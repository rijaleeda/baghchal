import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

const difficulties=[['easy','Easy','●'],['medium','Medium','▮▮'],['hard','Hard','★'],['expert','Expert','♛']] as const;
export default function Setup(){
 const {mode='computer'}=useLocalSearchParams<{mode?:string}>();
 const [side,setSide]=useState<'goat'|'tiger'>('goat');
 const [difficulty,setDifficulty]=useState('medium');
 const local=mode==='local';
 const start=()=>router.push(`/play?mode=${mode}&side=${side}&difficulty=${difficulty}`);
 return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.top}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹</Text></Pressable><Text style={s.title}>{local?'Local Game':'Choose Your Side'}</Text><View style={{width:32}}/></View>
  <Text style={s.kicker}>बाघचाल · BAGHCHAL</Text><Text style={s.sub}>{local?'Pass the device after each move.':'Pick a side, then choose how hard the AI should play.'}</Text>
  {!local&&<View style={s.cards}>
   <Pressable onPress={()=>setSide('tiger')} style={[s.sideCard,side==='tiger'&&s.selected]}><Mascot animal="tiger" size={138}/><Text style={s.cardTitle}>Tigers (बाघ)</Text><Text style={s.cardText}>Strong. Strategic. Fearless.</Text></Pressable>
   <Pressable onPress={()=>setSide('goat')} style={[s.sideCard,side==='goat'&&s.selected]}><Mascot animal="goat" size={138}/><Text style={s.cardTitle}>Goats (बोका)</Text><Text style={s.cardText}>Many. United. Clever.</Text></Pressable>
  </View>}
  {!local&&<><Text style={s.section}>SELECT DIFFICULTY</Text><View style={s.diffRow}>{difficulties.map(([v,l,i])=><Pressable key={v} onPress={()=>setDifficulty(v)} style={[s.diff,difficulty===v&&s.diffSelected]}><Text style={s.diffIcon}>{i}</Text><Text style={s.diffText}>{l}</Text></Pressable>)}</View>
  <Pressable style={s.challenge} onPress={()=>router.push('/challenges')}><View style={s.target}><Text style={s.targetText}>◎</Text></View><View style={{flex:1}}><Text style={s.challengeTitle}>Daily Challenge</Text><Text style={s.challengeCopy}>Block all tigers without losing a goat</Text></View><Text style={s.arrow}>›</Text></Pressable></>}
  <Pressable onPress={start} style={s.start}><Text style={s.startText}>Start Game</Text></Pressable><Text style={s.quote}>“Every move teaches patience.”</Text>
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:colors.greenDark},content:{padding:18,paddingBottom:40,maxWidth:720,width:'100%',alignSelf:'center'},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{fontSize:42,color:colors.sand},title:{fontSize:27,fontWeight:'900',color:colors.white},kicker:{textAlign:'center',color:'#C6D8CE',fontSize:11,fontWeight:'800',letterSpacing:1,marginTop:3},sub:{color:'#C8D8CE',textAlign:'center',marginTop:8,marginBottom:16,fontSize:12},cards:{gap:12},sideCard:{backgroundColor:'#F5E4C9',borderRadius:radius.lg,alignItems:'center',padding:12,borderWidth:3,borderColor:'transparent',minHeight:205},selected:{borderColor:colors.orange,backgroundColor:'#FFF1DD'},cardTitle:{fontSize:21,fontWeight:'900',color:colors.ink,marginTop:-5},cardText:{fontSize:11,color:colors.brown,marginTop:2},section:{color:colors.sand,fontWeight:'900',fontSize:12,letterSpacing:1.5,marginTop:20,marginBottom:9,textAlign:'center'},diffRow:{flexDirection:'row',gap:8},diff:{flex:1,backgroundColor:'#F5E4C9',borderRadius:12,paddingVertical:12,alignItems:'center',borderWidth:2,borderColor:'transparent'},diffSelected:{borderColor:colors.orange,backgroundColor:'#FBE0C2'},diffIcon:{fontSize:18,color:colors.green,fontWeight:'900'},diffText:{fontSize:11,color:colors.ink,fontWeight:'800',marginTop:4},challenge:{marginTop:14,backgroundColor:'#F5E4C9',borderRadius:radius.md,padding:13,flexDirection:'row',alignItems:'center',gap:11},target:{width:44,height:44,borderRadius:22,backgroundColor:'#E8C69A',alignItems:'center',justifyContent:'center'},targetText:{fontSize:25,color:colors.red,fontWeight:'900'},challengeTitle:{fontWeight:'900',fontSize:15,color:colors.ink},challengeCopy:{fontSize:11,color:colors.brown,marginTop:2},arrow:{fontSize:26,color:colors.brown},start:{marginTop:18,backgroundColor:colors.orange,borderRadius:radius.md,padding:17,alignItems:'center'},startText:{color:'white',fontWeight:'900',fontSize:18},quote:{color:'#B8C8BD',fontStyle:'italic',textAlign:'center',marginTop:16}});