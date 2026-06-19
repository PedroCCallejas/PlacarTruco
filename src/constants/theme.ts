import { Platform } from 'react-native';

export const colors = {
  background: '#081E18',
  backgroundRaised: '#0B251D',
  felt: '#0E3B2E',
  feltDeep: '#0A2B22',
  feltRaised: '#14513F',
  feltMuted: '#1A634C',
  feltLine: 'rgba(255, 255, 255, 0.08)',
  wood: '#3E2416',
  woodLight: '#6B4327',
  woodDark: '#28170F',
  card: '#FFF9EF',
  cardMuted: '#F0E7D6',
  cardShadow: '#E7D7BA',
  ink: '#10241B',
  cream: '#F7F0E1',
  gold: '#E0B15A',
  brass: '#B78A3A',
  red: '#A93530',
  ruby: '#C74848',
  sapphire: '#3A6CA8',
  emerald: '#2C8A6B',
  bean: '#7A5230',
  beanDark: '#54351C',
  beanLight: '#B4875B',
  white: '#FFFFFF',
  line: 'rgba(255, 255, 255, 0.12)',
  shadow: 'rgba(0, 0, 0, 0.28)',
  overlay: 'rgba(255, 255, 255, 0.08)',
  overlayStrong: 'rgba(255, 255, 255, 0.14)',
  disabled: '#6F837A',
  success: '#1D7A56',
  dangerSoft: 'rgba(169, 53, 48, 0.16)',
  successSoft: 'rgba(29, 122, 86, 0.16)',
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 32,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
} as const;

export const layout = {
  maxWidth: 1100,
  contentWidth: 960,
} as const;

export const fonts = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif-medium',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;
