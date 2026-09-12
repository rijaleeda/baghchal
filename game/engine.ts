export type Piece='tiger'|'goat';
export type Turn=Piece;
export type Cell=Piece|null;
export type Difficulty='easy'|'medium'|'hard'|'expert';
export type Move={from:number|null;to:number;captured?:number};
export type GameState={board:Cell[];turn:Turn;goatsPlaced:number;goatsCaptured:number;winner:Piece|null};

const SIZE=5;
const idx=(r:number,c:number)=>r*SIZE+c;
const rc=(i:number):[number,number]=>[Math.floor(i/SIZE),i%SIZE];
const inside=(r:number,c:number)=>r>=0&&r<SIZE&&c>=0&&c<SIZE;
const other=(p:Piece):Piece=>p==='tiger'?'goat':'tiger';

const directions=(i:number)=>{
  const[r,c]=rc(i);
  const d:number[][]=[[1,0],[-1,0],[0,1],[0,-1]];
  if((r+c)%2===0)d.push([1,1],[1,-1],[-1,1],[-1,-1]);
  return d;
};

export function initialState():GameState{
  const board:Cell[]=Array(25).fill(null);
  [0,4,20,24].forEach(i=>board[i]='tiger');
  return{board,turn:'goat',goatsPlaced:0,goatsCaptured:0,winner:null};
}

