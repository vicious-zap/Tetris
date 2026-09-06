import {Bag,makePiece,rotate} from './pieces.js';
export const WIDTH=10,HEIGHT=20;
export class TetrisEngine{
 constructor({random=Math.random,onEvent=()=>{}}={}){this.random=random;this.onEvent=onEvent;this.reset();}
 reset(){this.board=Array.from({length:HEIGHT},()=>Array(WIDTH).fill(null));this.bag=new Bag(this.random);this.score=0;this.lines=0;this.level=1;this.combo=-1;this.hold=null;this.canHold=true;this.gameOver=false;this.paused=false;this.spawn();}
 spawn(type=this.bag.next()){this.active=makePiece(type);this.canHold=true;if(this.collides(this.active))this.end();}
 cells(piece=this.active){return piece.cells.map(([x,y])=>[x+piece.x,y+piece.y]);}
 collides(piece){return this.cells(piece).some(([x,y])=>x<0||x>=WIDTH||y>=HEIGHT||(y>=0&&this.board[y][x]));}
 move(dx,dy){if(this.gameOver||this.paused)return false;const p={...this.active,x:this.active.x+dx,y:this.active.y+dy};if(this.collides(p))return false;this.active=p;return true;}
 drop(){if(this.move(0,1)){this.score+=1;return true;}this.lock();return false;}
 hardDrop(){if(this.gameOver||this.paused)return 0;let d=0;while(this.move(0,1))d++;this.score+=d*2;this.onEvent('hardDrop',{distance:d,cells:this.cells()});this.lock();return d;}
 rotate(dir){if(this.gameOver||this.paused)return false;const cells=rotate(this.active.cells,dir);for(const [dx,dy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1]]){const p={...this.active,cells,x:this.active.x+dx,y:this.active.y+dy,rotation:(this.active.rotation+dir+4)%4};if(!this.collides(p)){this.active=p;return true;}}return false;}
 holdPiece(){if(!this.canHold||this.gameOver||this.paused)return false;const current=this.active.type;if(this.hold){const swap=this.hold;this.hold=current;this.active=makePiece(swap);if(this.collides(this.active))this.end();}else{this.hold=current;this.spawn();}this.canHold=false;return true;}
 ghostY(){let p={...this.active};while(!this.collides({...p,y:p.y+1}))p.y++;return p.y;}
 lock(){const landed=this.cells();for(const [x,y] of landed){if(y<0){this.end();return;}this.board[y][x]=this.active.type;}const full=[];for(let y=0;y<HEIGHT;y++)if(this.board[y].every(Boolean))full.push(y);this.onEvent('lock',{cells:landed});if(full.length)this.clear(full);else this.combo=-1;if(!this.gameOver)this.spawn();}
 clear(rows){const count=rows.length;this.onEvent('lines',{rows,count});this.board=this.board.filter((_,i)=>!rows.includes(i));while(this.board.length<HEIGHT)this.board.unshift(Array(WIDTH).fill(null));this.lines+=count;this.combo++;const table=[0,100,300,500,800];this.score+=table[count]*this.level+(this.combo>0?50*this.combo*this.level:0);const old=this.level;this.level=Math.floor(this.lines/10)+1;if(this.level>old)this.onEvent('level',{level:this.level});}
 gravityMs(){return Math.max(75,900*Math.pow(.82,this.level-1));}
 togglePause(){if(!this.gameOver)this.paused=!this.paused;return this.paused;}
 end(){this.gameOver=true;this.onEvent('gameOver',{});}
}
