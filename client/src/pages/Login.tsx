import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { api } from "../utils/api";
import { setAuthToken } from "../utils/auth";
import "./../index.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/events";

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      setAuthToken(response.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={login} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
