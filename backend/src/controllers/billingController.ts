import { Request, Response } from 'express';

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        // Mock Stripe Session Creation
        const { planId } = req.body;

        console.log(`Creating Stripe Session for Plan: ${planId}`);

        // Return a mock URL
        res.json({
            sessionId: 'cs_test_mock_12345',
            url: 'https://checkout.stripe.com/mock-pay'
        });

    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: 'Billing failed' });
    }
};
