const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();
    const { title, price, userId } = req.body;

    try {
        const preference = {
            items: [{
                title: title,
                unit_price: Number(price),
                quantity: 1,
                currency_id: 'BRL'
            }],
            back_urls: {
                success: `https://${req.headers.host}/?status=approved&plan=${title.split(' ')[1].toLowerCase()}`,
                failure: `https://${req.headers.host}/`,
                pending: `https://${req.headers.host}/`
            },
            auto_return: "approved",
        };

        const response = await mercadopago.preferences.create(preference);
        res.status(200).json({ id: response.body.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}