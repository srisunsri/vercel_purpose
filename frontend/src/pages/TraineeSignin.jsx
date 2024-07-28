import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { BACKEND_URL } from "../config";

export default function TraineeSignin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target && e.target.id) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BACKEND_URL}/api/signin?type=f`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      console.log(res)
      if (res.ok === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      localStorage.setItem("token", data.accessToken);
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/trainee");
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="px-16 max-w-lg mx-auto my-24">
      <h1 className="text-3xl sm:text-4xl text-center font-extrabold my-7">
        Trainee Sign In
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
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 font-medium mt-3"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <div className="flex gap-2 mt-3 justify-center items-center font-medium">
        <div>Don&apos;t have an account?</div>
        <Link to={"/trainee-signup"}>
          <span className="text-blue-700 hover:underline">Sign up</span>
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
