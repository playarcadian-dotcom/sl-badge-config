// File: /api/badge-config/[id].js
// This displays the badge configuration page

import { kv } from '@vercel/kv';

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

export default async function handler(req, res) {
    const { id } = req.query;
    
    try {
        const config = await kv.get(`badge_${id}`);
        
        if (!config) {
            res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Configuration Not Found</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            max-width: 800px;
                            margin: 50px auto;
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .error {
                            background: #fff;
                            border: 2px solid #ff4444;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>Configuration Not Found</h1>
                        <p>This configuration may have expired or the link may be incorrect.</p>
                        <p>Configurations are kept for 24 hours.</p>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        const badgeCount = config.content.split('\\n').filter(line => line && !line.startsWith('#')).length;
        
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Badge Configuration</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        max-width: 900px;
                        margin: 30px auto;
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .container {
                        background: white;
                        border-radius: 12px;
                        padding: 30px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .subtitle {
                        color: #666;
                        margin-bottom: 30px;
                    }
                    .config-box {
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        padding: 20px;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        position: relative;
                        margin-bottom: 20px;
                    }
                    .copy-button {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.3s;
                    }
                    .copy-button:hover {
                        background: #5a67d8;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    }
                    .copy-button.copied {
                        background: #48bb78;
                    }
                    .instructions {
                        background: #f0f7ff;
                        border-left: 4px solid #667eea;
                        padding: 15px;
                        margin-top: 20px;
                        border-radius: 4px;
                    }
                    .instructions h3 {
                        margin-top: 0;
                        color: #667eea;
                    }
                    .instructions ol {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    .instructions li {
                        margin: 8px 0;
                        line-height: 1.6;
                    }
                    .metadata {
                        color: #999;
                        font-size: 12px;
                        margin-top: 20px;
                        text-align: center;
                    }
                    .badge-count {
                        background: #667eea;
                        color: white;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 14px;
                        display: inline-block;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎖️ Badge Configuration</h1>
                    <div class="subtitle">Your badge configuration is ready to copy!</div>
                    
                    <div class="badge-count">
                        ${badgeCount} badges configured
                    </div>
                    
                    <div class="config-box" id="configContent">${escapeHtml(config.content)}<button class="copy-button" onclick="copyConfig()">Copy to Clipboard</button></div>
                    
                    <div class="instructions">
                        <h3>📋 How to use this configuration:</h3>
                        <ol>
                            <li>Click the "Copy to Clipboard" button above</li>
                            <li>In Second Life, create a new notecard in your badge system object</li>
                            <li>Name the notecard exactly: <strong>badge_config</strong></li>
                            <li>Paste the configuration into the notecard</li>
                            <li>Save the notecard</li>
                            <li>Your badge system is now configured!</li>
                        </ol>
                    </div>
                    
                    <div class="metadata">
                        Configuration ID: ${id} | Created: ${config.created} | Expires in 24 hours
                    </div>
                </div>
                
                <script>
                    function copyConfig() {
                        const content = document.getElementById('configContent').innerText;
                        const textToCopy = content.replace('Copy to Clipboard', '').trim();
                        
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            const button = document.querySelector('.copy-button');
                            button.textContent = '✓ Copied!';
                            button.classList.add('copied');
                            
                            setTimeout(() => {
                                button.textContent = 'Copy to Clipboard';
                                button.classList.remove('copied');
                            }, 3000);
                        }).catch(err => {
                            const textarea = document.createElement('textarea');
                            textarea.value = textToCopy;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            
                            const button = document.querySelector('.copy-button');
                            button.textContent = '✓ Copied!';
                            button.classList.add('copied');
                            
                            setTimeout(() => {
                                button.textContent = 'Copy to Clipboard';
                                button.classList.remove('copied');
                            }, 3000);
                        });
                    }
                </script>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Error retrieving configuration:', error);
        res.status(500).send('Internal server error');
    }
}
