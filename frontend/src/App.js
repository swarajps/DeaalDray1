import React from 'react';
import Login from "./components/Login.js";
import Dashboard from './components/Dashboard.js';
import Emplist from './components/Emplist.js';
import Addemp from './components/Addemp.js';
import Editemp from './components/Editemp.js';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

function App() {
      return (
          <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/emplist" element={<Emplist/>}/>
                <Route path="/addemp" element={<Addemp/>}/>
                <Route path="/editemp/:id" element={<Editemp/>} />

              </Routes>
          </Router>
      );
    
}

export default App;
