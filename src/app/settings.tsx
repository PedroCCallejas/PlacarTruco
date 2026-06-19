import { router } from 'expo-router';
import { startTransition, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmActionModal } from '@/components/ConfirmActionModal';
import { ScoreStyleSelector } from '@/components/ScoreStyleSelector';
import { TrucoTableBackground } from '@/components/TrucoTableBackground';
import {
  BEST_OF_OPTIONS,
  MATCH_MODE_OPTIONS,
  SCORE_STYLE_OPTIONS,
  getPhaseLabel,
} from '@/constants/trucoRules';
import { colors, fonts, layout, radii, shadows, spacing } from '@/constants/theme';
import type { BestOf, MatchMode, ScoreStyle, TrucoVariant } from '@/types/match';
import { useMatchStore } from '@/store/matchStore';

type TargetChoice = '12' | '15' | '18' | 'custom';

interface ChoiceChipProps {
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
  subtitle?: string;
  title: string;
}

function ChoiceChip({
  active,
  disabled = false,
  onPress,
  subtitle,
  title,
}: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceChip,
        active && styles.choiceChipActive,
        disabled && styles.choiceChipDisabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.choiceTitle, active && styles.choiceTitleActive]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.choiceSubtitle, active && styles.choiceSubtitleActive]}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const getVariantSummary = (variant: TrucoVariant): string =>
  variant === 'truco-espanhol' ? 'Espanhol' : 'Paulista';

const getVariantDefaultTarget = (variant: TrucoVariant): TargetChoice =>
  variant === 'truco-espanhol' ? '18' : '12';

