
import { Router } from "express";
import promoCodeController from "../controller/promoCodeController.js";


/**
 * @class promoCodeRouter
 */


export default class promoCodeRouter {
       
    constructor(){
     this.router = Router();
     this.routes();

    }

  routes = ()=>{
     this.router.get("/getAllPromoCode",promoCodeController.getPromoCodes);
     this.router.post("/create/Promo",promoCodeController.createPromoCode);
     this.router.put("/promo/update/:id",promoCodeController.updatePromoCode);
     this.router.patch("/promo/conceal/:id",promoCodeController.concealPromoCode);
  };

}



// const express = require("express");
// const apicache = require("apicache");
// const router = express.Router();
// const { getAllStockData } = require("../controllers/stockController");
// const rateLimit = require('express-rate-limit');



// let cache = apicache.middleware;

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
//     standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers.

// })

// router.get("/", limiter, cache('15 seconds'), getAllStockData);



// module.exports = router;