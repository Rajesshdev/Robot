const mongoose = require("mongoose");
const StreetSchema = new mongoose.Schema({
  id: Number,
  data: {
    direction: String,
    status: String,
  },
});
const StreetModel = mongoose.model("datas", StreetSchema);
module.exports = StreetModel;
