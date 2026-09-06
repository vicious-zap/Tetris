export const COLORS={I:'#24dff2',O:'#ffd84d',T:'#b46aff',S:'#43e58a',Z:'#ff5373',J:'#4e82ff',L:'#ff9a42'};
export const SHAPES={
 I:[[0,0],[1,0],[2,0],[3,0]], O:[[0,0],[1,0],[0,1],[1,1]], T:[[0,0],[1,0],[2,0],[1,1]],
 S:[[1,0],[2,0],[0,1],[1,1]], Z:[[0,0],[1,0],[1,1],[2,1]], J:[[0,0],[0,1],[1,1],[2,1]], L:[[2,0],[0,1],[1,1],[2,1]]
};
export class Bag{
 constructor(){this.queue=[]} refill(){const bag=Object.keys(SHAPES);for(let i=bag.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}this.queue.push(...bag)}
 next(){if(!this.queue.length)this.refill();return this.queue.shift()} peek(){if(!this.queue.length)this.refill();return this.queue[0]}
}
export function createPiece(type){return{type,x:type==='O'?4:3,y:-1,rotation:0,cells:SHAPES[type].map(([x,y])=>[x,y])}}
export function rotated(piece,direction){if(piece.type==='O')return piece.cells.map(c=>[...c]);return piece.cells.map(([x,y])=>direction>0?[1-y,x]:[y,1-x])}
