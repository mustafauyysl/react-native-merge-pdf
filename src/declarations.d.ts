declare module 'react-native' {
  import { NativeModules as RNNativeModules } from 'react-native';
  export const NativeModules: typeof RNNativeModules;
  export const Platform: any;
} 