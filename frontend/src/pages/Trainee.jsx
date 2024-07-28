import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

const Trainee = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/f/module?id=${currentUser.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, [currentUser.id]);

  const allModulesCompleted = modules.every(module => module.completed);

  const handleTakeTest = () => {
    navigate("/trainee/test");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center">
        {modules.map((module) => (
          <div
            key={module.moduleId}
            className="m-4 p-4 border rounded-lg shadow-lg w-64 bg-white"
          >
            <img
              src="https://img-c.udemycdn.com/course/750x422/382300_f75b_3.jpg"
              alt="Module Thumbnail"
              className="w-full h-32 object-cover mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{module.moduleName}</h2>
            <p
              className={`text-lg ${
                module.completed ? "text-green-500" : "text-red-500"
              }`}
            >
              {module.completed ? "Completed" : "Not Completed"}
            </p>
          </div>
        ))}
      </div>
      {allModulesCompleted && (
        <button
          onClick={handleTakeTest}
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700"
        >
          Take Test
        </button>
      )}
    </div>
  );
};

export default Trainee;
