// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prismaClient } from "../../../utils/prisma";

const bcrypt = require("bcrypt");

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const { email, password } = req.body;
            let userPassword = await prismaClient.user.findUnique({
                where: {
                    email: email,
                },
                select: {
                    password: true,
                },
            });

            if (!userPassword) {
                res.status(200).json(null);
            } else {
                bcrypt
                    .compare(password, userPassword?.password)
                    .then(async (result: boolean) => {
                        if (result) {
                            let userObect = await prismaClient.user.findUnique({
                                where: {
                                    email: email,
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            });
                            res.status(200).json(userObect);
                        } else {
                            res.status(200).json(null);
                        }
                    });
            }
        } catch (error) {
            res.json(error);
        }
    }
};

export default login;
