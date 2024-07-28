import express from "express";
import {
	signup
} from "../controllers/advancedController";
import { authMiddleware } from "../controllers/middleware";
import {
	customersDetails,
	freshersDetails,
	specificFresher,
} from "../controllers/fresherToTrainerController";

// Endpoint here hits the /api/t/ endpoint

export const api = express();


api.use(authMiddleware);
api.post("/signup", signup);							// Tranfer fresher to advanced
api.get("/freshers", freshersDetails);		// Fetch all fresher details
api.get("/freshers/:id", specificFresher);		// Fetch all fresher details for this id
api.get("/customers", customersDetails); 	// Fetch all customers under this guy


// api.get("/", getAllTeachers);
// api.get("/scores", getClassScores);
// api.get("/:teacherId", getSpecificTeacher);
// api.put("/:teacherId", updateTeacherDetails);
// api.post("/:teacherId/makeClassTeacher", makeClassTeacher);
// api.post("/uploadMarks", upload.single("file"), uploadMarks);
