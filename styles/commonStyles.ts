
import { StyleSheet } from 'react-native';

// Light theme (default) - refined palette
export const lightColors = {
  primary: '#6366F1', // indigo-500
  secondary: '#4338CA', // indigo-700
  accent: '#22C55E', // green-500
  background: '#F7F7FB', // softened slate-50
  backgroundAlt: '#FFFFFF',
  text: '#0F172A', // slate-900
  grey: '#94A3B8', // slate-400
  card: '#FFFFFF',
};

// Dark theme - refined palette
export const darkColors = {
  primary: '#818CF8', // indigo-400
  secondary: '#6366F1', // indigo-500
  accent: '#34D399', // green-400
  background: '#0B1220',
  backgroundAlt: '#111927',
  text: '#E5E7EB',
  grey: '#9CA3AF',
  card: '#111927',
};

export type AppColors = typeof lightColors;

export const makeCommonStyles = (colors: AppColors) => StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: 0.3,
    fontFamily: 'Inter_800ExtraBold',
  },
  text: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: 'Inter_400Regular',
  },
  subheading: {
    fontSize: 14,
    color: colors.grey,
    letterSpacing: 0.2,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: 'rgba(148,163,184,0.18)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 16px 32px rgba(2,6,23,0.07)',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// Export default (light theme) for convenience
export const colors = lightColors;
export const commonStyles = makeCommonStyles(lightColors);

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: lightColors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: lightColors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});
