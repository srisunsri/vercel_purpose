import { Request, Response } from "express";
import prisma from "../../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const { type } = req.query;
	const isFresher = type === "f";

	console.log(username, password, type, isFresher);

	if (username === "" || password === "")
		return res.status(400).json({ error: "missing data!" });

	if (isFresher) {
		try {
			const result = await prisma.fresher.findUnique({
				where: {
					username,
				},
			});

			if (!result || result.testScore) {
				return res.status(400).json({
					err: "no such user exists!",
				});
			}

			const match = await bcrypt.compare(password, result.password);
			console.log("Match is: ", match);

			if (match) {
				const token = jwt.sign(
					{
						id: result.id,
						userRole: "fresher",
						username: result.username,
					},
					process.env.JWT_SECRET as string,
					{ expiresIn: "6h" }
				);
				return res.status(200).json({
					accessToken: `${token}`,
					id: result.id,
					userRole: "fresher",
				});
			} else
				res.status(400).json({
					err: "invalid credentials!",
				});
		} catch (e: any) {
			return res.status(500).json({
				err: "error: " + e.message,
			});
		}
	} else {
		try {
			const result = await prisma.advanced.findUnique({
				where: {
					username
				}
			});
			if (!result) {
				return res.status(400).json({
					err: "no such user exists!",
				});
			}

			const match = await bcrypt.compare(password, result.password);
			console.log("Match is: ", match);

			if (match) {
				const token = jwt.sign(
					{
						id: result.id,
						userRole: "advanced",
						username: result.username,
					},
					process.env.JWT_SECRET as string,
					{ expiresIn: "6h" }
				);
				return res.status(200).json({
					accessToken: `${token}`,
					id: result.id,
					userRole: "advanced",
				});
			} else
				res.status(400).json({
					err: "invalid credentials!",
				});
		}
		catch (e: any) {
			return res.status(500).json({msg: "error! " + e.message});
		}
	}
};
