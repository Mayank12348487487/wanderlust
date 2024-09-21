const mongoose =  require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Mongo_Url = "mongodb://127.0.0.1:27017/wnderlust";
main().then(()=>{
    console.log("Server Connected to Db ")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect(Mongo_Url);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    
   initData.data=  initData.data.map((obj)=>({...obj,owner:"66dd93918ea50395f3f9eac2"}));
    await Listing.insertMany(initData.data);

}
initDB();