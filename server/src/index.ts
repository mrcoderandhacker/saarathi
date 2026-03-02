import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.CLIENT_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(morgan('dev'));

// Basic Health Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', msg: 'Saarathii Backend is running!' });
});

// -------------------------------------------------------------
// COLLEGE EXPLORER API
// -------------------------------------------------------------
app.get('/api/colleges', async (req, res, next) => {
    try {
        const { stream, type, search, limit = 50 } = req.query;

        const whereClause: any = {};
        if (stream && stream !== 'All') whereClause.stream = stream;
        if (type && type !== 'All') whereClause.type = type;
        if (search) {
            whereClause.name = { contains: String(search), mode: 'insensitive' };
        }

        const colleges = await prisma.colleges_master.findMany({
            where: whereClause,
            take: Number(limit),
            orderBy: { nirf_rank: 'asc' }
        });

        res.status(200).json(colleges);
    } catch (err) {
        next(err);
    }
});

import { createClient } from '@supabase/supabase-js';

// -------------------------------------------------------------
// AI DYNAMIC ROADMAP API
// -------------------------------------------------------------
app.post('/api/ai/generate-roadmap', async (req, res, next) => {
    try {
        const { userId, goal, durationMonths = 6 } = req.body;

        if (!userId || !goal) {
            return res.status(400).json({ error: 'Missing userId or goal' });
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: 'Missing Supabase URL/Key in environment variables. Restart the server.' });
        }

        // We initialize the client inside the route to pick up env vars dynamically
        const supabase = createClient(supabaseUrl, supabaseKey);

        const CLOUDFLARE_AI_URL = 'https://saarathii-api.vikaskumar5866.workers.dev/ai';
        const SYSTEM_PROMPT = `You are Saarathii, an expert academic planner.
The student wants to prepare for: "${goal}".
Generate a structured, month-by-month study curriculum for exactly ${durationMonths} months.

Respond ONLY with a raw JSON array of objects. Do not use markdown blocks like \`\`\`json.
Each object must have exactly these keys:
- "month": number (e.g., 1)
- "focus": a short string describing the broad goal of the month
- "topics": an array of strings detailing specific chapters/subjects

No intro, no outro, JUST the JSON array.`;

        // Call the Cloudflare Worker proxy (same one used by AIGuide chat - has its own working Gemini key)
        const cfRes = await fetch(CLOUDFLARE_AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }] }],
                generationConfig: { temperature: 0.7 }
            })
        });

        if (!cfRes.ok) {
            const errText = await cfRes.text();
            console.error('Cloudflare Worker Error:', cfRes.status, errText);
            throw new Error(`AI proxy returned ${cfRes.status}: ${errText}`);
        }

        const cfData = await cfRes.json() as any;
        let rawJson = cfData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Strip backticks if the model ignores our instruction
        rawJson = rawJson.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();

        const parsedCurriculum = JSON.parse(rawJson);

        // We execute the insert against the Supabase HTTP API (bypassing ISP pooler blocks natively). 
        // Note: The roadmaps table must have its Row Level Security OPENED for `anon` inserts for this to succeed since we lack a Service Role key locally.
        const { data: savedRoadmap, error: dbErr } = await supabase
            .from('roadmaps')
            .insert([
                { user_id: userId, goal: goal, curriculum: parsedCurriculum }
            ])
            .select()
            .single();

        if (dbErr) {
            console.error("SUPABASE REST ERROR:", JSON.stringify(dbErr, null, 2));
            throw dbErr;
        }

        res.status(200).json(savedRoadmap);
    } catch (err) {
        console.error("AI Generation Error:", err);
        next(err);
    }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('FULL ERROR:', err);
    res.status(500).json({
        error: err.message || 'Something broke!',
        code: err.code,
        status: err.status,
        details: err.errorDetails || err.details
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Saarathii API Engine running on http://localhost:${PORT}`);
});
