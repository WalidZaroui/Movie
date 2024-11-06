import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";



function Form({ route, method }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        alert("API Base URL: " + import.meta.env.VITE_API_URL);
        e.preventDefault();
        setLoading(true);

        const requestData = method === "login"
            ? { username, password }
            : { first_name: firstName, last_name: lastName, username, email, password };

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
            let errorMessage = 'An error occurred. Please try again.';

            if (error.response) {
                errorMessage = `Error: ${error.response.data.detail || 'An error occurred.'}`;
            } else if (error.request) {
                errorMessage = 'Error: No response from the server. Please check your network connection.';
            } else {
                errorMessage = `Error: ${error.message}`;
            }

            alert(`${errorMessage}\nAPI URL: ${fullApiUrl}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {method === "register" && (
                <>
                    <input
                        className="form-input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                    />
                    <input
                        className="form-input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                    />
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </>
            )}
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
