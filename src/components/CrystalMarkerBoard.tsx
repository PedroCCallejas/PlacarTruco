import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PointMarkers } from '@/components/PointMarkers';
import { trucoAssets } from '@/constants/trucoAssets';

interface CrystalMarkerBoardProps {
  accentColor: string;
  score: number;
  targetScore: number;
}

export function CrystalMarkerBoard({
  accentColor,
  score,
  targetScore,
}: CrystalMarkerBoardProps) {
  const turned = targetScore === 18 && score > 9;
  const objectShadow = trucoAssets.shadows.objectShadow;

  return (
    <View style={styles.stage}>
      {objectShadow ? (
        <Image contentFit="contain" source={objectShadow} style={styles.crystalShadowTop} />
      ) : null}
      {trucoAssets.crystals.crystalPurple ? (
        <Image
          contentFit="contain"
          source={trucoAssets.crystals.crystalPurple}
          style={styles.crystalAssetTop}
        />
      ) : null}
      {trucoAssets.crystals.crystalRed ? (
        <Image contentFit="contain" source={trucoAssets.crystals.crystalRed} style={styles.crystalAssetMid} />
      ) : null}
      {objectShadow ? (
        <Image contentFit="contain" source={objectShadow} style={styles.crystalShadowBottom} />
      ) : null}
      {trucoAssets.crystals.crystalGold ? (
        <Image contentFit="contain" source={trucoAssets.crystals.crystalGold} style={styles.crystalAssetBottom} />
      ) : null}

      <View style={styles.markerField}>
        <PointMarkers
          accentColor={accentColor}
          markerStyle="crystals"
          score={score}
          targetScore={targetScore}
          turned={turned}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  crystalAssetBottom: {
    position: 'absolute',
    bottom: 8,
    left: -8,
    width: 76,
    height: 76,
    opacity: 0.22,
    transform: [{ rotate: '-12deg' }],
  },
  crystalAssetMid: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    width: 46,
    height: 46,
    opacity: 0.16,
    transform: [{ rotate: '10deg' }],
  },
  crystalAssetTop: {
    position: 'absolute',
    top: 20,
    right: -8,
    width: 74,
    height: 74,
    opacity: 0.24,
    transform: [{ rotate: '18deg' }],
  },
  crystalShadowBottom: {
    position: 'absolute',
    bottom: 14,
    left: -4,
    width: 74,
    height: 42,
    opacity: 0.14,
    transform: [{ rotate: '-6deg' }],
  },
  crystalShadowTop: {
    position: 'absolute',
    top: 36,
    right: -4,
    width: 78,
    height: 44,
    opacity: 0.14,
    transform: [{ rotate: '6deg' }],
  },
  markerField: {
    flex: 1,
    justifyContent: 'center',
  },
  stage: {
    position: 'relative',
    minHeight: 218,
    paddingTop: 8,
    paddingBottom: 6,
  },
});
