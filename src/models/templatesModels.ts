const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const templatesSchema = Schema(
  {
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    pdf: {
      type: String,
    },
    analyzedData: {
      type: String,
    },
    mapping: {
      type: Object,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true },
);

const templates = mongoose.model('templates', templatesSchema);

export default exports = templates;
