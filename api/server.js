require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Hoa Mơ đang chạy!");
});

app.use("/api/auth", require("./routers/auth"));

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Đã kết nối MongoDB");
    app.listen(PORT, () => console.log("Chạy tại http://localhost:" + PORT));
  })
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));
