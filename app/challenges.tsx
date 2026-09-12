import { router } from 'expo-router';
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

const challenges = [
  {id:'safe_goats', icon:'◎', title:'Perfect Defense', side:'goat', difficulty:'expert', copy:'Trap all four tigers without losing a single goat.', reward:'★★★'},
  {id:'tiger_rush', icon:'⚡', title:'Tiger Rush', side:'tiger', difficulty:'hard', copy:'Capture five goats in 30 total moves or fewer.', reward:'★★'},
  {id:'trap_master', icon:'◇', title:'Trap Master', side:'goat', difficulty:'expert', copy:'Win while allowing no more than two goats to be captured.', reward:'★★★'},
] as const;

export default function Challenges(){
 return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.top}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹</Text></Pressable><View><Text style={s.kicker}>बाघचाल · BAGHCHAL</Text><Text style={s.title}>Challenges</Text></View><Text style={s.trophy}>♛</Text></View>
  <Text style={s.sub}>Purpose-built games that test real BaghChal strategy.</Text>
  <View style={s.hero}><Mascot animal="tiger" size={86}/><View style={s.heroText}><Text style={s.heroTitle}>Daily Challenge</Text><Text style={s.heroCopy}>Perfect Defense · Expert</Text></View><Mascot animal="goat" size={80}/></View>
  {challenges.map(c=><View key={c.id} style={s.card}>
    <View style={s.cardTop}><View style={s.icon}><Text style={s.iconText}>{c.icon}</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>{c.title}</Text><Text style={s.meta}>{c.side.toUpperCase()} · {c.difficulty.toUpperCase()}</Text></View><Text style={s.reward}>{c.reward}</Text></View>
    <Text style={s.copy}>{c.copy}</Text>
    <Pressable style={s.play} onPress={()=>router.push(`/play?mode=computer&side=${c.side}&difficulty=${c.difficulty}&challenge=${c.id}`)}><Text style={s.playText}>Play Challenge</Text><Text style={s.arrow}>›</Text></Pressable>
  </View>)}
  <Text style={s.footer}>New challenges can be rotated here without changing the core game.</Text>
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:colors.greenDark},content:{padding:20,paddingBottom:44,maxWidth:720,width:'100%',alignSelf:'center'},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{fontSize:42,color:colors.sand},kicker:{color:'#C6D8CE',fontSize:11,fontWeight:'800',textAlign:'center',letterSpacing:1},title:{color:colors.white,fontWeight:'900',fontSize:30,textAlign:'center'},trophy:{fontSize:28,color:'#F0C879'},sub:{color:'#C6D8CE',textAlign:'center',marginTop:8,marginBottom:18},hero:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#F3DFC0',borderRadius:radius.lg,padding:14,marginBottom:14},heroText:{alignItems:'center',flex:1},heroTitle:{fontWeight:'900',fontSize:20,color:colors.ink},heroCopy:{fontSize:12,color:colors.brown,marginTop:3},card:{backgroundColor:'#F8E8CF',borderRadius:radius.lg,padding:16,marginBottom:12,borderWidth:1,borderColor:'#D9B98F'},cardTop:{flexDirection:'row',alignItems:'center',gap:12},icon:{width:46,height:46,borderRadius:23,backgroundColor:'#E5C698',alignItems:'center',justifyContent:'center'},iconText:{fontSize:24,color:colors.brown,fontWeight:'900'},cardTitle:{fontSize:18,fontWeight:'900',color:colors.ink},meta:{fontSize:10,color:colors.green,fontWeight:'900',letterSpacing:1,marginTop:3},reward:{color:'#B06A1C',fontSize:14},copy:{fontSize:13,color:'#5A4A3D',lineHeight:19,marginTop:12},play:{marginTop:14,backgroundColor:colors.green,borderRadius:radius.md,paddingHorizontal:16,paddingVertical:13,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},playText:{color:'white',fontWeight:'900',fontSize:15},arrow:{color:'white',fontSize:24},footer:{textAlign:'center',color:'#9FB6AA',fontStyle:'italic',fontSize:11,marginTop:6}});