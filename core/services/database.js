// Imports
const { createClient } = require("@supabase/supabase-js");
// Environment
require("dotenv").config();

const SURL = "https://oqwqeqhsezhbungarnku.supabase.co";
const SKEY = process.env.SUPABASE_KEY;

const db = createClient(SURL, SKEY);

module.exports = db;
