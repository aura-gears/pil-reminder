// import
const fs = require("fs");

// Controllers
class PilControllers {
    constructor(
        obatName,
        obatTypes,
        obatTerm,
        sehariBerapa,
        sekaliBerapa,
        totalObat,
        reminder
    ) {
        this.nama = obatName;
        this.tipe = obatTypes;
        this.syarat = obatTerm;
        this.sehariBerapa = sehariBerapa;
        this.sekaliBerapa = sekaliBerapa;
        this.totalObat = totalObat;
        this.pengingat = reminder;
    }
}

// module.exports = PilControllers;
