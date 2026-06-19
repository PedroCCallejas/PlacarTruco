import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { MatchResult } from '@/types/match';
import { colors, fonts, radii, spacing } from '@/constants/theme';

interface MatchWinnerModalProps {
  onDismiss: () => void;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
  result: MatchResult | null;
}

export function MatchWinnerModal({
  onDismiss,
  onPrimaryAction,
  primaryLabel,
  result,
}: MatchWinnerModalProps) {
  if (!result) {
    return null;
  }

  const isMatch = result.type === 'match';

  return (
    <Modal
      animationType="fade"
      onRequestClose={onDismiss}
      transparent
      visible={Boolean(result)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.topLine} />
          <Text style={styles.kicker}>{isMatch ? 'Partida encerrada' : 'Queda vencida'}</Text>
          <Text style={styles.title}>{result.winningTeamName}</Text>
          <Text style={styles.body}>
            {isMatch
              ? `${result.winningTeamName} venceu a partida em melhor de ${result.bestOf}.`
              : `${result.winningTeamName} bateu ${result.targetScore} pontos e levou a queda.`}
          </Text>

          <View style={styles.scoreGrid}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>Placar</Text>
              <Text style={styles.scoreCardValue}>
                {result.score.teamA} x {result.score.teamB}
              </Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>Quedas</Text>
              <Text style={styles.scoreCardValue}>
                {result.sets.teamA} x {result.sets.teamB}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryText}>Fechar</Text>
            </Pressable>

            {onPrimaryAction && primaryLabel ? (
              <Pressable
                onPress={onPrimaryAction}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(224, 177, 90, 0.35)',
    backgroundColor: colors.feltDeep,
    padding: spacing.xl,
    gap: spacing.md,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: colors.gold,
    opacity: 0.25,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  body: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.body,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scoreCard: {
    flexGrow: 1,
    minWidth: 150,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scoreCardLabel: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  scoreCardValue: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryButton: {
    flexGrow: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  secondaryButton: {
    flexGrow: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  primaryText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  secondaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