export function legalMoves(state:GameState,piece:Piece):Move[]{
  if(state.winner)return[];
  const moves:Move[]=[];
  if(piece==='goat'&&state.goatsPlaced<20){
    state.board.forEach((v,i)=>{if(!v)moves.push({from:null,to:i})});
    return moves;
  }
  state.board.forEach((v,from)=>{
    if(v!==piece)return;
    const[r,c]=rc(from);
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
  const board=[...state.board],piece=state.turn;
  if(move.from===null)board[move.to]=piece;
  else{board[move.from]=null;board[move.to]=piece;}
  let goatsCaptured=state.goatsCaptured;
  if(move.captured!==undefined){board[move.captured]=null;goatsCaptured++;}
  const next:GameState={board,turn:other(piece),goatsPlaced:state.goatsPlaced+(piece==='goat'&&move.from===null?1:0),goatsCaptured,winner:null};
  if(goatsCaptured>=5)next.winner='tiger';
  else if(legalMoves({...next,turn:'tiger'},'tiger').length===0)next.winner='goat';
  return next;
}

export function movesFrom(state:GameState,from:number|null){return legalMoves(state,state.turn).filter(m=>m.from===from);}

function positional(i:number){
  const[r,c]=rc(i);
  if(r===2&&c===2)return 8;
  if((r===1||r===3)&&(c===1||c===3))return 6;
  if(r===0||r===4||c===0||c===4)return 2;
  return 4;
}

function adjacentFriendly(state:GameState,index:number,piece:Piece){
  const[r,c]=rc(index);let n=0;
  for(const[dr,dc]of directions(index)){
    const rr=r+dr,cc=c+dc;
    if(inside(rr,cc)&&state.board[idx(rr,cc)]===piece)n++;
  }
  return n;
}

function tigerMobility(state:GameState){
  return legalMoves({...state,winner:null},'tiger').length;
}

function trappedTigers(state:GameState){
  let trapped=0;
  state.board.forEach((p,i)=>{if(p==='tiger'&&legalMoves({...state,winner:null},'tiger').filter(m=>m.from===i).length===0)trapped++;});
  return trapped;
}

function tigerCaptureMoves(state:GameState){
  return legalMoves({...state,winner:null},'tiger').filter(m=>m.captured!==undefined);
}

function evaluateAbsolute(state:GameState){
  if(state.winner==='tiger')return 1000000;
  if(state.winner==='goat')return -1000000;

  const mobility=tigerMobility(state);
  const captures=tigerCaptureMoves(state);
  const trapped=trappedTigers(state);
  let tigerPosition=0,goatPosition=0,goatLinks=0,goatsInDanger=0;
  const threatened=new Set(captures.map(m=>m.captured as number));

  state.board.forEach((p,i)=>{
    if(p==='tiger')tigerPosition+=positional(i);
    if(p==='goat'){
      goatPosition+=positional(i);
      goatLinks+=adjacentFriendly(state,i,'goat');
      if(threatened.has(i))goatsInDanger++;
    }
  });

  // Positive score favors tigers; negative favors goats.
  return state.goatsCaptured*520
    + mobility*11
    + captures.length*55
    + goatsInDanger*38
    + tigerPosition*3
    - trapped*210
    - goatLinks*7
    - goatPosition*2
    - (state.goatsPlaced>=16?Math.max(0,18-mobility)*8:0);
}

function evaluate(state:GameState,root:Piece){
  const absolute=evaluateAbsolute(state);
  return root==='tiger'?absolute:-absolute;
}

function keyOf(state:GameState,depth:number,root:Piece){
  const b=state.board.map(v=>v==='tiger'?'T':v==='goat'?'G':'.').join('');
  return `${b}|${state.turn}|${state.goatsPlaced}|${state.goatsCaptured}|${depth}|${root}`;
}

function sameMove(a:Move|undefined,b:Move|undefined){return !!a&&!!b&&a.from===b.from&&a.to===b.to&&a.captured===b.captured;}

function moveOrderScore(state:GameState,m:Move,ttBest?:Move){
  if(sameMove(m,ttBest))return 100000;
  let score=0;
  if(m.captured!==undefined)score+=5000;
  score+=positional(m.to)*18;
  if(state.turn==='goat'){
    const next=applyMove(state,m);
    score+=(40-tigerMobility(next))*10;
    if(tigerCaptureMoves(next).length===0)score+=180;
  }else{
    const next=applyMove(state,m);
    score+=tigerCaptureMoves(next).length*80;
  }
  return score;
}

function orderedMoves(state:GameState,ttBest?:Move){
  return [...legalMoves(state,state.turn)].sort((a,b)=>moveOrderScore(state,b,ttBest)-moveOrderScore(state,a,ttBest));
}

type TTEntry={depth:number;score:number;flag:'exact'|'lower'|'upper';best?:Move};
class SearchTimeout extends Error{}

type SearchContext={deadline:number;nodes:number;table:Map<string,TTEntry>};

function search(state:GameState,depth:number,root:Piece,alpha:number,beta:number,ctx:SearchContext,qDepth=2):number{
  if((ctx.nodes++&127)===0&&Date.now()>=ctx.deadline)throw new SearchTimeout();
  if(state.winner)return evaluate(state,root);

  if(depth<=0){
    // Tactical extension: do not evaluate a position while a tiger capture is hanging.
    const tactical=state.turn==='tiger'?tigerCaptureMoves(state):[];
    if(qDepth>0&&tactical.length){
      const maximizing=state.turn===root;
      let best=maximizing?-Infinity:Infinity;
      for(const m of tactical){
        const val=search(applyMove(state,m),0,root,alpha,beta,ctx,qDepth-1);
        if(maximizing){best=Math.max(best,val);alpha=Math.max(alpha,best);}else{best=Math.min(best,val);beta=Math.min(beta,best);}
        if(beta<=alpha)break;
      }
      return best;
    }
    return evaluate(state,root);
  }

  const key=keyOf(state,depth,root),cached=ctx.table.get(key),a0=alpha,b0=beta;
  if(cached&&cached.depth>=depth){
    if(cached.flag==='exact')return cached.score;
    if(cached.flag==='lower')alpha=Math.max(alpha,cached.score);
    if(cached.flag==='upper')beta=Math.min(beta,cached.score);
    if(alpha>=beta)return cached.score;
  }

  const moves=orderedMoves(state,cached?.best);
  if(!moves.length)return evaluate(state,root);
  const maximizing=state.turn===root;
  let bestScore=maximizing?-Infinity:Infinity,bestMove=moves[0];
  for(const m of moves){
    const val=search(applyMove(state,m),depth-1,root,alpha,beta,ctx,qDepth);
    if(maximizing){if(val>bestScore){bestScore=val;bestMove=m;}alpha=Math.max(alpha,bestScore);}
    else{if(val<bestScore){bestScore=val;bestMove=m;}beta=Math.min(beta,bestScore);}
    if(beta<=alpha)break;
  }
  const flag=bestScore<=a0?'upper':bestScore>=b0?'lower':'exact';
  ctx.table.set(key,{depth,score:bestScore,flag,best:bestMove});
  return bestScore;
}

function bestMoveAtDepth(state:GameState,depth:number,deadline:number,table:Map<string,TTEntry>){
  const root=state.turn,ctx:SearchContext={deadline,nodes:0,table};
  const moves=orderedMoves(state);
  let best=moves[0],bestScore=-Infinity;
  for(const m of moves){
    if(Date.now()>=deadline)throw new SearchTimeout();
    const score=search(applyMove(state,m),depth-1,root,-Infinity,Infinity,ctx);
    if(score>bestScore){bestScore=score;best=m;}
  }
  return{move:best,score:bestScore,nodes:ctx.nodes};
}

function intelligentMove(state:GameState,timeMs:number,maxDepth:number){
  const legal=legalMoves(state,state.turn);
  if(!legal.length)return null;

  // Immediate tactical wins/captures always come first.
  for(const m of legal){const next=applyMove(state,m);if(next.winner===state.turn)return m;}
  if(state.turn==='tiger'){
    const captures=legal.filter(m=>m.captured!==undefined);
    if(state.goatsCaptured===4&&captures.length)return captures[0];
  }

  const deadline=Date.now()+timeMs,table=new Map<string,TTEntry>();
  let best=orderedMoves(state)[0];
  for(let depth=1;depth<=maxDepth;depth++){
    try{
      const result=bestMoveAtDepth(state,depth,deadline,table);
      best=result.move;
    }catch(e){
      if(e instanceof SearchTimeout)break;
      throw e;
    }
    if(Date.now()>=deadline)break;
  }
  return best;
}

export function computerMove(state:GameState,difficulty:Difficulty='medium'):Move|null{
  const moves=legalMoves(state,state.turn);
  if(!moves.length)return null;
  if(difficulty==='easy')return moves[Math.floor(Math.random()*moves.length)];
  if(difficulty==='medium'){
    const captures=moves.filter(m=>m.captured!==undefined),pool=captures.length?captures:moves;
    return [...pool].sort((a,b)=>moveOrderScore(state,b)-moveOrderScore(state,a))[0];
  }
  if(difficulty==='hard')return intelligentMove(state,350,5);
  return intelligentMove(state,1200,9);
}

export const randomComputerMove=(state:GameState)=>computerMove(state,'easy');