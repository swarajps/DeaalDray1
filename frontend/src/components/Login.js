// import React, { useState } from "react";
// import Styles from "./style.css";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (!username || !password) {
//       alert("Please enter both username and password.");
//       return;
//     } else {
//       //     handleLogin(username, password);
//     }
//   };

//   return (
//     <form onSubmit={submitHandler}>
//       <div className="hone" style={Styles}>
//         Login
//       </div>
//       <div className="flex" style={{ Styles }}>
//         <div>
//           Username 
//           <input
//             type="text"
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             //   style={}
//           />
//         </div>
//         <div>
//           Password 
//           <input
//             type="password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             //   style={inputStyle}
//           />
//         </div>
//         <div>
//           <button className="btn" type="submit">Login</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import axios from 'axios';
import Styles from "./style.css";
import {useNavigate} from 'react-router-dom';



const API_URL = 'http://localhost:5000';
const LoginForm = () => {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {

      const response = await axios.post(`${API_URL}/login_post`, { username, password });
      console.log(response.data.status);

      if (response.data.status === 'ok') {
        localStorage.setItem('log_id', response.data.log_id);
        console.log(localStorage);
        
        setMessage(`Login successful!`);
        navigate("/dashboard")
    } else {
        setMessage('Login failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
         <form onSubmit={handleSubmit}>
           <div className="hone" style={Styles}>
             Login
           </div>
           <div className="flex" style={{ Styles }}>
             <div> Username
               <input id='username' name='username'
                 type="text"
                 onChange={(e) => setUsername(e.target.value)}
                 required
    //    style={}
               />
             </div>
             <div>
               Password 
               <input id='password' name='password'
                 type="password"
                 onChange={(e) => setPassword(e.target.value)}
                 required
                //   style={inputStyle}
               />
             </div>
             <div>
               <button className="btn" type="submit">Login</button>
            </div>
          </div>
        </form>
      );
    };
    

export default LoginForm;
