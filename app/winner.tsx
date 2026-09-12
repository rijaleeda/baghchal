import { useEffect, useMemo, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

export default function Winner(){
 const p=useLocalSearchParams<{winner?:string;captured?:string;challenge?:string;challengeSuccess?:string;side?:string;difficulty?:string}>();
 const winner=p.winner==='tiger'?'tiger':'goat';
 const scale=useRef(new Animated.Value(.7)).current;
 const rise=useRef(new Animated.Value(20)).current;
 const confetti=useMemo(()=>Array.from({length:18},(_,i)=>({left:`${5+(i*53)%90}%`,delay:(i%6)*90,spin:i%2?1:-1})),[]);
 const falls=useRef(confetti.map(()=>new Animated.Value(-35))).current;
 useEffect(()=>{
   Animated.parallel([
    Animated.spring(scale,{toValue:1,useNativeDriver:false,friction:5,tension:65}),
    Animated.timing(rise,{toValue:0,duration:500,easing:Easing.out(Easing.cubic),useNativeDriver:false}),
    ...falls.map((v,i)=>Animated.timing(v,{toValue:500,duration:1600+(i%5)*120,delay:confetti[i].delay,easing:Easing.out(Easing.quad),useNativeDriver:false}))
   ]).start();
 },[]);
 const challengeText=p.challenge? (p.challengeSuccess==='true'?'Challenge complete!':'Game complete · challenge target missed') : null;
 const playAgain=()=>router.replace(`/play?mode=computer&side=${p.side??'goat'}&difficulty=${p.difficulty??'medium'}${p.challenge?`&challenge=${p.challenge}`:''}`);
 return <SafeAreaView style={s.page}>
  <View style={s.sky}/>
  {confetti.map((c,i)=><Animated.View key={i} style={[s.confetti,{left:c.left as any,transform:[{translateY:falls[i]},{rotate:`${c.spin*18}deg`}],backgroundColor:i%3===0?colors.orange:i%3===1?colors.red:'#F2C14E'}]}/>)}
  <Animated.View style={[s.hero,{transform:[{scale},{translateY:rise}]}]}>
    <Mascot animal={winner} size={170}/>
    <View style={s.ribbon}><Text style={s.winText}>{winner==='goat'?'Goats Win!':'Tigers Win!'}</Text><Text style={s.motto}>{winner==='goat'?'Unity brings strength!':'Power meets strategy!'}</Text></View>
  </Animated.View>
  <View style={s.card}>
   <View style={s.stats}><View style={s.stat}><Mascot animal="tiger" size={48}/><View><Text style={s.statTitle}>Tigers</Text><Text style={s.statCopy}>Captures: {p.captured??'0'}</Text></View></View><View style={s.stat}><Mascot animal="goat" size={48}/><View><Text style={s.statTitle}>Goats</Text><Text style={s.statCopy}>{winner==='goat'?'All tigers blocked':'Five goats captured'}</Text></View></View></View>
   {challengeText&&<View style={[s.challenge,p.challengeSuccess==='true'&&s.challengeDone]}><Text style={s.challengeText}>{challengeText}</Text></View>}
   <Pressable style={s.again} onPress={playAgain}><Text style={s.againText}>↻  Play Again</Text></Pressable>
   <Pressable style={s.menu} onPress={()=>router.replace('/')}><Text style={s.menuText}>⌂  Main Menu</Text></Pressable>
  </View>
  <Text style={s.quote}>“Traditional games connect us to our roots.”</Text>
 </SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F2E2C8',alignItems:'center',justifyContent:'center',padding:20,overflow:'hidden'},sky:{position:'absolute',left:0,right:0,top:0,height:'48%',backgroundColor:'#CDE4EE'},confetti:{position:'absolute',top:0,width:10,height:18,borderRadius:2,zIndex:2},hero:{alignItems:'center',zIndex:3,marginTop:20},ribbon:{marginTop:-8,backgroundColor:'#C93629',borderRadius:12,paddingVertical:14,paddingHorizontal:30,minWidth:280,alignItems:'center',shadowColor:'#000',shadowOpacity:.22,shadowRadius:7,shadowOffset:{width:0,height:4}},winText:{fontSize:34,fontWeight:'900',color:'white'},motto:{fontSize:14,color:'#FFE8D8',fontWeight:'700',marginTop:3},card:{marginTop:18,width:'100%',maxWidth:520,backgroundColor:'#FFF2DC',borderRadius:radius.lg,padding:16,borderWidth:1,borderColor:'#DDBE94'},stats:{flexDirection:'row',gap:10},stat:{flex:1,flexDirection:'row',alignItems:'center',gap:6},statTitle:{fontSize:15,fontWeight:'900',color:colors.ink},statCopy:{fontSize:10,color:colors.brown},challenge:{marginTop:14,borderRadius:12,padding:10,backgroundColor:'#F4D8C6',alignItems:'center'},challengeDone:{backgroundColor:'#DDEBD9'},challengeText:{fontSize:12,fontWeight:'800',color:colors.ink},again:{marginTop:15,backgroundColor:colors.green,borderRadius:radius.md,padding:15,alignItems:'center'},againText:{color:'white',fontSize:17,fontWeight:'900'},menu:{marginTop:10,backgroundColor:'#E6BF89',borderRadius:radius.md,padding:14,alignItems:'center'},menuText:{color:colors.ink,fontSize:16,fontWeight:'900'},quote:{marginTop:20,color:colors.brown,fontStyle:'italic',textAlign:'center'}});