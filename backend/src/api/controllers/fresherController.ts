import { Request, Response } from "express";
import prisma from "../../utils/db";
import bcrypt from "bcrypt";
import { FresherModules, Modules } from "@prisma/client";

export const signup = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const exists = await prisma.fresher.findFirst({
			where: {
				email,
			},
		});

		if (exists)
			return res.status(400).json({
				err: "user already exists!",
			});

		const result = await prisma.fresher.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		if (!result) {
			return res.status(401).json({
				err: "couldn't add to the database",
			});
		}

		const modules: Array<Modules> = await prisma.modules.findMany();

		let toResolve: Array<Promise<FresherModules>> = [];
		for (let i = 0; i < modules.length; i++) {
			const temp = prisma.fresherModules.create({
				data: {
					fresherId: result.id,
					moduleId: modules[i].id,
				},
			});

			toResolve.push(temp);
		}

		Promise.all([...toResolve]);

		console.log("DONE");

		return res.status(200).json({ msg: "Success!" });
	} catch (err: any) {
		return res.status(500).json({
			err: "internal server error" + err.message,
		});
	}
};

export const fetchModules = async (req: Request, res: Response) => {
	const { id } = req.query;

	if (!id) return res.status(400).json({ msg: "no id found!" });

	try {
		const result = await prisma.fresherModules.findMany({
			where: {
				fresherId: id as string,
			},
			include: {
				Modules: true,
			},
		});
		const response = result.map((item) => ({
			moduleId: item.moduleId,
			moduleName: item.Modules.moduleName,
			completed: item.completed,
		}));

		return res.status(200).json(response);
	} catch (e: any) {
		res.status(400).json({ msg: "Error in fetching data!" });
	}
};

export const markAsDone = async (req: Request, res: Response) => {
	const moduleId = req.params.moduleId;
	const { id } = req;

	if (!moduleId || !id)
		return res.status(400).json({ msg: "missing data bro!" });

	try {
		const result = await prisma.fresherModules.update({
			where: {
				fresherId_moduleId: {
					fresherId: id,
					moduleId,
				},
			},
			data: {
				completed: true,
			},
		});

		if (!result) throw new Error("couldn't add data!");

		return res.json({ msg: "Success!" });
	} catch (e: any) {
		return res.status(400).json({ msg: "Error! " + e.message });
	}

	return res.json({ msg: "GGs" });
};



// export const getAllStudents = async (req: Request, res: Response) => {
// 	const { userRole } = req;

// 	if (!userRole || userRole === "student")
// 		return res.status(403).json({ err: "not authorized!" });

// 	let studs: Array<object>;
// 	try {
// 		if (userRole === "teacher") {
// 			studs = await prisma.student.findMany({
// 				select: {
// 					name: true,
// 					email: true,
// 					usn: true,
// 				},
// 			});
// 		} else {
// 			studs = await prisma.student.findMany({
// 				include: {
// 					studentDetails: true,
// 				},
// 			});
// 			if (!studs.length)
// 				return res.status(404).json({
// 					err: "no students found!",
// 				});
// 		}
// 		return res.status(200).json(studs);
// 	} catch (e: any) {
// 		return res.status(400).json({
// 			err: "error occured: " + e.message,
// 		});
// 	}
// };
