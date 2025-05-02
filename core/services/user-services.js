// Imports
const db = require("./database");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// --- User Service Functions ---
// Extras
const hashPassword = async password => {
    try {
        const salt = await bcrypt.genSalt(10);

        // hashedPassword
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword; // password hashed
    } catch (e) {
        console.error("Error hashing password.", e);
        throw e;
    }
};

// comparePasswordHash
const comparePassword = async (password, passwodHashed) => {
    try {
        const isMatch = await bcrypt.compare(password, passwodHashed);
        return isMatch;
    } catch (e) {
        console.error("Error compare password.", e);
        throw e;
    }
};

// --- createUser ---
const createUser = async userForm => {
    const password = await hashPassword(userForm.password);
    const user = await db
        .from("users")
        .insert(
            userForm.username,
            userForm.fullname,
            userForm.phone,
            password,
            userForm.isAdmin
        )
        .select();

    // Error
    if (!user) {
        console.error(
            "Terjadi kesalahan saat menambahkan pengguna baru: ",
            user
        );
        return null;
    }

    // Success
    console.log("Pengguna berhasil ditambahkan: ", user);
    return user;
};

// --- readUsers ---
const readUser = async username => {
    const user = await db
        .from("users")
        .select()
        .eq("username", username)
        .single();

    // Error
    if (!user) {
        console.error("Terjadi kesalahan saat mengambil data pengguna: ", user);
        return null;
    }

    // Success
    console.log("Data Pengguna: ", user);
    return user;
};

// --- readAllUsers ---
const readAllUsers = async () => {
    const user = await db.from("users").select("*");

    // Error
    if (!user) {
        console.error("Terjadi kesalahan saat mengambil data pengguna: ", user);
        return null;
    }

    // Success
    console.log("Data Pengguna: ", user);
    return user;
};

// --- readUserById ---
const readUserById = async id => {
    const user = await db.from("users").select("*").eq("id", id).single();

    // Error
    if (!user) {
        console.error(
            "Terjadi kesalahan saat mengambil data pengguna berdasarkan ID: ",
            user
        );
        return null;
    }

    // Success
    console.log("Data pengguna berdasarkan ID: ", user);
    return user;
};

// --- updateDrugIdWithUser ---
const updateUserDrugId = async (userId, newDrugID) => {
    const user = await db
        .from("users")
        .update({ drug_id: newDrugID })
        .eq("id", userId)
        .select("*")
        .single();

    // Error
    if (!user) {
        console.error("Terjadi kesalahan saat mengubah Drug ID: ", user);
        return null;
    }

    // Success
    console.log("Berhasil mengubah Drug ID data pengguna: ", user);
    return user;
};

// --- deleteUser ---
const deleteUser = async (id, newDrugID) => {
    const user = await db.from("users").delete().eq("id", id);

    // Error
    if (!user) {
        console.error(
            "Terjadi kesalahan saat menghapus data pengguna berdasarkan ID: ",
            user
        );
        return null;
    }

    // Success
    console.log("Berhasil menghapus data pengguna berdasarkan ID: ", user);
    return user;
};

module.exports = {
    createUser,
    readUser,
    readAllUsers,
    readUserById,
    updateUserDrugId,
    deleteUser,
    hashPassword,
    comparePassword
};

const main = async () => {
    console.log("Main Oke");
};

// main();
