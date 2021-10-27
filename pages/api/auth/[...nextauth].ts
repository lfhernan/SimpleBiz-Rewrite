import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Providers from "next-auth/providers";

const prisma = new PrismaClient();

const options = {
    providers: [
        Providers.Email({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        })
    ],
	adapter: PrismaAdapter(prisma)
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
