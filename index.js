import express from "express";
import colors from "colors";
import dotenv from "dotenv";

import connectDB from "./connectDB.js";
import User from "./Model/User.js";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: "*",
    }),
);
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
connectDB();

app.get("/", async (req, res) => {
    const user = await User.find();
    res.status(200).send({ Message: `Users Found`, user: user });
});

app.post("/register", async (req, res) => {
    const { Name, Email, Batch } = req.body;
    const foundUser = await User.findOne({ Email: Email });
    const d = new Date();
    const month = d.getMonth();
    console.log(foundUser);
    console.log(Email);
    if (foundUser) {
        console.log(month);
        // console.log(foundUser.Month);
        if (foundUser.Month == month) {
            res.status(200).send({
                Message: `You are already registered for current month and can change Batch next month. If your Money was deduced then it will be refunded.`,
            });
        } else {
            const updateUser = await User.findOneAndUpdate(
                { Email: Email },
                { Batch: Batch },
            );
            res.status(200).send({
                Message: `Payment Accepted. Updated the Subscription.`,
            });
        }
    } else {
        const allUser = await User.find({});

        const newUser = new User({
            Email: Email,
            Name: Name,
            Batch: Batch,
            Month: month,
        });
        console.log(allUser);
        console.log(newUser);
        const userCreated = await newUser.save();
        console.log(userCreated);
        res.status(200).send({
            Message: `Created a New Subscription. Payment Accepted`,
        });
    }
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
