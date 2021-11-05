import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const options = {
    adapter: PrismaAdapter(prisma),
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
            name: "Credentials",
            credentials: {
                username: {
                    label: "Email",
                    type: "email",
                    placeholder: "jsmith@email.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const user = await axios.post('localhost:3000/api/signon', credentials);
                return user;
            },
        }),
    ],
    session: {
        jwt: true,
    },
    secret: process.env.SECRET,
    jwt: {
        secret: process.env.SECRET,
        encryption: true,
    },
    debugger: true,
};

export default (req: NextApiRequest, res: NextApiResponse) =>
    NextAuth(req, res, options);
