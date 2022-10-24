import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import User from "../../../server/mongodb/models/User";
import { getToken } from "next-auth/jwt";
import mongodb from "../../../server/mongodb";

const handler = async (req, res) => {
  await mongodb();
  if (req.method === "GET") {
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

    return res.status(200).json({
      success: true,
      payload: {
        hope: user.hope,
        angels: user.angels,
        rainn: user.rainn,
      },
    });
  } else if (req.method === "POST") {
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

    const { hope, angels, rainn } = req.body;

    user.hope = hope;
    user.angels = angels;
    user.rainn = rainn;

    await user.save();

    return res.status(200).json({
      success: true,
    });
  }
};

export default handler;
