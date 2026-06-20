import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { CardRevealMarker } from '@/components/CardRevealMarker';
import {
  paulistaTenCardStates,
  spanishCardStates,
} from '@/components/scoreboard/CardCoverStates';
import { trucoAssets } from '@/constants/trucoAssets';
import { colors, radii } from '@/constants/theme';
import type { TrucoVariant } from '@/types/match';

interface CardMarkerBoardProps {
  accentColor: string;
  availableHeight: number;
  score: number;
  targetScore: number;
  variant: TrucoVariant;
}

function clampScore(variant: TrucoVariant, score: number, targetScore: number) {
  const variantLimit = variant === 'truco-paulista' ? 12 : 18;

  return Math.max(0, Math.min(score, Math.min(targetScore, variantLimit)));
}

export function CardMarkerBoard({
  accentColor,
  availableHeight,
  score,
  targetScore,
  variant,
}: CardMarkerBoardProps) {
  const { height, width } = useWindowDimensions();
  const compact = width < 420 || height < 760;
  const isLandscape = width > height;
  const safeScore = clampScore(variant, score, targetScore);
  const frontAsset =
    variant === 'truco-paulista'
      ? trucoAssets.cards.card10Front
      : trucoAssets.cards.card9Front;
  const backAsset =
    accentColor === colors.gold
      ? trucoAssets.cards.cardBackBlue
      : trucoAssets.cards.cardBackRed;
  const shadowAsset = trucoAssets.shadows.cardShadow;
  // Same card dimensions in both orientations — keeps x/y/rotate calibration consistent.
  // cardScale handles fit; landscape teams have full height so cards are ≥ portrait size.
  const cardWidth = compact ? 112 : 130;
  const cardHeight = Math.round(cardWidth * 1.414);
  const stageWidth = cardWidth + (compact ? 88 : 100);
  const stageHeight = cardHeight + (compact ? 58 : 68);
  const baseCardLeft = compact ? 8 : 10;
  const baseCardTop = compact ? 24 : 26;
  const topCardAnchorLeft = compact ? 14 : 18;
  const topCardAnchorTop = compact ? 4 : 6;
  // Use measured markerZone height when available; fall back to screen-height ratio.
  // availableHeight > 10 guards against initial zero value before layout fires.
  const cardScale = availableHeight > 10
    ? Math.min(availableHeight / stageHeight, 1)
    : Math.min((height * (isLandscape ? 0.38 : 0.20)) / stageHeight, 1);
  const shadowWidth = cardWidth + 10;
  const shadowHeight = cardHeight + 12;
  const activeState =
    variant === 'truco-paulista'
      ? paulistaTenCardStates[safeScore]
      : spanishCardStates[safeScore];
  const topCardAsset = activeState.face === 'front' ? frontAsset : backAsset;
  const topCardMode = activeState.face === 'front' ? 'turned' : 'covered';
  const topCardTransform = {
    transform: [
      { translateX: activeState.x },
      { translateY: activeState.y },
      { rotate: `${activeState.rotate}deg` },
    ],
  } as const;

  return (
    <View style={styles.stage}>
      <View style={[styles.canvas, { width: stageWidth, height: stageHeight, transform: [{ scale: cardScale }] }]}>
        {shadowAsset ? (
          <Image
            contentFit="contain"
            source={shadowAsset}
            style={[
              styles.shadowAsset,
              styles.baseTilt,
              {
                width: shadowWidth,
                height: shadowHeight,
                left: baseCardLeft - 3,
                top: baseCardTop - 4,
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.cardBase,
            styles.baseTilt,
            {
              width: cardWidth,
              height: cardHeight,
              left: baseCardLeft,
              top: baseCardTop,
            },
          ]}>
          {frontAsset ? (
            <Image contentFit="fill" source={frontAsset} style={styles.cardImage} />
          ) : null}
          <View style={styles.cardFrame} />
        </View>

        {shadowAsset ? (
          <Image
            contentFit="contain"
            source={shadowAsset}
            style={[
              styles.shadowAsset,
              {
                width: shadowWidth,
                height: shadowHeight,
                left: topCardAnchorLeft - 3,
                top: topCardAnchorTop - 3,
              },
              topCardTransform,
            ]}
          />
        ) : null}

        <CardRevealMarker
          mode={topCardMode}
          style={[
            {
              width: cardWidth,
              height: cardHeight,
              left: topCardAnchorLeft,
              top: topCardAnchorTop,
            },
            topCardTransform,
          ]}
          surfaceAsset={topCardAsset}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseTilt: {
    transform: [{ rotate: '0deg' }],
  },
  canvas: {},
  cardBase: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(84, 53, 28, 0.14)',
    backgroundColor: colors.card,
  },
  cardFrame: {
    ...StyleSheet.absoluteFillObject,
    top: 9,
    left: 9,
    right: 9,
    bottom: 9,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 36, 27, 0.10)',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  shadowAsset: {
    position: 'absolute',
    opacity: 0.22,
  },
  stage: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
