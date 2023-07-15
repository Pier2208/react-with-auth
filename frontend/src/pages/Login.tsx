import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setAuth({
        username: response.data.username,
        email: response.data.email,
        isLoggedIn: response.data.isLoggedIn,
        accessToken: response.data.accessToken,
      });

      resetForm();
      navigate("/home");
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <section className="w-full h-[calc(100vh-40px)] flex items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col w-96 bg-slate-50 px-4 py-4 rounded">
        <label className="text-slate-600" htmlFor="email">
          Email
        </label>
        <input
          ref={inputRef}
          className="p-1 mb-4 rounded focus:outline-emerald-300"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-slate-600" htmlFor="password">
          Password
        </label>
        <input
          className="p-1 mb-4 rounded focus:outline-emerald-300"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="my-4 p-1 rounded bg-emerald-300 text-white uppercase">
          Login
        </button>
      </form>
    </section>
  );
}
