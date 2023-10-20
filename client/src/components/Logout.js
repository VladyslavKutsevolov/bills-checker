import React from "react";

const Logout = ({ setIsAuthenticated }) => {
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        credentials: "include",
      });
      setIsAuthenticated(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Logout;
