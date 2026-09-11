export type Piece = 'tiger' | 'goat';
export type Turn = Piece;
export type Cell = Piece | null;
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Move = { from: number | null; to: number; captured?: number };
export type GameState = { board: Cell[]; turn: Turn; goatsPlaced: number; goatsCaptured: number; winner: Piece | null };

const SIZE=5;
const idx=(r:number,c:number)=>r*SIZE+c;
const rc=(i:number):[number,number]=>[Math.floor(i/SIZE),i%SIZE];
const inside=(r:number,c:number)=>r>=0&&r<SIZE&&c>=0&&c<SIZE;

const directions=(i:number)=>{
  const [r,c]=rc(i);
  const dirs:number[][]=[[1,0],[-1,0],[0,1],[0,-1]];
  if((r+c)%2===0)dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
  return dirs;
};

export function initialState():GameState{
  const board:Cell[]=Array(25).fill(null);
  [0,4,20,24].forEach(i=>board[i]='tiger');
  return {board,turn:'goat',goatsPlaced:0,goatsCaptured:0,winner:null};
}

export function legalMoves(state:GameState,piece:Piece):Move[]{
  if(state.winner)return [];
  const moves:Move[]=[];
  if(piece==='goat'&&state.goatsPlaced<20){
    state.board.forEach((v,i)=>{if(!v)moves.push({from:null,to:i})});
    return moves;
  }
  state.board.forEach((v,from)=>{
    if(v!==piece)return;
    const [r,c]=rc(from);
    directions(from).forEach(([dr,dc])=>{
      const r1=r+dr,c1=c+dc;
      if(!inside(r1,c1))return;
      const one=idx(r1,c1);
      if(!state.board[one])moves.push({from,to:one});
      if(piece==='tiger'&&state.board[one]==='goat'){
        const r2=r+2*dr,c2=c+2*dc;
        if(inside(r2,c2)){
          const two=idx(r2,c2);
          if(!state.board[two])moves.push({from,to:two,captured:one});
        }
      }
    });
  });
  return moves;
}

export function applyMove(state:GameState,move:Move):GameState{
  const board=[...state.board];
  const piece=state.turn;
  if(move.from===null)board[move.to]=piece;
  else{board[move.from]=null;board[move.to]=piece;}
  let goatsCaptured=state.goatsCaptured;
  if(move.captured!==undefined){board[move.captured]=null;goatsCaptured++;}
  const next:GameState={board,turn:piece==='goat'?'tiger':'goat',goatsPlaced:state.goatsPlaced+(piece==='goat'&&move.from===null?1:0),goatsCaptured,winner:null};
  if(goatsCaptured>=5)next.winner='tiger';
  else if(legalMoves({...next,turn:'tiger'},'tiger').length===0)next.winner='goat';
  return next;
}

export function movesFrom(state:GameState,from:number|null){return legalMoves(state,state.turn).filter(m=>m.from===from);}

function positional(i:number){
  const [r,c]=rc(i); const d=Math.abs(2-r)+Math.abs(2-c); return 4-d;
}

function evaluate(state:GameState,root:Piece){
  if(state.winner)return state.winner===root?100000:-100000;
  const tigerMobility=legalMoves({...state,turn:'tiger'},'tiger').length;
  const captures=state.goatsCaptured;
  let center=0;
  state.board.forEach((p,i)=>{if(p===root)center+=positional(i)});
  const tigerScore=captures*220+tigerMobility*5+(root==='tiger'?center:0);
  const goatScore=(28-tigerMobility)*7+(root==='goat'?center*2:0)-captures*220;
  return root==='tiger'?tigerScore:goatScore;
}

function minimax(state:GameState,depth:number,root:Piece,alpha:number,beta:number):number{
  if(depth===0||state.winner)return evaluate(state,root);
  const moves=legalMoves(state,state.turn);
  if(!moves.length)return evaluate(state,root);
  const maximizing=state.turn===root;
  if(maximizing){
    let best=-Infinity;
    for(const m of moves){best=Math.max(best,minimax(applyMove(state,m),depth-1,root,alpha,beta));alpha=Math.max(alpha,best);if(beta<=alpha)break;}
    return best;
  }
  let best=Infinity;
  for(const m of moves){best=Math.min(best,minimax(applyMove(state,m),depth-1,root,alpha,beta));beta=Math.min(beta,best);if(beta<=alpha)break;}
  return best;
}

export function computerMove(state:GameState,difficulty:Difficulty='medium'):Move|null{
  const moves=legalMoves(state,state.turn);
  if(!moves.length)return null;
  if(difficulty==='easy')return moves[Math.floor(Math.random()*moves.length)];
  const captures=moves.filter(m=>m.captured!==undefined);
  if(difficulty==='medium'){
    const pool=captures.length?captures:moves;
    return [...pool].sort((a,b)=>positional(b.to)-positional(a.to))[0];
  }
  const depth=difficulty==='expert'?3:2;
  const root=state.turn;
  let best=moves[0],bestScore=-Infinity;
  const ordered=[...moves].sort((a,b)=>(b.captured!==undefined?1:0)-(a.captured!==undefined?1:0));
  for(const m of ordered){
    const score=minimax(applyMove(state,m),depth-1,root,-Infinity,Infinity);
    if(score>bestScore){bestScore=score;best=m;}
  }
  return best;
}

export const randomComputerMove=(state:GameState)=>computerMove(state,'easy');
