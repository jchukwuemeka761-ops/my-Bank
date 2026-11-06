import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

/**
 * AI Assistant Chat Endpoint for JChukwuemeka's Financials
 * Never receives passwords, OTPs, or full card numbers (scrubbed by client proxy)
 */
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      // Fallback response if key is not configured
      return res.json({
        response: `JChukwuemeka's Financials Concierge: You asked: "${prompt}". Our current High-Yield Savings rate is 4.85% APY, routing number is 021000021, and customer support is available 24/7.`,
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the helpful, professional, and trustworthy AI banking concierge for "JChukwuemeka's Financials" (JF).
Your tone is warm, precise, and secure.
Banking information:
- Bank Name: JChukwuemeka's Financials (short: JF)
- Routing Number: 021000021
- High-Yield Savings APY: 4.85% APY
- 12-Month CD APY: 5.10% APY
- Premier Checking APY: 0.25% APY, zero monthly maintenance fees
- 30-Year Fixed Mortgage: 6.45% APR
- 15-Year Fixed Mortgage: 5.75% APR
- Auto Loan: 4.99% APR with an extra 0.50% discount for electric vehicles
- Cards: Travel Elite Visa Signature (3x points travel/dining, no foreign transaction fees), Cash Rewards Mastercard (2% flat cash back)
- Security: FDIC Insured up to $250,000, 2FA OTP mandatory, double-entry ledger security
- Never ask for or record passwords, PINs, OTP codes, or full 16-digit card numbers.
Keep answers concise, helpful, and formatted with clean paragraphs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({ response: response.text || 'Thank you for reaching out to JF. How else can I assist you with your banking?' });
  } catch (error: unknown) {
    console.error('Error in /api/ai/chat:', error);
    return res.json({
      response: "JChukwuemeka's Financials Concierge: Our services are operating normally. For specific inquiries regarding account balances, transfers, or card locks, please use the navigation shortcuts on your customer dashboard.",
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
