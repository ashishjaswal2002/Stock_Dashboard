// Recreate __filename and __dirname in ES modules
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
class StockController {


  async getAllStockData(req, res) {
    try {
      const validateSchema = groundSchema.validate(req.query);
      if (validateSchema.error) {
        return res.status(process.env.BAD_REQUEST).json({
          success: false,
          message: validateSchema.error.details[0].message,
        });
      }

      const response = await new GroundService().getAllGround(
        validateSchema.value
      );

      return res.status(response.status).json({
        success: response.status === process.env.SUCCESS,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      console.error("Error getting Grounds:", error.message);
      logger.error(`Ground Controller Error: ${error}
        File: ${path.basename(__filename)}
        Directory: ${__dirname}
        Line: ${
          (error.stack &&
            error.stack
              .split("\n")
              .find((line) => line.includes(path.basename(__filename)))
              ?.split(":")[1]) ||
          "Unknown"
        }
        Stack: ${error.stack || "No stack trace available"}`);
      return res.status(process.env.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
 



}
export default new StockController();




// const { fetchCMP } = require("../services/yahooService");
// const { fetchPERatio, fetchLatestEarnings } = require("../services/yahooService");



// exports.getAllStockData = async(req, res) => {
   
// //Static stock data Purchase price & quantity
// // Symbols Refernce from Grow App.
//     const stockMap = {
//         "INDUSINDBK.NS": { name: "IndusInd Bank Limited", purchasePrice: 1600, quantity: 58, sector: "Financials" },
//         "BAJFINANCE.NS": { name: "Bajaj Finance", purchasePrice: 6466, quantity: 15, sector: "Financials" },
//         "JIOFIN.NS": { name: "ICICI Bank", purchasePrice: 780, quantity: 84, sector: "Financials" },
//         "IXIGO.NS": { name: "Le Travenues Techno", purchasePrice: 1151, quantity: 50, sector: "Technology" },
//         "LTTS.NS": { name: "L&T Technology Services", purchasePrice: 672, quantity: 61, sector: "Technology" },
//         "TECHM.NS": { name: "Tech Mahindra Limited", purchasePrice: 1072, quantity: 63, sector: "Technology" },
//         "WIPRO.NS": { name: "Wipro", purchasePrice: 1134, quantity: 45, sector: "Technology" },
//         "NESTLEIND.NS": { name: "Nestle India", purchasePrice: 3777, quantity: 27, sector: "Consumer Goods" },
//         "BRITANNIA.NS": { name: "Britannia Industries", purchasePrice: 1200, quantity: 50, sector: "Consumer Goods" },
//         "ONGC.NS": { name: "Oil and Natural Gas Corporation", purchasePrice: 224, quantity: 225, sector: "Energy" },
//         "BPCL.NS": { name: "Bharat Petroleum Corporation", purchasePrice: 875, quantity: 50, sector: "Energy" },
//         "ADANIPOWER.NS": { name: "Adani Power", purchasePrice: 44, quantity: 450, sector: "Energy" },
//         "JSWENERGY.NS": { name: "JSW Energy", purchasePrice: 998, quantity: 45, sector: "Energy" },
//         "ASTRAL.NS": { name: "Astral", purchasePrice: 1517, quantity: 56, sector: "Industrial" },
//         "POLYCAB.NS": { name: "Polycab", purchasePrice: 2818, quantity: 28, sector: "Industrial" },
//         "GRAVITA.NS": { name: "Gravita", purchasePrice: 2037, quantity: 8, sector: "Materials" },
//         "SBILIFE.NS": { name: "SBI Life", purchasePrice: 1197, quantity: 49, sector: "Financials" },
//         "INFY.NS": { name: "Infosys", purchasePrice: 1400, quantity: 46, sector: "Technology" },
//         "INDIACEM.NS": { name: "The India Cements Limited", purchasePrice: 20, quantity: 1332, sector: "Materials" },
//         "ULTRACEMCO.NS": { name: "UltraTech Cement Limited ", purchasePrice: 20, quantity: 1000, sector: "Materials" },
//         "TCS.NS": { name: "TCS", purchasePrice: 3200, quantity: 5, sector: "Technology" },
       
//     };

//     const stockDataPromises = Object.entries(stockMap).map(async([symbol, stock]) => {
//         try {
            

//            //Current Market Price Yahoo services
//             const cmp = await fetchCMP(symbol); 
//             const peRatio = await fetchPERatio(symbol); 
//             const latestEarnings = await fetchLatestEarnings(symbol); 
//             const investment = stock.purchasePrice * stock.quantity;
//             const presentValue = cmp * stock.quantity;
//             const gainLoss = (presentValue - investment);

//             return {
//                 name: stock.name,
//                 symbol,
//                 purchasePrice: stock.purchasePrice,
//                 quantity: stock.quantity,
//                 investment,
//                 cmp,
//                 presentValue,
//                 gainLoss,
//                 peRatio,
//                 latestEarnings,
//                 sector: stock.sector,
//                 portfolioPercentage: 0,
//             };
//         } catch (error) {
//             return {
//                 name: stock.name,
//                 symbol,
//                 error: error.message || "Failed to fetch stock data"
//             };
//         }
//     });

//     try {
//         const allStockData = await Promise.all(stockDataPromises); // promise for promising to get all the data

//         // Calculate total investment for portfolio percentage
//         const totalInvestment = allStockData.reduce((total, stock) => {
//             return total + (stock.investment || 0);
//         }, 0);

//         // update portfolio percentage for each stock
//         allStockData.forEach(stock => {
//             if (totalInvestment > 0) {
//                 stock.portfolioPercentage = ((stock.investment || 0) / totalInvestment * 100).toFixed(2) + '%';
//             } else {
//                 stock.portfolioPercentage = "0%"; // Handle case where total investment is 0
//             }
//         });

//         res.json(allStockData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch stocks data" });
//     }
// };