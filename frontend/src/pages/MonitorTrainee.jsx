import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import 'tailwindcss/tailwind.css';

const MonitorTrainee = () => {
  const [freshers, setFreshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreshers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/t/freshers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch freshers");
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setFreshers(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshers();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/trainee-info/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center p-4 bg-gray-100 min-h-screen">
      {freshers.map((fresher) => !fresher.testScore && (
        <div
          key={fresher.id}
          className="m-4 p-6 border border-gray-300 rounded-lg shadow-lg bg-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
          onClick={() => handleCardClick(fresher.id)}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">{fresher.name}</h2>
          <p className="text-lg text-gray-600 mb-4 md:mb-6">{fresher.email}</p>
          <div className="flex justify-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonitorTrainee;
