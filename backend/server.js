const express = require("express");
const cors = require("cors");
const app = express();
const stockRoutes = require("./routes/stockRoutes");

// for allow origin policy.
app.use(cors());
app.use(express.json());

//api endpoint to 
app.use("/api/v1/stocks", stockRoutes);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
