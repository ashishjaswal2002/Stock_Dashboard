const yahooFinance = require("yahoo-finance2").default;


//fetching cmp using symobl
exports.getCMP = async (symbol) => {
  const quote = await yahooFinance.quote(symbol);
  const CMP = quote.regularMarketPrice;
   // calculate p/e ratio in quote data.

   /// CMP/ eps trailing twelve months
  let peRatio;

  if (quote.epsTrailingTwelveMonths) {
    peRatio = CMP / quote.epsTrailingTwelveMonths;
  } else {
    peRatio = quote.forwardPE || quote.trailingPE;
  }

  return { CMP, peRatio };
};


//Function of fetching earning per Share
exports.getLatestEarnings = async (symbol) => {
  try {
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: ["defaultKeyStatistics", "financialData"],
    });

    const eps1 = quote?.financialData?.epsTrailingTwelveMonths;
    const eps2 = quote?.defaultKeyStatistics?.trailingEps;

    const eps = eps1 || eps2;
    // console.log(`YAHOO SERV - file`);

    return eps ? `₹${eps.toFixed(2)}` : "N/A";
  } catch (err) {
    console.error(`Error fetching earnings for ${symbol}:`, err.message);
    return "N/A";
  }
};
