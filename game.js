export const COLS = 10;
export const ROWS = 20;
export const SHAPES = {
  I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], J:[[1,0,0],[1,1,1],[0,0,0]],
  L:[[0,0,1],[1,1,1],[0,0,0]], O:[[1,1],[1,1]], S:[[0,1,1],[1,1,0],[0,0,0]],
  T:[[0,1,0],[1,1,1],[0,0,0]], Z:[[1,1,0],[0,1,1],[0,0,0]]
};
export const COLORS = { I:'#20e3ef',J:'#4361ee',L:'#ff9f1c',O:'#ffe347',S:'#39e75f',T:'#a855f7',Z:'#ff3d5a' };
export const emptyBoard = () => Array.from({length:ROWS},()=>Array(COLS).fill(''));
export function rotate(matrix,direction=1) { const n=matrix.length; return Array.from({length:n},(_,y)=>Array.from({length:n},(_,x)=>direction>0?matrix[n-1-x][y]:matrix[x][n-1-y])); }
export function collides(board,piece,dx=0,dy=0,matrix=piece.matrix) { return matrix.some((row,y)=>row.some((v,x)=>v&&(piece.x+x+dx<0||piece.x+x+dx>=COLS||piece.y+y+dy>=ROWS||(piece.y+y+dy>=0&&board[piece.y+y+dy][piece.x+x+dx])))); }
export function clearLines(board) { const remaining=board.filter(row=>row.some(cell=>!cell)); const cleared=ROWS-remaining.length; while(remaining.length<ROWS) remaining.unshift(Array(COLS).fill('')); return {board:remaining,cleared}; }
export class Bag { constructor(random=Math.random){this.random=random;this.items=[];} next(){if(!this.items.length){this.items=Object.keys(SHAPES);for(let i=this.items.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.items[i],this.items[j]]=[this.items[j],this.items[i]];}}return this.items.pop();} }

