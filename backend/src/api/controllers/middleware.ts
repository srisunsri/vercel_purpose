import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

interface CustomJwtPayload extends JwtPayload {
	id: string;
}

declare module "express-serve-static-core" {
	interface Request {
		userRole?: string;
		id: string;
	}
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization || "";

	try {
		const jwtToken = token.split(" ")[1];
		const response = jwt?.verify(
			jwtToken,
			process.env.JWT_SECRET as string
		) as CustomJwtPayload;
		
		console.log("RESPONSE IS: ", response);	
			
		req.userRole = response.userRole;	
		req.id = response.id;	
			
		if (response.userRole && response.id) {
			next();
		} else {
			return res.json({
				err: "not authorized",
			});
		}
	} catch (e: any) {
		return res.status(403).json({
			err: "not authorized",
		});
	}
}
