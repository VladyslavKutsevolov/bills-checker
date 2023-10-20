import "./App.css";
import { useState } from "react";
import Login from "./components/Login";
import Logout from "./components/Logout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [bills, setBills] = useState(null);
  const [message, setMessage] = useState(null);

  const checkBills = async () => {
    const response = await fetch("http://localhost:3000/api/check-bills", {
      credentials: "include",
    });
    const { message, bills } = await response.json();

    if (message) {
      setMessage(message);
    }

    if (bills) {
      setBills(bills);
    }
  };

  return (
    <div className="App">
      {isAuthenticated === null ? (
        <Login
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <div>
          <Logout setIsAuthenticated={setIsAuthenticated} />
          <h1>Bills Checker</h1>
          {message && <p>{message}</p>}
          <button onClick={checkBills}>check bills</button>
        </div>
      )}
    </div>
  );
}

export default App;
