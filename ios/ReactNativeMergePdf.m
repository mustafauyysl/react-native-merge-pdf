#import "ReactNativeMergePdf.h"
#import <PDFKit/PDFKit.h>

@implementation ReactNativeMergePdf

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(mergePDFs:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSArray *files = options[@"files"];
    NSString *outputPath = options[@"outputPath"];
    NSString *returnType = options[@"returnType"] ?: @"path";
    
    if ([files count] == 0) {
        reject(@"no_files", @"No files to merge", nil);
        return;
    }
    
    @try {
        if (outputPath == nil || [outputPath isEqualToString:@""]) {
            NSString *tmpDir = NSTemporaryDirectory();
            NSString *fileName = [NSString stringWithFormat:@"merged_%@.pdf", [[NSUUID UUID] UUIDString]];
            outputPath = [tmpDir stringByAppendingPathComponent:fileName];
        }
        
        PDFDocument *mergedPDF = [[PDFDocument alloc] init];
        NSInteger currentPage = 0;
        
        for (NSDictionary *file in files) {
            NSString *uri = file[@"uri"];
            if (uri == nil || [uri isEqualToString:@""]) {
                continue;
            }
            
            NSString *filePath = uri;
            if ([uri hasPrefix:@"file://"]) {
                filePath = [uri substringFromIndex:7];
            }
            
            PDFDocument *pdfDoc = [[PDFDocument alloc] initWithURL:[NSURL fileURLWithPath:filePath]];
            if (pdfDoc == nil) {
                NSLog(@"Could not load PDF at path: %@", filePath);
                continue;
            }
            
            NSInteger pageCount = [pdfDoc pageCount];
            
            for (NSInteger i = 0; i < pageCount; i++) {
                PDFPage *page = [pdfDoc pageAtIndex:i];
                if (page) {
                    [mergedPDF insertPage:page atIndex:currentPage];
                    currentPage++;
                }
            }
        }
        
        if ([mergedPDF writeToURL:[NSURL fileURLWithPath:outputPath]]) {
            if ([returnType isEqualToString:@"base64"]) {
                NSData *pdfData = [NSData dataWithContentsOfFile:outputPath];
                if (pdfData) {
                    NSString *base64String = [pdfData base64EncodedStringWithOptions:0];
                    resolve(base64String);
                } else {
                    reject(@"read_error", @"Could not read merged PDF for base64 encoding", nil);
                }
            } else {
                resolve(outputPath);
            }
        } else {
            reject(@"write_error", @"Could not write merged PDF to output path", nil);
        }
    } @catch (NSException *exception) {
        reject(@"pdf_merge_error", exception.reason, nil);
    }
}

@end 