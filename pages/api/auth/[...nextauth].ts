import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaClient } from "../../../utils/prisma";
import axios from "axios";

const options = {
   adapter: PrismaAdapter(prismaClient),
   session: {
      jwt: true,
   },
   jwt: {
      secret: process.env.SECRET,
      signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
   },
   providers: [
      EmailProvider({
         server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
               user: process.env.EMAIL_SERVER_USER,
               pass: process.env.EMAIL_SERVER_PASSWORD,
            },
         },
         from: process.env.EMAIL_FROM,
      }),
      CredentialsProvider({
         id: "credentials",
         name: "Credentials",
         type: "credentials",
         credentials: {
            email: {
               label: "Email",
               type: "email",
               placeholder: "jsmith@email.com",
            },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            const user = await axios.post(
               `${process.env.NEXTAUTH_URL}/api/loginUserAccount`,
               credentials,
            );

            return user.data;
         },
      }),
   ],
};

export default (req: NextApiRequest, res: NextApiResponse) =>
   NextAuth(req, res, options);
