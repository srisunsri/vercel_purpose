import { Request, Response } from "express";
import prisma from "../../utils/db";

export const freshersDetails = async (req: Request, res: Response) => {
	const { userRole } = req;
	if (userRole !== "advanced")
		return res.status(403).json({ msg: "you are not authorized!" });

	try {
		const data = await prisma.fresher.findMany();
		console.log("DATA IS: ", data);
		
		if (!data) return res.status(404).json({ msg: "no data found!" });
		res.status(200).json(data);
	} catch (e: any) {
		console.log(e.message);
		return res.status(400).json(e.message);
	}
};

export const specificFresher = async (req: Request, res: Response) => {
	const { userRole } = req;
	if(userRole !== "advanced") return res.status(403).json({msg: "you are not authorized!"});
	const { id } = req.params;

	try {
		const response = await prisma.fresherModules.findMany({
			where: {
				fresherId: id
			},
			include: {
				Modules: true
			}
		});

		console.log("RESPONSE IS LMAOOO: ", response);
		

		if(!response) throw new Error("No user found!");
		res.status(200).json(response);
	}
	catch(e: any) {
		return res.status(500).json({msg: "error! " + e.message});
	}
}

export const customersDetails = async (req: Request, res: Response) => {
	const { userRole, id } = req;

	if (userRole !== "advanced") {
		return res.status(403).json({ msg: "you are not authorized!" });
	}

	try {
		const data = await prisma.customer.findMany({
			where: {
				trainerId: id
			}
		});
        console.log(data)

		if (!data) {
			return res.status(404).json({ msg: "no trainer found!" });
		}

		res.status(200).json(data);
	} catch (e: any) {
		console.error(e.message);
		return res.status(400).json({ msg: e.message });
	}
};
