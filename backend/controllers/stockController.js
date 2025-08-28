const { getCMP } = require("../services/yahooService");
const {  getLatestEarnings } = require("../services/yahooService");

require('dotenv').config();

exports.getAllStockData = async(req, res) => {
   
//Static stock data Purchase price & quantity
// Symbols Refernce from Grow App and from the google spread sheet(Given in assignement)
const stockMap = {
    "BAJFINANCE.NS": { name: "Bajaj Finance", purchasePrice: 6466, quantity: 15, sector: "Financials" },
    "ICICIBANK.NS": { name: "ICICI Bank", purchasePrice: 780, quantity: 84, sector: "Financials" },
    "SBILIFE.NS": { name: "SBI Life", purchasePrice: 1197, quantity: 49, sector: "Financials" },
    "AFFLE.NS": { name: "Affle India", purchasePrice: 1151, quantity: 50, sector: "Technology" },
    "HDFCBANK.NS": { name: "HDFC Bank", purchasePrice: 1490, quantity: 50, sector: "Financials" },
    "KPITTECH.NS": { name: "KPIT Tech", purchasePrice: 672, quantity: 61, sector: "Technology" },
    "TATATECH.NS": { name: "Tata Tech", purchasePrice: 1072, quantity: 63, sector: "Technology" },
    "KPIGREEN.NS": { name: "KPI Green", purchasePrice: 875, quantity: 50, sector: "Energy" },
    "TATAPOWER.NS": { name: "Tata Power", purchasePrice: 224, quantity: 225, sector: "Energy" },
    "TATACONSUM.NS": { name: "Tata Consumer Products Limited ", purchasePrice: 3007, quantity: 27, sector: "Consumer" },
    "NESTLEIND.NS": { name: "Nestle India", purchasePrice: 3777, quantity: 27, sector: "Consumer" },
    "BRITANNIA.NS": { name: "Britannia Industries", purchasePrice: 1200, quantity: 50, sector: "Consumer" },
    "SUZLON.NS": { name: "Suzlon", purchasePrice: 44, quantity: 450, sector: "Energy" },
    "GENSOL.NS": { name: "Gensol", purchasePrice: 998, quantity: 45, sector: "Energy" },
    "ASTRAL.NS": { name: "Astral", purchasePrice: 1517, quantity: 56, sector: "Industrial" },
    "POLYCAB.NS": { name: "Polycab", purchasePrice: 2818, quantity: 28, sector: "Industrial" },
    "GRAVITA.NS": { name: "Gravita", purchasePrice: 2037, quantity: 8, sector: "Materials" },
    "INFY.NS": { name: "Infosys", purchasePrice: 1400, quantity: 46, sector: "Technology" },
    "EASEMYTRIP.NS": { name: "Easemytrip", purchasePrice: 20, quantity: 1332, sector: "Technology" },
    "TCS.NS": { name: "TCS", purchasePrice: 3200, quantity: 5, sector: "Technology" },
    "LTIM.NS": { name: "LTI Mindtree", purchasePrice: 4775, quantity: 16, sector: "Technology" }
};


    const stockDataPromises = Object.entries(stockMap).map(async([symbol, stock]) => {
        try {
            

           //Current Market Price Yahoo services
           
           const { CMP: cmp, peRatio } = await getCMP(symbol);// calculated PE ratio along with peratio
            // const peRatio = await getPERatio(symbol); 
            const latestEarnings = await getLatestEarnings(symbol); 
            const investment = stock.purchasePrice * stock.quantity;
            const presentValue = cmp * stock.quantity;
            const gainLoss = (presentValue - investment);

            // console.log(`STOCK CONTROLLER - stockcontroller.js file`);

            return {
                
                name: stock.name,
                symbol,
                purchasePrice: stock.purchasePrice,
                quantity: stock.quantity,
                investment,
                cmp,
                presentValue,
                gainLoss,
                peRatio,
                latestEarnings,
                sector: stock.sector,
                portfolioPercentage: 0,
            };
        } catch (error) {
            return {
                
                name: stock.name,
                symbol,
                status:404,
                error: error.message || "Failed to fetch stock data"
            };
        }
    });

    try {
        const allStockData = await Promise.all(stockDataPromises); // promise handling for promising to get all the data

        // Calculate total investment for portfolio percentage
        const totalInvestment = allStockData.reduce((total, stock) => {
            return total + (stock.investment || 0);
        }, 0);

        //  portfolio percentage for each stock
        allStockData.forEach(stock => {
            if (totalInvestment > 0) {
                stock.portfolioPercentage = ((stock.investment || 0) / totalInvestment * 100).toFixed(2) + '%';
            } else {
                //if total investement is 0;
                stock.portfolioPercentage = "0%"; 
            }
        });

        res.json(allStockData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stocks data" });
    }
};