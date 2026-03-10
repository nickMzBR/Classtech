// api/create-preference.js
const mercadopago = require('mercadopago');

// O Vercel injeta a variável de ambiente aqui automaticamente
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, price } = req.body;

        let preference = {
            items: [
                {
                    title: title,
                    unit_price: Number(price),
                    quantity: 1,
                    currency_id: 'BRL'
                }
            ],
            // Para onde o usuário volta após pagar
            back_urls: {
                success: "https://seu-site.vercel.app/sucesso",
                failure: "https://seu-site.vercel.app/erro",
                pending: "https://seu-site.vercel.app/pendente"
            },
            auto_return: "approved",
        };

        try {
            const response = await mercadopago.preferences.create(preference);
            res.status(200).json({ id: response.body.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
