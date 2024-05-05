const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "662f67a1e34e2cecf1a7c75c"
  }));
  await Listing.insertMany(listingsWithOwner);
  console.log("Data was initialized");
};


initDB();