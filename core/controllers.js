// import
const { Router } = require("express");

const db = require("./services/database");
const userGreating = require("./helpers");
const {
    createUser,
    readUser,
    readAllUsers,
    updateUser,
    deleteUser,
    getUserWithDrug
} = require("./services/user-services");
const {
    createDrug,
    readDrug,
    readAllDrugs,
    updateDrug,
    deleteDrug,
    getDrugWithUser,
    searchDrugs
} = require("./services/drug-services");

const auth = async user => {
    if (user.username) {
    }
};

const main = async () => {
    const user = {
        username: "tomsdroid",
        password: "secret2"
    };
    let signUp = await db.from("users").select("username, password");
    console.log(signUp);
};

main();
