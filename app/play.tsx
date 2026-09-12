import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { applyMove, initialState, legalMoves, movesFrom, computerMove, GameState, Difficulty, Piece } from '../game/engine';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

const lines:[number,number][]=[];
for(let r=0;r<5;r++)for(let c=0;c<4;c++)lines.push([r*5+c,r*5+c+1]);
for(let c=0;c<5;c++)for(let r=0;r<4;r++)lines.push([r*5+c,(r+1)*5+c]);
for(let r=0;r<5;r++)for(let c=0;c<5;c++){
  if((r+c)%2!==0)continue;
  if(r<4&&c<4)lines.push([r*5+c,(r+1)*5+c+1]);
  if(r<4&&c>0)lines.push([r*5+c,(r+1)*5+c-1]);
}

export default function Play(){
 const params=useLocalSearchParams<{mode?:string;side?:string;difficulty?:string}>();
 const mode=params.mode??'computer';
 const humanSide:Piece=params.side==='tiger'?'tiger':'goat';
 const difficulty=(['easy','medium','hard','expert'].includes(params.difficulty??'')?params.difficulty:'medium') as Difficulty;
 const [game,setGame]=useState<GameState>(initialState());
 const [selected,setSelected]=useState<number|null>(null);
 const {width}=useWindowDimensions();
 const size=Math.min(width-24,520); const pad=26; const step=(size-pad*2)/4;
 const legal=useMemo(()=>legalMoves(game,game.turn),[game]);
 const targets=selected!==null?movesFrom(game,selected):[];
 const computer=mode==='computer'&&game.turn!==humanSide&&!game.winner;

 useEffect(()=>{
  if(!computer)return;
  const t=setTimeout(()=>{const m=computerMove(game,difficulty);if(m)setGame(g=>applyMove(g,m));setSelected(null)},difficulty==='expert'?650:420);
  return()=>clearTimeout(t);
 },[computer,game,difficulty]);

 function reset(){setGame(initialState());setSelected(null)}
 function tap(i:number){
  if(computer||game.winner)return;
  const cell=game.board[i];
  if(mode==='computer'&&game.turn!==humanSide)return;
  if(game.turn==='goat'&&game.goatsPlaced<20){const m=legal.find(x=>x.from===null&&x.to===i);if(m)setGame(applyMove(game,m));return;}
  const target=targets.find(x=>x.to===i);if(target){setGame(applyMove(game,target));setSelected(null);return;}
  if(cell===game.turn)setSelected(i);else setSelected(null);
 }

 const turnLabel=game.winner?`${game.winner==='goat'?'Goats':'Tigers'} win!`:computer?'Computer is thinking…':`${game.turn==='goat'?'Goats':'Tigers'} to move`;
 const subtitle=game.goatsPlaced<20?`Place a goat on an empty point · ${20-game.goatsPlaced} remaining`:`Movement phase · ${game.goatsCaptured}/5 goats captured`;

 return <SafeAreaView style={s.page}>
  <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
   <View style={s.hero}>
    <View style={s.topRow}>
     <Pressable style={s.circleBtn} onPress={()=>router.back()}><Text style={s.circleText}>‹</Text></Pressable>
     <View style={s.brandWrap}><Text style={s.mountain}>△  ⛰  △</Text><Text style={s.nepali}>बाघचाल</Text><Text style={s.brand}>BAGHCHAL</Text><Text style={s.tagline}>A timeless game from Nepal</Text></View>
     <Pressable style={s.circleBtn} onPress={reset}><Text style={s.circleText}>↻</Text></Pressable>
    </View>
    <Text style={s.mantra}>Play · Learn · Share · Keep the Tradition Alive</Text>
    <View style={s.mascotRow}>
      <View style={s.mascotSide}><Mascot animal="tiger" size={86}/><View><Text style={s.mascotTitle}>Tigers</Text><Text style={s.mascotCopy}>Strong. Strategic. Fearless.</Text></View></View>
      <View style={[s.mascotSide,{justifyContent:'flex-end'}]}><View style={{alignItems:'flex-end'}}><Text style={s.mascotTitle}>Goats</Text><Text style={s.mascotCopy}>Many. United. Clever.</Text></View><Mascot animal="goat" size={86}/></View>
    </View>
   </View>

   <View style={s.turnWrap}><Text style={s.turn}>{turnLabel}</Text><Text style={s.turnSub}>{subtitle}</Text><Text style={s.mode}>{mode==='computer'?`${difficulty.toUpperCase()} · YOU: ${humanSide.toUpperCase()}`:'LOCAL TWO PLAYER'}</Text></View>

   <View style={[s.board,{width:size,height:size}]}>
    <View style={s.boardInner}/>
    {lines.map(([a,b],k)=>{const ar=Math.floor(a/5),ac=a%5,br=Math.floor(b/5),bc=b%5;const x1=pad+ac*step,y1=pad+ar*step,x2=pad+bc*step,y2=pad+br*step;const len=Math.hypot(x2-x1,y2-y1),angle=Math.atan2(y2-y1,x2-x1);return <View key={k} style={[s.line,{left:x1,top:y1,width:len,transform:[{rotate:`${angle}rad`}]}]}/>})}
    {game.board.map((p,i)=>{const r=Math.floor(i/5),c=i%5;const isTarget=targets.some(m=>m.to===i);return <Pressable key={i} onPress={()=>tap(i)} style={[s.point,{left:pad+c*step-23,top:pad+r*step-23},isTarget&&s.target,selected===i&&s.selected]}>
      {!p&&<View style={s.node}/>} 
      {p&&<Mascot animal={p} size={44}/>} 
    </Pressable>})}
   </View>

   <View style={s.bottomTitle}><View style={s.rule}/><Text style={s.yourTurn}>Your Turn</Text><View style={s.rule}/></View>
   <Text style={s.choose}>{game.goatsPlaced<20?'Place a goat on any empty point':'Choose a piece and move to a highlighted point'}</Text>

   <View style={s.scoreRow}>
    <View style={s.scoreItem}><Mascot animal="tiger" size={54}/><View><Text style={s.scoreTitle}>Tigers</Text><Text style={s.scoreCopy}>Captures: {game.goatsCaptured}</Text></View></View>
    <View style={s.scoreItem}><Mascot animal="goat" size={54}/><View><Text style={s.scoreTitle}>Goats</Text><Text style={s.scoreCopy}>{game.goatsPlaced<20?`To place: ${20-game.goatsPlaced}`:'All placed'}</Text></View></View>
   </View>

   <View style={s.controls}>
    <Pressable style={[s.control,s.undo]}><Text style={s.controlIcon}>↶</Text><Text style={s.controlText}>Undo</Text></Pressable>
    <Pressable style={[s.control,s.restart]} onPress={reset}><Text style={s.controlIcon}>↻</Text><Text style={s.controlText}>Restart</Text></Pressable>
    <Pressable style={[s.control,s.hint]}><Text style={s.controlIcon}>✦</Text><Text style={s.controlText}>Hint</Text></Pressable>
   </View>

   <View style={s.footerRow}><Text style={s.lang}>🇳🇵  EN | नेपाली</Text><Text style={s.home}>More Than a Game — A Piece of Home</Text><Text style={s.learn}>▣ Learn to Play</Text></View>
  </ScrollView>
 </SafeAreaView>
}

