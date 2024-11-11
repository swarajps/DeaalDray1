import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import Styles from "./style.css";
import Logo from "./unnamed.png";

const API_URL = 'http://localhost:5000';

const Dashboard = () => {
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
      <Header></Header>
      <div className="hone">Dashboard</div>
      <div style={{ position: "relative", left: "500px", top: "200px" }}>
        Welcome to Admin Dashboard
      </div>
    </form>
  );
};

export default Dashboard;
