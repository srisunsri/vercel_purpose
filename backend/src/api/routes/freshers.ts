import express from "express";
import {
  fetchModules,
  markAsDone,
  signup
} from "../controllers/fresherController";
import { authMiddleware } from "../controllers/middleware";
import { enterQuestions, fetchQuestions } from "../controllers/questionController";

// Any endpoint here hits the /f/ endpoint

export const api = express();

api.post("/signup", signup);
api.use(authMiddleware);
api.get("/module", fetchModules);          // fetch modules that are assigned
api.get("/test", fetchQuestions);          // Fetch questions to answer
api.post("/test", enterQuestions);         // Respond to questions
api.post("/test/:moduleId", markAsDone);   // Marking modules as done
// api.get("/", getAllStudents);
// api.get("/:studentId", getSpecificStudent);
// api.get("/usn/:usn", getSpecificStudentByUsn);
// api.put("/:studentId", updateStudentDetails);
// api.get("/scores/:studentId", getSpecificStudentScores)
