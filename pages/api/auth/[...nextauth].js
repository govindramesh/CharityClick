import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login, signUp } from "../../../server/mongodb/actions/User";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        let user = null;
        if (credentials.action === "login") {
          user = await login(credentials.email, credentials.password);
        } else if (credentials.action === "signUp") {
          user = await signUp(credentials.email, credentials.password);
        }

        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
