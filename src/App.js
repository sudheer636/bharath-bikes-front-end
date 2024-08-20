import "./App.css";
import React from "react";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/loginPage";
import ErrorPage from "./components/ErrorPage";
import UserHomePage from "./components/User/UserHomePage";
import AdminHomePage from "./components/Admin/AdminHomePage";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();
export const baseUrl = "http://localhost:3001";

function App() {
  return (
      <HistoryRouter history={history}>
          <div className="body-div">
            <Routes>
              <Route path="/" element={<Navigate replace to="/api/auth/login" />} />
              <Route path="/api/auth/login" element={<LoginPage />} />
              <Route path="/api/user/home" element={<UserHomePage />} />
              <Route path="/api/admin/home" element={<AdminHomePage />} />
              <Route path="/api/timeout" element={<ErrorPage />} />
            </Routes>
        </div>
      </HistoryRouter>
  );
}

export default App;
