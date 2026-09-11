import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native';

export default function Home(){
 return <SafeAreaView style={s.page}>
   <View style={s.hero}><Text style={s.nepali}>बाघचाल</Text><Text style={s.title}>BAGHCHAL</Text><Text style={s.sub}>The traditional strategy game of Nepal</Text></View>
   <View style={s.actions}>
    <Pressable style={s.primary} onPress={()=>router.push('/play?mode=computer')}><Text style={s.primaryText}>Play vs Computer</Text><Text style={s.smallLight}>Challenge the tiger</Text></Pressable>
    <Pressable style={s.secondary} onPress={()=>router.push('/play?mode=local')}><Text style={s.secondaryText}>Two Players</Text><Text style={s.small}>Play together on one device</Text></Pressable>
   </View>
   <Text style={s.footer}>4 Tigers · 20 Goats · One ancient battle of strategy</Text>
 </SafeAreaView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#17261e',padding:24,justifyContent:'space-between'},hero:{alignItems:'center',marginTop:80},nepali:{fontSize:52,color:'#e5c879',fontWeight:'700'},title:{fontSize:34,color:'#fff8e7',fontWeight:'900',letterSpacing:5,marginTop:8},sub:{color:'#c8c0a8',fontSize:15,marginTop:12},actions:{gap:14,width:'100%',maxWidth:520,alignSelf:'center'},primary:{backgroundColor:'#c95b32',borderRadius:18,padding:20},primaryText:{color:'white',fontWeight:'800',fontSize:20},smallLight:{color:'#f5d8c8',marginTop:4},secondary:{borderWidth:1,borderColor:'#8f8062',borderRadius:18,padding:20,backgroundColor:'#203128'},secondaryText:{color:'#fff8e7',fontWeight:'800',fontSize:20},small:{color:'#aaa28f',marginTop:4},footer:{textAlign:'center',color:'#8f8a78',fontSize:12,marginBottom:20}});