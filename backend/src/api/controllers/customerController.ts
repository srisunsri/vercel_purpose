import { Request, Response } from "express";
import prisma from "../../utils/db";
import multer from 'multer';


export const enterCustomerDetails = async (req: Request, res: Response) => {
	const { name, email, trainerId } = req.body;
	try {
		const result = await prisma.customer.create({
			data: {
				name,
				email: email,
				trainerId,
			},
		});

		if (!result) throw new Error("error adding customer");

		return res.status(200).json({ msg: "success!" });
	} catch (e: any) {
		return res.status(400).json({ msg: "error! bad request!" });
	}
};

export const sendData = async (req: Request, res: Response) => {
    const { userRole } = req;
    if (userRole !== "advanced")
        return res.status(403).json({ msg: "not authorized to send data!" });

    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        console.log("File uploaded! ", req.file);
        res.json({ message: 'File uploaded successfully', file: req.file });
    }
    catch (e: any) {
        if (e instanceof multer.MulterError) {
            return res.status(400).json({ msg: "Multer error: " + e.message });
        }
        return res.status(500).json({ msg: "Server error: " + e.message });
    }
};