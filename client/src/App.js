import "./App.css";
import { useState } from "react";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Table from "./components/Table";
import Loader from "./components/Loader";
import Alert from "./components/Alert";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [bills, setBills] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBills = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/check-bills", {
        credentials: "include",
      });
      const { message, bills } = await response.json();

      setLoading(false);

      if (message) {
        setMessage(message);
      }

      if (bills) {
        setBills(bills);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-7xl flex justify-center items-center mx-auto">
      {isAuthenticated === null ? (
        <Login
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <div className="w-full h-full">
          <Logout setIsAuthenticated={setIsAuthenticated} />
          <h1 className="text-7xl">Bills Checker</h1>
          <button
            disabled={loading}
            type="button"
            onClick={checkBills}
            className="text-white outline-none mt-4 bg-blue-700 hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 inline-flex items-center"
          >
            Check Bills
            <Loader show={loading} />
          </button>
          {message && <Alert message={message} />}
          <Table bills={bills} />
        </div>
      )}
    </div>
  );
}

export default App;
