import Head from "next/head";
import styles from "@/styles/Auth.module.css";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { setCookie } from "nookies";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = qs.stringify(credentials);
    const resp = await axios.post("http://127.0.0.1:8000/user/login", data);
    if (resp.data["success"]) {
      alert("Hola de nuevo");
      setCookie(null, "session_token", resp.data["session_token"], {
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      setCookie(null, "access_token", resp.data["access_token"], {
        path: "/",
        maxAge: 15 * 60,
      });
    } else {
      alert(resp.data["msg"]);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Taskify</title>
      </Head>
      <div className="wrapper">
        <div className="logo">Taskify</div>

        <div className={styles.login}>
          <h2>Log In</h2>
          <form onSubmit={handleSubmit} method="post">
            <input
              type="text"
              name="username"
              id=""
              placeholder="Username"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              id=""
              placeholder="Password"
              onChange={handleChange}
            />

            <button type="submit">Login</button>
          </form>
          <div className={styles.border_login}></div>
          <button className={styles.btn_register}>Register</button>
        </div>
      </div>
    </>
  );
}
