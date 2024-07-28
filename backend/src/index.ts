import express from "express";
import { api as indexRouter } from "./api/routes/index";
import cors from "cors";

const api = express();


api.use(cors({
	origin: ["https://bpf.vercel.app"],
	methods: ["POST", "GET"],
	credentials: true
}));
api.use(express.json());
api.use(indexRouter);

const HOST = "localhost";
const PORT = 3000;
api.listen(PORT, () =>
	console.log(`Server up and running on PORT ${PORT} & HOST ${HOST}`)
);
