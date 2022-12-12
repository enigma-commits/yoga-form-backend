import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = Schema({
    Name: String,
    Email: String,
    Batch: String,
    Month: Number,
});

const User = mongoose.model("User", userSchema);
export default User;
