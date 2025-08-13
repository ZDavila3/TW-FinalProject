/**
 * OpenAI API Service
 * 
 * This service handles all interactions with the OpenAI API for document analysis.
 * It provides methods to simplify Terms of Service documents and other legal text.
 */

import config from '../utils/config.js';

class OpenAIService {
  constructor() {
    this.apiKey = config.openai.apiKey;
    this.model = config.openai.model;
    this.maxTokens = config.openai.maxTokens;
    this.apiUrl = config.api.openai;
  }

  /**
   * Validates if the API key is configured
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Simplifies a Terms of Service document using OpenAI
   * @param {string} documentText - The raw document text to simplify
   * @param {string} documentType - Type of document (e.g., 'tos', 'privacy-policy', 'eula')
   * @returns {Promise<Object>} - Simplified text and analysis
   */
  async simplifyDocument(documentText, documentType = 'tos') {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
    }

    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text cannot be empty');
    }

    // Limit text size to prevent token overflow
    const limitedText = this.limitTextSize(documentText, 3000);

    const prompt = this.createPrompt(limitedText, documentType);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a legal expert specializing in simplifying complex legal documents for everyday users. Your goal is to make legal text accessible and understandable while highlighting important clauses.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: 0.3, // Lower temperature for more consistent, factual responses
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from OpenAI');
      }

      const simplifiedContent = data.choices[0].message.content;
      
      return {
        original: documentText,
        simplified: simplifiedContent,
        wordCount: {
          original: documentText.split(/\s+/).length,
          simplified: simplifiedContent.split(/\s+/).length
        },
        timestamp: new Date().toISOString(),
        model: this.model,
        success: true
      };

    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw new Error(`Failed to simplify document: ${error.message}`);
    }
  }

  /**
   * Creates a specialized prompt based on document type
   * @param {string} text - Document text
   * @param {string} type - Document type
   * @returns {string} - Formatted prompt
   */
  createPrompt(text, type) {
    const basePrompt = `Please analyze and simplify the following ${type.toUpperCase()} document. 

INSTRUCTIONS:
1. Break down complex legal language into simple, everyday terms
2. Highlight the most important points that users should know
3. Identify any potentially concerning clauses or red flags
4. Organize the content with clear headings
5. Use bullet points for easy reading
6. Explain what the user is agreeing to in practical terms

FORMAT YOUR RESPONSE AS:
## Key Points You Should Know
[Most important takeaways in bullet points]

## Simplified Summary
[Easy-to-understand version of the main content]

## Red Flags & Concerns
[Any clauses that might be problematic for users]

## What This Means for You
[Practical implications of agreeing to these terms]

Document to analyze:
${text}`;

    return basePrompt;
  }

  /**
   * Limits text size to prevent token overflow
   * @param {string} text - Input text
   * @param {number} maxChars - Maximum characters to keep
   * @returns {string} - Truncated text
   */
  limitTextSize(text, maxChars = 3000) {
    if (text.length <= maxChars) {
      return text;
    }

    // Try to cut at a sentence boundary
    const truncated = text.substring(0, maxChars);
    const lastSentence = truncated.lastIndexOf('.');
    
    if (lastSentence > maxChars * 0.8) {
      return truncated.substring(0, lastSentence + 1);
    }
    
    return truncated + '...';
  }

  /**
   * Extracts text from different file types
   * @param {File} file - The uploaded file
   * @returns {Promise<string>} - Extracted text content
   */
  async extractTextFromFile(file) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await this.readTextFile(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        // For PDF files, you might want to use a PDF parsing library
        // For now, we'll throw an error suggesting text files
        throw new Error('PDF parsing not implemented yet. Please convert your PDF to a text file or copy-paste the content.');
      } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        throw new Error('Word document parsing not implemented yet. Please convert your document to a text file or copy-paste the content.');
      } else {
        throw new Error('Unsupported file type. Please use .txt files or copy-paste the content.');
      }
    } catch (error) {
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  }

  /**
   * Reads text from a text file
   * @param {File} file - Text file
   * @returns {Promise<string>} - File content
   */
  async readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
export default openaiService;
