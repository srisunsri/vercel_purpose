import { Request, Response } from "express";
import prisma from "../../utils/db";
import { Fresher } from "@prisma/client";

export const signup = async (req: Request, res: Response) => {
	const { fresherId } = req.body;

	let existingUser: Fresher | null = null;
	try {
		existingUser = await prisma.fresher.findUnique({
			where: { id: fresherId },
		});
		if (!existingUser)
			return res.status(400).json({ msg: "fresher doesn't exist!" });
		if (!existingUser.testScore)
			return res
				.status(400)
				.json({ msg: "please pass the test first, you noob!" });
	} catch (e: any) {
		res.status(500).json({ message: e.message });
	}

	try {
		const exists = await prisma.advanced.findFirst({
			where: {
				id: existingUser?.id,
			},
		});

		if (exists)
			return res.status(400).json({ error: "user already registered!" });
		const result = await prisma.advanced.create({
			data: {
				username: existingUser?.username as string,
				email: existingUser?.email as string,
				password: existingUser?.password as string,
				fresherId: existingUser?.id as string,
			},
		});

		return res.status(200).json({
			msg: "Success",
		});
	} catch (err: any) {
		console.log(err);

		return res.status(500).json({
			err: "internal server error" + err.message,
		});
	}
};

export const getChartData = async (req: Request, res: Response) => {
	const { userRole } = req;
	if (userRole !== "advanced")
		return res.status(403).json({ msg: "you are not trainer" });

	const { id } = req.query;
	if (!id)
		return res
			.status(400)
			.json({ msg: "no id found, please send that also noob" });

	
};
