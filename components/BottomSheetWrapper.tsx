
import React, { forwardRef, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Platform, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type BottomSheetWrapperRef = BottomSheet;

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
};

const BottomSheetWrapper = forwardRef<BottomSheetWrapperRef, Props>(({ children, snapPoints, onClose }, ref) => {
  console.log('BottomSheetWrapper render');
  const { colors } = useTheme();
  const points = useMemo(() => snapPoints || ['40%'], [snapPoints]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enablePanDownToClose
      snapPoints={points}
      onClose={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.25}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.grey }}
      backgroundStyle={{ backgroundColor: colors.card, borderRadius: 16 }}
      style={{ shadowColor: '#000', boxShadow: Platform.select({ web: '0 12px 24px rgba(0,0,0,0.15)', default: undefined }) as any }}
    >
      <View style={{ flex: 1, padding: 16 }}>{children}</View>
    </BottomSheet>
  );
});
BottomSheetWrapper.displayName = 'BottomSheetWrapper';

export default BottomSheetWrapper;
