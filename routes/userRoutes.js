
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require("../middlewares/multerConfig");
const { register, applyLeave, getLeaveData, getAllEmployees, getTeamMembers,deleteTeamMembers , saveTeamMembers,updateManagerProfile,updateEmployeeProfile, getLeaveDataCount,updateLeaveAvailable,getLeaveDataPending,updateLeaveStatusById,getLeaveDataApproved,getLeaveDataRejected,getLeaveDataByDateRange,getUserProfile,updateLeaveApplication} = userController;

router.get('/leave-data', getLeaveData);
router.get('/leave-data-pending', getLeaveDataPending);
router.get('/leave-data-approved', getLeaveDataApproved);
router.get('/leave-data-rejected', getLeaveDataRejected);
router.get('/leave-data-count', getLeaveDataCount);
router.get('/get-all-employees', getAllEmployees);
router.get('/get-team-members', getTeamMembers);
router.get('/leave-data-range', getLeaveDataByDateRange);
router.get('/get-user-profile/:userId', getUserProfile);

router.post('/save-team-members', saveTeamMembers);

router.post('/register', register);
router.post('/leave-application', applyLeave);
router.post('/update-manager-profile', upload.single('image'),updateManagerProfile);
router.post('/update-employee-profile', upload.single('image'), updateEmployeeProfile);
router.post('/update-leave-available', updateLeaveAvailable);

router.post('/update-leave-application', updateLeaveApplication);


router.put('/update-leave-status', updateLeaveStatusById);
router.delete('/delete-team-member', deleteTeamMembers );


module.exports = router;
