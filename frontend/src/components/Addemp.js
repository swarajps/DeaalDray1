import React, { useState } from "react";
import Styles from "./style.css";
import Logo from "./unnamed.png";
import validator from "validator";
import axios from "axios"; 

const API_URL = 'http://localhost:5000';


const Addemp = () => {
  const [formFields, setFormFields] = useState({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          course: '',
  })
  const [file, setFile] = useState(null); 
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // const handleEmailChange = (e) => {
  //   const emailValue = e.target.value;
  //   setEmail(emailValue);
  //   if (!validator.isEmail(emailValue)) {
  //     setErrors({ ...errors, email: "Please enter a valid email." });
  //   } else {
  //     setErrors({ ...errors, email: "" });
  //   }
  // };

  // const handleMobileChange = (e) => {
  //   const mobileValue = e.target.value;
  //   setMobile(mobileValue);
  //   if (!/^\d+$/.test(mobileValue)) {
  //     setErrors({ ...errors, mobile: "Mobile number must be numeric." });
  //   } else {
  //     setErrors({ ...errors, mobile: "" });
  //   }
  // };

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

  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !name ||
  //     !email ||
  //     !mobile ||
  //     !designation ||
  //     !gender ||
  //     !course ||
  //     !file
  //   ) {
  //     alert("Please fill out all fields.");
  //     return;
  //   }

  //   if (errors.email || errors.mobile || errors.image) {
  //     alert("Please correct the validation errors before submitting.");
  //     return;
  //   }

  //   // Create formData and append the fields
  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("mobile", mobile);
  //   formData.append("designation", designation);
  //   formData.append("gender", gender);
  //   formData.append("course", course);
  //   formData.append("image", file); // Append the image file

  //   try {
  //     // Send POST request to the backend to add the employee
  //     const response = await axios.post(`${API_URL}/addemp`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.data === "ok") {
  //       alert("Employee added successfully!");
  //       window.location.replace("/admin/EmployeeManagement");
  //     }
  //   } catch (error) {
  //     console.error("Error adding employee:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fileField', file);
    for (const key in formFields) {
      formData.append(key, formFields[key]);
    }

    try {
      const response = await axios.post(`${API_URL}/addemp`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data === 'ok') {
        alert('Employee added successfully:', response.data);
        window.location.replace('/emplist');
      }
    } catch (error) {
      console.error('Error adding Employee:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="htwo">
        <img style={{ width: "75px", height: "20px" }} src={Logo} alt="Logo" />
        <div>Home</div>
        <a style={{ textDecoration: "none", color: "black" }} href="#">
          Employee List
        </a>
        <div>name</div>
        <a href="/">Logout</a>
      </div>
      <div className="hone">Employee List</div>
      <div className="addempflex">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formFields.name} onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={formFields.email} onChange={handleInputChange} />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="mobile">Mobile No</label>
          <input type="text" id="mobile" name="mobile" value={formFields.mobile} onChange={handleInputChange} />
          {errors.mobile && <div style={{ color: "red" }}>{errors.mobile}</div>}
        </div>
        <div>
          <label htmlFor="designation">Designation</label>
          <input
          id="designation" name="designation"
            type="text"
            value={formFields.designation}
            onChange={handleInputChange}          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <input
          id="gender" name="gender"
            type="text"
            value={formFields.gender}
            onChange={handleInputChange}          />
        </div>
        <div>
          <label htmlFor="course">Course</label>
          <input
          id="course" name="course"
            type="text"
            value={formFields.course}
            onChange={handleInputChange}          />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input type="file" id="fileField" name="fileField" onChange={handleImageChange} />
          {errors.image && <div style={{ color: "red" }}>{errors.image}</div>}
        </div>
        <button className="btn" type="submit">
          Add Employee
        </button>
      </div>
    </form>
  );
};

export default Addemp;
