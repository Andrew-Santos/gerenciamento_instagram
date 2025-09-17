const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Chave secreta do webhook (do app no Facebook)
const APP_SECRET = '90620e783142560ce9903361efe9ff97';

// Middleware para ler JSON
app.use(bodyParser.json());

// Rota de verificação do webhook (GET)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'awjk'; // token que você define
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verificado!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Rota de recebimento de eventos (POST)
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];

    // Verifica assinatura para segurança
    if (!verifyRequestSignature(req.body, signature)) {
        console.log('Assinatura inválida!');
        return res.sendStatus(403);
    }

    const data = req.body;
    console.log('Recebido evento:', JSON.stringify(data, null, 2));

    // Aqui você processa os eventos do Instagram, ex:
    if (data.entry) {
        data.entry.forEach(entry => {
            if (entry.messaging) {
                entry.messaging.forEach(event => {
                    console.log('Mensagem ou evento:', event);
                    // processa mensagem, comentário, etc
                });
            }
        });
    }

    // Sempre responda 200 para o Facebook/Instagram
    res.sendStatus(200);
});

// Função de verificação de assinatura
function verifyRequestSignature(payload, signature) {
    if (!signature) return false;
    const hash = 'sha256=' + crypto.createHmac('sha256', APP_SECRET)
                                   .update(JSON.stringify(payload))
                                   .digest('hex');
    return signature === hash;
}

app.listen(PORT, () => {
    console.log(`Webhook rodando em http://localhost:${PORT}`);
});

