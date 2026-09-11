import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { animal: 'tiger' | 'goat'; size?: number };

export function Mascot({ animal, size = 96 }: Props) {
  const scale = size / 96;
  return <View style={{width:size,height:size,alignItems:'center',justifyContent:'center'}}>
    <View style={[s.canvas,{transform:[{scale}]}]}>
      {animal === 'tiger' ? <Tiger/> : <Goat/>}
    </View>
  </View>;
}

function Tiger(){
  return <>
    <View style={[s.ear,s.leftEar]}/><View style={[s.ear,s.rightEar]}/>
    <View style={s.tigerHead}>
      <View style={[s.stripe,{top:7,left:34}]}/>
      <View style={[s.stripe,{top:13,left:22,transform:[{rotate:'-24deg'}]}]}/>
      <View style={[s.stripe,{top:13,right:22,transform:[{rotate:'24deg'}]}]}/>
      <View style={[s.eye,{left:16}]}><View style={s.pupil}/></View>
      <View style={[s.eye,{right:16}]}><View style={s.pupil}/></View>
      <View style={s.muzzle}><View style={s.nose}/><Text style={s.smile}>⌣</Text></View>
    </View>
  </>;
}

function Goat(){
  return <>
    <View style={[s.horn,s.leftHorn]}/><View style={[s.horn,s.rightHorn]}/>
    <View style={[s.goatEar,s.goatLeftEar]}/><View style={[s.goatEar,s.goatRightEar]}/>
    <View style={s.goatHead}>
      <View style={[s.eye,{left:16}]}><View style={s.pupil}/></View>
      <View style={[s.eye,{right:16}]}><View style={s.pupil}/></View>
      <View style={s.goatMuzzle}><View style={s.goatNose}/><Text style={s.smile}>⌣</Text></View>
      <View style={s.tuft}/>
    </View>
  </>;
}

const s=StyleSheet.create({
  canvas:{width:96,height:96,position:'relative',alignItems:'center',justifyContent:'center'},
  tigerHead:{position:'absolute',left:9,top:14,width:78,height:72,borderRadius:36,backgroundColor:colors.orange,borderWidth:3,borderColor:'#6A3314'},
  ear:{position:'absolute',width:28,height:28,borderRadius:14,backgroundColor:colors.orange,borderWidth:3,borderColor:'#6A3314',top:8,zIndex:0},leftEar:{left:8},rightEar:{right:8},
  stripe:{position:'absolute',width:9,height:19,borderRadius:5,backgroundColor:'#2C241F'},
  eye:{position:'absolute',top:25,width:18,height:20,borderRadius:10,backgroundColor:colors.white,borderWidth:1,borderColor:'#47372E',alignItems:'center',justifyContent:'center'},pupil:{width:8,height:11,borderRadius:5,backgroundColor:'#17120F'},
  muzzle:{position:'absolute',bottom:5,left:16,width:42,height:29,borderRadius:18,backgroundColor:'#FFE7C9',alignItems:'center'},nose:{marginTop:4,width:12,height:8,borderRadius:5,backgroundColor:'#7A392A'},smile:{marginTop:-5,fontSize:20,color:'#38261D',fontWeight:'700'},
  horn:{position:'absolute',width:13,height:36,borderRadius:8,backgroundColor:'#7A5336',top:2,borderWidth:2,borderColor:'#533421',zIndex:0},leftHorn:{left:22,transform:[{rotate:'-18deg'}]},rightHorn:{right:22,transform:[{rotate:'18deg'}]},
  goatEar:{position:'absolute',width:33,height:16,borderRadius:10,backgroundColor:'#D78B75',top:31,zIndex:0},goatLeftEar:{left:3,transform:[{rotate:'-18deg'}]},goatRightEar:{right:3,transform:[{rotate:'18deg'}]},
  goatHead:{position:'absolute',left:12,top:16,width:72,height:74,borderRadius:34,backgroundColor:'#FFF2DF',borderWidth:3,borderColor:'#B58D69'},goatMuzzle:{position:'absolute',bottom:6,left:15,width:37,height:27,borderRadius:17,backgroundColor:'#F5D8C4',alignItems:'center'},goatNose:{marginTop:4,width:10,height:7,borderRadius:5,backgroundColor:'#8B5D54'},tuft:{position:'absolute',top:-8,left:28,width:14,height:20,borderRadius:8,backgroundColor:'#FFF2DF',transform:[{rotate:'12deg'}]},
});