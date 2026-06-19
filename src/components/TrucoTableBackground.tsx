import type { PropsWithChildren } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { trucoAssets } from '@/constants/trucoAssets';
import { colors, radii, shadows } from '@/constants/theme';
import { useMatchStore } from '@/store/matchStore';

export function TrucoTableBackground({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const scoreStyle = useMatchStore((state) => state.scoreStyle);
  const compact = width < 620;
  const isBeans = scoreStyle === 'beans';
  const isCrystals = scoreStyle === 'crystals';

  return (
    <View style={styles.root}>
      <View style={styles.woodShadow} pointerEvents="none" />
      <View
        style={[
          styles.woodRail,
          isBeans && styles.woodRailBeans,
          isCrystals && styles.woodRailCrystals,
        ]}
        pointerEvents="none"
      />

      {trucoAssets.table.woodFrame ? (
        <Image
          contentFit="cover"
          pointerEvents="none"
          source={trucoAssets.table.woodFrame}
          style={styles.woodFrameAsset}
        />
      ) : null}

      <View
        style={[
          styles.feltLayer,
          isBeans && styles.feltLayerBeans,
          isCrystals && styles.feltLayerCrystals,
        ]}
        pointerEvents="none"
      />

      {trucoAssets.table.feltGreen ? (
        <Image
          contentFit="cover"
          pointerEvents="none"
          source={trucoAssets.table.feltGreen}
          style={styles.feltAsset}
        />
      ) : null}

      <View style={styles.vignette} pointerEvents="none" />
      <View
        style={[
          styles.centerHalo,
          isBeans && styles.centerHaloBeans,
          isCrystals && styles.centerHaloCrystals,
        ]}
        pointerEvents="none"
      />
      <View style={styles.innerBorder} pointerEvents="none" />

      <View
        style={[
          styles.seatGlow,
          styles.seatGlowLeft,
          compact && styles.seatGlowCompact,
          isBeans && styles.seatGlowBeans,
          isCrystals && styles.seatGlowCrystals,
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.seatGlow,
          styles.seatGlowRight,
          compact && styles.seatGlowCompact,
          isBeans && styles.seatGlowBeans,
          isCrystals && styles.seatGlowCrystals,
        ]}
        pointerEvents="none"
      />

      {!compact ? <View style={styles.centerLine} pointerEvents="none" /> : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerHalo: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 180,
    height: 180,
    marginLeft: -90,
    marginTop: -90,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  centerHaloBeans: {
    borderColor: 'rgba(180, 135, 91, 0.10)',
    backgroundColor: 'rgba(122, 82, 48, 0.03)',
  },
  centerHaloCrystals: {
    borderColor: 'rgba(58, 108, 168, 0.12)',
    backgroundColor: 'rgba(58, 108, 168, 0.035)',
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 90,
    bottom: 90,
    width: 1,
    marginLeft: -0.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
  },
  feltAsset: {
    ...StyleSheet.absoluteFillObject,
    margin: 22,
    borderRadius: radii.xl,
    opacity: 0.32,
  },
  feltLayer: {
    ...StyleSheet.absoluteFillObject,
    margin: 22,
    borderRadius: radii.xl,
    backgroundColor: colors.felt,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  feltLayerBeans: {
    backgroundColor: '#123328',
  },
  feltLayerCrystals: {
    backgroundColor: '#102E33',
  },
  innerBorder: {
    position: 'absolute',
    top: 34,
    left: 34,
    right: 34,
    bottom: 34,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...shadows.soft,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  seatGlow: {
    position: 'absolute',
    top: 96,
    bottom: 96,
    width: '37%',
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  seatGlowBeans: {
    backgroundColor: 'rgba(122, 82, 48, 0.04)',
  },
  seatGlowCompact: {
    top: 110,
    bottom: 110,
    width: '35%',
  },
  seatGlowCrystals: {
    backgroundColor: 'rgba(58, 108, 168, 0.04)',
  },
  seatGlowLeft: {
    left: 54,
  },
  seatGlowRight: {
    right: 54,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  woodFrameAsset: {
    ...StyleSheet.absoluteFillObject,
    margin: 12,
    borderRadius: radii.xl,
    opacity: 0.38,
  },
  woodRail: {
    ...StyleSheet.absoluteFillObject,
    margin: 12,
    borderRadius: radii.xl,
    backgroundColor: colors.wood,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  woodRailBeans: {
    backgroundColor: '#3A2417',
  },
  woodRailCrystals: {
    backgroundColor: '#332117',
  },
  woodShadow: {
    ...StyleSheet.absoluteFillObject,
    margin: 4,
    borderRadius: radii.xl,
    backgroundColor: colors.woodDark,
  },
});
