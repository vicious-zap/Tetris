import test from 'node:test';import assert from 'node:assert/strict';import {TetrisEngine,HEIGHT,WIDTH} from '../src/engine.js';import {Bag} from '../src/pieces.js';
test('7-bag contains every tetromino exactly once',()=>{const bag=new Bag(()=>.5),items=Array.from({length:7},()=>bag.next());assert.equal(new Set(items).size,7)});
test('board dimensions and wall collision',()=>{const e=new TetrisEngine();assert.equal(e.board.length,HEIGHT);assert.equal(e.board[0].length,WIDTH);while(e.move(-1,0));assert.equal(e.move(-1,0),false)});
test('hard drop locks and scores distance',()=>{const e=new TetrisEngine({random:()=>.1});const type=e.active.type,d=e.hardDrop();assert.ok(d>0);assert.ok(e.board.flat().includes(type));assert.ok(e.score>=d*2)});
test('completed row clears and increments counters',()=>{const e=new TetrisEngine();e.board[19].fill('I');e.board[19][4]=null;e.board[19][5]=null;e.active={type:'O',x:3,y:18,cells:[[1,0],[2,0],[1,1],[2,1]]};e.lock();assert.equal(e.lines,1);assert.equal(e.score,100)});
test('hold can only be used once per turn',()=>{const e=new TetrisEngine();assert.equal(e.holdPiece(),true);assert.equal(e.holdPiece(),false)});
