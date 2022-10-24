import bcrypt from "bcryptjs";
import mongoDB from "../index";
import User from "../models/User";

export async function login(email, password) {
  if (email == null || password == null) {
    throw new Error("All parameters must be provided!");
  }
  await mongoDB();

  const user = await User.findOne({ email });

  if (user != null) {
    const didMatch = await bcrypt.compare(password, user.password);

    if (!didMatch) {
      throw new Error("The password you entered is incorrect!");
    }
  } else {
    throw new Error("User does not exist!");
  }

  return {
    id: user._id,
  };
}

export async function signUp(email, password) {
  if (email == null || password == null) {
    throw new Error("All parameters must be provided!");
  }

  await mongoDB();

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      return {
        id: user._id,
      };
    });
}

export const getUserFromId = async (id) => {
  await mongoDB();
  try {
    const user = await User.findOne({ _id: id });

    if (user == null) {
      throw new Error();
    }

    return {
      id,
      email: user.email,
    };
  } catch (e) {
    throw new Error("Invalid token!");
  }
};
