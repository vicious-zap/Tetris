import {COLORS,SHAPES} from './pieces.js';import {WIDTH,HEIGHT} from './engine.js';
export class Renderer{
 constructor(board,effects,particles){this.canvas=board;this.ctx=board.getContext('2d');this.fx=effects.getContext('2d');this.particles=particles;this.cell=36;this.visualX=3;this.visualY=-1;this.flash=[];}
 block(ctx,x,y,color,alpha=1,scale=1){const s=this.cell*scale,p=(this.cell-s)/2,g=ctx.createLinearGradient(x,y,x+this.cell,y+this.cell);g.addColorStop(0,'#fff');g.addColorStop(.12,color);g.addColorStop(1,'#10162b');ctx.globalAlpha=alpha;ctx.fillStyle=g;ctx.shadowColor=color;ctx.shadowBlur=alpha<.5?3:9;ctx.fillRect(x+p+2,y+p+2,s-4,s-4);ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.strokeRect(x+p+3,y+p+3,s-6,s-6);ctx.globalAlpha=1;ctx.shadowBlur=0;}
 render(engine,dt){const c=this.ctx;c.clearRect(0,0,360,720);c.fillStyle='#071020';c.fillRect(0,0,360,720);c.strokeStyle='rgba(94,216,255,.055)';for(let x=0;x<=WIDTH;x++){c.beginPath();c.moveTo(x*this.cell,0);c.lineTo(x*this.cell,720);c.stroke()}for(let y=0;y<=HEIGHT;y++){c.beginPath();c.moveTo(0,y*this.cell);c.lineTo(360,y*this.cell);c.stroke()}
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)if(engine.board[y][x])this.block(c,x*this.cell,y*this.cell,COLORS[engine.board[y][x]]);
  if(!engine.gameOver){const gy=engine.ghostY();for(const [x,y] of engine.active.cells)this.block(c,(x+engine.active.x)*this.cell,(y+gy)*this.cell,COLORS[engine.active.type],.2);
   this.visualX+=(engine.active.x-this.visualX)*Math.min(1,dt/45);this.visualY+=(engine.active.y-this.visualY)*Math.min(1,dt/70);for(const [x,y] of engine.active.cells)this.block(c,(x+this.visualX)*this.cell,(y+this.visualY)*this.cell,COLORS[engine.active.type]);}
  this.fx.clearRect(0,0,360,720);this.particles.update(dt);this.particles.draw(this.fx);}
 preview(canvas,type){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);if(!type)return;const cells=SHAPES[type],size=25,minX=Math.min(...cells.map(a=>a[0])),maxX=Math.max(...cells.map(a=>a[0]));const ox=(canvas.width-(maxX-minX+1)*size)/2-minX*size,oy=25;for(const [x,y] of cells){const old=this.cell;this.cell=size;this.block(c,ox+x*size,oy+y*size,COLORS[type]);this.cell=old;}}
}
