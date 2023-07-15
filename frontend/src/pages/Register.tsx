import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });
      resetForm();
      navigate("/");
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <section className="w-full h-[calc(100vh-40px)] flex items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col w-96 bg-slate-50 px-4 py-4 rounded">
        <label className="text-slate-600" htmlFor="username">
          Username
        </label>
        <input
          ref={inputRef}
          className="p-1 mb-4 rounded focus:outline-emerald-300"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-slate-600" htmlFor="email">
          Email
        </label>
        <input
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
          Create account
        </button>
      </form>
    </section>
  );
}
