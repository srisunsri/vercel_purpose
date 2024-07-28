import { Request, Response } from "express";
import prisma from "../../utils/db";

export const fetchQuestions = async (req: Request, res: Response) => {
	try {
		const response = await prisma.testQuestions.findMany({
			select: {
				id: true,
				question: true,
				optionA: true,
				optionB: true,
				optionC: true,
				optionD: true,
			},
		});
		return res.status(200).json(response);
	} catch (e: any) {
		console.log("question fetch catch : ", e.message);
		return res.status(400).json(e.message);
	}
};

export const enterQuestions = async (req: Request, res: Response) => {
	const userAnswers: Array<{
		questionId: string;
		option: number;
	}> = req.body;

	if (!userAnswers)
		return res.status(400).json({
			msg: "no data received!",
		});

	try {
		const questions = await prisma.testQuestions.findMany();
		const qAns = new Map<string, number>();
		questions.forEach((item) => qAns.set(item.id, item.answer));

		let score: number = 0;
		let totScore: number = 0;
		userAnswers.forEach((item) => {
			if (qAns.get(item.questionId) === item.option) score++;
			totScore++;
		});

		const rounded = (score / totScore) * 100;

		return res.status(200).json({
			marks: score,
			percentange: rounded.toFixed(2),
		});
	} catch (e: any) {
		return res.status(400).json({
			msg: "Error! " + e.message,
		});
	}
};
