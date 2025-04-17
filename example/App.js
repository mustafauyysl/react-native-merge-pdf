import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { mergePDFs } from 'react-native-merge-pdf';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [mergedPdfPath, setMergedPdfPath] = useState(null);
  const [mergedPdfBase64, setMergedPdfBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useBase64, setUseBase64] = useState(false);

  const pickPdfs = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });
      
      setSelectedPdfs(results);
      setMergedPdfPath(null);
      setMergedPdfBase64(null);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        Alert.alert('Error', 'Failed to pick documents: ' + err.message);
      }
    }
  };

  const mergeFiles = async () => {
    if (selectedPdfs.length < 2) {
      Alert.alert('Warning', 'Please select at least 2 PDF files to merge');
      return;
    }

    setIsLoading(true);
    try {
      const filesForMerge = selectedPdfs.map(file => ({
        uri: Platform.OS === 'ios' ? file.uri : file.fileCopyUri || file.uri,
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      const result = await mergePDFs({
        files: filesForMerge,
        returnType: useBase64 ? 'base64' : 'path',
      });
      
      if (useBase64) {
        setMergedPdfBase64(result);
        setMergedPdfPath(null);
      } else {
        setMergedPdfPath(result);
        setMergedPdfBase64(null);
      }
      
      Alert.alert('Success', 'PDFs merged successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to merge PDFs: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBase64 = () => setUseBase64(previousState => !previousState);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>React Native Merge PDF</Text>
              <Text style={styles.sectionDescription}>
                Example application showing how to merge PDF files
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button 
                title="Select PDF Files" 
                onPress={pickPdfs} 
              />
            </View>
            
            {selectedPdfs.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Selected Files</Text>
                {selectedPdfs.map((pdf, index) => (
                  <Text key={index} style={styles.fileItem}>
                    {index + 1}. {pdf.name} ({(pdf.size / 1024).toFixed(2)} KB)
                  </Text>
                ))}
                
                <View style={styles.optionContainer}>
                  <Text style={styles.optionText}>Return as Base64:</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={useBase64 ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleBase64}
                    value={useBase64}
                  />
                </View>
                
                <View style={styles.buttonContainer}>
                  <Button 
                    title={isLoading ? "Merging..." : "Merge PDFs"} 
                    onPress={mergeFiles}
                    disabled={isLoading || selectedPdfs.length < 2}
                  />
                </View>
              </View>
            )}
            
            {mergedPdfPath && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Merge Complete!</Text>
                <Text style={styles.sectionDescription}>
                  Output file: {mergedPdfPath}
                </Text>
              </View>
            )}
            
            {mergedPdfBase64 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Merge Complete! (Base64)</Text>
                <Text style={styles.sectionDescription}>
                  Base64 data (first 50 chars): {mergedPdfBase64.substring(0, 50)}...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#F3F3F3',
  },
  body: {
    backgroundColor: 'white',
    minHeight: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#444',
  },
  fileItem: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    margin: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 24,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App; 