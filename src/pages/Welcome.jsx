import { useEffect, useState } from "react";
import { inputs } from "../utils/inputFormat";
import { inputPassword } from "../utils/inputFormat";

import LeftSide from "../components/leftSide";
import "./welcome.css";
import { Link, redirect } from "react-router-dom";
import FormInput from "../components/FormInput";
import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
// import dotenv from 'dotenv'

const Welcome = (props) => {
  const { Login } = props;
  const [login, setLogin] = useState(props.Login);
  const [values, setValues] = useState({
    username: "",
    email: "",
    lastName: "",
    firstName: "",
    password: "",
    comfirmPassword: "",
  });
  const [showLeftSide, setShowLeftSide] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [showError, setShowError] = useState(false)
  const [resp, setResp] = useState("");

  const loginURL = `${import.meta.env.VITE_API_LOGIN_URL}`;
  const registerURL = `${import.meta.env.VITE_API_REGISTER_URL}`;
  const loginWithGoogleURL = `${import.meta.env.VITE_API_LOGIN_WITH_GOOGLE_URL}`
  
  let newInputs;

  if (login) {
    newInputs = inputs.filter((input) => input.id === 3 || input.id === 4);
  } else {
    newInputs = inputs;
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleResize = () => {
    if (window.innerWidth <= 750) {
      setShowLeftSide(false);
    } else {
      setShowLeftSide(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(false)
    if (login) {
      axios
        .post(loginURL, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          console.log(response.data);
          setResp(`${response.data.message}`);
          <Redirect to="/email-verification" />
        })
        .catch((error) => {
          setResp(`${error.response.data.status}`)
          console.log(error)
        });
      
        setValues(
         { username: "",
          email: "",
          lastName: "",
          firstName: "",
          password: "",
          comfirmPassword: "",
         }
        )

    } else {
      axios
        .post(registerURL, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          user_role: "user",
        })
        .then((response) => {
          setResp(`${response.data.message}`);
          console.log(response.data, response.data.message);
        })
        .catch((error) => {
          setResp(`${error.response.data.message}`);
          console.log(error.response.data.message, error.response.data.success);
        });
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
  });

  return (
    <div className="welcomePage">
      <div className="loginContainer">
        {showLeftSide && <LeftSide />}

        <div className="login">
          <form onSubmit={handleSubmit}>
            <h1>{Login ? "Login" : "Get Started Now"}</h1>
           
            <div className="signOthers">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse.credential);
                  // axios
                  //   .post(loginWithGoogleURL, {
                  //     token: credentialResponse.credential
                  //   })
                  //   .then((response) => {
                  //     console.log(response.data);
                  //     setResp(`${response.data.message}`);
                  //   })
                  //   .catch((error) => console.log(error));
                  }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
            <p>
              {Login
                ? "Welcome back"
                : "Enter your credentials to signup with email"}
            </p>

            <div className={login ? "loginForm" : "registerForm"}>
            
                {newInputs.map((input) => (
                  <FormInput
                    loginForm={login}
                    key={input.id}
                    label={input.label}
                    {...input}
                    value={values[input.name]}
                    onChange={onChange}
                    showError={showError}
                  />
                ))}
              

              {/* password */}
              <>
                <FormInput
                  loginForm={login}
                  key={inputPassword[0].id}
                  id={inputPassword[0].id}
                  {...inputPassword[0]}
                  value={values[inputPassword[0].name]}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  showError={showError}
                />
                <span
                  className="passwordSpan"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "hide" : "show"}
                </span>
              </>

              {/* confirm password */}
              {!login && (
                <>
                  <FormInput
                    loginForm={login}
                    key={inputPassword[1].id}
                    id={inputPassword[1].id}
                    {...inputPassword[1]}
                    value={values[inputPassword[1].name]}
                    onChange={onChange}
                    type={showConPassword ? "text" : "password"}
                    showError={showError}
                  />
                  <span
                    className="passwordSpan"
                    onClick={() => setShowConPassword((prev) => !prev)}
                  >
                    {showConPassword ? "hide" : "show"}
                  </span>
                </>
              )}
            </div>

            <button className="Lgbutton"
            onClick={
              ()=> setShowError(true)
            }
            >Submit</button>
            {login ? (
              <Link
                to="/"
                className="loginLink"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Signup Here
              </Link>
            ) : (
              <Link
                to="/login"
                className="loginLink"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login Here
              </Link>
            )}
            <span>{resp}</span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
