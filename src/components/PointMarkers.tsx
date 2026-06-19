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
  score: number;
  targetScore: number;
  turned: boolean;
}

interface SpreadPoint {
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

const BEAN_SPREADS: Record<number, SpreadPoint[]> = {
  5: [
    { x: 18, y: 24, rotate: '-14deg', scale: 1.02 },
    { x: 42, y: 16, rotate: '9deg', scale: 0.94 },
    { x: 66, y: 26, rotate: '-6deg', scale: 1.08 },
    { x: 30, y: 62, rotate: '16deg', scale: 0.98 },
    { x: 62, y: 68, rotate: '-18deg', scale: 1.04 },
  ],
  6: [
    { x: 16, y: 22, rotate: '-18deg', scale: 1.04 },
    { x: 40, y: 14, rotate: '11deg', scale: 0.94 },
    { x: 66, y: 22, rotate: '-10deg', scale: 1.08 },
    { x: 26, y: 54, rotate: '17deg', scale: 0.98 },
    { x: 54, y: 46, rotate: '-7deg', scale: 1.02 },
    { x: 74, y: 66, rotate: '13deg', scale: 1.06 },
  ],
  9: [
    { x: 16, y: 14, rotate: '-14deg', scale: 1.02 },
    { x: 40, y: 12, rotate: '8deg', scale: 0.96 },
    { x: 66, y: 18, rotate: '-9deg', scale: 1.08 },
    { x: 26, y: 36, rotate: '16deg', scale: 0.98 },
    { x: 50, y: 34, rotate: '-5deg', scale: 1.04 },
    { x: 76, y: 40, rotate: '11deg', scale: 0.94 },
    { x: 22, y: 66, rotate: '-16deg', scale: 1.06 },
    { x: 48, y: 72, rotate: '12deg', scale: 0.98 },
    { x: 72, y: 68, rotate: '-7deg', scale: 1.08 },
  ],
};

const CRYSTAL_SPREADS: Record<number, SpreadPoint[]> = {
  5: [
    { x: 22, y: 20, rotate: '-12deg', scale: 0.92 },
    { x: 48, y: 14, rotate: '10deg', scale: 1.06 },
    { x: 72, y: 24, rotate: '-8deg', scale: 1 },
    { x: 32, y: 60, rotate: '14deg', scale: 0.94 },
    { x: 62, y: 66, rotate: '-16deg', scale: 1.08 },
  ],
  6: [
    { x: 18, y: 18, rotate: '-10deg', scale: 0.94 },
    { x: 42, y: 12, rotate: '8deg', scale: 1.04 },
    { x: 68, y: 20, rotate: '-14deg', scale: 1.02 },
    { x: 24, y: 52, rotate: '14deg', scale: 0.98 },
    { x: 52, y: 44, rotate: '-6deg', scale: 1.1 },
    { x: 76, y: 60, rotate: '12deg', scale: 0.9 },
  ],
  9: [
    { x: 18, y: 14, rotate: '-14deg', scale: 0.94 },
    { x: 42, y: 12, rotate: '9deg', scale: 1.04 },
    { x: 68, y: 18, rotate: '-8deg', scale: 1.08 },
    { x: 28, y: 34, rotate: '16deg', scale: 0.92 },
    { x: 54, y: 32, rotate: '-4deg', scale: 1.1 },
    { x: 78, y: 38, rotate: '11deg', scale: 0.96 },
    { x: 22, y: 64, rotate: '-18deg', scale: 1.02 },
    { x: 50, y: 70, rotate: '14deg', scale: 0.98 },
    { x: 72, y: 66, rotate: '-10deg', scale: 1.06 },
  ],
};

const buildMarkerGroups = (targetScore: number): number[] => {
  if (targetScore === 12) {
    return [6, 6];
  }

  if (targetScore === 15) {
    return [5, 5, 5];
  }

  if (targetScore === 18) {
    return [9, 9];
  }

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

const createFallbackSpread = (
  index: number,
  count: number,
  markerStyle: PointMarkersProps['markerStyle']
): SpreadPoint => {
  const columns = Math.max(2, Math.ceil(Math.sqrt(count)));
  const row = Math.floor(index / columns);
  const column = index % columns;
  const columnSpread = columns === 1 ? 50 : 18 + (column / (columns - 1)) * 58;

  return {
    x: columnSpread + (row % 2 === 0 ? -2 : 4),
    y: 18 + row * 24 + (index % 2 === 0 ? 0 : 6),
    rotate: `${(index % 5) * 8 - 16}deg`,
    scale: markerStyle === 'beans' ? 0.96 + (index % 3) * 0.05 : 0.92 + (index % 4) * 0.04,
  };
};

const getSpreadLayout = (
  markerStyle: PointMarkersProps['markerStyle'],
  count: number
): SpreadPoint[] => {
  const preset = markerStyle === 'beans' ? BEAN_SPREADS[count] : CRYSTAL_SPREADS[count];

  if (preset) {
    return preset;
  }

  return Array.from({ length: count }, (_, index) =>
    createFallbackSpread(index, count, markerStyle)
  );
};

const seededUnit = (seed: number): number => {
  const raw = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;

  return raw - Math.floor(raw);
};

const clampSpread = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const createScatterSpread = (
  spread: SpreadPoint,
  markerStyle: PointMarkersProps['markerStyle'],
  targetScore: number,
  groupIndex: number,
  markerIndex: number
): SpreadPoint => {
  const seedBase =
    (markerStyle === 'beans' ? 17 : 29) + targetScore * 7 + groupIndex * 19 + markerIndex * 23;
  const jitterRange = markerStyle === 'beans' ? 5 : 6;
  const xJitter = (seededUnit(seedBase) - 0.5) * jitterRange;
  const yJitter = (seededUnit(seedBase + 1) - 0.5) * (jitterRange - 1);
  const rotateJitter = (seededUnit(seedBase + 2) - 0.5) * (markerStyle === 'beans' ? 10 : 14);
  const scaleJitter = (seededUnit(seedBase + 3) - 0.5) * 0.08;

  return {
    x: clampSpread(spread.x + xJitter, 12, 82),
    y: clampSpread(spread.y + yJitter, 10, 84),
    rotate: `${Number.parseFloat(spread.rotate) + rotateJitter}deg`,
    scale: clampSpread(spread.scale + scaleJitter, 0.9, 1.18),
  };
};

const getEntryMotion = (
  markerStyle: PointMarkersProps['markerStyle'],
  groupIndex: number,
  markerIndex: number
) => {
  const seedBase = (markerStyle === 'beans' ? 41 : 59) + groupIndex * 13 + markerIndex * 17;

  return {
    delay: Math.round(seededUnit(seedBase) * 80),
    entryRotateDeg: (seededUnit(seedBase + 1) - 0.5) * (markerStyle === 'beans' ? 42 : 58),
    entryX: (seededUnit(seedBase + 2) - 0.5) * (markerStyle === 'beans' ? 28 : 38),
    entryY: -18 - seededUnit(seedBase + 3) * (markerStyle === 'beans' ? 26 : 34),
    entryZoom: 0.84 + seededUnit(seedBase + 4) * 0.16,
  };
};

const getGroupHeight = (
  markerStyle: PointMarkersProps['markerStyle'],
  count: number
): number => {
  if (markerStyle === 'beans') {
    return count >= 9 ? 144 : 104;
  }

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
          damping: 12,
          mass: 0.9,
          stiffness: 165,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.cubic),
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
  accentColor,
  markerStyle,
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
    <View
      style={[
        styles.container,
        safeTarget === 18 ? styles.containerSplit : null,
      ]}>
      {groups.map((groupSize, groupIndex) => {
        const layout = getSpreadLayout(markerStyle, groupSize);
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
            {markers.map((index, itemIndex) => {
              const active = index < safeScore;
              const asset = markerAssets.length > 0 ? markerAssets[index % markerAssets.length] : null;

              if (!active || !asset) {
                return null;
              }

              const spread = createScatterSpread(
                layout[itemIndex] ?? createFallbackSpread(itemIndex, groupSize, markerStyle),
                markerStyle,
                safeTarget,
                groupIndex,
                index
              );
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
                      left: `${spread.x}%`,
                      marginLeft: -width / 2,
                      marginTop: -height / 2,
                      top: `${spread.y}%`,
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
                          { rotate: spread.rotate },
                          { scale: spread.scale * turnedScaleBoost },
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
