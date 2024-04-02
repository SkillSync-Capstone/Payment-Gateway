require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { quantityInput } = req.body; // Extract quantity from the request body
        const unitAmount = parseInt(quantityInput) * 100; // Convert quantity to cents

        const session = await stripe.checkout.sessions.create({
            "mode": "payment",
            "line_items": [
                {
                    "price_data": {
                        "unit_amount": unitAmount,
                        "currency": "usd",
                        "product_data": {
                            "name": "Donation For the Website" // Add your product name here
                        }
                    },
                    "quantity": 1
                }
            ],
            "cancel_url": "http://localhost:4000/cancel.html",
            "success_url": "http://localhost:4000/success.html",
            "payment_method_types": [
                "card"
            ]
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
