export type animatedInputProps = {
  value: string;
  withClearButton?: boolean;
  placeholder: string;
  maxLength: number;
  maxHeight?: number;
  setText: (val: string) => void;
  onSave?: () => void;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
};

// f - focused, d - default;
export const animatedInputValues = {
  fxy: -30,
  fSize: 12,
  dxy: 10,
  dSize: 14,
  xySpeed: 500,
  sizeSpeed: 100,
};
