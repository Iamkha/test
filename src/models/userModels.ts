const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    },
    role: {
      type: Array,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at', // and `updated_at` to store the last updated date
    },
  },
);

const User = mongoose.model('User', userSchema);

export default exports = User;
