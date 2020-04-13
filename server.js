const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
//
const app = express();
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     next();
// });
app.use(cors());

const server = require("http").Server(app);

const io = require("socket.io")(server);

io.on("connection", function (socket) {
    socket.emit("news", { hello: "world" });
    socket.on("my other event", function (data) {
        console.log(data);
    });
});

app.use(express.json());

app.use("/api", require("./routes/api"));

mongoose.connect(
    `mongodb+srv://datng198:Dat12345678@cluster0-xejqn.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log("Connect to MongoDB successfully")
);

app.listen(port, () => console.log(`Server is running on port ${port}`));
