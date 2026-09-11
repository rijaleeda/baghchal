import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { applyMove, initialState, legalMoves, movesFrom, computerMove, GameState, Difficulty, Piece } from '../game/engine';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

const lines:[number,number][]=[];
for(let r=0;r<5;r++)for(let c=0;c<4;c++)lines.push([r*5+c,r*5+c+1]);
for(let c=0;c<5;c++)for(let r=0;r<4;r++)lines.push([r*5+c,(r+1)*5+c]);
for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r+c)%2===0){lines.push([r*5+c,(r+1)*5+c+6]);lines.push([r*5+c+1,(r+1)*5+c+5]);}

export default function Play(){
 const params=useLocalSearchParams<{mode?:string;side?:string;difficulty?:string}>();
 const mode=params.mode??'computer';
 const humanSide:Piece=params.side==='tiger'?'tiger':'goat';
 const difficulty=(['easy','medium','hard','expert'].includes(params.difficulty??'')?params.difficulty:'medium') as Difficulty;
 const [game,setGame]=useState<GameState>(initialState());
 const [selected,setSelected]=useState<number|null>(null);
 const {width,height}=useWindowDimensions();
 const size=Math.min(width-28,height*0.53,520); const pad=24; const step=(size-pad*2)/4;
 const legal=useMemo(()=>legalMoves(game,game.turn),[game]);
 const targets=selected!==null?movesFrom(game,selected):[];
 const computer=mode==='computer'&&game.turn!==humanSide&&!game.winner;

 useEffect(()=>{
  if(!computer)return;
  const t=setTimeout(()=>{const m=computerMove(game,difficulty);if(m)setGame(g=>applyMove(g,m));setSelected(null)},difficulty==='expert'?650:420);
  return()=>clearTimeout(t);
 },[computer,game,difficulty]);

 function tap(i:number){
  if(computer||game.winner)return;
  const cell=game.board[i];
  if(mode==='computer'&&game.turn!==humanSide)return;
  if(game.turn==='goat'&&game.goatsPlaced<20){const m=legal.find(x=>x.from===null&&x.to===i);if(m)setGame(applyMove(game,m));return;}
  const target=targets.find(x=>x.to===i);if(target){setGame(applyMove(game,target));setSelected(null);return;}
  if(cell===game.turn)setSelected(i);else setSelected(null);
 }

 const turnLabel=game.winner?`${game.winner==='goat'?'Goats':'Tigers'} win!`:computer?'Computer is thinking…':`${game.turn==='goat'?'Goats':'Tigers'} to move`;
 return <SafeAreaView style={s.page}>
  <View style={s.top}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹</Text></Pressable><View><Text style={s.heading}>बाघचाल · BAGHCHAL</Text><Text style={s.mode}>{mode==='computer'?`${difficulty.toUpperCase()} · YOU: ${humanSide.toUpperCase()}`:'LOCAL TWO PLAYER'}</Text></View><Pressable onPress={()=>{setGame(initialState());setSelected(null)}}><Text style={s.restart}>↻</Text></Pressable></View>
  <View style={s.status}><Text style={s.turn}>{turnLabel}</Text><Text style={s.meta}>{game.goatsPlaced<20?`Place goats · ${20-game.goatsPlaced} remaining`:'Movement phase'} · Captured {game.goatsCaptured}/5</Text></View>
  <View style={[s.board,{width:size,height:size}]}>
   {lines.map(([a,b],k)=>{const ar=Math.floor(a/5),ac=a%5,br=Math.floor(b/5),bc=b%5;const x1=pad+ac*step,y1=pad+ar*step,x2=pad+bc*step,y2=pad+br*step;const len=Math.hypot(x2-x1,y2-y1),angle=Math.atan2(y2-y1,x2-x1);return <View key={k} style={[s.line,{left:x1,top:y1,width:len,transform:[{rotate:`${angle}rad`}]}]}/>})}
   {game.board.map((p,i)=>{const r=Math.floor(i/5),c=i%5;const isTarget=targets.some(m=>m.to===i);return <Pressable key={i} onPress={()=>tap(i)} style={[s.point,{left:pad+c*step-20,top:pad+r*step-20},isTarget&&s.target,selected===i&&s.selected]}>{p?<Mascot animal={p} size={38}/>:<View style={s.dot}/>}</Pressable>})}
  </View>
  <View style={s.scoreRow}>
   <View style={s.scoreCard}><Mascot animal="tiger" size={42}/><View><Text style={s.scoreTitle}>Tigers</Text><Text style={s.scoreCopy}>Captures: {game.goatsCaptured}</Text></View></View>
   <View style={s.scoreCard}><Mascot animal="goat" size={42}/><View><Text style={s.scoreTitle}>Goats</Text><Text style={s.scoreCopy}>{game.goatsPlaced<20?`To place: ${20-game.goatsPlaced}`:'All placed'}</Text></View></View>
  </View>
  <View style={s.controls}><Pressable style={s.control} onPress={()=>{setGame(initialState());setSelected(null)}}><Text style={s.controlIcon}>↻</Text><Text style={s.controlText}>Restart</Text></Pressable><Pressable style={[s.control,s.hint]}><Text style={s.controlIcon}>✦</Text><Text style={s.controlText}>Hint soon</Text></Pressable></View>
 </SafeAreaView>
}

const s=StyleSheet.create({
 page:{flex:1,backgroundColor:colors.greenDark,alignItems:'center'},top:{width:'100%',maxWidth:760,paddingHorizontal:18,paddingTop:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},back:{fontSize:42,color:colors.sand},heading:{color:colors.white,fontWeight:'900',textAlign:'center',letterSpacing:1},mode:{color:'#B7C8BD',fontSize:10,textAlign:'center',marginTop:4},restart:{fontSize:30,color:colors.sand},
 status:{alignItems:'center',marginVertical:13},turn:{fontSize:20,color:colors.sand,fontWeight:'900'},meta:{fontSize:12,color:'#B7C8BD',marginTop:4},
 board:{backgroundColor:'#D8A85F',borderRadius:radius.lg,position:'relative',borderWidth:8,borderColor:colors.brown,shadowColor:'#000',shadowOpacity:.25,shadowRadius:12,shadowOffset:{width:0,height:7}},line:{position:'absolute',height:2,backgroundColor:colors.green,transformOrigin:'left center'},point:{position:'absolute',width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',zIndex:2},dot:{width:10,height:10,borderRadius:5,backgroundColor:colors.green},target:{backgroundColor:'rgba(255,255,255,.55)'},selected:{borderWidth:3,borderColor:colors.orange,backgroundColor:'rgba(245,124,0,.18)'},
 scoreRow:{flexDirection:'row',gap:10,width:'100%',maxWidth:520,paddingHorizontal:16,marginTop:12},scoreCard:{flex:1,flexDirection:'row',alignItems:'center',gap:8,backgroundColor:colors.green,padding:8,borderRadius:radius.md},scoreTitle:{color:'white',fontWeight:'900'},scoreCopy:{color:'#D6E5DC',fontSize:11,marginTop:2},
 controls:{flexDirection:'row',gap:10,marginTop:10,width:'100%',maxWidth:520,paddingHorizontal:16},control:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,padding:12,borderRadius:radius.md,backgroundColor:colors.brown},hint:{backgroundColor:'#2D734F'},controlIcon:{color:'white',fontSize:17,fontWeight:'900'},controlText:{color:'white',fontWeight:'800',fontSize:12}
});