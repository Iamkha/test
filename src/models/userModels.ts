const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is not null'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is not null'],
  },
  email: {
    type: String,
    required: [true, 'Email is not null'],
  },
  password: {
    type: String,
    required: [true, 'pasword is not null'],
  },
});

const User = mongoose.model('User', userSchema);

export default exports = User;
