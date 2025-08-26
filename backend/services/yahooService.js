const yahooFinance = require("yahoo-finance2").default;

//fetching cmp using symobl
exports.getCMP = async(symbol) => {
  const quote = await yahooFinance.quote(symbol);
  return quote.regularMarketPrice;


};
//fetch pe ratio
exports.getPERatio = async(symbol) => {
    try {
        const quote = await yahooFinance.quoteSummary(symbol, { modules: ['defaultKeyStatistics', 'financialData'] });
        const pe = quote.defaultKeyStatistics ?.forwardPE || quote.defaultKeyStatistics ?.trailingPE;
        return pe || 'N/A';
    } catch (err) {
        console.error(`Error fetching P/E for ${symbol}:`, err.message);
        return 'N/A';
    }
};


//Function of fetching earning per Share
exports.getLatestEarnings = async (symbol) => {
  try {
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: ['defaultKeyStatistics', 'financialData']
    });

    const eps1 = quote?.financialData?.epsTrailingTwelveMonths;
    const eps2 = quote?.defaultKeyStatistics?.trailingEps;

    const eps = eps1 || eps2;

    return eps ? `₹${eps.toFixed(2)}` : 'N/A';
  } catch (err) {
    console.error(`Error fetching earnings for ${symbol}:`, err.message);
    return 'N/A';
  }
};

