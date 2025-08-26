const express = require("express");
const cors = require("cors");
const app = express();
const stockRoutes = require("./routes/stockRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/v1/stocks", stockRoutes);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
