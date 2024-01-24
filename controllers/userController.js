const User = require('../models/user');
const LeaveApplication = require("../models/LeaveApplication")
const moment = require('moment');
const fs = require('fs');

//Register
const register = async (req, res) => {
    console.log('Received data:', req.body);
   
  const { name, email, password, role ,department} = req.body;
  // console.log('Received data:', { name, email, password, role ,department});
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const newUser = new User({ name, email, password, role ,department});
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//LeaveApplication
const applyLeave = async (req, res) => {
  const {name,image,email,teamLeadEmail,department, startDate, endDate, noOfDays, leaveType, reason,leaveStatus } = req.body;
  console.log('Received leave application:', { name,image,email,teamLeadEmail,department,startDate, endDate, noOfDays, leaveType, reason ,leaveStatus});

  try {
    const leaveApplication = new LeaveApplication({name,image,email,teamLeadEmail,department,startDate, endDate,noOfDays,leaveType, reason,leaveStatus});

    await leaveApplication.save();

    res.status(200).json({ success: true, message: 'Leave application received successfully' });
  } catch (error) {
    console.error('Error saving leave application:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//leave-data

const getLeaveData = async (req, res) => {
  const { email } = req.query;

  try {
    const leaveData = await LeaveApplication.find({ email });

    res.status(200).json({ success: true, leaveData });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



//leave-data-pending
const getLeaveDataPending = async (req, res) => {
  const { teamLeadEmail, leaveStatus } = req.query;

  try {
    console.log('Team Lead Email:', teamLeadEmail);

    const leaveData = await LeaveApplication.find({ teamLeadEmail, leaveStatus });

    console.log('Leave Data:', leaveData);

    res.status(200).json({ success: true, leaveData });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



//leave-data-approved
const getLeaveDataApproved = async (req, res) => {
  const { teamLeadEmail, leaveStatus } = req.query;

  try {
    console.log('Team Lead Email:', teamLeadEmail);

    const leaveData = await LeaveApplication.find({ teamLeadEmail, leaveStatus });

    console.log('Leave Data:', leaveData);

    res.status(200).json({ success: true, leaveData });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//leave-data-rejected

const getLeaveDataRejected = async (req, res) => {
  const { teamLeadEmail, leaveStatus } = req.query;

  try {
    console.log('Team Lead Email:', teamLeadEmail);

    const leaveData = await LeaveApplication.find({ teamLeadEmail, leaveStatus });

    console.log('Leave Data:', leaveData);

    res.status(200).json({ success: true, leaveData });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const getLeaveDataCount = async (req, res) => {
  const { email } = req.query;

  try {
    const leaveData = await LeaveApplication.find({ email });

    res.status(200).json({ success: true, leaveData });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Get all employees

const getAllEmployees = async (req, res) => {
  try {
    
    const { department, email } = req.query;
   
    const manager = await User.findOne({ email: email }); 
    const teamMembers = manager ? manager.teamMembers.map(member => member.email) : [];

    const employees = await User.find({
      department,
      role: 'Employee', 
      email: { $nin: teamMembers }, 
    });

    res.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTeamMembers = async (req, res) => {
  const { email } = req.query;

  try {
    const manager = await User.findOne({ email: email }); 
    const teamMembers = manager ? manager.teamMembers : [];
    
   
    const uniqueTeamMembers = Array.from(new Set(teamMembers.map(member => member.email)))
      .map(email => teamMembers.find(member => member.email === email));
    
    console.log("teamMembers:", uniqueTeamMembers);
    res.status(200).json({ success: true, teamMembers: uniqueTeamMembers });
  } catch (error) {
    console.error('Error fetching team members: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const saveTeamMembers = async (req, res) => {
  const { email,name, teamMembers } = req.body;
  console.log('Received data:', { email,name, teamMembers }); 
  try {

    await User.updateOne({ email }, { $push: { teamMembers: { $each: teamMembers } } });
    
    await Promise.all(
      teamMembers.map(async (teamMember) => {
        await User.updateOne(
          { 'email': teamMember.email },
          {
            $set: {
              'teamLeadName': name,
              'teamLeadEmail': email,
            },
          }
        );
      })
    );
    
    res.status(200).json({ success: true, message: 'Team members saved successfully' });
  } catch (error) {
    console.error('Error saving team members:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const deleteTeamMembers = async (req, res) => {


  const { email, employeeEmail } = req.query;
  
  try {
 
    const manager = await User.findOne({ email: email });

  
    if (manager) {
      manager.teamMembers = manager.teamMembers.filter(member => member.email !== employeeEmail);
      await manager.save();
    }

    res.status(200).json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




//updateManagerProfile


  const updateManagerProfile = async (req, res) => {
  const { email, name } = req.body;

  try {
    let imageData = null;

    if (req.file && req.file.buffer) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
   
    const updatedManager = await User.findOneAndUpdate(
      { email: email },
      { $set: { name: name,email : email , image: imageData } },
      { new: true }
    );


    // await Promise.all(
    //   teamMembers.map(async (teamMember) => {
    //     await User.updateOne(
    //       { 'email': teamMember.email },
    //       {
    //         $set: {
    //           'teamLeadName': name,
    //           'teamLeadEmail': email,
    //         },
    //       }
    //     );
    //   })
    // );

    res.json({ updatedManager });
  } catch (error) {
    console.error('Error updating manager profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//updateEmployeeProfile
const updateEmployeeProfile = async (req, res) => {
  const { _id, email, name } = req.body;

  try {
    let imageData = null;

    if (req.file && req.file.buffer) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    console.log("imageData:",imageData);
    const updatedEmployee = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { name: name, email: email, image: imageData } },
      { new: true }
    );

    await LeaveApplication.updateMany(
      { email: email },
      { $set: { name: name } }
    );

    res.json({ updatedEmployee });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const updateLeaveAvailable = async (req, res) => {
  const { email, leaveAvailable } = req.body;

  try {
    await LeaveApplication.updateMany({ email: email }, { $set: { leaveAvailable: leaveAvailable } });

    res.json({ success: true, message: 'Leave available updated successfully' });
  } catch (error) {
    console.error('Error updating leave available:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const updateLeaveStatusById = async (req, res) => {
  const { _id, leaveStatus } = req.body;
  console.log("Received _id:", _id);
  try {
    const updatedDocument = await LeaveApplication.findOneAndUpdate({_id}, { $set: { leaveStatus } }, { new: true });

    if (updatedDocument) {
     
      console.log('Updated Document:', updatedDocument);

     
      res.status(200).json({ success: true, message: "Leave Status Updated successfully" });
    } else {
     
      console.log('No matching document found for the given _id.');
      res.status(404).json({ success: false, message: 'No matching document found' });
    }
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const getLeaveDataByDateRange = async (req, res) => {
  const { teamLeadEmail } = req.query;

  try {
    const today = moment().format('DD MMM YYYY');
    const thisWeekStart = moment().startOf('week').format('DD MMM YYYY');
    const nextWeekStart = moment().startOf('week').add(1, 'weeks').format('DD MMM YYYY');

    const todayData = await LeaveApplication.find({ teamLeadEmail, startDate: today });
    const thisWeekData = await LeaveApplication.find({ teamLeadEmail, startDate: { $gte: thisWeekStart, $lte: today } });
    const nextWeekData = await LeaveApplication.find({ teamLeadEmail, startDate: { $gte: nextWeekStart } });

    const result = {
      today: todayData,
      thisWeek: thisWeekData,
      nextWeek: nextWeekData,
    };

    res.status(200).json({ success: true, leaveData: result });
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const userProfile = await User.findOne({ _id: userId });
    console.log("userProfile:",userProfile);
    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    
    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateLeaveApplication = async (req, res) => {

  try {
    const { email, imageUrl } = req.body;

    
    const leaveApp = await LeaveApplication.findOne({ email });

    if (!leaveApp) {
      return res.status(404).json({ success: false, message: 'Leave application not found.' });
    }

    
    leaveApp.image = imageUrl;

    
    await leaveApp.save();

    return res.status(200).json({ success: true, message: 'Leave application updated successfully.' });
  } catch (error) {
    console.error('Error updating leave application:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




module.exports = { register, applyLeave, getLeaveData,deleteTeamMembers, getAllEmployees, getTeamMembers, saveTeamMembers,updateManagerProfile,updateEmployeeProfile ,getLeaveDataCount,updateLeaveAvailable,getLeaveDataPending,updateLeaveStatusById,getLeaveDataApproved,getLeaveDataRejected, getLeaveDataByDateRange,getUserProfile,updateLeaveApplication};

