import "dotenv/config";
import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.route.js";
import connectDB from "./config/db.js";
import path from "path";

// connect DB first
connectDB();  

// initialize express
const app = express();

const PORT = process.env.PORT || 4000;

// enable cors  
// app.use(cors());

// middleware to parse json data
app.use(express.json());

// test route 
app.get("/", (req, res) => {
  res.send("API is working fine!");
});

app.use("/api/todos", todoRoutes);


const __dirname = path.resolve();

if (process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/todo-app/dist")));
  app.get("*",(req,res)=> {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));

  });
}

 

// start server
app.listen(PORT, () => {
  console.log("Server is running under the  PORT Number :4000");
});




















// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// //! dotenv configuration
// dotenv.config();

// //! initialize express function
// const app = express();

// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is working fine!");
// });

// //! Start server
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server is running under the PORT Number : ${PORT}`);
// });
