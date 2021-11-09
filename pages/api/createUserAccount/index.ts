// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prismaClient } from "../../../utils/prisma";

const bcrypt = require("bcrypt");
const saltRounds: number = 12;

const create = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { name, email, password } = req.body;

        bcrypt.hash(password, saltRounds).then(async (hash: string) => {
            let user: Prisma.UserCreateInput = {
                name: name,
                email: email,
                password: hash,
            };
            const result = await prismaClient.user.create({ data: user });
            res.json(result);
        }).catch((e: ErrorEvent) => {
			console.log(e);
			res.json(e.message);
		});
    } else if (req.method === "GET") {
        const result = await prismaClient.user.findMany();
        res.json(result);
    }
};

export default create;
