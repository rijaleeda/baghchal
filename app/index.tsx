import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors, radius, type } from '../theme';

export default function Home(){
 return <SafeAreaView style={s.page}>
   <View style={s.mountains}><Text style={s.mountainText}>△  △△   ⛰</Text></View>
   <View style={s.hero}>
     <View style={s.mascots}><Mascot animal="tiger" size={100}/><Mascot animal="goat" size={92}/></View>
     <Text style={s.nepali}>बाघचाल</Text><Text style={s.title}>BAGHCHAL</Text>
     <Text style={s.sub}>A timeless game from Nepal</Text>
   </View>
   <View style={s.actions}>
    <Pressable style={s.primary} onPress={()=>router.push('/setup?mode=computer')}><Text style={s.playIcon}>▶</Text><View><Text style={s.primaryText}>Play vs Computer</Text><Text style={s.smallLight}>Easy to Expert AI</Text></View></Pressable>
    <Pressable style={s.secondary} onPress={()=>router.push('/setup?mode=local')}><Text style={s.friendIcon}>●●</Text><View><Text style={s.secondaryText}>Play with Friend</Text><Text style={s.small}>Same device · Offline</Text></View></Pressable>
    <Pressable style={s.learn} onPress={()=>{}}><Text style={s.book}>▣</Text><View><Text style={s.learnText}>Learn to Play</Text><Text style={s.small}>Rules · Strategy · History</Text></View><Text style={s.soon}>Soon</Text></Pressable>
   </View>
   <View style={s.bottom}><Text style={s.footer}>Play · Learn · Share · Keep the tradition alive</Text><Text style={s.origin}>A game from Nepal for the world</Text></View>
 </SafeAreaView>
}
const s=StyleSheet.create({
 page:{flex:1,backgroundColor:colors.sand,padding:22,justifyContent:'space-between',overflow:'hidden'},
 mountains:{position:'absolute',left:0,right:0,top:0,height:175,backgroundColor:'#DDE9E5',justifyContent:'flex-end',alignItems:'center'},mountainText:{fontSize:70,color:'#ABC9C0',opacity:.7},
 hero:{alignItems:'center',marginTop:28},mascots:{flexDirection:'row',alignItems:'flex-end',height:105,gap:-10},nepali:{fontFamily:type.display,fontSize:50,color:colors.ink,fontWeight:'900',marginTop:2},title:{fontSize:26,color:colors.ink,fontWeight:'900',letterSpacing:6,marginTop:-6},sub:{color:colors.brown,fontSize:15,marginTop:8},
 actions:{gap:12,width:'100%',maxWidth:520,alignSelf:'center'},primary:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:colors.green,borderRadius:radius.md,padding:17},playIcon:{width:38,height:38,borderRadius:19,backgroundColor:'#3A7C5E',textAlign:'center',textAlignVertical:'center',lineHeight:38,color:'white'},primaryText:{color:'white',fontWeight:'900',fontSize:18},smallLight:{color:'#D7E7DD',marginTop:3,fontSize:12},
 secondary:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:radius.md,padding:17,backgroundColor:colors.brown},friendIcon:{color:'white',fontSize:12,width:38,textAlign:'center'},secondaryText:{color:'white',fontWeight:'900',fontSize:18},small:{color:'#7E6D62',marginTop:3,fontSize:12},
 learn:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:radius.md,padding:17,backgroundColor:'#E9C9A5'},book:{fontSize:22,color:colors.brown,width:38,textAlign:'center'},learnText:{fontWeight:'900',fontSize:17,color:colors.ink},soon:{marginLeft:'auto',fontSize:11,fontWeight:'800',color:colors.red},
 bottom:{alignItems:'center',gap:5},footer:{textAlign:'center',color:colors.brown,fontSize:12,fontStyle:'italic'},origin:{textAlign:'center',color:colors.green,fontWeight:'800',fontSize:11}
});