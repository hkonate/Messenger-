import React from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    console.log("ok");
    setLoading(true);
    /* Delete error message at every submit */
    if (err) {
      setErr("");
    }
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      /************     Authentification     ***************/
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr("Something went wrong during authentification.");
      setLoading(false);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Messenger</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button disabled={loading}>sign in</button>
          {loading && !err && (
            <span>Authentification in progress, please wait...</span>
          )}
          {err && <span className="error">{err}</span>}
        </form>
        <p>
          you do not have an account ?<Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
