const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companiesSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'First Name is not null'],
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    no: {
      type: String,
    },
    name2: {
      type: String,
    },
    searchName: {
      type: String,
    },
  },
  { timestamps: true },
);

const companies = mongoose.model('companies', companiesSchema);

export default exports = companies;
