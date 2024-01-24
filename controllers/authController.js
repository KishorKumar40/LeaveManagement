const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.SECRETKEY, { expiresIn: '1d' });
};

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = generateToken(user);

      res.json({ token, _id:user._id, role: user.role, name: user.name,image:user.image, email: user.email,password:user.password, department: user.department,teamLeadName: user.teamLeadName ,teamLeadEmail: user.teamLeadEmail  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

 
};

module.exports = authController;
