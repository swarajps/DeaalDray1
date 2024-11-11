import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css'; // Ensure you're importing your styles here

const Editemp = () => {
  const { id } = useParams(); 
  console.log("Editemp component loaded with ID:", id); // Log to check if the page is loading
  const API_URL = 'http://localhost:5000';

  const [employeeDetails, setEmployeeDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    image: ''
  });

  const [file, setFile] = useState(null);  // For file upload (image)
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    image: "",
  });

  useEffect(() => {
    console.log("useEffect triggered for ID:", id); // Log inside useEffect to check if it's being triggered
    if (!id) {
      console.error('No ID in URL');
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employee/${id}`);
        console.log('Employee details fetched:', response.data); // Log the data to check if it's fetched
        if (response.data) {
          const employee = response.data;
          setEmployeeDetails({
            name: employee.f_Name,
            email: employee.f_Email,
            mobile: employee.f_Mobile,
            designation: employee.f_Designation,
            gender: employee.f_gender,
            course: employee.f_Course,
            image: employee.f_Image
          });
        } else {
          console.error('No data found for employee with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails({ ...employeeDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const fileValue = e.target.files[0];
    setFile(fileValue);
    const fileExtension = fileValue?.name.split(".").pop();
    if (!(fileExtension === "jpg" || fileExtension === "png")) {
      setErrors({ ...errors, image: "Please upload a jpg or png image." });
    } else {
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, designation, gender, course } = employeeDetails;

    if (!name || !email || !mobile || !designation || !gender || !course) {
      alert("Please fill out all fields.");
      return;
    }

    if (errors.email || errors.mobile || errors.image) {
      alert("Please correct the validation errors before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fileField', file);  // Append the file if selected
      formData.append('name', name);
      formData.append('email', email);
      formData.append('mobile', mobile);
      formData.append('designation', designation);
      formData.append('gender', gender);
      formData.append('course', course);
      formData.append('id', id);  // Send the employee ID to identify the record to update

      const response = await axios.post(`http://localhost:5000/editemp/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data === 'ok') {
        alert('Employee details updated successfully!');
        window.location.replace('/emplist');
      }
    } catch (error) {
      console.error('Error updating employee details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="htwo">
        <div>Home</div>
        <a style={{ textDecoration: "none", color: "black" }} href="#">Employee List</a>
        <div>Edit Employee</div>
        <a href="/">Logout</a>
      </div>

      <div className="hone">Edit Employee</div>
      <div className="addempflex">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={employeeDetails.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            value={employeeDetails.email}
            onChange={handleInputChange}
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="mobile">Mobile No</label>
          <input
            id="mobile"
            name="mobile"
            type="text"
            value={employeeDetails.mobile}
            onChange={handleInputChange}
          />
          {errors.mobile && <div style={{ color: "red" }}>{errors.mobile}</div>}
        </div>
        <div>
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            name="designation"
            type="text"
            value={employeeDetails.designation}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <input
            id="gender"
            name="gender"
            type="text"
            value={employeeDetails.gender}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="course">Course</label>
          <input
            id="course"
            name="course"
            type="text"
            value={employeeDetails.course}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="fileField"
            name="fileField"
            onChange={handleImageChange}
          />
          {errors.image && <div style={{ color: "red" }}>{errors.image}</div>}
        </div>
        <button className="btn" type="submit">
          Update Employee
        </button>
      </div>
    </form>
  );
};

export default Editemp;
