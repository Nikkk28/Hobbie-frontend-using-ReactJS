import React from "react";
import Footer from "../../fragments/footer/Footer";
import Background from "../../fragments/background/Background";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../../../api/authentication/AuthenticationService";
import LoginService from "../../../../api/login/LoginService";
import styles from "../../../../css/Forms.module.css";
import style from "../../../../css/Footer.module.css";
import { Link } from "react-router-dom";
import AuthenticateUserDataService from "../../../../api/authentication/AuthenticateUserDataService";
import LoadingDotsDark from "./animation/LoadingDotsDark";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [loginState, setLoginState] = useState({
    hasLoginFailed: false,
    showSuccessMessage: false,
  });

  const validate = () => {
    const errors = {};

    if (!credentials.username) {
      errors.username = "Username required";
    } else if (credentials.username.length < 4) {
      errors.username = "Minimum 4 characters";
    }

    if (!credentials.password) {
      errors.password = "A password is required";
    }

    return errors;
  };

  const loginClicked = async (event) => {
    event.preventDefault();
    let errors = validate(credentials);
    setErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const res = await AuthenticateUserDataService(
        credentials.username,
        credentials.password
      );

      if (res.status !== 200) {
        setLoading(false);
        setLoginState((prevState) => ({ ...prevState, hasLoginFailed: true }));
        setLoginState((prevState) => ({
          ...prevState,
          showSuccessMessage: false,
        }));
      } else {
        let jwtToken = res.data.jwtToken;
        const token = `Bearer ${jwtToken}`;
        AuthenticationService.setUpToken(token);
        const response = await LoginService(credentials.username, jwtToken);
        
        if (response.status !== 200) {
          setLoading(false);
          setLoginState((prevState) => ({
            ...prevState,
            hasLoginFailed: true,
          }));
          setLoginState((prevState) => ({
            ...prevState,
            showSuccessMessage: false,
          }));
        } else if (response.data === "USER") {
          AuthenticationService.registerSuccessfulLoginUser(
            credentials.username
          );
          navigate("/user-home");
        } else if (response.data === "BUSINESS_USER") {
          AuthenticationService.registerSuccessfulLoginBusiness(
            credentials.username
          );
          navigate("/business-home");
        }
      }
    }
  };

  const handleOAuthLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <main>
        <form className={styles.form_style}>
          <div className={styles.loginh1}>
            <h1>Login</h1>
          </div>
          <div className={styles.login}>
            {loginState.hasLoginFailed && (
              <div className={styles.midErrors}> Invalid credentials</div>
            )}
            {loginState.showSuccessMessage && (
              <div className={styles.midErrors}>Login successful</div>
            )}
          </div>

          <div className={styles.form_field}>
            <input
              id="username"
              type="text"
              name="username"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
            <label htmlFor="username" className={styles.label_name}>
              {Object.keys(errors).length === 0 && (
                <span className={styles.content_name}>Username</span>
              )}
              {errors.username && (
                <small className={styles.errors}>{errors.username}</small>
              )}
            </label>
          </div>

          <div className={styles.form_field}>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
            <label htmlFor="password" className={styles.label_name}>
              {Object.keys(errors).length === 0 && (
                <span className={styles.content_name}>Password</span>
              )}
              {errors.password && (
                <small className={styles.errors}>Password required</small>
              )}
            </label>
          </div>
          <p>
            <Link
              to="/change-password"
              className={styles.button_password_forgot}
            >
              Forgot your password?
            </Link>
          </p>
          {loading && <LoadingDotsDark className={styles.dots} />}  
          {!loading && (
            <>
              <button className={styles.button} onClick={loginClicked}>
                Login
              </button>
              
              {/* OAuth Login Button */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p style={{ color: "#595f6e", marginBottom: "10px" }}>Or</p>
                <button
                  type="button"
                  className={styles.oauth_button}
                  onClick={handleOAuthLogin}
                  style={{
                    backgroundColor: "#4285F4",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    margin: "0 auto"
                  }}
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#000" fillRule="evenodd">
                      <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
                      <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
                      <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"/>
                      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"/>
                    </g>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </>
          )}
        </form>
      </main>
      <Footer class={style.footer_cover} />
      <Background />
    </>
  );
};

export default Login;