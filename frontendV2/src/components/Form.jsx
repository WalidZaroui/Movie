import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import backgroundImage from "../assets/img/Background.jpg"; // Import the image
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function Form({ route, method }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData =
      method === "login"
        ? { username: formData.username, password: formData.password }
        : {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

    const fullApiUrl = `${api.defaults.baseURL}${route}`;

    try {
      console.log("Sending request to:", fullApiUrl);
      console.log("Request data:", requestData);

      const res = await api.post(route, requestData);
      console.log("Response:", res);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("API call error:", error);
      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        errorMessage = `Error: ${
          error.response.data.detail || "An error occurred."
        }`;
      } else if (error.request) {
        errorMessage =
          "Error: No response from the server. Please check your network connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      alert(`${errorMessage}\nAPI URL: ${fullApiUrl}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg w-3/4 max-w-lg bg-black bg-opacity-75"
      >
        <h1 className="text-4xl font-bold mb-10 text-white">{name}</h1>
        {method === "register" && (
          <>
            <input
              className="form-input w-3/4 p-2 mb-4 border text-white rounded border-black hover:border-white"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.60)", // Semi-transparent black background
              }}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              className="form-input w-3/4 p-2 mb-4 border bg-black  text-white  rounded border-black hover:border-white "
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.60)", // Semi-transparent black background
              }}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              className="form-input w-3/4 p-2 mb-4 border bg-black  text-white  rounded border-black hover:border-white"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.60)", // Semi-transparent black background
              }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </>
        )}
        <input
          className="form-input w-3/4 p-2 mb-4 border bg-black  text-white  rounded border-black hover:border-white"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.60)", // Semi-transparent black background
          }}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <div className="relative w-3/4 mb-4">
          <input
            className="form-input w-full p-2 border bg-black text-white rounded border-black hover:border-white pr-10"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.60)", // Semi-transparent black background
            }}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {loading && <LoadingIndicator />}
        <button
          className="w-3/4 p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200"
          type="submit"
        >
          {name}
        </button>
        <div className="mt-4 text-white">
          {method === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-red-500 hover:underline">
                Login
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Form;