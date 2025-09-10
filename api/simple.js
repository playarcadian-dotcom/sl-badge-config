export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const { data } = req.query;
    
    if (!data) {
        return res.status(404).send('No configuration data provided');
    }
    
    try {
        // Decode the base64 content
        const decoded = Buffer.from(data, 'base64').toString('utf-8');
        const lines = decoded.split('\n');
        const badgeLines = lines.filter(line => line && !line.startsWith('#'));
        const badgeCount = badgeLines.length;
        
        // Simple HTML page with inline styles and script
        const html = `<!DOCTYPE html>
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
        }
        .copy-button:hover {
            background: #5a67d8;
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
        .badge-count {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .important-note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
            color: #856404;
        }
        .important-note strong {
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎖️ Badge Configuration</h1>
        <div class="subtitle">Your badge configuration is ready to copy!</div>
        
        <div class="badge-count">${badgeCount} badges configured</div>
        
        <div class="config-box" id="configContent">${decoded}<button class="copy-button" onclick="copyConfig()">Copy to Clipboard</button></div>
        
        <div class="important-note">
            <strong>⚠️ Important:</strong> The badge_config notecard already exists in your Merit Badge Controller object. You'll be replacing its contents, not creating a new notecard.
        </div>
        
        <div class="instructions">
            <h3>📋 How to use this configuration:</h3>
            <ol>
                <li>Click the <strong>"Copy to Clipboard"</strong> button above</li>
                <li>In Second Life, right-click your <strong>Merit Badge Controller</strong> object</li>
                <li>Select <strong>Edit</strong> → Go to the <strong>Content</strong> tab</li>
                <li>Double-click the existing <strong>badge_config</strong> notecard to open it</li>
                <li>Select all existing text (Ctrl+A) and delete it</li>
                <li>Paste the new configuration (Ctrl+V)</li>
                <li>Click <strong>Save</strong></li>
                <li>Your badge system is now updated with the new badges!</li>
            </ol>
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
                // Fallback for older browsers
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
</html>`;
        
        res.status(200).send(html);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing configuration: ' + error.message);
    }
}
