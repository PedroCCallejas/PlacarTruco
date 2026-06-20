import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardScore } from '@/components/CardScore';
import { MatchWinnerModal } from '@/components/MatchWinnerModal';
import { SetWinnerBanner } from '@/components/SetWinnerBanner';
import { TrucoTableBackground } from '@/components/TrucoTableBackground';
import { CompactScoreHeader } from '@/components/scoreboard/CompactScoreHeader';
import { ScoreActionPanel } from '@/components/scoreboard/ScoreActionPanel';
import { getScoreActionsForVariant } from '@/constants/trucoRules';
import { colors, fonts, layout, radii, spacing } from '@/constants/theme';
import { matchStoreSelectors, useMatchStore } from '@/store/matchStore';
import type { MatchResult, TeamKey } from '@/types/match';

interface ScorePointButtonProps {
  accentColor: string;
  disabled: boolean;
  label: string;
  onPress: () => void;
}

function ScorePointButton({
  accentColor,
  disabled,
  label,
  onPress,
}: ScorePointButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pointButton,
        { borderColor: accentColor },
        disabled && styles.pointButtonDisabled,
        pressed && !disabled && styles.pointButtonPressed,
      ]}>
      <Text style={[styles.pointButtonText, { color: accentColor }]}>{label}</Text>
    </Pressable>
  );
}

interface TeamSelectorButtonProps {
  accentColor: string;
  active: boolean;
  label: string;
  onPress: () => void;
}

