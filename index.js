require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const device = require('express-device');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const itemRouter = require('./routes/itemRoutes');
const houseRouter = require('./routes/houseRoutes');
const searchRouter = require('./routes/searchRoutes');
const commentRouter = require('./routes/commentRoutes');
const notificationRouter = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use("/resources", express.static("resources"));
app.use(device.capture());

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mycluster.zvfqd.mongodb.net/house-items-mgmt?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
connectDB();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/houses", houseRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/notifications", notificationRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Starting server at port: ${port}`);
})

