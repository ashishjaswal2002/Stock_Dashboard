

const express = require("express");
const apicache = require("apicache");
const router = express.Router();
const { getAllStockData } = require("../controllers/stockController");
const rateLimit = require('express-rate-limit');



let cache = apicache.middleware;
// a limit set so a client can req 100 req per 15 minutes.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 105, // limit each IP to 105 requests per windowMs
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    message: "Too many requests from this IP, please try again after 15 minutes",// send a message to the client.
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.


})
// stale data in cache for 15 seconds.
router.get("/", limiter, cache('15 seconds'), getAllStockData);



module.exports = router;