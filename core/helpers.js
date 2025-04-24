const fs = require("fs");

const makeUsers = (model, data) => {
    const dataJSON = JSON.parse(data);
    console.log(dataJSON);

    // const dataFile = fs.writeFileSync("users.json", data);
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    makeUsers,
    getRandomInt
};
