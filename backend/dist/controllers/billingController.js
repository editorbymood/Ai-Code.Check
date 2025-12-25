"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mock Stripe Session Creation
        const { planId } = req.body;
        console.log(`Creating Stripe Session for Plan: ${planId}`);
        // Return a mock URL
        res.json({
            sessionId: 'cs_test_mock_12345',
            url: 'https://checkout.stripe.com/mock-pay'
        });
    }
    catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: 'Billing failed' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
