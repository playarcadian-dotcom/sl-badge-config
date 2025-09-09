// File: /api/save.js
// This handles saving badge configurations

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { id, content, timestamp } = req.body;
        
        if (!id || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Store in Vercel KV (Redis) with 24-hour expiration
        await kv.set(
            `badge_${id}`,
            {
                content: content,
                timestamp: timestamp || Date.now(),
                created: new Date().toISOString()
            },
            { ex: 86400 } // 24 hours in seconds
        );
        
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Error saving configuration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
