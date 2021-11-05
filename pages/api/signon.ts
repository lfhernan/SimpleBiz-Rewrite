// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { User } from "../../interfaces/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;
    const result: User = await prisma.user.create({
        data: {
            name: req.body.name,
			email: req.body.email
        },
    });
    res.json(result);
};

export default create;
