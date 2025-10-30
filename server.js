// Load environment variables FIRST
require('dotenv').config();

// Debug: Check if env vars are loaded
console.log('🔍 Checking environment variables...');
console.log('   OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('   OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('   PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Initialize OpenAI with explicit check
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY is not set in .env file');
    console.error('   Please check:');
    console.error('   1. File is named ".env" (not ".env.txt")');
    console.error('   2. File is in:', __dirname);
    console.error('   3. Format is: OPENAI_API_KEY=sk-your-key-here');
    console.error('   4. No quotes around the key');
    console.error('   5. No spaces around the = sign');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Load system prompt from markdown file
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'ralf_prompt.md'), 'utf-8');
console.log('✅ Loaded R.A.L.F. system prompt from ralf_prompt.md');

// Store conversation history (in-memory, per session)
// In production, use Redis or database
const conversationHistory = new Map();

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { type, message, context, result, sessionId = 'default' } = req.body;
        
        // Initialize conversation history for this session
        if (!conversationHistory.has(sessionId)) {
            conversationHistory.set(sessionId, []);
        }
        
        const history = conversationHistory.get(sessionId);
        
        // Build the user message based on type
        let userMessage = '';
        
        if (type === 'init') {
            userMessage = 'Greet the student and explain that a dust storm scrambled the air tanks. Explain they need to fill all 10 tanks with the right gases to make safe breathing air. Be encouraging and exciting!';
        } else if (type === 'player') {
            userMessage = `The student says: "${message}"\n\nCurrent tank status: ${context.tanks.O2} Oxygen tanks, ${context.tanks.N2} Nitrogen tanks, ${context.tanks.Other} Other tanks.\n\nRespond helpfully to their question or comment. Give hints about percentages if they're stuck.`;
        } else if (type === 'check') {
            const { tanks, target } = context;
            
            if (result === 'perfect') {
                userMessage = `SUCCESS! The student got it perfect: ${tanks.O2} Oxygen tanks (20%), ${tanks.N2} Nitrogen tanks (70%), ${tanks.Other} Other tank (10%). Celebrate their achievement and explain they've mastered this percentage challenge!`;
            } else {
                const filled = tanks.O2 + tanks.N2 + tanks.Other;
                
                if (filled < 10) {
                    userMessage = `The student has only filled ${filled} out of 10 tanks. Current mix: ${tanks.O2} Oxygen, ${tanks.N2} Nitrogen, ${tanks.Other} Other. Remind them all 10 tanks need to be filled (that's 100%). Give a helpful hint.`;
                } else {
                    // Calculate differences
                    const diffs = {
                        O2: tanks.O2 - target.O2,
                        N2: tanks.N2 - target.N2,
                        Other: tanks.Other - target.Other
                    };
                    
                    userMessage = `The student's mix: ${tanks.O2} Oxygen tanks (${tanks.O2 * 10}%), ${tanks.N2} Nitrogen tanks (${tanks.N2 * 10}%), ${tanks.Other} Other tanks (${tanks.Other * 10}%).\n\nTarget: ${target.O2} Oxygen (20%), ${target.N2} Nitrogen (70%), ${target.Other} Other (10%).\n\nGive specific feedback on the biggest error. Explain what's wrong in terms of percentages and tanks. Give hints to help them fix it.`;
                }
            }
        }
        
        // Build messages array with history
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userMessage }
        ];
        
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.8,
            max_tokens: 150
        });
        
        const ralfResponse = completion.choices[0].message.content;
        
        // Add to conversation history
        history.push({ role: "user", content: userMessage });
        history.push({ role: "assistant", content: ralfResponse });
        
        // Keep history manageable (last 10 exchanges = 20 messages)
        if (history.length > 20) {
            conversationHistory.set(sessionId, history.slice(-20));
        }
        
        res.json({ message: ralfResponse });
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            error: 'R.A.L.F. is having technical difficulties',
            message: 'Beep boop... my circuits are a bit fuzzy. Try again, Explorer!'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'R.A.L.F. is online and ready to help!' });
});

// Clear conversation history endpoint
app.post('/clear-history', (req, res) => {
    const { sessionId = 'default' } = req.body;
    conversationHistory.delete(sessionId);
    res.json({ message: 'Conversation history cleared', sessionId });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🤖 R.A.L.F. backend running on port ${PORT}`);
    console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? '✅ Yes' : '❌ No'}`);
});