const s=StyleSheet.create({
 page:{flex:1,backgroundColor:'#EFDDBF'},content:{alignItems:'center',paddingBottom:26},hero:{width:'100%',backgroundColor:'#CFE2E8',paddingHorizontal:16,paddingTop:8,paddingBottom:8,borderBottomWidth:1,borderBottomColor:'#B6CFCB'},
 topRow:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},circleBtn:{width:44,height:44,borderRadius:22,backgroundColor:'#F7E7CC',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.12,shadowRadius:4,shadowOffset:{width:0,height:2}},circleText:{fontSize:30,color:'#3A2518',lineHeight:34},
 brandWrap:{alignItems:'center'},mountain:{fontSize:24,color:'#C87025',fontWeight:'800',height:28},nepali:{fontSize:36,fontWeight:'900',color:'#2E211A',marginTop:-4},brand:{fontSize:17,fontWeight:'900',color:'#2E211A',letterSpacing:5,marginTop:-3},tagline:{fontSize:12,color:'#4E4238',marginTop:3},mantra:{textAlign:'center',fontSize:11,color:'#244C3B',marginTop:6,fontStyle:'italic'},
 mascotRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',marginTop:6},mascotSide:{flex:1,flexDirection:'row',alignItems:'center',gap:5},mascotTitle:{fontSize:18,fontWeight:'900',color:'#2E211A'},mascotCopy:{fontSize:9,color:'#5B5148'},
 turnWrap:{alignItems:'center',paddingTop:10,paddingBottom:9},turn:{fontSize:20,fontWeight:'900',color:'#2E211A'},turnSub:{fontSize:11,color:'#6A5B50',marginTop:2},mode:{fontSize:9,color:'#7E7165',marginTop:3,letterSpacing:.6},
 board:{position:'relative',backgroundColor:'#E6BF83',borderRadius:20,borderWidth:10,borderColor:'#8E6A4A',overflow:'hidden',shadowColor:'#000',shadowOpacity:.22,shadowRadius:12,shadowOffset:{width:0,height:7}},boardInner:{position:'absolute',left:4,right:4,top:4,bottom:4,borderRadius:12,backgroundColor:'#E7C48D'},line:{position:'absolute',height:3,backgroundColor:'#5A3822',transformOrigin:'left center',borderRadius:3},point:{position:'absolute',width:46,height:46,borderRadius:23,alignItems:'center',justifyContent:'center',zIndex:2,backgroundColor:'transparent'},node:{width:16,height:16,borderRadius:8,backgroundColor:'#E7C48D',borderWidth:3,borderColor:'#5A3822'},target:{backgroundColor:'rgba(255,255,255,.66)'},selected:{borderWidth:3,borderColor:colors.orange,backgroundColor:'rgba(245,124,0,.12)'},
 bottomTitle:{flexDirection:'row',alignItems:'center',gap:10,marginTop:14},rule:{width:70,height:1,backgroundColor:'#8B735E'},yourTurn:{fontSize:22,fontWeight:'900',color:'#2E211A'},choose:{fontSize:12,color:'#5B5148',marginTop:2},
 scoreRow:{flexDirection:'row',width:'100%',maxWidth:520,paddingHorizontal:20,justifyContent:'space-between',marginTop:8},scoreItem:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'transparent'},scoreTitle:{fontSize:17,fontWeight:'900',color:'#2E211A'},scoreCopy:{fontSize:11,color:'#5B5148'},
 controls:{flexDirection:'row',gap:10,width:'100%',maxWidth:520,paddingHorizontal:20,marginTop:10},control:{flex:1,alignItems:'center',paddingVertical:11,borderRadius:14},undo:{backgroundColor:'#6D4C41'},restart:{backgroundColor:'#B63A2B'},hint:{backgroundColor:'#1E6A46'},controlIcon:{fontSize:20,color:'white',fontWeight:'900'},controlText:{fontSize:11,color:'white',fontWeight:'800',marginTop:2},
 footerRow:{width:'100%',maxWidth:680,paddingHorizontal:20,marginTop:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},lang:{fontSize:11,color:'#2E211A'},home:{fontSize:11,color:'#6D4C41',fontStyle:'italic',textAlign:'center',flex:1},learn:{fontSize:11,color:'#2E211A',fontWeight:'700'}
});
