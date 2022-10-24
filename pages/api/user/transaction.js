import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import User from "../../../server/mongodb/models/User";
import { getToken } from "next-auth/jwt";
import mongodb from "../../../server/mongodb";

import Cors from "cors";
import { useUnmountEffect } from "framer-motion";
import { randomBytes } from "crypto";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const handler = async (req, res) => {
  await runMiddleware(req, res, cors);
  if (req.method === "POST") {
    await mongodb();
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = await getToken({ req });
    let { sub: id } = token;
    let user = await User.findById(id);

    const { amount, platform } = req.body;

    let charities = [];
    if (user.rainn) charities.push("rainn");
    if (user.angels) charities.push("angels");
    if (user.hope) charities.push("hope");

    if (charities.length === 0) {
      charities = ["rainn", "angels", "hope"];
    }

    // select a random charity
    const charity = charities[Math.floor(Math.random() * charities.length)];

    if (user.balance !== 0) {
      user.transactions.push({
        id: randomBytes(16).toString("hex"),
        amount,
        charity,
        platform,
        date: new Date(),
      });

      await user.save();
      return res.status(200).json({
        success: true,
      });
    }

    return res.status(400).json({
      success: false,
    });
  }
};

export default handler;
