const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pdfSchema = Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    pdf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const companies = mongoose.model('pdfs', pdfSchema);

export default exports = companies;
