const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  teamLeadName: { type: String },  
  teamLeadEmail: { type: String }, 
  teamMembers: [
    {
      name: { type: String },
      email: { type: String },  
      department: { type: String }
    }
  ],  
  image: {
    data: Buffer,
    contentType: String,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