if (typeof document !== 'undefined') {
  const $=id=>document.getElementById(id), boardCanvas=$('board'), ctx=boardCanvas.getContext('2d');
  const holdCtx=$('hold').getContext('2d'), nextCtx=$('next').getContext('2d');
  let board=emptyBoard(), bag=new Bag(), queue=[], active, held='', canHold=true, score=0, lines=0, level=1, playing=false, paused=false, last=0, elapsed=0, sound=false;
  const high=()=>Number(localStorage.getItem('neon-tetris-high')||0);
  function refill(){while(queue.length<5)queue.push(bag.next());}
  function make(type){const matrix=SHAPES[type].map(r=>[...r]);return {type,matrix,x:Math.floor((COLS-matrix[0].length)/2),y:-matrix.findIndex(r=>r.some(Boolean))};}
  function spawn(){refill();active=make(queue.shift());refill();canHold=true;drawPreviews();if(collides(board,active)){finish();return false;}return true;}
  function cell(context,x,y,color,size=30,ghost=false){context.save();context.globalAlpha=ghost?.2:1;context.fillStyle=color;context.fillRect(x*size+1,y*size+1,size-2,size-2);context.fillStyle=ghost?'transparent':'#ffffff35';context.fillRect(x*size+3,y*size+3,size-6,3);context.strokeStyle=ghost?color:'#0005';context.strokeRect(x*size+1.5,y*size+1.5,size-3,size-3);context.restore();}
  function paintPiece(context,piece,offsetX=0,offsetY=0,size=30,ghost=false){piece.matrix.forEach((row,y)=>row.forEach((v,x)=>v&&cell(context,x+piece.x+offsetX,y+piece.y+offsetY,COLORS[piece.type],size,ghost)));}
  function draw(){ctx.fillStyle='#080a13';ctx.fillRect(0,0,300,600);ctx.strokeStyle='#171b2c';for(let x=1;x<COLS;x++){ctx.beginPath();ctx.moveTo(x*30,0);ctx.lineTo(x*30,600);ctx.stroke();}for(let y=1;y<ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*30);ctx.lineTo(300,y*30);ctx.stroke();}board.forEach((row,y)=>row.forEach((v,x)=>v&&cell(ctx,x,y,COLORS[v])));if(active){let drop=0;while(!collides(board,active,0,drop+1))drop++;paintPiece(ctx,active,0,drop,30,true);paintPiece(ctx,active);}}
  function preview(context,type,slot=0){if(!type)return;const matrix=SHAPES[type], size=20, width=matrix[0].length*size;paintPiece(context,{type,matrix,x:0,y:0},(120-width)/(2*size),slot*3.4+.5,size);}
  function drawPreviews(){holdCtx.clearRect(0,0,120,96);nextCtx.clearRect(0,0,120,300);preview(holdCtx,held);queue.slice(0,4).forEach((type,i)=>preview(nextCtx,type,i));}
  function updateStats(){const best=Math.max(score,high());$('score').textContent=String(score).padStart(6,'0');$('high-score').textContent=String(best).padStart(6,'0');$('lines').textContent=lines;$('level').textContent=level;if(score>=high())localStorage.setItem('neon-tetris-high',score);}
  function tone(freq=300,duration=.04){if(!sound)return;const ac=tone.ac||(tone.ac=new AudioContext()),osc=ac.createOscillator(),gain=ac.createGain();osc.frequency.value=freq;gain.gain.setValueAtTime(.05,ac.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);osc.connect(gain).connect(ac.destination);osc.start();osc.stop(ac.currentTime+duration);}
  function move(dx,dy){if(!playing||paused||collides(board,active,dx,dy))return false;active.x+=dx;active.y+=dy;if(dx)tone(180);draw();return true;}
  function lock(){active.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v&&active.y+y>=0)board[active.y+y][active.x+x]=active.type;}));const result=clearLines(board);board=result.board;if(result.cleared){score+=[0,100,300,500,800][result.cleared]*level;lines+=result.cleared;level=Math.floor(lines/10)+1;tone(620,.12);}spawn();updateStats();draw();}
  function drop(){if(!move(0,1))lock();}
  function hardDrop(){if(!playing||paused)return;let distance=0;while(move(0,1))distance++;score+=distance*2;tone(420);lock();}
  function turn(direction=1){if(!playing||paused)return;const changed=rotate(active.matrix,direction);for(const kick of [0,-1,1,-2,2])if(!collides(board,active,kick,0,changed)){active.x+=kick;active.matrix=changed;tone(260);draw();break;}}
  function hold(){if(!playing||paused||!canHold)return;const previous=held;held=active.type;active=previous?make(previous):null;canHold=false;if(!active)spawn();else if(collides(board,active))finish();drawPreviews();draw();}
  function overlay(title,kicker,copy,button){$('overlay-title').textContent=title;$('overlay-kicker').textContent=kicker;$('overlay-copy').textContent=copy;$('start').textContent=button;$('overlay').classList.remove('hidden');}
  function start(){board=emptyBoard();bag=new Bag();queue=[];held='';score=lines=0;level=1;playing=true;paused=false;last=performance.now();elapsed=0;spawn();updateStats();$('overlay').classList.add('hidden');draw();}
  function finish(){playing=false;localStorage.setItem('neon-tetris-high',Math.max(score,high()));overlay('FIN DE PARTIDA','PUNTUACIÓN '+String(score).padStart(6,'0'),'Has completado '+lines+' líneas.','OTRA PARTIDA');tone(100,.3);}
  function pause(){if(!playing)return;paused=!paused;if(paused)overlay('PAUSA','PARTIDA DETENIDA','Pulsa P o continúa cuando estés listo.','CONTINUAR');else{$('overlay').classList.add('hidden');last=performance.now();}}
  function loop(now){if(playing&&!paused){elapsed+=now-last;if(elapsed>Math.max(90,800-(level-1)*65)){drop();elapsed=0;}draw();}last=now;requestAnimationFrame(loop);}
  const actions={left:()=>move(-1,0),right:()=>move(1,0),down:()=>{if(move(0,1)){score++;updateStats();}},rotate:()=>turn(),drop:hardDrop,hold};
  document.addEventListener('keydown',event=>{const map={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowDown:'down',s:'down',S:'down',ArrowUp:'rotate',x:'rotate',X:'rotate',' ':'drop',c:'hold',C:'hold'};if(map[event.key]){event.preventDefault();actions[map[event.key]]();}else if(event.key==='z'||event.key==='Z')turn(-1);else if(event.key==='p'||event.key==='P'||event.key==='Escape')pause();else if(event.key==='r'||event.key==='R')start();});
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('pointerdown',event=>{event.preventDefault();actions[button.dataset.action]();}));
  $('start').addEventListener('click',()=>paused?pause():start());$('sound').addEventListener('click',event=>{sound=!sound;event.currentTarget.setAttribute('aria-pressed',sound);event.currentTarget.setAttribute('aria-label',sound?'Desactivar sonido':'Activar sonido');tone(440);});window.addEventListener('blur',()=>{if(playing&&!paused)pause();});
  updateStats();refill();drawPreviews();draw();requestAnimationFrame(loop);
}
