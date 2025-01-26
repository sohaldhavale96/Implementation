const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// const DBconnection = async()=>{
//   try{
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");
//   }catch(error){
//     console.log("Error connecting to MongoDB", error);
//     process.exit(1);
//   }
// }
// DBconnection();

app.use('/api', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
