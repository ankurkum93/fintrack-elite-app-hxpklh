
import { StyleSheet } from 'react-native';

// Light theme (default) - refined palette
export const lightColors = {
  primary: '#3B82F6', // blue-500
  secondary: '#1D4ED8', // blue-700
  accent: '#22C55E', // green-500
  background: '#F8FAFC', // slate-50
  backgroundAlt: '#FFFFFF',
  text: '#0F172A', // slate-900
  grey: '#94A3B8', // slate-400
  card: '#FFFFFF',
};

// Dark theme - refined palette
export const darkColors = {
  primary: '#60A5FA', // blue-400
  secondary: '#2563EB', // blue-600
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
    borderColor: 'rgba(148,163,184,0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 10px 24px rgba(2,6,23,0.06)',
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
