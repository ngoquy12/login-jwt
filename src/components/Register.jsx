import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const newUser = {
    Email: email,
    Passwords: password,
    Roles: 1,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8000/api/v1/register", newUser)
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h3>SIGN UP</h3>
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
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
