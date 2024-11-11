import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Styles from "./style.css";
import Logo from "./unnamed.png";
import Header from "./Header";

const API_URL = "http://localhost:5000"; // Backend API URL

const Emplist = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/emplist`);
        console.log("Fetched employee data:", response.data);

        setEmployees(response.data); // Update the employees state with fetched data
        setFilteredEmployees(response.data); // Initially, set filteredEmployees to all employees
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    fetchEmployees();
  }, []);
  const handleSort = () => {
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      if (sortCriteria === "name") {
        return a.f_Name.localeCompare(b.f_Name);
      } else if (sortCriteria === "email") {
        return a.f_Email.localeCompare(b.f_Email);
      } else if (sortCriteria === "date") {
        return new Date(a.createDate) - new Date(b.createDate);
      }
      return 0;
    });
    setFilteredEmployees(sortedEmployees);
  };

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
    const filtered = employees.filter(
      (employee) =>
        employee.f_Name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        employee.f_Email
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = () => {
    navigate("/addemp"); // Navigate to /addemp
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        console.log("Attempting to delete employee with ID:", id);
        const response = await axios.delete(
          `http://localhost:5000/deleteemp/${id}`
        );
        
        if (response.data === "ok") {
          alert("Employee deleted successfully!");
          window.location.replace("/emplist");  // Redirect to employee list after deletion
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("There was an error deleting the employee.");
      }
    }
  };
  

  return (
    <form>
      <Header />
      <div className="hone">Employee List</div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>Total Count: {employees.length}</div>
        <button className="btn" type="button" onClick={handleCreateEmployee}>
          Create Employees
        </button>
      </div>

      <div className="hthree">
        <button type="submit">Search</button>
        <input
          style={{ width: "300px" }}
          type="text"
          value={searchKeyword}
          onChange={handleSearch}
          placeholder="Enter Search Keyword"
        />
        <select
          onChange={(e) => setSortCriteria(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="date">Create Date</option>
        </select>
        <button
          type="button"
          onClick={handleSort}
          style={{ marginLeft: "10px" }}
        >
          Sort
        </button>
      </div>

      <div className="hfour">
        <table style={{ display: "table", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "rgb(220,220,220)" }}>
              <th>Unique ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.f_Id}</td>
                <td>
                  <img
                    src={`${API_URL}/images/${employee.f_Image}`}
                    alt="Photo"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{employee.f_Name}</td>
                <td>{employee.f_Email}</td>
                <td>{employee.f_Mobile}</td>
                <td>{employee.f_Designation}</td>
                <td>{employee.f_gender}</td>
                <td>{employee.f_Course}</td>
                <td>{new Date(employee.f_Createdate).toLocaleDateString()}</td>
                <td>
                  <Link to={`/editemp/${employee._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(employee._id)}> Delete
                    Employee
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default Emplist;
