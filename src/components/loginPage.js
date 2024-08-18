import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "../App";
import "./ErrorPage.css";

const LoginPage = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailId, setEmailId] = useState("");
  const [selectedBike, setSelectedBike] = useState("");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setUsername("");
    setPassword("");
    setSelectedBike("");
  };

  useEffect(() => {
    localStorage.removeItem("selectedBike");
    localStorage.removeItem("username");
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
  }, []);

  const handleLogin = async () => {
    if ((!username || !password || !selectedBike) && currentPage === "login") {
      alert("Please fill in all fields.");
      return;
    }
    if ((!username || !password) && currentPage === "admin") {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const data = {
        Username: username,
        Password: password,
        selectedBike,
        currentPage,
      };
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        data
      );
      if (response.status === 200) {
        const { data: responseData } = response;
        const token = responseData.token;
        document.cookie = `token=${token}; path=/; Secure;`;
        localStorage.setItem("selectedBike", selectedBike);
        localStorage.setItem("username", username);
        if (currentPage === "admin") {
          history.push("/admin/home");
        } else {
          history.push("/user/home");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!emailId.includes("@") || !emailId.endsWith(".com")) {
      alert("Invalid email format.");
      return;
    }
    try {
      const data = {
        Username: username,
        UserPassword: password,
        Email: emailId,
      };
      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        data
      );
      if (response.status === 201) {
        alert("Username Already exists!");
      }
      if (response.status === 200) {
        alert("Registration successful!");
        setPassword("");
        setSelectedBike("");
        setCurrentPage("login");
      } else {
        console.log("user id and password doesn't exists");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderPage = () => {
    return (
      <div className="paper">
        <div className="container">
          {(() => {
            switch (currentPage) {
              case "login":
                return (
                  <>
                    <div className="centered-heading">
                      <h4>User Login</h4>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <select
                        className="form-control"
                        value={selectedBike}
                        onChange={(e) => setSelectedBike(e.target.value)}
                      >
                        <option value="">Select Bike</option>
                        <option value="Bike1">Bike1</option>
                        <option value="Bike2">Bike2</option>
                        <option value="Bike3">Bike3</option>
                      </select>
                      <button className="btn" onClick={handleLogin}>
                        Login
                      </button>
                      <div className="links">
                        <button
                          className="link-button"
                          onClick={() => handlePageChange("admin")}
                        >
                          Admin Login
                        </button>
                        <button
                          className="link-button"
                          onClick={() => handlePageChange("register")}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </>
                );
              case "admin":
                return (
                  <>
                    <div className="centered-heading">
                      <h4>Admin Login</h4>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button className="btn" onClick={handleLogin}>
                        Admin Login
                      </button>
                      <button
                        className="link-button"
                        onClick={() => handlePageChange("login")}
                      >
                        Back to User Login
                      </button>
                    </div>
                  </>
                );
              case "register":
                return (
                  <>
                    <div className="centered-heading">
                      <h4>User Registeration</h4>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email Id"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                      />
                      <button className="btn" onClick={handleRegister}>
                        Register
                      </button>
                      <button
                        className="link-button"
                        onClick={() => handlePageChange("login")}
                      >
                        Back to Login
                      </button>
                    </div>
                  </>
                );
              default:
                return <h6>Page not found</h6>;
            }
          })()}
        </div>
      </div>
    );
  };

  return <div>{renderPage()}</div>;
};

export default LoginPage;
