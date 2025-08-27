const express = require("express");
const cors = require("cors");
const app = express();
const stockRoutes = require("./routes/stockRoutes");

const notFound = require('./middleware/notFound.js');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// for allow origin policy.
app.use(cors());
app.use(express.json());

//api endpoint to check stocks data
app.use("/api/v1/stocks", stockRoutes);


//health check of the server
app.get("/", (req, res) => {
    res.status(200).send(
      `<div><p><h2>App Server is working fine on port ${PORT}</h2><p></div>`
    );
  });
  
  // 404 handler for wrong req.....
app.use(notFound);



app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}  index.js FILE`);
});

module.exports = app;