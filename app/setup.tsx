import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors, radius } from '../theme';

const difficulties = [
  ['easy', 'Easy', 'A gentle start'],
  ['medium', 'Medium', 'A real challenge'],
  ['hard', 'Hard', 'Think ahead'],
  ['expert', 'Expert', 'For BaghChal masters'],
] as const;

export default function Setup() {
  const { mode = 'computer' } = useLocalSearchParams<{ mode?: string }>();
  const [side, setSide] = useState<'goat' | 'tiger'>('goat');
  const [difficulty, setDifficulty] = useState('medium');
  const local = mode === 'local';
  const start = () => router.push(`/play?mode=${mode}&side=${side}&difficulty=${difficulty}`);

  return <SafeAreaView style={s.page}>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.top}><Pressable onPress={() => router.back()}><Text style={s.back}>‹</Text></Pressable><Text style={s.kicker}>बाघचाल · BAGHCHAL</Text><View style={{width:30}} /></View>
      <Text style={s.title}>{local ? 'Local Game' : 'Choose Your Side'}</Text>
      <Text style={s.sub}>{local ? 'Pass the device after each move.' : 'Pick the side you want to command.'}</Text>

      {!local && <View style={s.sideRow}>
        <Pressable onPress={() => setSide('tiger')} style={[s.sideCard, side === 'tiger' && s.selected]}>
          <Mascot animal="tiger" size={105}/><Text style={s.cardTitle}>Tigers</Text><Text style={s.cardText}>Strong · Strategic · Fearless</Text>
        </Pressable>
        <Pressable onPress={() => setSide('goat')} style={[s.sideCard, side === 'goat' && s.selected]}>
          <Mascot animal="goat" size={105}/><Text style={s.cardTitle}>Goats</Text><Text style={s.cardText}>Many · United · Clever</Text>
        </Pressable>
      </View>}

      {!local && <>
        <Text style={s.section}>DIFFICULTY</Text>
        <View style={s.diffList}>{difficulties.map(([value,label,copy], i) => <Pressable key={value} onPress={() => setDifficulty(value)} style={[s.diff, difficulty === value && s.diffSelected]}>
          <View style={s.levelIcon}><Text style={s.levelText}>{i === 0 ? '●' : i === 1 ? '▮▮' : i === 2 ? '▮▮▮' : '♛'}</Text></View>
          <View style={{flex:1}}><Text style={s.diffTitle}>{label}</Text><Text style={s.diffCopy}>{copy}</Text></View>
          <Text style={s.check}>{difficulty === value ? '✓' : '›'}</Text>
        </Pressable>)}</View>
      </>}

      <Pressable onPress={start} style={s.start}><Text style={s.startText}>Start Game</Text></Pressable>
      <Text style={s.quote}>“Every move teaches patience.”</Text>
    </ScrollView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  page:{flex:1,backgroundColor:colors.greenDark},content:{padding:20,paddingBottom:40,maxWidth:760,width:'100%',alignSelf:'center'},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{fontSize:42,color:colors.sand},kicker:{fontWeight:'800',color:colors.sand,letterSpacing:1},
  title:{fontSize:30,fontWeight:'900',color:colors.white,textAlign:'center',marginTop:20},sub:{color:'#C8D8CE',textAlign:'center',marginTop:8,marginBottom:20},
  sideRow:{flexDirection:'row',gap:12},sideCard:{flex:1,minHeight:190,backgroundColor:colors.sand,borderRadius:radius.lg,alignItems:'center',padding:16,borderWidth:3,borderColor:'transparent'},selected:{borderColor:colors.orange,backgroundColor:'#FFF4E6'},
  cardTitle:{fontSize:22,fontWeight:'900',color:colors.ink},cardText:{fontSize:11,color:colors.brown,textAlign:'center',marginTop:3},section:{color:colors.sand,fontWeight:'900',fontSize:12,letterSpacing:2,marginTop:26,marginBottom:10},
  diffList:{gap:10},diff:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:colors.sand,padding:15,borderRadius:radius.md,borderWidth:2,borderColor:'transparent'},diffSelected:{borderColor:colors.green,backgroundColor:'#EEF6E9'},
  levelIcon:{width:42,height:42,borderRadius:21,backgroundColor:'#E3EAD9',alignItems:'center',justifyContent:'center'},levelText:{color:colors.green,fontWeight:'900'},diffTitle:{fontWeight:'900',fontSize:16,color:colors.ink},diffCopy:{color:colors.muted,fontSize:12,marginTop:2},check:{fontSize:22,color:colors.green,fontWeight:'800'},
  start:{marginTop:22,backgroundColor:colors.orange,borderRadius:radius.md,padding:18,alignItems:'center'},startText:{color:'white',fontWeight:'900',fontSize:18},quote:{color:'#B8C8BD',fontStyle:'italic',textAlign:'center',marginTop:18},
});
