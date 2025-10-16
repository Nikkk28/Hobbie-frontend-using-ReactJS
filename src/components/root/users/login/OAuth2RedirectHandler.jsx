import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthenticationService from "../../api/authentication/AuthenticationService";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const role = searchParams.get("role");

    if (token && username && role) {
      // Store token
      const bearerToken = `Bearer ${token}`;
      AuthenticationService.setUpToken(bearerToken);

      // Register user session
      if (role === "USER") {
        AuthenticationService.registerSuccessfulLoginUser(username);
        navigate("/user-home");
      } else if (role === "BUSINESS_USER") {
        AuthenticationService.registerSuccessfulLoginBusiness(username);
        navigate("/business-home");
      }
    } else {
      // Handle error
      navigate("/login?error=oauth");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <p>Processing login...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;