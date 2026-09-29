import http from 'http';
import { RemittanceRoutes } from './routes/remittanceRoutes';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let bodyStr = '';
    req.on('data', chunk => {
        bodyStr += chunk;
    });

    req.on('end', async () => {
        let body: any = {};
        if (bodyStr) {
            try {
                body = JSON.parse(bodyStr);
            } catch {
                body = {};
            }
        }

        try {
            const responseData = await RemittanceRoutes.handleRequest(req.url || '/', req.method || 'GET', body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseData));
        } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`BharatBridge Backend Server running on port ${PORT}`);
    });
}

export default server;