export default function SettingsScreen() {
  const savedBestOf = useMatchStore((state) => state.bestOf);
  const savedMode = useMatchStore((state) => state.mode);
  const savedTargetScore = useMatchStore((state) => state.targetScore);
  const savedTeamA = useMatchStore((state) => state.teamA);
  const savedTeamB = useMatchStore((state) => state.teamB);
  const savedVariant = useMatchStore((state) => state.variant);
  const savedScoreStyle = useMatchStore((state) => state.scoreStyle);
  const phase = useMatchStore((state) => state.phase);
  const clearLocalData = useMatchStore((state) => state.clearLocalData);
  const resetMatch = useMatchStore((state) => state.resetMatch);
  const setScoreStyle = useMatchStore((state) => state.setScoreStyle);
  const startNewMatch = useMatchStore((state) => state.startNewMatch);

  const initialTargetChoice: TargetChoice =
    savedTargetScore === 12
      ? '12'
      : savedTargetScore === 15
        ? '15'
        : savedTargetScore === 18
          ? '18'
          : 'custom';

  const [variant, setVariant] = useState<TrucoVariant>(savedVariant);
  const [mode, setMode] = useState<MatchMode>(
    savedMode === 'dual-device' ? 'single-device' : savedMode
  );
  const [bestOf, setBestOf] = useState<BestOf>(savedBestOf);
  const [scoreStyle, setLocalScoreStyle] = useState<ScoreStyle>(savedScoreStyle);
  const [targetChoice, setTargetChoice] = useState<TargetChoice>(initialTargetChoice);
  const [customTarget, setCustomTarget] = useState(
    initialTargetChoice === 'custom'
      ? String(savedTargetScore)
      : getVariantDefaultTarget(savedVariant)
  );
  const [teamA, setTeamA] = useState(savedTeamA);
  const [teamB, setTeamB] = useState(savedTeamB);
  const [isClearDataConfirmOpen, setIsClearDataConfirmOpen] = useState(false);

  const targetPresets = useMemo(
    () => (variant === 'truco-espanhol' ? [18, 12, 15] : [12, 15, 18]),
    [variant]
  );

  const selectedStyle = useMemo(
    () => SCORE_STYLE_OPTIONS.find((option) => option.id === scoreStyle),
    [scoreStyle]
  );

  const targetScore =
    targetChoice === 'custom'
      ? Number.parseInt(customTarget.trim() || '0', 10)
      : Number.parseInt(targetChoice, 10);

  const canStart =
    Number.isFinite(targetScore) &&
    targetScore > 0 &&
    targetScore <= 30 &&
    teamA.trim().length > 0 &&
    teamB.trim().length > 0;

  const previewSummary = `${getVariantSummary(variant)} / ${targetScore || 0} pts / md${bestOf}`;
  const phaseLabel = getPhaseLabel(phase);

  const handleOpenTable = () => {
    if (!canStart) {
      return;
    }

    setScoreStyle(scoreStyle);
    startNewMatch({
      variant,
      mode,
      targetScore,
      bestOf,
      teamA,
      teamB,
    });

    startTransition(() => {
      router.replace('/scoreboard');
    });
  };

  const handleResetMatch = () => {
    resetMatch();
    startTransition(() => {
      router.replace('/scoreboard');
    });
  };

  const handleRequestClearLocalData = () => {
    setIsClearDataConfirmOpen(true);
  };

  const handleCancelClearLocalData = () => {
    setIsClearDataConfirmOpen(false);
  };

  const handleConfirmClearLocalData = () => {
    setIsClearDataConfirmOpen(false);
    clearLocalData();
    startTransition(() => {
      router.replace('/scoreboard');
    });
  };

  return (
    <TrucoTableBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>Mesa</Text>
            <Text style={styles.title}>Ajustes do placar</Text>
            <Text style={styles.summary}>{previewSummary}</Text>
            <Text style={styles.description}>
              A marcacao muda na hora. Variante, alvo, serie e nomes abrem uma nova mesa limpa.
            </Text>
            <Text style={styles.statusLine}>{phaseLabel}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Variante</Text>
            <View style={styles.choiceRow}>
              <ChoiceChip
                active={variant === 'truco-paulista'}
                onPress={() => {
                  setVariant('truco-paulista');

                  if (targetChoice !== 'custom') {
                    setTargetChoice('12');
                  }
                }}
                subtitle="12 pontos"
                title="Paulista"
              />
              <ChoiceChip
                active={variant === 'truco-espanhol'}
                onPress={() => {
                  setVariant('truco-espanhol');

                  if (targetChoice !== 'custom') {
                    setTargetChoice('18');
                  }
                }}
                subtitle="18 pontos"
                title="Espanhol"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Marcacao</Text>
            <ScoreStyleSelector
              compact
              onChange={(nextStyle) => {
                setLocalScoreStyle(nextStyle);
                setScoreStyle(nextStyle);
              }}
              value={scoreStyle}
            />
            <Text style={styles.sectionHelper}>
              {selectedStyle?.description ?? 'Carta, feijao e cristal continuam disponiveis aqui.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alvo e serie</Text>
            <View style={styles.targetRow}>
              {targetPresets.map((preset) => (
                <Pressable
                  key={preset}
                  onPress={() => setTargetChoice(String(preset) as TargetChoice)}
                  style={({ pressed }) => [
                    styles.pillButton,
                    targetChoice === String(preset) && styles.pillButtonActive,
                    pressed && styles.pressed,
                  ]}>
                  <Text
                    style={[
                      styles.pillText,
                      targetChoice === String(preset) && styles.pillTextActive,
                    ]}>
                    {preset} pts
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setTargetChoice('custom')}
                style={({ pressed }) => [
                  styles.pillButton,
                  targetChoice === 'custom' && styles.pillButtonActive,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.pillText,
                    targetChoice === 'custom' && styles.pillTextActive,
                  ]}>
                  Outro
                </Text>
              </Pressable>
            </View>

            {targetChoice === 'custom' ? (
              <TextInput
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={setCustomTarget}
                placeholder="Digite de 1 a 30"
                placeholderTextColor="rgba(255,255,255,0.40)"
                style={styles.input}
                value={customTarget}
              />
            ) : null}

            <View style={styles.choiceRow}>
              {BEST_OF_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  active={bestOf === option.value}
                  onPress={() => setBestOf(option.value)}
                  subtitle={option.description}
                  title={`md${option.value}`}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo</Text>
            <View style={styles.choiceRow}>
              {MATCH_MODE_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.id}
                  active={mode === option.id}
                  disabled={!option.enabled}
                  onPress={() => {
                    if (option.enabled) {
                      setMode(option.id);
                    }
                  }}
                  subtitle={option.enabled ? option.description : 'Em breve'}
                  title={option.label}
                />
              ))}
            </View>
            <Text style={styles.sectionHelper}>
              O MVP atual funciona em um celular compartilhado. O modo com 2 celulares ainda nao esta disponivel.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Times</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nos</Text>
              <TextInput
                onChangeText={setTeamA}
                placeholder="Nos"
                placeholderTextColor="rgba(255,255,255,0.40)"
                style={styles.input}
                value={teamA}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Eles</Text>
              <TextInput
                onChangeText={setTeamB}
                placeholder="Eles"
                placeholderTextColor="rgba(255,255,255,0.40)"
                style={styles.input}
                value={teamB}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acoes</Text>
            <Pressable
              accessibilityRole="button"
              disabled={!canStart}
              onPress={handleOpenTable}
              style={({ pressed }) => [
                styles.primaryAction,
                !canStart && styles.primaryActionDisabled,
                pressed && canStart && styles.pressed,
              ]}>
              <Text style={styles.primaryActionTitle}>
                {phase === 'idle' ? 'Abrir mesa' : 'Nova partida com ajustes'}
              </Text>
              <Text style={styles.primaryActionDescription}>
                Reinicia o placar com esta configuracao.
              </Text>
            </Pressable>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => router.push('/history')}
                style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}>
                <Text style={styles.secondaryActionTitle}>Historico</Text>
              </Pressable>

              <Pressable
                disabled={phase === 'idle'}
                onPress={handleResetMatch}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  phase === 'idle' && styles.secondaryActionDisabled,
                  pressed && phase !== 'idle' && styles.pressed,
                ]}>
                <Text style={styles.secondaryActionTitle}>Reiniciar placar</Text>
              </Pressable>

              <Pressable
                onPress={handleRequestClearLocalData}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  styles.secondaryActionDanger,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.secondaryActionTitle, styles.secondaryActionTitleDanger]}>
                  Limpar dados
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ConfirmActionModal
        body="Isso vai apagar a partida atual e todo o historico salvo neste aparelho."
        confirmLabel="Apagar tudo"
        onCancel={handleCancelClearLocalData}
        onConfirm={handleConfirmClearLocalData}
        title="Limpar dados locais?"
        visible={isClearDataConfirmOpen}
      />
    </TrucoTableBackground>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choiceChip: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 66,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(8, 30, 24, 0.44)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    gap: 4,
  },
  choiceChipActive: {
    borderColor: 'rgba(224, 177, 90, 0.28)',
    backgroundColor: 'rgba(224, 177, 90, 0.12)',
  },
  choiceChipDisabled: {
    opacity: 0.48,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choiceSubtitle: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.body,
  },
  choiceSubtitleActive: {
    color: 'rgba(247, 240, 225, 0.82)',
  },
  choiceTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  choiceTitleActive: {
    color: colors.gold,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: layout.contentWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  description: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  heroCard: {
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadows.soft,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.body,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: 'rgba(247, 240, 225, 0.70)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  kicker: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  pillButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
  },
  pillButtonActive: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  pillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  pillTextActive: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  primaryAction: {
    borderRadius: radii.lg,
    backgroundColor: colors.gold,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
  },
  primaryActionDescription: {
    color: 'rgba(16, 36, 27, 0.78)',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  primaryActionDisabled: {
    opacity: 0.44,
  },
  primaryActionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  safeArea: {
    flex: 1,
  },
  section: {
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionHelper: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
  sectionTitle: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  secondaryAction: {
    flexGrow: 1,
    minHeight: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  secondaryActionDanger: {
    borderColor: 'rgba(169, 53, 48, 0.20)',
    backgroundColor: 'rgba(169, 53, 48, 0.12)',
  },
  secondaryActionDisabled: {
    opacity: 0.4,
  },
  secondaryActionTitle: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  secondaryActionTitleDanger: {
    color: colors.white,
  },
  statusLine: {
    color: 'rgba(247, 240, 225, 0.60)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: fonts.body,
  },
  summary: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
});
