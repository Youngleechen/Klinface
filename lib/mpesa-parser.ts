// lib/mpesa-parser.ts

export interface ParsedMpesa {
  isValid: boolean;
  amount?: number;
  transactionCode?: string;
  senderPhone?: string;
  senderName?: string;
  accountNumber?: string;
  date?: Date;
  errorMessage?: string;
}

// Your specific business details
const EXPECTED_ACCOUNT_NUMBER = '0100444592000';
const EXPECTED_AMOUNT = 1500; // KES

/**
 * Parses M-Pesa confirmation SMS and validates against expected values
 */
export function parseMpesaConfirmation(message: string): ParsedMpesa {
  try {
    if (!message || typeof message !== 'string') {
      return {
        isValid: false,
        errorMessage: 'No message provided'
      };
    }

    // Clean the message - remove extra spaces and normalize
    const cleanMessage = message.replace(/\s+/g, ' ').trim();
    
    // Extract transaction details using regex patterns
    const amountMatch = cleanMessage.match(/(?:Ksh|KES)?\s*([0-9,]+(?:\.\d{2})?)/i);
    const transactionCodeMatch = cleanMessage.match(/[A-Z0-9]{10,12}/); // M-Pesa codes are usually 10-12 chars
    const phoneMatch = cleanMessage.match(/0[7-9][0-9]{8}/); // Kenyan phone numbers
    const accountMatch = cleanMessage.match(new RegExp(EXPECTED_ACCOUNT_NUMBER)); // Look for your specific account
    
    // Try to extract account number from common patterns
    let accountNumber = '';
    const accountPatterns = [
      /Account\s*[#:]?\s*(\d+)/i,
      /Acc:\s*(\d+)/i,
      /A\/C:\s*(\d+)/i,
      new RegExp(`\\b${EXPECTED_ACCOUNT_NUMBER}\\b`)
    ];
    
    for (const pattern of accountPatterns) {
      const match = cleanMessage.match(pattern);
      if (match) {
        accountNumber = match[1] || match[0];
        break;
      }
    }

    // Extract amount (remove commas and convert to number)
    let amount: number | undefined;
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract transaction code
    let transactionCode = transactionCodeMatch ? transactionCodeMatch[0] : undefined;
    
    // If no transaction code found, try to generate from timestamp
    if (!transactionCode) {
      const timestamp = new Date().getTime().toString().slice(-8);
      transactionCode = `MP${timestamp}`;
    }

    // Extract sender phone
    let senderPhone = phoneMatch ? phoneMatch[0] : undefined;

    // Extract sender name if present (often after "from" or "by")
    let senderName: string | undefined;
    const nameMatch = cleanMessage.match(/(?:from|by)\s+([A-Za-z\s]+?)(?:\s+(?:to|on|at|$))/i);
    if (nameMatch) {
      senderName = nameMatch[1].trim();
    }

    // Extract date
    let date: Date | undefined;
    const dateMatch = cleanMessage.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
    if (dateMatch) {
      date = new Date(dateMatch[1]);
    }

    // Validation checks
    const validations = {
      hasAccountNumber: accountNumber === EXPECTED_ACCOUNT_NUMBER || cleanMessage.includes(EXPECTED_ACCOUNT_NUMBER),
      hasCorrectAmount: amount === EXPECTED_AMOUNT,
      hasTransactionCode: !!transactionCode,
      hasPhone: !!senderPhone
    };

    // Build response
    const result: ParsedMpesa = {
      isValid: validations.hasAccountNumber && validations.hasCorrectAmount,
      amount,
      transactionCode,
      senderPhone,
      senderName,
      accountNumber: accountNumber || EXPECTED_ACCOUNT_NUMBER,
      date
    };

    // Add specific error messages if validation fails
    if (!result.isValid) {
      if (!validations.hasAccountNumber) {
        result.errorMessage = `Account number mismatch. Expected: ${EXPECTED_ACCOUNT_NUMBER}`;
      } else if (!validations.hasCorrectAmount) {
        result.errorMessage = `Amount mismatch. Expected: KES ${EXPECTED_AMOUNT}, Found: KES ${amount}`;
      } else {
        result.errorMessage = 'Invalid M-Pesa message format';
      }
    }

    return result;
  } catch (error) {
    return {
      isValid: false,
      errorMessage: 'Failed to parse M-Pesa message'
    };
  }
}

/**
 * Extracts just the transaction code from an M-Pesa message
 */
export function extractTransactionCode(message: string): string | null {
  const match = message.match(/[A-Z0-9]{10,12}/);
  return match ? match[0] : null;
}

/**
 * Validates if an M-Pesa message matches expected payment
 */
export function validateMpesaPayment(message: string): {
  isValid: boolean;
  expectedAccount: string;
  expectedAmount: number;
  actualAmount?: number;
  accountMatched: boolean;
  amountMatched: boolean;
} {
  const parsed = parseMpesaConfirmation(message);
  
  return {
    isValid: parsed.isValid,
    expectedAccount: EXPECTED_ACCOUNT_NUMBER,
    expectedAmount: EXPECTED_AMOUNT,
    actualAmount: parsed.amount,
    accountMatched: parsed.accountNumber === EXPECTED_ACCOUNT_NUMBER,
    amountMatched: parsed.amount === EXPECTED_AMOUNT
  };
}