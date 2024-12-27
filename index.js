const express = require("express");
require("dotenv").config();
const userRouter = require("./routes/user.routes.js");
const connectToDB = require('./config/db.js');
connectToDB();
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes.js');

const PORT = process.env.PORT || 3000;
const app = express();

// it will show console if we not user this two built in middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.set("view engine", 'ejs');


app.use("/", indexRouter)
app.use('/user', userRouter)


app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})