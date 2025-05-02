// Imports
const db = require("./database");
const { readUser } = require("./user-services");

// --- Drug Service Functions ---
// --- getDrugForUser ---
const getDrugForUser = async userId => {
    const { data: drugs, error } = await db
        .from("drugs")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        return null;
    }

    return drugs;
};

// --- getUserWithDrug ---
const getUserWithDrug = async userId => {
    const { data: users, error } = await db
        .from("*, drugs(*)")
        .eq("id", userId)
        .single();

    if (error) {
        return null;
    }

    return users;
};
// --- createDrug ---
const createDrug = async (
    username,
    nama_obat,
    tipe_obat,
    ketentuan_obat,
    sehari_berapa,
    sekali_berapa,
    total_obat,
    waktu_pengingat
) => {
    const user_id = readUser(username);
    const { newDrug, error } = await db
        .from("drugs")
        .insert(
            user_id,
            nama_obat,
            tipe_obat,
            ketentuan_obat,
            sehari_berapa,
            sekali_berapa,
            total_obat,
            waktu_pengingat
        )
        .select("*")
        .single();

    // Error
    if (!newDrug) {
        console.error(
            "Terjadi kesalahan saat menambahkan obat baru: ",
            newDrug
        );
        return null;
    }

    // Success
    console.log("Obat berhasil ditambahkan: ", newDrug);
    return newDrug;
};

// --- getDrug ---
const getDrug = async () => {
    const drug = await db.from("drugs").select("*");

    // Error
    if (!drug) {
        console.error("Terjadi kesalahan saat mengambil data obat: ", drug);
        return null;
    }

    // Success
    console.log("Data Obat: ", drug);
    return drug;
};

// --- readDrugById ---
const readDrugById = async id => {
    const drug = await db.from("drugs").select("*").eq("id", id).single();

    // Error
    if (!drug) {
        console.error(
            "Terjadi kesalahan saat mengambil data obat berdasarkan ID: ",
            drug
        );
        return null;
    }

    // Success
    console.log("Data obat berdasarkan ID: ", drug);
    return drug;
};

// --- updateDrugEval ---
const updateDrugEval = async (id, newTotalObat) => {
    const drug = await db
        .from("drugs")
        .update({ total_obat: newTotalObat })
        .eq("id", id)
        .select();

    // Error
    if (!drug) {
        console.error("Terjadi kesalahan saat mengubah total obat: ", drug);
        return null;
    }

    // Success
    console.log("Berhasil mengubah total obat pengguna: ", drug);
    return drug;
};

// --- deleteDrug ---
const deleteDrug = async id => {
    const drug = await db.from("drugs").delete().eq("id", id);

    // Error
    if (!drug) {
        console.error(
            "Terjadi kesalahan saat menghapus data pengguna berdasarkan ID: ",
            drug
        );
        return null;
    }

    // Success
    console.log("Berhasil menghapus data pengguna berdasarkan ID: ", drug);
    return drug;
};

module.exports = {
    createDrug,
    getDrug,
    readDrugById,
    updateDrugEval,
    deleteDrug,
    getDrugForUser,
    getUserWithDrug
};
