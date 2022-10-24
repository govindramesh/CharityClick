import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import User from "../../../server/mongodb/models/User";
import { getToken } from "next-auth/jwt";
import mongodb from "../../../server/mongodb";

const handler = async (req, res) => {
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

    user.balance = 0;

    await user.save();

    return res.status(200).json({
      success: true,
    });
  }
};

export default handler;
