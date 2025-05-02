const db = require("./database");
const getDrugWithUser = require("./drug-services");

const main = async () => {
    const users = getDrugWithUser("tomsdroid");
    const drugs = await db
        .from("drugs")
        .select("*", "users(phone, username)")
        .neq("total_obat", 0);

    console.log(drugs);
    console.log(drugs.user);
};

main();
