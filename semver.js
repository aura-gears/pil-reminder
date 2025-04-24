const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const { PilControllers } = require("./core/controllers");

// Config dotenv
dotenv.config();

// Define
const APP = "Pil Reminder" || process.env.APP_NAME;
const PORT = "3154" || process.env.APP_PORT;

// Initialize
const app = express();

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public/"));
app.use(ejsLayouts);
app.use(
    cors({
        origin: ["http://127.0.0.1:3154"]
    })
);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("Content-Type", "application/json");

// Endpoint - obat
app.get("/", (req, res) => {
    res.render("index", {
        layout: "layouts/main",
        title: "Home"
    });
});
app.post("/", (req, res) => {
    res.render("index", {
        layout: "layouts/main",
        title: "Home"
    });
});
app.get("/login", (req, res) => {
    res.render("login", { layout: "layouts/main", title: "Login" });
});
app.get("/regist", (req, res) => {
    res.render("regist", { layout: "layouts/main", title: "Register" });
});
app.get("/dashboard", (req, res) => {
    res.render("dashboard", { layout: "layouts/main", title: "Dashboard" });
});

// Not Found
app.use((req, res, next) => {
    res.status(404);
    res.json({
        status: "Failed",
        message: "Not Found!"
    });
    next();
});

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
