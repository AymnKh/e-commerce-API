import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Category name is required"],
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

export default mongoose.model("Category", categorySchema);
