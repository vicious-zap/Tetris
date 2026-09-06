export const COLORS={I:'#31e8ff',O:'#ffe04b',T:'#bc6cff',S:'#48ef8b',Z:'#ff5578',J:'#5087ff',L:'#ff9b42'};
export const SHAPES={
 I:[[0,1],[1,1],[2,1],[3,1]], O:[[1,0],[2,0],[1,1],[2,1]], T:[[1,0],[0,1],[1,1],[2,1]],
 S:[[1,0],[2,0],[0,1],[1,1]], Z:[[0,0],[1,0],[1,1],[2,1]], J:[[0,0],[0,1],[1,1],[2,1]], L:[[2,0],[0,1],[1,1],[2,1]]
};
export const rotate=(cells,dir)=>cells.map(([x,y])=>dir>0?[3-y,x]:[y,3-x]);
export class Bag {
 constructor(random=Math.random){this.random=random;this.queue=[];}
 fill(){const a=Object.keys(SHAPES);for(let i=a.length-1;i;i--){const j=Math.floor(this.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}this.queue.push(...a);}
 next(){if(this.queue.length<7)this.fill();return this.queue.shift();}
 peek(){if(this.queue.length<7)this.fill();return this.queue[0];}
}
export const makePiece=(type)=>({type,x:3,y:-1,rotation:0,cells:SHAPES[type].map(c=>[...c])});
