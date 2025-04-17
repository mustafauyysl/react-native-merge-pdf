package com.reactnativemergepdf;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import android.net.Uri;
import android.util.Base64;
import android.util.Log;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PdfMerger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@ReactModule(name = ReactNativeMergePdfModule.NAME)
public class ReactNativeMergePdfModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ReactNativeMergePdf";
    private final ReactApplicationContext reactContext;

    public ReactNativeMergePdfModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void mergePDFs(ReadableMap options, Promise promise) {
        try {
            ReadableArray files = options.getArray("files");
            String outputPath = options.hasKey("outputPath") ? options.getString("outputPath") : null;
            String returnType = options.hasKey("returnType") ? options.getString("returnType") : "path";

            if (files == null || files.size() == 0) {
                promise.reject("NO_FILES", "No files to merge");
                return;
            }

            if (outputPath == null || outputPath.isEmpty()) {
                File outputDir = reactContext.getCacheDir();
                outputPath = new File(outputDir, "merged_" + UUID.randomUUID().toString() + ".pdf").getAbsolutePath();
            }

            PdfWriter writer = new PdfWriter(outputPath);
            PdfDocument outputPdf = new PdfDocument(writer);
            PdfMerger merger = new PdfMerger(outputPdf);

            for (int i = 0; i < files.size(); i++) {
                ReadableMap file = files.getMap(i);
                String uri = file.getString("uri");

                if (uri == null || uri.isEmpty()) {
                    continue;
                }

                try {
                    String filePath = uri;
                    if (uri.startsWith("file://")) {
                        filePath = uri.substring(7);
                    }

                    PdfReader reader = new PdfReader(filePath);
                    PdfDocument inputPdf = new PdfDocument(reader);

                    merger.merge(inputPdf, 1, inputPdf.getNumberOfPages());

                    inputPdf.close();
                } catch (Exception e) {
                    Log.e(NAME, "Error processing PDF: " + uri, e);
                }
            }

            outputPdf.close();

            if ("base64".equals(returnType)) {
                try {
                    File file = new File(outputPath);
                    int size = (int) file.length();
                    byte[] bytes = new byte[size];
                    
                    try (InputStream buf = new FileInputStream(file)) {
                        buf.read(bytes, 0, bytes.length);
                    }
                    
                    String base64String = Base64.encodeToString(bytes, Base64.DEFAULT);
                    promise.resolve(base64String);
                } catch (Exception e) {
                    Log.e(NAME, "Error converting PDF to base64", e);
                    promise.reject("ENCODING_FAILED", "Failed to encode PDF to base64: " + e.getMessage(), e);
                }
            } else {
                promise.resolve(outputPath);
            }
        } catch (IOException e) {
            promise.reject("MERGE_FAILED", "Failed to merge PDFs: " + e.getMessage(), e);
        } catch (Exception e) {
            promise.reject("UNEXPECTED_ERROR", "An unexpected error occurred: " + e.getMessage(), e);
        }
    }
} 