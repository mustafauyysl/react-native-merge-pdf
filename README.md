# react-native-merge-pdf

[![npm version](https://img.shields.io/npm/v/react-native-merge-pdf.svg)](https://www.npmjs.com/package/react-native-merge-pdf)
[![npm downloads](https://img.shields.io/npm/dm/react-native-merge-pdf.svg)](https://www.npmjs.com/package/react-native-merge-pdf)
[![license](https://img.shields.io/npm/l/react-native-merge-pdf.svg)](https://github.com/mustafauyysl/react-native-merge-pdf/blob/master/LICENSE)

A React Native package that allows you to merge multiple PDF files into a single PDF file. Works on both iOS and Android.

## Features

- 📑 Merge multiple PDF documents into a single PDF file
- 📱 Cross-platform (iOS and Android)
- 📁 Return the merged PDF as a file path
- 📊 Return the merged PDF as base64 data
- 🔄 Simple and easy-to-use API

## Installation

```sh
# Using npm
npm install react-native-merge-pdf

# Using yarn
yarn add react-native-merge-pdf
```

### iOS Setup

This package uses PDFKit which is only available on iOS 11.0 and above.

```sh
cd ios && pod install
```

### Android Setup

No additional setup required for Android. The package uses iText PDF library under the hood which is automatically included.

## Usage

### Basic Usage

```javascript
import { mergePDFs } from 'react-native-merge-pdf';

// Example PDF files array
const pdfs = [
  {
    uri: 'file:///path/to/file1.pdf',
    name: 'file1.pdf',
    size: 12345,
    type: 'application/pdf'
  },
  {
    uri: 'file:///path/to/file2.pdf',
    name: 'file2.pdf',
    size: 67890,
    type: 'application/pdf'
  }
];

// Merge PDFs and get file path
const mergeAndGetPath = async () => {
  try {
    const outputPath = await mergePDFs({
      files: pdfs,
      // Optional: outputPath: '/path/to/output.pdf' 
      // If not provided, a temporary file will be created
    });
    
    console.log('Merged PDF path:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
};
```

### Get Base64 Data

```javascript
// Merge PDFs and get base64 data
const mergeAndGetBase64 = async () => {
  try {
    const base64Data = await mergePDFs({
      files: pdfs,
      returnType: 'base64'
    });
    
    console.log('Merged PDF as base64:', base64Data.substring(0, 50) + '...');
    return base64Data;
  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
};
```

### With Document Picker Example

```javascript
import { mergePDFs } from 'react-native-merge-pdf';
import DocumentPicker from 'react-native-document-picker';

const pickAndMergePDFs = async () => {
  try {
    // Pick multiple PDFs
    const results = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.pdf],
    });
    
    // Format for mergePDFs function
    const filesForMerge = results.map(file => ({
      uri: Platform.OS === 'ios' ? file.uri : file.fileCopyUri || file.uri,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    
    // Merge PDFs
    const outputPath = await mergePDFs({
      files: filesForMerge,
    });
    
    console.log('Merged PDF saved at:', outputPath);
    return outputPath;
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      console.error('Error:', error);
    }
  }
};
```

## API Reference

### `mergePDFs(options: MergePDFOptions): Promise<string>`

Merges multiple PDF files and returns either the path to the merged PDF file or the base64-encoded content.

#### Options

- `files` (Array of PDFFile objects): An array of PDF file objects with the following properties:
  - `uri` (string, required): The URI of the PDF file
  - `name` (string, optional): The name of the PDF file
  - `size` (number, optional): The size of the PDF file in bytes
  - `type` (string, optional): The MIME type of the file
  - `fileCopyUri` (string, optional): An alternative URI for the file (useful for Android)

- `outputPath` (string, optional): The path where the merged PDF should be saved. If not provided, a temporary file will be created.

- `returnType` (string, optional): The type of return value you want:
  - `'path'` (default): Returns the file path of the merged PDF
  - `'base64'`: Returns the base64-encoded string of the merged PDF

#### Returns

A promise that resolves to:
- The path of the merged PDF file (when `returnType` is `'path'` or not specified)
- The base64-encoded string representation of the merged PDF (when `returnType` is `'base64'`)

## Example App

See the `example` directory in the GitHub repository for a complete example app:
[https://github.com/mustafauyysl/react-native-merge-pdf/tree/master/example](https://github.com/mustafauyysl/react-native-merge-pdf/tree/master/example)

## Supported Platforms

- iOS (11.0+)
- Android

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 