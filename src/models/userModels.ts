const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/;

const userSchema = Schema(
  {
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
      match: [
        pwdRegex,
        'Make sure your password has at least 8 characters including at least one uppercase letter, one lowercase letter, one number and one special character',
      ],
    },
    role: {
      type: Array,
    },
  },
  { timestamps: true },
);
const User = mongoose.model('User', userSchema);

export default exports = User;
