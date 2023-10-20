import React, { useEffect } from "react";
import logo from "../logo.svg";

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
  }, [isAuthenticated, setIsAuthenticated]);

  const authenticateUser = async () => {
    window.location.href = "http://localhost:3000/api/auth";
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <img className="w-[400px] h-[300px]" src={logo} alt="logo" />
      <button
        type="button"
        onClick={authenticateUser}
        className="text-white shadow-2xl -mt-16 w-72 bg-[#24292F] hover:bg-[#24292F]/90 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center hover:text-gray-900 dark:hover:bg-[#050708]/30 mr-2 mb-2"
      >
        <svg
          fill="none"
          height="35"
          width="35"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          className="mr-4"
        >
          <path
            d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64z"
            fill="#2ca01c"
          />
          <path
            d="M17.778 64a24.889 24.889 0 0 0 24.889 24.889h3.555v-9.245h-3.555a15.645 15.645 0 1 1 0-31.289H51.2v48.356a9.248 9.248 0 0 0 9.244 9.245V39.111H42.667A24.889 24.889 0 0 0 17.777 64zm67.555-24.889h-3.555v9.245h3.555a15.645 15.645 0 0 1 0 31.288H76.8V31.29a9.244 9.244 0 0 0-9.244-9.245V88.89h17.777a24.888 24.888 0 0 0 0-49.778z"
            fill="#fff"
          />
        </svg>
        Connect with Quickbooks
      </button>
    </div>
  );
};

export default Login;
