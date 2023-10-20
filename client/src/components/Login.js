import React, { useEffect } from "react";

const Login = ({ setIsAuthenticated, isAuthenticated }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("http://localhost:3000/api/current-user", {
        credentials: "include",
      });
      const { user } = await response.json();

      if (user) {
        setIsAuthenticated(user);
      }
    };

    if (isAuthenticated === null) {
      checkAuth();
    }
  }, []);

  const authenticateUser = async () => {
    window.location.href = "http://localhost:3000/api/auth";
  };

  return (
    <div>
      <button onClick={authenticateUser}>connect with QBO</button>
    </div>
  );
};

export default Login;
