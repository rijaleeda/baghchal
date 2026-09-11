import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { applyMove, initialState, legalMoves, movesFrom, randomComputerMove, GameState } from '../game/engine';

const lines:[number,number][]=[];
for(let r=0;r<5;r++)for(let c=0;c<4;c++)lines.push([r*5+c,r*5+c+1]);
for(let c=0;c<5;c++)for(let r=0;r<4;r++)lines.push([r*5+c,(r+1)*5+c]);
for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r+c)%2===0){lines.push([r*5+c,(r+1)*5+c+6]);lines.push([r*5+c+1,(r+1)*5+c+5]);}

export default function Play(){
 const {mode}=useLocalSearchParams<{mode:string}>();
 const [game,setGame]=useState<GameState>(initialState());
 const [selected,setSelected]=useState<number|null>(null);
 const {width}=useWindowDimensions(); const size=Math.min(width-32,520); const pad=24; const step=(size-pad*2)/4;
 const legal=useMemo(()=>legalMoves(game,game.turn),[game]);
 const targets=selected!==null?movesFrom(game,selected):[];
 const computer=mode==='computer' && game.turn==='tiger' && !game.winner;
 useEffect(()=>{if(!computer)return; const t=setTimeout(()=>{const m=randomComputerMove(game);if(m)setGame(g=>applyMove(g,m));setSelected(null)},450);return()=>clearTimeout(t)},[computer,game]);
 function tap(i:number){if(computer||game.winner)return; const cell=game.board[i];
  if(game.turn==='goat'&&game.goatsPlaced<20){const m=legal.find(x=>x.from===null&&x.to===i);if(m)setGame(applyMove(game,m));return;}
  const target=targets.find(x=>x.to===i);if(target){setGame(applyMove(game,target));setSelected(null);return;}
  if(cell===game.turn)setSelected(i);else setSelected(null);
 }
 return <SafeAreaView style={s.page}><View style={s.top}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹</Text></Pressable><View><Text style={s.heading}>बाघचाल · BAGHCHAL</Text><Text style={s.mode}>{mode==='computer'?'YOU: GOATS  ·  COMPUTER: TIGERS':'LOCAL TWO PLAYER'}</Text></View><Pressable onPress={()=>{setGame(initialState());setSelected(null)}}><Text style={s.restart}>↻</Text></Pressable></View>
 <View style={s.status}><Text style={s.turn}>{game.winner?`${game.winner==='goat'?'GOATS':'TIGERS'} WIN`:(computer?'Tiger is thinking…':`${game.turn==='goat'?'Goats':'Tigers'} to move`)}</Text><Text style={s.meta}>Goats placed {game.goatsPlaced}/20   ·   Captured {game.goatsCaptured}/5</Text></View>
 <View style={[s.board,{width:size,height:size}]}>{lines.map(([a,b],k)=>{const ar=Math.floor(a/5),ac=a%5,br=Math.floor(b/5),bc=b%5;const x1=pad+ac*step,y1=pad+ar*step,x2=pad+bc*step,y2=pad+br*step;const len=Math.hypot(x2-x1,y2-y1),angle=Math.atan2(y2-y1,x2-x1);return <View key={k} style={[s.line,{left:x1,top:y1,width:len,transform:[{rotate:`${angle}rad`}]}]}/>})}
 {game.board.map((p,i)=>{const r=Math.floor(i/5),c=i%5;const isTarget=targets.some(m=>m.to===i);return <Pressable key={i} onPress={()=>tap(i)} style={[s.point,{left:pad+c*step-18,top:pad+r*step-18},isTarget&&s.target,selected===i&&s.selected]}>{p&&<View style={[s.piece,p==='tiger'?s.tiger:s.goat]}><Text style={s.icon}>{p==='tiger'?'ब':'बा'}</Text></View>}</Pressable>})}</View>
 <View style={s.help}><Text style={s.helpTitle}>{game.goatsPlaced<20?'PLACEMENT PHASE':'MOVEMENT PHASE'}</Text><Text style={s.helpText}>{game.turn==='goat'&&game.goatsPlaced<20?'Place one goat on any empty intersection. Tigers move after every placement.':'Tap a piece, then a highlighted intersection. Tigers capture by jumping over a goat.'}</Text></View>
 </SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#17261e',alignItems:'center'},top:{width:'100%',paddingHorizontal:18,paddingTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},back:{fontSize:42,color:'#e5c879'},heading:{color:'#fff8e7',fontWeight:'900',textAlign:'center',letterSpacing:1},mode:{color:'#9c947f',fontSize:10,textAlign:'center',marginTop:4},restart:{fontSize:30,color:'#e5c879'},status:{alignItems:'center',marginVertical:20},turn:{fontSize:20,color:'#e5c879',fontWeight:'800'},meta:{fontSize:12,color:'#aaa28f',marginTop:5},board:{backgroundColor:'#d7b977',borderRadius:20,position:'relative',borderWidth:8,borderColor:'#6f4529'},line:{position:'absolute',height:2,backgroundColor:'#49321f',transformOrigin:'left center'},point:{position:'absolute',width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center',zIndex:2},target:{backgroundColor:'rgba(255,255,255,.45)'},selected:{borderWidth:3,borderColor:'#f3e0a5'},piece:{width:31,height:31,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:2},tiger:{backgroundColor:'#c7552d',borderColor:'#692b19'},goat:{backgroundColor:'#f4ead2',borderColor:'#635944'},icon:{fontWeight:'900',fontSize:11,color:'#33261d'},help:{margin:22,maxWidth:520,padding:16,borderRadius:14,backgroundColor:'#203128'},helpTitle:{color:'#e5c879',fontWeight:'800',fontSize:12},helpText:{color:'#c7c0ac',marginTop:5,lineHeight:19}});