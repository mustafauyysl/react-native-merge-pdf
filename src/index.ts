import { NativeModules, Platform } from 'react-native';

export interface PDFFile {
  fileCopyUri?: string;
  name?: string;
  size?: number;
  type?: string;
  uri: string;
}

export type ReturnType = 'path' | 'base64';

export interface MergePDFOptions {
  files: PDFFile[];
  outputPath?: string;
  returnType?: ReturnType;
}

export interface ReactNativeMergePdfInterface {
  mergePDFs(options: MergePDFOptions): Promise<string>;
}

const LINKING_ERROR =
  `The package 'react-native-merge-pdf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ReactNativeMergePdf = NativeModules.ReactNativeMergePdf
  ? NativeModules.ReactNativeMergePdf
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function mergePDFs(options: MergePDFOptions): Promise<string> {
  // Default to 'path' if returnType is not provided
  const mergeOptions = {
    ...options,
    returnType: options.returnType || 'path',
  };
  return ReactNativeMergePdf.mergePDFs(mergeOptions);
}

export default {
  mergePDFs,
} as ReactNativeMergePdfInterface; 