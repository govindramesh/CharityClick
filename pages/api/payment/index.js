import Stripe from "stripe";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongodb from "../../../server/mongodb";
const stripe = new Stripe(
  "sk_test_51LvdtbF7Yo4hJn5Ln3IWIkbAFUNxaPRdUuBEN9UuXQcP9piEk2iHkiGJlkBOJZPsS1t7ebkwYYXMuzQB5Vubz8x100CCxxCpad"
);

const handler = async (req, res) => {
  await mongodb();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    success: true,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });
};

export default handler;
