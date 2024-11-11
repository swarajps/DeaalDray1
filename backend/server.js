const express = require('express');
const mongoose = require('mongoose');
const Login = require('./models/Login');
const Employee = require('./models/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // To check and create the images directory
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve images
app.use('/images', express.static('images'));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/dealsdray', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Ensure 'images' directory exists
const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir); // Create the directory if it doesn't exist
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Directory to store the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp as filename
  }
});

const upload = multer({ storage: storage });
// login post
app.post('/login_post', async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  // console.log(req.body);
  
  try {
    const log = await Login.findOne({ f_userName: username, f_Pwd: password });
    console.log(log);
    
    if (log) {
      res.json({ status: 'ok', log_id: log._id });
    } else {
      res.json({ status: 'nokay!' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
//dashboard post
app.post('/dashboard', async (req, res) => {
  var log_id = req.body.log_id;
  const log = await Login.findOne({ _id: log_id });
  // console.log(log.f_sno);
  
  const logdata = log.f_sno;
  
  try {
    const log = await Employee.findOne({ _id: logdata });
    // console.log(log);
    
    if (log) {
      res.json(log);
    } else {
      res.json({ status: 'nokay!' });
    }
  } catch (err) {
    console.error('Error ', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// post emplist

app.get('/emplist', async (req, res) => {
  try {
    const employees = await Employee.find();
    // console.log(employees);
    

    if (!employees) {
      return res.status(404).json({ message: 'No employees found' });
    }
    else{
    res.json(employees);
    // console.log(employees);
    
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//post addemp
// app.post('/addemp', upload.single('fileField'), async (req, res) => {
//   try {
//     // Get form data from request body
//     const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
//     const f_Id = uuidv4();
//     console.log(req.body);
//     console.log(req.file);
    
//     // Get file path from multer
//     const f_Image = '/images/' + req.file.filename; // Save image path in 'images/' folder

//     // Check if the employee already exists (based on email)
//     const existingEmployee = await Employee.findOne({ f_Email });
//     if (existingEmployee) {
//       // If the employee already exists, send an error response
//       return res.status(400).send("Employee already exists.");
//     }

//     // Create a new employee object
//     const newEmployee = new Employee({
//       f_Id,
//       f_Name,
//       f_Email,
//       f_Mobile,
//       f_Designation,
//       f_gender,
//       f_Course,
//       f_Image, // Store the file path in the database
//     });

//     // Save the new employee to the database
//     await newEmployee.save();

//     res.status(201).send("Employee added successfully!");
//   } catch (error) {
//     console.error("Error adding employee:", error);
//     res.status(500).send("Server error.");
//   }
// });


app.post('/addemp',upload.single('fileField'), async function(request, response, next) {
  const dt = request.dt;
  const lastEmployee = await Employee.findOne().sort({ f_Id: -1 }).exec();
  const newFId = lastEmployee ? (parseInt(lastEmployee.f_Id, 10) + 1) : 1;

  var f_Id = newFId;
  var f_Name = request.body.name;
  var f_Email = request.body.email;
  var f_Mobile = request.body.mobile;
  var f_Designation = request.body.designation;
  var f_gender = request.body.gender;
  var f_Course = request.body.course;
 

  
  var f_Image =  request.file.filename;  // + '-' + dt + path.extname(request.file.originalname);
  console.log(f_Image);

  var d1 = await Employee.find({f_Email: f_Email});
  if (d1.length !== 0 || !request.file) {
      if(request.file){
          fs.unlinkSync(request.file.path);
      }
      response.send('no');
      return;
  }

  
  // var logitem = {
  //     username: email,
  //     password: phone,
  // };

  // const logint = await new Login(logitem).save();
  var item = {
      f_Id: f_Id,
      f_Name: f_Name,
      f_Email: f_Email,
      f_Mobile: f_Mobile,
      f_Designation: f_Designation,
      f_gender: f_gender,
      f_Course: f_Course,
      f_Image: f_Image,
  };

  await new Employee(item).save();
  response.send('ok')

});


app.get('/employee/:id', async (req, res) => {
  const employeeId = req.params.id;
  const employee = await Employee.findById(employeeId);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send('Employee not found');
  }
});
app.post('/editemp/:id', upload.single('fileField'), async (req, res) => {
  console.log('h1');
  
  const { name, email, mobile, designation, gender, course } = req.body;
  const file = req.file;
  console.log(req.body.id);
  

  try {
    const employee = await Employee.findOne({ _id:req.body.id})

    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    // Update the fields if provided
    employee.f_Name = name || employee.f_Name;
    employee.f_Email = email || employee.f_Email;
    employee.f_Mobile = mobile || employee.f_Mobile;
    employee.f_Designation = designation || employee.f_Designation;
    employee.f_gender = gender || employee.f_gender;
    employee.f_Course = course || employee.f_Course;

    // Handle image update if new image is provided
    if (file) {
      // Optionally, delete the old image before saving the new one (make sure to manage files properly)
      if (employee.f_Image) {
        fs.unlinkSync(path.join(__dirname, 'uploads', employee.f_Image));
      }
      employee.f_Image = file.filename;
    }

    await employee.save();
    res.send('ok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating employee');
  }
});

app.delete('/deleteemp/:did', async (req, res) => {
  try {
    console.log(req.params.did);
    
    
    
    const employee = await Employee.findByIdAndDelete(req.params.did);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.json('ok'); // Send success response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting employee');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
