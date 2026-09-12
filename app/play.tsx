import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { applyMove, initialState, legalMoves, movesFrom, computerMove, GameState, Difficulty, Piece } from '../game/engine';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme';

const lines:[number,number][]=[];
for(let r=0;r<5;r++)for(let c=0;c<4;c++)lines.push([r*5+c,r*5+c+1]);
for(let c=0;c<5;c++)for(let r=0;r<4;r++)lines.push([r*5+c,(r+1)*5+c]);
// Traditional BaghChal diagonals: diagonal movement exists only from even-parity intersections.
for(let r=0;r<4;r++)for(let c=0;c<4;c++){
  if((r+c)%2===0) lines.push([r*5+c,(r+1)*5+c+1]);
  if((r+c)%2===1) lines.push([r*5+c+1,(r+1)*5+c]);
}

export default function Play(){
 const params=useLocalSearchParams<{mode?:string;side?:string;difficulty?:string}>();
 const mode=params.mode??'computer';
 const humanSide:Piece=params.side==='tiger'?'tiger':'goat';
 const difficulty=(['easy','medium','hard','expert'].includes(params.difficulty??'')?params.difficulty:'medium') as Difficulty;
 const [game,setGame]=useState<GameState>(initialState());
 const [selected,setSelected]=useState<number|null>(null);
 const {width}=useWindowDimensions();
 const size=Math.min(Math.max(width-26,320),520), pad=28, step=(size-pad*2)/4;
 const legal=useMemo(()=>legalMoves(game,game.turn),[game]);
 const targets=selected!==null?movesFrom(game,selected):[];
 const computer=mode==='computer'&&game.turn!==humanSide&&!game.winner;
 useEffect(()=>{if(!computer)return;const t=setTimeout(()=>{const m=computerMove(game,difficulty);if(m)setGame(g=>applyMove(g,m));setSelected(null)},difficulty==='expert'?650:420);return()=>clearTimeout(t)},[computer,game,difficulty]);
 function reset(){setGame(initialState());setSelected(null)}
 function tap(i:number){if(computer||game.winner)return;if(mode==='computer'&&game.turn!==humanSide)return;const cell=game.board[i];if(game.turn==='goat'&&game.goatsPlaced<20){const m=legal.find(x=>x.from===null&&x.to===i);if(m)setGame(applyMove(game,m));return}const target=targets.find(x=>x.to===i);if(target){setGame(applyMove(game,target));setSelected(null);return}setSelected(cell===game.turn?i:null)}
 const turnLabel=game.winner?`${game.winner==='goat'?'Goats':'Tigers'} win!`:computer?'Computer is thinking…':`${game.turn==='goat'?'Goats':'Tigers'} to move`;
 return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.hero}>
   <View style={s.top}><Pressable style={s.circle} onPress={()=>router.back()}><Text style={s.circleText}>‹</Text></Pressable><View style={s.brand}><Text style={s.mountain}>▲  ⛰  ▲</Text><Text style={s.nepali}>बाघचाल</Text><Text style={s.english}>BAGHCHAL</Text><Text style={s.tag}>A timeless game from Nepal</Text></View><Pressable style={s.circle} onPress={reset}><Text style={s.circleText}>↻</Text></Pressable></View>
   <Text style={s.mantra}>Play · Learn · Share · Keep the Tradition Alive</Text>
   <View style={s.mascots}><View style={s.side}><Mascot animal="tiger" size={82}/><View><Text style={s.sideTitle}>Tigers</Text><Text style={s.sideCopy}>Strong. Strategic. Fearless.</Text></View></View><View style={[s.side,{justifyContent:'flex-end'}]}><View style={{alignItems:'flex-end'}}><Text style={s.sideTitle}>Goats</Text><Text style={s.sideCopy}>Many. United. Clever.</Text></View><Mascot animal="goat" size={82}/></View></View>
  </View>
  <View style={s.turnBox}><Text style={s.turn}>{turnLabel}</Text><Text style={s.sub}>{game.goatsPlaced<20?`Place a goat on an empty point · ${20-game.goatsPlaced} remaining`:`Movement phase · ${game.goatsCaptured}/5 captured`}</Text></View>
  <View style={[s.board,{width:size,height:size}]}>
   {lines.map(([a,b],k)=>{const ar=Math.floor(a/5),ac=a%5,br=Math.floor(b/5),bc=b%5,x1=pad+ac*step,y1=pad+ar*step,x2=pad+bc*step,y2=pad+br*step,len=Math.hypot(x2-x1,y2-y1),angle=Math.atan2(y2-y1,x2-x1);return <View key={k} style={[s.line,{left:x1,top:y1,width:len,transform:[{rotate:`${angle}rad`}]}]}/>})}
   {game.board.map((p,i)=>{const r=Math.floor(i/5),c=i%5,isTarget=targets.some(m=>m.to===i);return <Pressable key={i} onPress={()=>tap(i)} style={[s.point,{left:pad+c*step-24,top:pad+r*step-24},isTarget&&s.target,selected===i&&s.selected]}>{!p&&<View style={s.node}/>} {p&&<Mascot animal={p} size={46}/>}</Pressable>})}
  </View>
  <View style={s.titleLine}><View style={s.rule}/><Text style={s.yourTurn}>Your Turn</Text><View style={s.rule}/></View><Text style={s.choose}>{game.goatsPlaced<20?'Place a piece on an empty point':'Choose a piece and move to a highlighted point'}</Text>
  <View style={s.score}><View style={s.scoreItem}><Mascot animal="tiger" size={52}/><View><Text style={s.scoreTitle}>Tigers</Text><Text style={s.scoreText}>Captured: {game.goatsCaptured}</Text></View></View><View style={s.scoreItem}><Mascot animal="goat" size={52}/><View><Text style={s.scoreTitle}>Goats</Text><Text style={s.scoreText}>{game.goatsPlaced<20?`To place: ${20-game.goatsPlaced}`:'All placed'}</Text></View></View></View>
  <View style={s.controls}><Pressable style={[s.control,s.undo]}><Text style={s.icon}>↶</Text><Text style={s.controlText}>Undo</Text></Pressable><Pressable style={[s.control,s.restart]} onPress={reset}><Text style={s.icon}>↻</Text><Text style={s.controlText}>Restart</Text></Pressable><Pressable style={[s.control,s.hint]}><Text style={s.icon}>✦</Text><Text style={s.controlText}>Hint</Text></Pressable></View>
  <View style={s.footer}><Text>🇳🇵  EN | नेपाली</Text><Text style={s.home}>More Than a Game — A Piece of Home</Text><Text style={s.learn}>▣ Learn to Play</Text></View>
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F1DFC1'},content:{alignItems:'center',paddingBottom:26},hero:{width:'100%',backgroundColor:'#CFE3E8',padding:12,paddingBottom:5},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},circle:{width:44,height:44,borderRadius:22,backgroundColor:'#F8E8CB',alignItems:'center',justifyContent:'center'},circleText:{fontSize:30,color:'#382419'},brand:{alignItems:'center'},mountain:{fontSize:20,color:'#C56D24',fontWeight:'900'},nepali:{fontSize:35,fontWeight:'900',color:'#291A12'},english:{fontSize:16,fontWeight:'900',letterSpacing:5,color:'#291A12'},tag:{fontSize:11,color:'#4B4037',marginTop:2},mantra:{textAlign:'center',fontSize:10,color:'#28513D',fontStyle:'italic',marginTop:4},mascots:{flexDirection:'row',justifyContent:'space-between',marginTop:4},side:{flex:1,flexDirection:'row',alignItems:'center',gap:3},sideTitle:{fontSize:17,fontWeight:'900',color:'#291A12'},sideCopy:{fontSize:9,color:'#55493F'},turnBox:{alignItems:'center',paddingVertical:9},turn:{fontSize:20,fontWeight:'900',color:'#291A12'},sub:{fontSize:10,color:'#66584D',marginTop:2},board:{position:'relative',backgroundColor:'#E5C18A',borderWidth:10,borderColor:'#8A6546',borderRadius:18,shadowColor:'#000',shadowOpacity:.2,shadowRadius:10,shadowOffset:{width:0,height:5}},line:{position:'absolute',height:3,backgroundColor:'#57351F',transformOrigin:'left center',borderRadius:2},point:{position:'absolute',width:48,height:48,borderRadius:24,alignItems:'center',justifyContent:'center',zIndex:2,backgroundColor:'transparent'},node:{width:16,height:16,borderRadius:8,backgroundColor:'#D9A963',borderWidth:3,borderColor:'#57351F'},target:{backgroundColor:'rgba(255,255,255,.55)'},selected:{borderWidth:3,borderColor:colors.orange,backgroundColor:'rgba(245,124,0,.12)'},titleLine:{flexDirection:'row',alignItems:'center',gap:10,marginTop:13},rule:{width:65,height:1,backgroundColor:'#8C745D'},yourTurn:{fontSize:22,fontWeight:'900',color:'#291A12'},choose:{fontSize:11,color:'#5C5047',marginTop:2},score:{flexDirection:'row',justifyContent:'space-around',width:'100%',maxWidth:520,marginTop:8,paddingHorizontal:20},scoreItem:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'transparent'},scoreTitle:{fontSize:17,fontWeight:'900',color:'#291A12'},scoreText:{fontSize:11,color:'#5C5047'},controls:{flexDirection:'row',gap:10,width:'100%',maxWidth:520,paddingHorizontal:20,marginTop:9},control:{flex:1,alignItems:'center',paddingVertical:10,borderRadius:14},undo:{backgroundColor:'#684738'},restart:{backgroundColor:'#B7382A'},hint:{backgroundColor:'#1D6945'},icon:{fontSize:20,color:'#fff',fontWeight:'900'},controlText:{fontSize:11,color:'#fff',fontWeight:'800'},footer:{width:'100%',maxWidth:680,paddingHorizontal:20,marginTop:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},home:{flex:1,textAlign:'center',fontSize:10,color:'#6A4C3B',fontStyle:'italic'},learn:{fontSize:10,fontWeight:'700',color:'#342318'}});