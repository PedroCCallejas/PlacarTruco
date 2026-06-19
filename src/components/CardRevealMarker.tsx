import { Image } from 'expo-image';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/constants/theme';

interface CardRevealMarkerProps {
  mode: 'covered' | 'turned';
  style?: StyleProp<ViewStyle>;
  surfaceAsset: ImageSourcePropType | null;
}

export function CardRevealMarker({
  mode,
  style,
  surfaceAsset,
}: CardRevealMarkerProps) {
  return (
    <View style={[styles.cardBase, style]}>
      {surfaceAsset ? <Image contentFit="fill" source={surfaceAsset} style={styles.surfaceImage} /> : null}
      <View style={[styles.surfaceTint, mode === 'turned' && styles.surfaceTintTurned]} />
      {mode === 'turned' ? <View style={styles.frontVeil} /> : <View style={styles.backVeil} />}
      <View style={[styles.cardFrame, mode === 'turned' && styles.cardFrameTurned]} />
    </View>
  );
}

const styles = StyleSheet.create({
  backVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 30, 24, 0.06)',
  },
  cardBase: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(84, 53, 28, 0.14)',
    backgroundColor: colors.cardMuted,
  },
  cardFrame: {
    ...StyleSheet.absoluteFillObject,
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 36, 27, 0.10)',
  },
  cardFrameTurned: {
    borderColor: 'rgba(224, 177, 90, 0.22)',
  },
  frontVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 30, 24, 0.18)',
  },
  surfaceImage: {
    ...StyleSheet.absoluteFillObject,
  },
  surfaceTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247, 240, 225, 0.02)',
  },
  surfaceTintTurned: {
    backgroundColor: 'rgba(247, 240, 225, 0.05)',
  },
});
