import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Styles from "./style.css";
import Logo from "./unnamed.png";

const API_URL = "http://localhost:5000";

const Header = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("log_id"); // Get the user ID from localStorage

        if (storedUserId) {
          const response = await axios.post(`${API_URL}/dashboard`, {
            log_id: storedUserId, // Use storedUserId here
          });

          if (response.data) {
            setUserData(response.data);
            console.log(userData);
          } else {
            setError("User data not found.");
          }
        } else {
          setError("User data not found in localStorage.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <form>
      <div className="htwo">
        <img style={{ width: "75px", height: "20px" }} src={Logo} alt="Logo" />
        <Link style={{ textDecoration: "none", color: "black" }} to="/dashboard">
          Home
        </Link>
        <Link style={{ textDecoration: "none", color: "black" }} to="/emplist">
          Employee List
        </Link>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {userData && <div>{userData.f_Name}</div>}

        <a href="/">Logout</a>
      </div>
    </form>
  );
};

export default Header;
