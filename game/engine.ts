export type Piece = 'tiger' | 'goat';
export type Turn = Piece;
export type Cell = Piece | null;
export type Move = { from: number | null; to: number; captured?: number };
export type GameState = { board: Cell[]; turn: Turn; goatsPlaced: number; goatsCaptured: number; winner: Piece | null };

const SIZE = 5;
const idx = (r:number,c:number) => r*SIZE+c;
const rc = (i:number):[number,number] => [Math.floor(i/SIZE), i%SIZE];
const inside = (r:number,c:number) => r>=0&&r<SIZE&&c>=0&&c<SIZE;

// Bagh-Chal lines: every point has orthogonal lines; diagonals exist on alternating intersections.
const directions = (i:number) => {
  const [r,c]=rc(i);
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  if ((r+c)%2===0) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
  return dirs;
};

export function initialState():GameState {
  const board:Cell[]=Array(25).fill(null);
  [0,4,20,24].forEach(i=>board[i]='tiger');
  return {board,turn:'goat',goatsPlaced:0,goatsCaptured:0,winner:null};
}

export function legalMoves(state:GameState, piece:Piece):Move[] {
  if(state.winner) return [];
  const moves:Move[]=[];
  if(piece==='goat' && state.goatsPlaced<20){
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
      if(!state.board[one]) moves.push({from,to:one});
      if(piece==='tiger' && state.board[one]==='goat'){
        const r2=r+2*dr,c2=c+2*dc;
        if(inside(r2,c2)){
          const two=idx(r2,c2);
          if(!state.board[two]) moves.push({from,to:two,captured:one});
        }
      }
    });
  });
  return moves;
}

export function applyMove(state:GameState, move:Move):GameState {
  const board=[...state.board];
  const piece=state.turn;
  if(move.from===null){ board[move.to]=piece; }
  else { board[move.from]=null; board[move.to]=piece; }
  let goatsCaptured=state.goatsCaptured;
  if(move.captured!==undefined){board[move.captured]=null;goatsCaptured++;}
  const next:GameState={board,turn:piece==='goat'?'tiger':'goat',goatsPlaced:state.goatsPlaced+(piece==='goat'&&move.from===null?1:0),goatsCaptured,winner:null};
  if(goatsCaptured>=5) next.winner='tiger';
  else if(legalMoves({...next,turn:'tiger'},'tiger').length===0) next.winner='goat';
  return next;
}

export function movesFrom(state:GameState, from:number|null){
  return legalMoves(state,state.turn).filter(m=>m.from===from);
}

export function randomComputerMove(state:GameState):Move|null {
  const moves=legalMoves(state,state.turn);
  if(!moves.length)return null;
  // Prefer captures, otherwise choose a legal move. This is the first AI baseline.
  const captures=moves.filter(m=>m.captured!==undefined);
  const pool=captures.length?captures:moves;
  return pool[Math.floor(Math.random()*pool.length)];
}