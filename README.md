# react-native-merge-pdf

A React Native package that allows you to merge multiple PDF files into a single PDF file.

## Installation

```sh
npm install react-native-merge-pdf
# or
yarn add react-native-merge-pdf
```

### iOS

This package uses PDFKit which is only available on iOS 11.0 and above.

```sh
cd ios && pod install
```

### Android

No additional setup required for Android, but it uses iText PDF library under the hood.

## Usage

```javascript
import { mergePDFs } from 'react-native-merge-pdf';

// ...

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

## API

### `mergePDFs(options: MergePDFOptions): Promise<string>`

Merges multiple PDF files and returns either the path to the merged PDF file or the base64-encoded content.

#### Options

- `files` (Array of PDFFile objects): An array of PDF file objects with the following properties:
  - `uri` (string, required): The URI of the PDF file
  - `name` (string, optional): The name of the PDF file
  - `size` (number, optional): The size of the PDF file in bytes
  - `type` (string, optional): The MIME type of the file
  - `fileCopyUri` (string, optional): An alternative URI for the file

- `outputPath` (string, optional): The path where the merged PDF should be saved. If not provided, a temporary file will be created.

- `returnType` (string, optional): The type of return value you want:
  - `'path'` (default): Returns the file path of the merged PDF
  - `'base64'`: Returns the base64-encoded string of the merged PDF

#### Returns

A promise that resolves to:
- The path of the merged PDF file (when `returnType` is `'path'` or not specified)
- The base64-encoded string representation of the merged PDF (when `returnType` is `'base64'`)

## Example

See the `example` directory for a complete example app.

## License

MIT 