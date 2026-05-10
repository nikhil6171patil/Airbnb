const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => { console.log("conneted to DB") })
    .catch((err) => { console.log(err) })

async function main() {
    await mongoose.connect(MONGO_URL);
};

let initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, owner:"69cbe0d6fd8f6bca0110e316",
    }));
    await Listing.insertMany(initData.data);
    console.log(`the data was initialies`);

}

initDB();