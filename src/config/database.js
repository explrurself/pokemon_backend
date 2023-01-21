const mongoose = require('mongoose')
const connestToDatabse = async () => {
  try {
    mongoose.set('strictQuery', true); 
    await mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true
      })
      .then((resp) => {
        console.log("Database is Connected");
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connestToDatabse;
