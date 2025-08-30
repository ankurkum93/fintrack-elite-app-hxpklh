
import { StyleSheet } from 'react-native';

// Light theme (default)
export const lightColors = {
  primary: '#2B6CB0',
  secondary: '#2C5282',
  accent: '#ED8936',
  background: '#F7FAFC',
  backgroundAlt: '#FFFFFF',
  text: '#1A202C',
  grey: '#A0AEC0',
  card: '#FFFFFF',
};

// Dark theme
export const darkColors = {
  primary: '#64B5F6',
  secondary: '#90CAF9',
  accent: '#F6AD55',
  background: '#101824',
  backgroundAlt: '#162133',
  text: '#E3E3E3',
  grey: '#90A4AE',
  card: '#162133',
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
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
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
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 6px 16px rgba(0,0,0,0.08)',
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
