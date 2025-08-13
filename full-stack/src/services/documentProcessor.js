/**
 * Document Processing Service
 * 
 * This service orchestrates the document processing workflow:
 * 1. File upload and text extraction
 * 2. OpenAI analysis and simplification
 * 3. Result formatting and storage
 */

import { openaiService } from './openaiService.js';
import config from '../utils/config.js';

class DocumentProcessor {
  constructor() {
    this.supportedTypes = ['.txt', '.pdf', '.doc', '.docx'];
    this.maxFileSize = config.app.maxFileSize;
  }

  /**
   * Validates if a file can be processed
   * @param {File} file - The file to validate
   * @returns {Object} - Validation result with success/error
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.maxFileSize) {
      return { 
        valid: false, 
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 10MB` 
      };
    }

    const fileName = file.name.toLowerCase();
    const isSupported = this.supportedTypes.some(type => fileName.endsWith(type));
    
    if (!isSupported) {
      return {
        valid: false,
        error: `Unsupported file type. Supported types: ${this.supportedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Processes a document file through the complete workflow
   * @param {File} file - The document file to process
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} - Processing result
   */
  async processDocument(file, onProgress = () => {}) {
    try {
      // Step 1: Validate file
      onProgress({ step: 'validating', progress: 10, message: 'Validating file...' });
      
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Step 2: Extract text from file
      onProgress({ step: 'extracting', progress: 30, message: 'Extracting text from file...' });
      
      const extractedText = await openaiService.extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text content found in the file');
      }

      // Step 3: Analyze with OpenAI
      onProgress({ step: 'analyzing', progress: 60, message: 'Analyzing document with AI...' });
      
      const documentType = this.detectDocumentType(file.name, extractedText);
      const analysisResult = await openaiService.simplifyDocument(extractedText, documentType);

      // Step 4: Format final result
      onProgress({ step: 'formatting', progress: 90, message: 'Formatting results...' });
      
      const result = {
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        },
        documentType,
        analysis: analysisResult,
        processedAt: new Date().toISOString(),
        success: true
      };

      onProgress({ step: 'complete', progress: 100, message: 'Document processing complete!' });
      
      return result;

    } catch (error) {
      console.error('Document processing error:', error);
      onProgress({ step: 'error', progress: 0, message: error.message });
      
      return {
        success: false,
        error: error.message,
        processedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Attempts to detect document type based on filename and content
   * @param {string} fileName - Name of the file
   * @param {string} content - Document content
   * @returns {string} - Detected document type
   */
  detectDocumentType(fileName, content) {
    const lowerFileName = fileName.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Check filename patterns
    if (lowerFileName.includes('terms') || lowerFileName.includes('tos')) {
      return 'tos';
    }
    if (lowerFileName.includes('privacy')) {
      return 'privacy-policy';
    }
    if (lowerFileName.includes('eula') || lowerFileName.includes('license')) {
      return 'eula';
    }

    // Check content patterns
    if (lowerContent.includes('terms of service') || lowerContent.includes('terms and conditions')) {
      return 'tos';
    }
    if (lowerContent.includes('privacy policy') || lowerContent.includes('data collection')) {
      return 'privacy-policy';
    }
    if (lowerContent.includes('end user license') || lowerContent.includes('software license')) {
      return 'eula';
    }

    // Default to terms of service
    return 'tos';
  }

  /**
   * Processes text directly (without file upload)
   * @param {string} text - Raw text to process
   * @param {string} documentType - Type of document
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} - Processing result
   */
  async processText(text, documentType = 'tos', onProgress = () => {}) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('No text provided for processing');
      }

      onProgress({ step: 'analyzing', progress: 30, message: 'Analyzing text with AI...' });
      
      const analysisResult = await openaiService.simplifyDocument(text, documentType);

      onProgress({ step: 'formatting', progress: 90, message: 'Formatting results...' });
      
      const result = {
        documentType,
        analysis: analysisResult,
        processedAt: new Date().toISOString(),
        success: true
      };

      onProgress({ step: 'complete', progress: 100, message: 'Text processing complete!' });
      
      return result;

    } catch (error) {
      console.error('Text processing error:', error);
      onProgress({ step: 'error', progress: 0, message: error.message });
      
      return {
        success: false,
        error: error.message,
        processedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Gets processing history from localStorage
   * @returns {Array} - Array of previous processing results
   */
  getProcessingHistory() {
    try {
      const history = localStorage.getItem('tos-dumbifier-history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading processing history:', error);
      return [];
    }
  }

  /**
   * Saves processing result to history
   * @param {Object} result - Processing result to save
   */
  saveToHistory(result) {
    try {
      const history = this.getProcessingHistory();
      
      // Add new result to the beginning of the array
      history.unshift({
        id: Date.now().toString(),
        ...result,
        savedAt: new Date().toISOString()
      });

      // Keep only the last 10 results
      const limitedHistory = history.slice(0, 10);
      
      localStorage.setItem('tos-dumbifier-history', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving to processing history:', error);
    }
  }

  /**
   * Clears processing history
   */
  clearHistory() {
    try {
      localStorage.removeItem('tos-dumbifier-history');
    } catch (error) {
      console.error('Error clearing processing history:', error);
    }
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();
export default documentProcessor;
