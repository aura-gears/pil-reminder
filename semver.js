require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const path = require("path");
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode,
    getAggregateVotesInPollMessage,
    prepareWAMessageMedia,
    proto
} = require("baileys");
const P = require("pino");
const cron = require("node-cron");
const qrcode = require("qrcode-terminal");
const WARun = require("./core/helpers");

const app = express();
const port = process.env.PORT || 3000;

// Setup Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false
    })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public/"));

// Helper middleware to check logged in
function redirectLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

// Routes

// Index
app.get("/", (req, res) => {
    res.render("index");
});

// GET /signup - form for sign up
app.get("/signup", (req, res) => {
    res.render("signup");
});

// POST /signup - registrasi user baru
app.post("/signup", async (req, res) => {
    const { username, fullname, phone, password } = req.body;
    try {
        // check jika username sudah ada
        let { data: existingUser, error: errCheck } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (existingUser) {
            return res.send("Username sudah ada, gunakan username lain.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let { data, error } = await supabase.from("users").insert([
            {
                username,
                fullname,
                phone,
                password: hashedPassword,
                isAdmin: false,
                drug_id: null
            }
        ]);

        if (error) {
            console.error(error);
            return res.status(500).send("Gagal mendaftar user.");
        }

        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

// GET /login - halaman login
app.get("/login", (req, res) => {
    res.render("login");
});

// POST /login - proses login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (error || !user) {
            return res.status(400).send("User tidak ditemukan.");
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).send("Password salah.");
        }

        // simpan session user
        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

// GET /dashboard - view form tambah obat dan daftar obat user
app.get("/dashboard", redirectLogin, async (req, res) => {
    const userId = req.session.user.id;

    try {
        const { data: drugs, error } = await supabase
            .from("drugs")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error(error);
            return res.status(500).send("Gagal mengambil data obat.");
        }

        res.render("dashboard", {
            username: req.session.user.username,
            drugs: drugs.length ? drugs : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

// POST /add-drug - proses tambah data obat
app.post("/add-drug", redirectLogin, async (req, res) => {
    const {
        nama_obat,
        tipe_obat,
        ketentuan_obat,
        sehari_berapa,
        sekali_berapa,
        waktu_pengingat,
        total_obat
    } = req.body;

    const userId = req.session.user.id;

    try {
        if (
            !nama_obat ||
            !tipe_obat ||
            !ketentuan_obat ||
            !sehari_berapa ||
            !sekali_berapa ||
            !waktu_pengingat ||
            !total_obat
        ) {
            return res.status(400).send("Semua field wajib diisi.");
        }

        const { data, error } = await supabase.from("drugs").insert({
            nama_obat,
            tipe_obat,
            ketentuan_obat,
            sehari_berapa: parseInt(sehari_berapa),
            sekali_berapa: parseInt(sekali_berapa),
            waktu_pengingat,
            total_obat: parseInt(total_obat), // default stok obat, bisa sesuaikan
            user_id: userId
        });

        if (error) {
            console.error(error);
            return res.status(500).send("Gagal menambah obat.");
        }

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

// GET /logout - logout clear session
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// ===================== Start server ======================
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});