function TeamSelectorButton({
  accentColor,
  active,
  label,
  onPress,
}: TeamSelectorButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.teamSelectorButton,
        active && [styles.teamSelectorButtonActive, { borderColor: accentColor }],
        pressed && styles.pointButtonPressed,
      ]}>
      <Text
        numberOfLines={1}
        style={[
          styles.teamSelectorText,
          active && { color: accentColor },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ScoreboardScreen() {
  const { height, width } = useWindowDimensions();
  const isCompact = width < 420 || height < 760;
  const isLandscape = width > height;

  const addPoints = useMatchStore((state) => state.addPoints);
  const placementSeed = useMatchStore((state) => state.placementSeed);
  const bestOf = useMatchStore((state) => state.bestOf);
  const canUndo = useMatchStore(matchStoreSelectors.canUndo);
  const currentScore = useMatchStore((state) => state.currentScore);
  const dismissPendingResult = useMatchStore((state) => state.dismissPendingResult);
  const pendingResult = useMatchStore((state) => state.pendingResult);
  const phase = useMatchStore((state) => state.phase);
  const resetCurrentSet = useMatchStore((state) => state.resetCurrentSet);
  const resetMatch = useMatchStore((state) => state.resetMatch);
  const scoreStyle = useMatchStore((state) => state.scoreStyle);
  const sets = useMatchStore((state) => state.sets);
  const targetScore = useMatchStore((state) => state.targetScore);
  const teamA = useMatchStore((state) => state.teamA);
  const teamB = useMatchStore((state) => state.teamB);
  const undoLastAction = useMatchStore((state) => state.undoLastAction);
  const variant = useMatchStore((state) => state.variant);

  const canGoBack = router.canGoBack();
  const [activeTeam, setActiveTeam] = useState<TeamKey>('teamA');

  const scoreActions = useMemo(() => getScoreActionsForVariant(variant), [variant]);
  const scoreLocked = phase !== 'inProgress';

  const setBannerResult = useMemo<MatchResult | null>(() => {
    if (phase !== 'setOver') {
      return null;
    }

    if (pendingResult?.type === 'set') {
      return pendingResult;
    }

    const winner: TeamKey = currentScore.teamA >= currentScore.teamB ? 'teamA' : 'teamB';

    return {
      type: 'set',
      winner,
      winningTeamName: winner === 'teamA' ? teamA : teamB,
      createdAt: new Date().toISOString(),
      score: currentScore,
      sets,
      targetScore,
      bestOf,
    };
  }, [bestOf, currentScore, pendingResult, phase, sets, targetScore, teamA, teamB]);

  const matchModalResult = pendingResult?.type === 'match' ? pendingResult : null;

  const tableStateText = useMemo(() => {
    if (phase === 'matchOver') {
      return 'encerrada';
    }

    if (phase === 'setOver') {
      return 'queda fechada';
    }

    if (phase === 'idle') {
      return 'mesa pronta';
    }

    return 'em jogo';
  }, [phase]);

  const variantShort = variant === 'truco-paulista' ? 'Paulista' : 'Espanhol';
  const summaryLine = `${variantShort} / ${targetScore} pts / md${bestOf} / ${tableStateText}`;
  const activeAccentColor = activeTeam === 'teamA' ? colors.gold : colors.red;
  const activeTeamName = activeTeam === 'teamA' ? teamA : teamB;

  const handleAddPoints = (points: number) => {
    addPoints(activeTeam, points);
  };

  const handleDismissMatchResult = () => {
    dismissPendingResult();
  };

  const handlePrimaryModalAction = () => {
    dismissPendingResult();

    resetMatch();
  };

  const handleStartNextSet = () => {
    dismissPendingResult();

    resetCurrentSet();
  };

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <TrucoTableBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <CompactScoreHeader
            onBack={canGoBack ? handleBack : undefined}
            onOpenSettings={handleOpenSettings}
            subtitle={summaryLine}
            title="Truco"
          />

          {setBannerResult ? (
            <SetWinnerBanner
              onPrimaryAction={handleStartNextSet}
              primaryLabel="Nova queda"
              result={setBannerResult}
            />
          ) : null}

          <View style={styles.tableZone}>
            <View style={[styles.cardRow, !isLandscape && styles.cardRowPortrait]}>
              <CardScore
                accentColor={colors.gold}
                bestOf={bestOf}
                isActive={activeTeam === 'teamA'}
                label="A"
                onPress={() => setActiveTeam('teamA')}
                placementSeed={placementSeed}
                score={currentScore.teamA}
                scoreStyle={scoreStyle}
                sets={sets.teamA}
                targetScore={targetScore}
                teamName={teamA}
                variant={variant}
              />
              <CardScore
                accentColor={colors.red}
                bestOf={bestOf}
                isActive={activeTeam === 'teamB'}
                label="B"
                onPress={() => setActiveTeam('teamB')}
                placementSeed={placementSeed + 500_000}
                score={currentScore.teamB}
                scoreStyle={scoreStyle}
                sets={sets.teamB}
                targetScore={targetScore}
                teamName={teamB}
                variant={variant}
              />
            </View>
          </View>

          <View style={[styles.bottomDock, isLandscape && styles.bottomDockLandscape]}>
            {isLandscape ? (
              <>
                <View style={styles.landscapeTopRow}>
                  <View style={styles.teamSelectorRow}>
                    <TeamSelectorButton
                      accentColor={colors.gold}
                      active={activeTeam === 'teamA'}
                      label={teamA}
                      onPress={() => setActiveTeam('teamA')}
                    />
                    <TeamSelectorButton
                      accentColor={colors.red}
                      active={activeTeam === 'teamB'}
                      label={teamB}
                      onPress={() => setActiveTeam('teamB')}
                    />
                  </View>
                  <View style={[styles.pointsRow, styles.pointsRowExpand]}>
                    {scoreActions.map((action) => (
                      <ScorePointButton
                        accentColor={activeAccentColor}
                        disabled={scoreLocked}
                        key={`score-${action.points}`}
                        label={action.label}
                        onPress={() => handleAddPoints(action.points)}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.utilityRow}>
                  <ScoreActionPanel
                    canUndo={canUndo}
                    isCompact={true}
                    onResetCurrentSet={resetCurrentSet}
                    onResetMatch={resetMatch}
                    onUndo={undoLastAction}
                    phase={phase}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.selectionRow}>
                  <View style={styles.selectionCopy}>
                    <Text style={styles.selectionLabel}>
                      {phase === 'idle' ? 'Mesa pronta' : 'Selecionado'}
                    </Text>
                    <Text style={[styles.selectionValue, { color: activeAccentColor }]}>
                      {phase === 'idle' ? 'Abra a engrenagem para iniciar' : activeTeamName}
                    </Text>
                  </View>
                  <View style={styles.teamSelectorRow}>
                    <TeamSelectorButton
                      accentColor={colors.gold}
                      active={activeTeam === 'teamA'}
                      label={teamA}
                      onPress={() => setActiveTeam('teamA')}
                    />
                    <TeamSelectorButton
                      accentColor={colors.red}
                      active={activeTeam === 'teamB'}
                      label={teamB}
                      onPress={() => setActiveTeam('teamB')}
                    />
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  {scoreActions.map((action) => (
                    <ScorePointButton
                      accentColor={activeAccentColor}
                      disabled={scoreLocked}
                      key={`score-${action.points}`}
                      label={action.label}
                      onPress={() => handleAddPoints(action.points)}
                    />
                  ))}
                </View>

                <View style={styles.utilityRow}>
                  <ScoreActionPanel
                    canUndo={canUndo}
                    isCompact={isCompact}
                    onResetCurrentSet={resetCurrentSet}
                    onResetMatch={resetMatch}
                    onUndo={undoLastAction}
                    phase={phase}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>

      <MatchWinnerModal
        onDismiss={handleDismissMatchResult}
        onPrimaryAction={handlePrimaryModalAction}
        primaryLabel="Nova partida"
        result={matchModalResult}
      />
    </TrucoTableBackground>
  );
}

const styles = StyleSheet.create({
  bottomDock: {
    gap: 8,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5, 19, 15, 0.58)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  bottomDockLandscape: {
    gap: 4,
    paddingVertical: 3,
  },
  landscapeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsRowExpand: {
    flex: 1,
  },
  cardRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 0,
  },
  cardRowPortrait: {
    flexDirection: 'column',
  },
  pointButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    borderRadius: radii.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(8, 30, 24, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pointButtonDisabled: {
    opacity: 0.38,
  },
  pointButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  pointButtonText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  pointsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    maxWidth: layout.maxWidth,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  selectionCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  selectionLabel: {
    color: 'rgba(247, 240, 225, 0.54)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectionValue: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  tableZone: {
    flex: 1,
    minHeight: 0,
  },
  teamSelectorButton: {
    maxWidth: 118,
    minHeight: 30,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  teamSelectorButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  teamSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  teamSelectorText: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
