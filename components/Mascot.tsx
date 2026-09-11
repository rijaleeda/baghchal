import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { animal: 'tiger' | 'goat'; size?: number };

export function Mascot({ animal, size = 96 }: Props) {
  const scale = size / 96;
  if (animal === 'tiger') {
    return (
      <View style={[s.frame, { width: size, height: size }]}> 
        <View style={[s.ear, s.leftEar, { transform: [{ scale }] }]} />
        <View style={[s.ear, s.rightEar, { transform: [{ scale }] }]} />
        <View style={[s.tigerHead, { transform: [{ scale }] }]}> 
          <View style={[s.stripe, { top: 8, left: 37 }]} />
          <View style={[s.stripe, { top: 14, left: 24, transform: [{ rotate: '-24deg' }] }]} />
          <View style={[s.stripe, { top: 14, right: 24, transform: [{ rotate: '24deg' }] }]} />
          <View style={[s.eye, { left: 19 }]}><View style={s.pupil}/></View>
          <View style={[s.eye, { right: 19 }]}><View style={s.pupil}/></View>
          <View style={s.muzzle}><View style={s.nose}/><Text style={s.smile}>⌣</Text></View>
        </View>
      </View>
    );
  }
  return (
    <View style={[s.frame, { width: size, height: size }]}> 
      <View style={[s.horn, s.leftHorn, { transform: [{ scale }, { rotate: '-18deg' }] }]} />
      <View style={[s.horn, s.rightHorn, { transform: [{ scale }, { rotate: '18deg' }] }]} />
      <View style={[s.goatEar, s.goatLeftEar, { transform: [{ scale }, { rotate: '-18deg' }] }]} />
      <View style={[s.goatEar, s.goatRightEar, { transform: [{ scale }, { rotate: '18deg' }] }]} />
      <View style={[s.goatHead, { transform: [{ scale }] }]}> 
        <View style={[s.eye, { left: 19 }]}><View style={s.pupil}/></View>
        <View style={[s.eye, { right: 19 }]}><View style={s.pupil}/></View>
        <View style={s.goatMuzzle}><View style={s.goatNose}/><Text style={s.smile}>⌣</Text></View>
        <View style={s.tuft}/>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  frame: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  tigerHead: { position: 'absolute', width: 78, height: 72, borderRadius: 35, backgroundColor: colors.orange, borderWidth: 3, borderColor: '#6A3314' },
  ear: { position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: colors.orange, borderWidth: 3, borderColor: '#6A3314', top: 9 },
  leftEar: { left: 11 }, rightEar: { right: 11 },
  stripe: { position: 'absolute', width: 9, height: 20, borderRadius: 5, backgroundColor: '#2C241F' },
  eye: { position: 'absolute', top: 26, width: 17, height: 19, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: '#47372E', alignItems: 'center', justifyContent: 'center' },
  pupil: { width: 8, height: 11, borderRadius: 5, backgroundColor: '#17120F' },
  muzzle: { position: 'absolute', bottom: 5, left: 19, width: 40, height: 28, borderRadius: 18, backgroundColor: '#FFE7C9', alignItems: 'center' },
  nose: { marginTop: 4, width: 12, height: 8, borderRadius: 5, backgroundColor: '#7A392A' },
  smile: { marginTop: -5, fontSize: 20, color: '#38261D', fontWeight: '700' },
  horn: { position: 'absolute', width: 12, height: 34, borderRadius: 8, backgroundColor: '#7A5336', top: 1, borderWidth: 2, borderColor: '#533421' },
  leftHorn: { left: 23 }, rightHorn: { right: 23 },
  goatEar: { position: 'absolute', width: 31, height: 15, borderRadius: 10, backgroundColor: '#D78B75', top: 29 },
  goatLeftEar: { left: 5 }, goatRightEar: { right: 5 },
  goatHead: { position: 'absolute', width: 72, height: 73, borderRadius: 31, backgroundColor: '#FFF2DF', borderWidth: 3, borderColor: '#B58D69' },
  goatMuzzle: { position: 'absolute', bottom: 6, left: 18, width: 36, height: 26, borderRadius: 17, backgroundColor: '#F5D8C4', alignItems: 'center' },
  goatNose: { marginTop: 4, width: 10, height: 7, borderRadius: 5, backgroundColor: '#8B5D54' },
  tuft: { position: 'absolute', top: -8, left: 29, width: 14, height: 20, borderRadius: 8, backgroundColor: '#FFF2DF', transform: [{ rotate: '12deg' }] },
});
