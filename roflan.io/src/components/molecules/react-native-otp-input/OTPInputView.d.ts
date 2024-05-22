import { TextStyle } from "react-native";

export type OTPInputViewProps = {
  pinCount: number;
  autoFocusOnLoad?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean;
  keyboardAppearance?: "default" | "light" | "dark";
  keyboardType?:
    | "default"
    | "number-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  clearInputs?: boolean;
  placeholderCharacter?: string;
  selectionColor?: string;
  code?: string;
  onCodeChanged?: (code: string) => void;
  onCodeFilled?: (code: string) => void;
  style?: object;
  codeInputFieldStyle?: object;
  codeInputHighlightStyle?: object;
  placeholderTextColor?: string;
  onChange: (code: string) => void;
};


export type OTPInputForwardProps = {
  handleAutoFocus: () => void;
  notifyCodeChanged: () => void;
  handleBlurHidden: () => void;
}
