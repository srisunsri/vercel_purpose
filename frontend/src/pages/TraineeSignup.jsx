import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BACKEND_URL } from "../config";

export default function TraineeSignup() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/f/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        return;
      }

      navigate("/trainee-signin");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="px-16 max-w-lg mx-auto my-24">
      <h1 className="text-3xl sm:text-4xl text-center font-extrabold my-7">
        Trainee Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 font-semibold mt-3"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-2 mt-3 justify-center items-center font-medium">
        <div>Have an account?</div>
        <Link to={"/trainee-signin"}>
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
      {error && (
        <div className="text-red-500 mt-5 text-center font-semibold">
          {error}
        </div>
      )}
    </div>
  );
}
