import{Bag,createPiece,rotated,COLORS}from'./pieces.js';
export class Game{
 constructor(events={}){this.events=events;this.reset()}
 reset(){this.board=Array.from({length:20},()=>Array(10).fill(null));this.bag=new Bag;this.current=createPiece(this.bag.next());this.next=this.bag.peek();this.hold=null;this.holdUsed=false;this.score=0;this.lines=0;this.level=1;this.combo=-1;this.over=false;this.paused=false;this.dropTimer=0;this.lockTimer=0;this.spawnTime=performance.now()}
 valid(piece=this.current,cells=piece.cells,dx=0,dy=0){return cells.every(([cx,cy])=>{const x=piece.x+cx+dx,y=piece.y+cy+dy;return x>=0&&x<10&&y<20&&(y<0||!this.board[y][x])})}
 move(dx,dy){if(this.over||this.paused)return false;if(this.valid(this.current,this.current.cells,dx,dy)){this.current.x+=dx;this.current.y+=dy;if(dy)this.score+=dy>0?1:0;this.lockTimer=0;return true}return false}
 rotate(dir){if(this.over||this.paused)return false;const cells=rotated(this.current,dir);for(const kick of[0,-1,1,-2,2])if(this.valid(this.current,cells,kick,0)){this.current.cells=cells;this.current.x+=kick;this.current.rotation=(this.current.rotation+dir+4)%4;this.events.sound?.('rotate');return true}return false}
 ghostY(){let dy=0;while(this.valid(this.current,this.current.cells,0,dy+1))dy++;return this.current.y+dy}
 hardDrop(){if(this.over||this.paused)return;const from=this.current.y,to=this.ghostY();this.current.y=to;this.score+=(to-from)*2;this.events.hardDrop?.(this.current,from,to);this.events.sound?.('drop');this.lock()}
 holdPiece(){if(this.holdUsed||this.over||this.paused)return;const old=this.current.type;if(this.hold){this.current=createPiece(this.hold);this.hold=old}else{this.hold=old;this.spawn()}this.holdUsed=true;this.events.sound?.('rotate')}
 spawn(){this.current=createPiece(this.bag.next());this.next=this.bag.peek();this.spawnTime=performance.now();if(!this.valid()){this.over=true;this.events.gameOver?.()}}
 lock(){for(const[cx,cy]of this.current.cells){const x=this.current.x+cx,y=this.current.y+cy;if(y<0){this.over=true;this.events.gameOver?.();return}this.board[y][x]=this.current.type}this.events.lock?.(this.current);const full=[];for(let y=0;y<20;y++)if(this.board[y].every(Boolean))full.push(y);if(full.length)this.clear(full);else this.combo=-1;this.holdUsed=false;this.spawn()}
 clear(rows){this.combo++;const oldLevel=this.level;const points=[0,100,300,500,800][rows.length]*this.level;this.score+=points+(this.combo>0?50*this.combo*this.level:0);this.lines+=rows.length;this.level=Math.floor(this.lines/10)+1;this.events.lines?.(rows,rows.length,this.combo);for(const y of rows.sort((a,b)=>b-a)){this.board.splice(y,1);this.board.unshift(Array(10).fill(null))}if(this.level>oldLevel)this.events.level?.(this.level)}
 update(dt){if(this.paused||this.over)return;this.dropTimer+=dt;const interval=Math.max(85,800*Math.pow(.82,this.level-1));if(this.dropTimer>=interval){this.dropTimer=0;if(!this.move(0,1)){this.lockTimer+=interval;if(this.lockTimer>=380){this.lockTimer=0;this.lock()}}}}
 togglePause(){if(this.over)return this.paused;this.paused=!this.paused;return this.paused}
}
