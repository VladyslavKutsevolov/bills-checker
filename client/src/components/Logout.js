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
    <div className="flex justify-end">
      <button
        type="button"
        onClick={logout}
        className="text-gray-900 mt-4 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-900 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
