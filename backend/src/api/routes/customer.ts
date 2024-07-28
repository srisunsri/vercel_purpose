import express from "express";
import { authMiddleware } from "../controllers/middleware";
import { enterCustomerDetails, sendData } from "../controllers/customerController";
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
export const api = express();

// /api/c/
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "extras/"); // Directory to save the uploaded files
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`); // Use the current timestamp + original filename
	},
});

const upload = multer({ storage: storage });

api.use(authMiddleware);
api.post("/", enterCustomerDetails); // enter customer details

api.post("/upload", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const form = new FormData();
        
        // Append the file
        form.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        
        // Append other form fields
        Object.keys(req.body).forEach(key => {
            form.append(key, req.body[key]);
        });

        const response = await axios.post('http://127.0.0.1:5000/analyze_report', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        res.json(response.data);

        // Clean up: delete the temporary file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
        });
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});