import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const newUser = {
    Email: email,
    Passwords: password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8000/api/v1/login", newUser)
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          navigate("/admin");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div>
        <h3>SIGN IN</h3>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name=""
            id=""
          />
          <label htmlFor="email">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name=""
            id=""
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </>
  );
}
