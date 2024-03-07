import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { authenticate } from "./auth";
import userpool from "./userpool";

const Login = () => {
//   const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const formInputChange = (formField, value) => {
    if (formField === "email") {
      setEmail(value);
    }
    if (formField === "password") {
      setPassword(value);
    }
  };

  const validation = () => {
    return new Promise((resolve, reject) => {
      if (email === "" && password === "") {
        setEmailErr("Email is Required");
        setPasswordErr("Password is required");
        resolve({
          email: "Email is Required",
          password: "Password is required",
        });
      } else if (email === "") {
        setEmailErr("Email is Required");
        resolve({ email: "Email is Required", password: "" });
      } else if (password === "") {
        setPasswordErr("Password is required");
        resolve({ email: "", password: "Password is required" });
      } else if (password.length < 6) {
        setPasswordErr("must be 6 character");
        resolve({ email: "", password: "must be 6 character" });
      } else {
        resolve({ email: "", password: "" });
      }
    });
  };

  const handleClick = () => {
    setEmailErr("");
    setPasswordErr("");
    validation()
      .then(
        (res) => {
          if (res.email === "" && res.password === "") {
            authenticate(email, password)
              .then(
                (data) => {
                  setLoginErr("");
                //   Navigate("/dashboard");
                },
                (err) => {
                  console.log(err);
                  setLoginErr(err.message);
                }
              )
              .catch((err) => console.log(err));
          }
        },
        (err) => console.log(err)
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="form">
        <div className="formfield">
          <input
            value={email}
            onChange={(e) => formInputChange("email", e.target.value)}
            label="Email"
          />
        </div>
        <div className="formfield">
          <input
            value={password}
            onChange={(e) => {
              formInputChange("password", e.target.value);
            }}
            type="password"
            label="Password"
          />
        </div>
        <div className="formfield">
          <button type="submit" onClick={handleClick}>
            Login
          </button>
        </div>
        <label>{loginErr}</label>
      </div>
    </div>
  );
};

export default Login;
