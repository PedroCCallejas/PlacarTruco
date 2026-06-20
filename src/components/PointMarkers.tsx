import { Image } from 'expo-image';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { trucoAssets, type TrucoAssetSource } from '@/constants/trucoAssets';
import { spacing } from '@/constants/theme';

interface PointMarkersProps {
  accentColor: string;
  markerStyle: 'beans' | 'crystals';
  placementSeed: number;
  score: number;
  targetScore: number;
  turned: boolean;
}

interface MarkerPosition {
  rotate: string;
  scale: number;
  x: number;
  y: number;
}

interface ScatterMarkerProps {
  children: ReactNode;
  delay: number;
  entryRotateDeg: number;
  entryX: number;
  entryY: number;
  entryZoom: number;
  style?: StyleProp<ViewStyle>;
}

const seededUnit = (seed: number): number => {
  const raw = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return raw - Math.floor(raw);
};

const generateMarkerPosition = (
  placementSeed: number,
  markerIndex: number,
  markerStyle: PointMarkersProps['markerStyle']
): MarkerPosition => {
  const b = placementSeed + markerIndex * 97;
  const x = 11 + seededUnit(b) * 78;           // 11% – 89%
  const y = 15 + seededUnit(b + 1) * 62;        // 15% – 77%
  const rotateDeg = (seededUnit(b + 2) - 0.5) * 56; // -28° – 28°
  const scale =
    markerStyle === 'beans'
      ? 0.88 + seededUnit(b + 3) * 0.28         // 0.88 – 1.16
      : 0.84 + seededUnit(b + 3) * 0.32;        // 0.84 – 1.16

  return {
    x: Math.min(89, Math.max(11, x)),
    y: Math.min(85, Math.max(15, y)),
    rotate: `${rotateDeg.toFixed(1)}deg`,
    scale: Math.min(1.16, Math.max(0.84, scale)),
  };
};

const buildMarkerGroups = (targetScore: number): number[] => {
  if (targetScore === 12) return [6, 6];
  if (targetScore === 15) return [5, 5, 5];
  if (targetScore === 18) return [9, 9];

  const groups: number[] = [];
  let remaining = targetScore;

  while (remaining > 0) {
    const chunk = Math.min(6, remaining);
    groups.push(chunk);
    remaining -= chunk;
  }

  return groups;
};

const hasAssetSource = (
  asset: TrucoAssetSource
): asset is Exclude<TrucoAssetSource, null> => asset !== null;

const getEntryMotion = (
  markerStyle: PointMarkersProps['markerStyle'],
  groupIndex: number,
  markerIndex: number
) => {
  const seedBase = (markerStyle === 'beans' ? 41 : 59) + groupIndex * 13 + markerIndex * 17;

  return {
    delay: Math.round(seededUnit(seedBase) * 80),
    entryRotateDeg: (seededUnit(seedBase + 1) - 0.5) * (markerStyle === 'beans' ? 240 : 300),
    entryX: (seededUnit(seedBase + 2) - 0.5) * (markerStyle === 'beans' ? 36 : 48),
    entryY: -30 - seededUnit(seedBase + 3) * (markerStyle === 'beans' ? 50 : 60),
    entryZoom: 0.80 + seededUnit(seedBase + 4) * 0.20,
  };
};

const getGroupHeight = (
  markerStyle: PointMarkersProps['markerStyle'],
  count: number
): number => {
  if (markerStyle === 'beans') return count >= 9 ? 144 : 104;
  return count >= 9 ? 132 : 96;
};

