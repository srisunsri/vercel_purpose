import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import "tailwindcss/tailwind.css";

const TraineeInfo = () => {
	const { id } = useParams();
	const [fresher, setFresher] = useState({});
	const [modules, setModules] = useState([]);

	useEffect(() => {
		const fetchFresher = async () => {
			const res = await fetch(`${BACKEND_URL}/api/t/freshers?id=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
			const data = await res.json();
			setFresher(data);
		};

		const fetchModules = async () => {
			const res = await fetch(`${BACKEND_URL}/api/t/freshers/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
			const data = await res.json();
			setModules(data);
		};

		fetchFresher();
		fetchModules();
	}, [id]);

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-4">{fresher.name}</h2>
				<p className="text-lg mb-4">{fresher.email}</p>
				<div className="flex flex-wrap justify-center">
					{modules &&
						modules.length &&
						modules.map((item, ind) => (
							<div
								key={ind}
								className="m-4 p-4 border rounded-lg shadow-lg w-64 bg-white"
							>
								<h2 className="text-xl font-bold mb-2">{item.Modules.moduleName}</h2>
								<p
									className={`text-lg ${
										item.completed ? "text-green-500" : "text-red-500"
									}`}
								>
									{item.completed ? "Completed" : "Not Completed"}
								</p>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default TraineeInfo;
