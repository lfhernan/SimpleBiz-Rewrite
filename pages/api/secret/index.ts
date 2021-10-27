import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        res.send({
            content: "Welcome",
        });
    } else {
        res.send({
            error: "Unauthorized",
        });
    }
};
