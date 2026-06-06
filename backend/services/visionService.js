const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const fs = require('fs');

exports.extractDataFromImage = async (imagePath) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env file");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        rawText: {
          type: SchemaType.STRING,
          description: "The complete raw text extracted from the invoice or bill."
        },
        vendor: {
          type: SchemaType.STRING,
          description: "The official name of the store, merchant, company, or vendor issuing the bill."
        },
        amount: {
          type: SchemaType.NUMBER,
          description: "The final total amount (grand total / amount due) paid or charged. Ensure this is a clean number."
        },
        currency: {
          type: SchemaType.STRING,
          description: "The detected currency symbol (e.g. $, ₹, €, £, ¥, C$, A$) from the bill."
        },
        date: {
          type: SchemaType.STRING,
          description: "The date of the transaction formatted strictly as YYYY-MM-DD."
        },
        category: {
          type: SchemaType.STRING,
          description: "The exact matched category from the allowed enum list based on the items and vendor.",
          enum: ['Food', 'Travel', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Others']
        }
      },
      required: ["rawText", "vendor", "amount", "currency", "date", "category"]
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Low temperature for highly deterministic and accurate classification
      }
    });

    const imageBytes = fs.readFileSync(imagePath);
    const base64Data = imageBytes.toString('base64');
    
    const mimeType = imagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    const prompt = `You are an expert AI financial auditor and supervised machine learning classifier. Analyze the attached invoice/bill image with extreme precision and extract the required fields.

CRITICAL INSTRUCTIONS FOR CATEGORY CLASSIFICATION:
You must analyze the merchant name, the line items, and the context of the bill to classify it into EXACTLY ONE of the following categories:
1. Food: Restaurants, cafes, fast food, bakeries, grocery stores, supermarkets, food delivery (e.g., McDonald's, KFC, Starbucks, Swiggy, Zomato, Walmart Grocery, Whole Foods).
2. Travel: Flights, trains, cabs/taxis, ridesharing (Uber, Lyft), gas stations, fuel, hotels, lodging, parking, tolls, bus tickets.
3. Shopping: E-commerce (Amazon, eBay), retail stores, clothing, apparel, electronics (Best Buy, Apple), department stores (Target, Walmart), hardware stores.
4. Utilities: Electricity bills, water bills, gas heating, internet/broadband, mobile phone bills (AT&T, Verizon), trash collection, municipal services.
5. Healthcare: Pharmacies (CVS, Walgreens), hospital bills, clinic visits, doctor fees, dental, vision, medical insurance, prescription drugs.
6. Entertainment: Movie tickets, streaming services (Netflix, Spotify, Disney+), concert tickets, video games (Steam, PlayStation), amusement parks, museums, sporting events.
7. Others: Miscellaneous expenses, professional services, banking fees, legal fees, or any bill that clearly does not fit into the above 6 categories.

CRITICAL INSTRUCTIONS FOR OTHER FIELDS:
- vendor: Look at the top header or logo text. Extract the cleanest version of the company name.
- amount: Look for "Total", "Grand Total", "Amount Due", or "Balance". Do not include currency symbols ($). Convert to a pure floating-point number.
- currency: Detect the currency symbol or code used on the bill (e.g., "$", "₹", "€", "£", "¥", "C$", "A$"). If none found, default to "$".
- date: Identify the invoice date, billing date, or receipt date. Convert whatever format is present into a standard "YYYY-MM-DD" string.
- rawText: Include the complete OCR text transcript of the bill.

Output ONLY the JSON object matching the required schema.`;
    
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return JSON.parse(response.text());
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
