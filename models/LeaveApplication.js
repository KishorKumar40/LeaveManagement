const mongoose = require('mongoose');
const moment = require('moment');

const leaveApplicationSchema = new mongoose.Schema({
 
  name: { type: String, required: true },
  image:{type:String},
  email: { type: String, required: true },
  leaveAvailable:{ type: Number},
  teamLeadEmail: { type: String, required: true },
  department: { type: String, required: true },
  startDate: { type: String, required: true ,default: () => moment().format('DD MMM YYYY')},
  endDate: { type: String, required: true ,default: () => moment().format('DD MMM YYYY')},
  noOfDays: { type: Number, required: true },
  leaveType: { type: String, required: true },
  reason: { type: String, required: true },
  appliedDate: { type: String, default: () => moment().format('DD MMM YYYY') },
  leaveStatus: { type: String, required: true },
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication;
