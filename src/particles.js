export class Particles{
 constructor(){this.items=[];}
 burst(x,y,color,count=18,power=5){for(let i=0;i<count&&this.items.length<180;i++){const a=Math.random()*Math.PI*2,s=Math.random()*power+1;this.items.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color,size:Math.random()*4+2});}}
 update(dt){for(const p of this.items){p.x+=p.vx*dt*.06;p.y+=p.vy*dt*.06;p.vy+=.012*dt;p.life-=dt/650;}this.items=this.items.filter(p=>p.life>0);}
 draw(ctx){ctx.save();ctx.globalCompositeOperation='lighter';for(const p of this.items){ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);}ctx.restore();}
}