function ScatterMarker({
  children,
  delay,
  entryRotateDeg,
  entryX,
  entryY,
  entryZoom,
  style,
}: ScatterMarkerProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(entryX)).current;
  const translateY = useRef(new Animated.Value(entryY)).current;
  const rotate = useRef(new Animated.Value(entryRotateDeg)).current;
  const scale = useRef(new Animated.Value(entryZoom)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateX.setValue(entryX);
    translateY.setValue(entryY);
    rotate.setValue(entryRotateDeg);
    scale.setValue(entryZoom);

    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          damping: 11,
          mass: 0.8,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 7,
          mass: 0.85,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.spring(rotate, {
          toValue: 0,
          damping: 6,
          mass: 0.8,
          stiffness: 55,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 10,
          mass: 0.7,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => animation.stop();
  }, [
    delay,
    entryRotateDeg,
    entryX,
    entryY,
    entryZoom,
    opacity,
    rotate,
    scale,
    translateX,
    translateY,
  ]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            {
              rotate: rotate.interpolate({
                inputRange: [-180, 180],
                outputRange: ['-180deg', '180deg'],
              }),
            },
            { scale },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
}

export function PointMarkers({
  accentColor: _accentColor,
  markerStyle,
  placementSeed,
  score,
  targetScore,
  turned,
}: PointMarkersProps) {
  const safeTarget = Math.max(1, Math.min(targetScore, 30));
  const safeScore = Math.max(0, Math.min(score, safeTarget));
  const groups = buildMarkerGroups(safeTarget);
  const isBean = markerStyle === 'beans';
  const markerAssets = (
    isBean
      ? [trucoAssets.beans.bean01, trucoAssets.beans.bean02]
      : [
          trucoAssets.crystals.crystalRed,
          trucoAssets.crystals.crystalPurple,
          trucoAssets.crystals.crystalGold,
        ]
  ).filter(hasAssetSource);
  let markerIndex = 0;

  return (
    <View style={[styles.container, safeTarget === 18 ? styles.containerSplit : null]}>
      {groups.map((groupSize, groupIndex) => {
        const stageHeight = getGroupHeight(markerStyle, groupSize);
        const markers = Array.from({ length: groupSize }, () => {
          const currentIndex = markerIndex;
          markerIndex += 1;
          return currentIndex;
        });

        return (
          <View
            key={`group-${groupIndex}`}
            style={[
              styles.scatterArea,
              isBean ? styles.scatterAreaBeans : styles.scatterAreaCrystals,
              { minHeight: stageHeight },
            ]}>
            {markers.map((index) => {
              const active = index < safeScore;
              const asset =
                markerAssets.length > 0 ? markerAssets[index % markerAssets.length] : null;

              if (!active || !asset) {
                return null;
              }

              const position = generateMarkerPosition(placementSeed, index, markerStyle);
              const inSecondHalf = safeTarget === 18 && index >= 9;
              const width = isBean ? 34 : 36;
              const height = isBean ? 46 : 36;
              const entryMotion = getEntryMotion(markerStyle, groupIndex, index);
              const turnedScaleBoost = turned && inSecondHalf ? 1.04 : 1;

              return (
                <ScatterMarker
                  delay={entryMotion.delay}
                  entryRotateDeg={entryMotion.entryRotateDeg}
                  entryX={entryMotion.entryX}
                  entryY={entryMotion.entryY}
                  entryZoom={entryMotion.entryZoom}
                  key={`marker-${safeTarget}-${index}`}
                  style={[
                    styles.markerAnchor,
                    {
                      left: `${position.x}%`,
                      marginLeft: -width / 2,
                      marginTop: -height / 2,
                      top: `${position.y}%`,
                    },
                  ]}>
                  <View
                    style={[
                      styles.physicalMarker,
                      isBean ? styles.beanMarkerShadow : styles.crystalMarkerShadow,
                      turned && inSecondHalf ? styles.turnedMarkerShadow : null,
                      {
                        width,
                        height,
                        opacity: turned && inSecondHalf ? 1 : 0.97,
                        transform: [
                          { rotate: position.rotate },
                          { scale: position.scale * turnedScaleBoost },
                        ],
                      },
                    ]}>
                    <Image contentFit="contain" source={asset} style={styles.markerImage} />
                  </View>
                </ScatterMarker>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  beanMarkerShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  container: {
    gap: spacing.xs,
  },
  containerSplit: {
    gap: spacing.sm,
  },
  crystalMarkerShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  markerAnchor: {
    position: 'absolute',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  physicalMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scatterArea: {
    position: 'relative',
    width: '100%',
  },
  scatterAreaBeans: {
    minHeight: 96,
  },
  scatterAreaCrystals: {
    minHeight: 88,
  },
  turnedMarkerShadow: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
});
