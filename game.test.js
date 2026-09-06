import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag,COLS,ROWS,SHAPES,clearLines,collides,emptyBoard,rotate} from './game.js';

test('el tablero tiene las dimensiones reglamentarias',()=>{const board=emptyBoard();assert.equal(board.length,ROWS);assert.ok(board.every(row=>row.length===COLS));});
test('la rotación horaria y antihoraria son reversibles',()=>{const shape=SHAPES.L;assert.deepEqual(rotate(rotate(shape),-1),shape);});
test('detecta paredes, suelo y bloques ocupados',()=>{const board=emptyBoard(),piece={x:0,y:0,matrix:SHAPES.O};assert.equal(collides(board,piece,-1,0),true);assert.equal(collides(board,{...piece,y:18},0,1),true);board[1][1]='T';assert.equal(collides(board,piece),true);});
test('elimina varias líneas y conserva las demás',()=>{const board=emptyBoard();board[17][0]='T';board[18].fill('I');board[19].fill('O');const result=clearLines(board);assert.equal(result.cleared,2);assert.equal(result.board.length,ROWS);assert.equal(result.board[19][0],'T');});
test('la bolsa entrega las siete piezas sin repetir',()=>{const bag=new Bag(()=>.5),pieces=Array.from({length:7},()=>bag.next());assert.deepEqual(new Set(pieces),new Set(Object.keys(SHAPES)));});
