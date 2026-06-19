import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrucoTableBackground } from '@/components/TrucoTableBackground';
import { colors, fonts, layout, radii, spacing } from '@/constants/theme';
import type { HistoryEntry } from '@/types/match';
import { useMatchStore } from '@/store/matchStore';

const formatHistoryDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Data indisponivel';
  }

  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  });
};

const getEntryTag = (item: HistoryEntry): string => {
  switch (item.type) {
    case 'start-match':
      return 'Nova partida';
    case 'new-set':
      return 'Nova queda';
    case 'reset-match':
      return 'Reinicio';
    case 'add-points':
    default:
      if (item.after.phase === 'matchOver') {
        return 'Partida finalizada';
      }

      if (item.after.phase === 'setOver') {
        return 'Queda encerrada';
      }

      return 'Pontuacao';
  }
};

export default function HistoryScreen() {
  const history = useMatchStore((state) => state.history);
  const reversedHistory = useMemo(() => [...history].reverse(), [history]);

  return (
    <TrucoTableBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.kicker}>Historico local</Text>
            <Text style={styles.title}>Ultimos lances da mesa</Text>
            <Text style={styles.description}>
              Aqui ficam pontos adicionados, quedas encerradas, reinicios e partidas finalizadas. Se o aparelho vier com dados antigos, o historico e normalizado antes de aparecer.
            </Text>
          </View>

          <FlatList
            contentContainerStyle={styles.listContent}
            data={reversedHistory}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhum lance salvo ainda</Text>
                <Text style={styles.emptyDescription}>
                  Inicie uma partida, marque alguns pontos e o log local aparecera aqui.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTag}>{getEntryTag(item)}</Text>
                  <Text style={styles.itemTime}>{formatHistoryDate(item.createdAt)}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemMetaRow}>
                  {typeof item.points === 'number' ? (
                    <Text style={styles.itemMeta}>Pontuacao aplicada: +{item.points}</Text>
                  ) : null}
                  <Text style={styles.itemMeta}>
                    Mesa: {item.after.currentScore.teamA} x {item.after.currentScore.teamB}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </TrucoTableBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    maxWidth: layout.contentWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  itemCard: {
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.md,
    gap: spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemTag: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: 'rgba(224, 177, 90, 0.14)',
    color: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  itemTime: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  itemTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  itemDescription: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.body,
  },
  itemMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  itemMeta: {
    color: colors.cream,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  emptyState: {
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  emptyDescription: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
});
