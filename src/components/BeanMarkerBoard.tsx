import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PointMarkers } from '@/components/PointMarkers';
import { trucoAssets } from '@/constants/trucoAssets';

interface BeanMarkerBoardProps {
  accentColor: string;
  placementSeed: number;
  score: number;
  targetScore: number;
}

export function BeanMarkerBoard({
  accentColor,
  placementSeed,
  score,
  targetScore,
}: BeanMarkerBoardProps) {
  const turned = targetScore === 18 && score > 9;
  const objectShadow = trucoAssets.shadows.objectShadow;

  return (
    <View style={styles.stage}>
      {objectShadow ? (
        <Image contentFit="contain" source={objectShadow} style={styles.beanShadowLeft} />
      ) : null}
      {trucoAssets.beans.bean01 ? (
        <Image contentFit="contain" source={trucoAssets.beans.bean01} style={styles.beanAssetLeft} />
      ) : null}
      {objectShadow ? (
        <Image contentFit="contain" source={objectShadow} style={styles.beanShadowRight} />
      ) : null}
      {trucoAssets.beans.bean02 ? (
        <Image contentFit="contain" source={trucoAssets.beans.bean02} style={styles.beanAssetRight} />
      ) : null}

      <View style={styles.markerField}>
        <PointMarkers
          accentColor={accentColor}
          markerStyle="beans"
          placementSeed={placementSeed}
          score={score}
          targetScore={targetScore}
          turned={turned}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  beanAssetLeft: {
    position: 'absolute',
    left: -6,
    bottom: 6,
    width: 88,
    height: 88,
    opacity: 0.26,
    transform: [{ rotate: '-20deg' }],
  },
  beanAssetRight: {
    position: 'absolute',
    right: 10,
    top: 28,
    width: 70,
    height: 70,
    opacity: 0.2,
    transform: [{ rotate: '22deg' }],
  },
  beanShadowLeft: {
    position: 'absolute',
    left: -4,
    bottom: 20,
    width: 86,
    height: 52,
    opacity: 0.16,
    transform: [{ rotate: '-8deg' }],
  },
  beanShadowRight: {
    position: 'absolute',
    right: 8,
    top: 44,
    width: 78,
    height: 44,
    opacity: 0.14,
    transform: [{ rotate: '8deg' }],
  },
  markerField: {
    flex: 1,
    justifyContent: 'center',
  },
  stage: {
    position: 'relative',
    minHeight: 220,
    paddingTop: 8,
    paddingBottom: 6,
  },
});
