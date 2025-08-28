PROJECT DIR

FRONTEND- 
cd client

BACKEND-
cd backend



KEY CHALLENGES FACED

*Stock data according to symbol
- Used yahoo finance api 

*Difficulty in get exact P/E Ratio.
- Google blocked the scrapping process because the application need to get fresh data every 15 seconds so google blocked because we need req again and again and google blocked the scrapping req.

Solution- Through yahoo finance api they have  json data
like this


{
  language: 'en-US',
  region: 'US',
  quoteType: 'EQUITY',
  typeDisp: 'Equity',
  quoteSourceName: 'Free Realtime Quote',
  triggerable: true,
  customPriceAlertConfidence: 'HIGH',
  currency: 'INR',
  sharesOutstanding: 38446400,
  bookValue: 155.243,
  fiftyDayAverage: 45.6826,
  fiftyDayAverageChange: -8.002598,
  fiftyDayAverageChangePercent: -0.17517826,
  twoHundredDayAverage: 331.6877,
  twoHundredDayAverageChange: -294.00772,
  twoHundredDayAverageChangePercent: -0.8863992,
  marketCap: 1455194112,
  priceToBook: 0.24271627,
  sourceInterval: 15,
  exchangeDataDelayedBy: 15,
  tradeable: false,
  cryptoTradeable: false,
  shortName: 'GENSOL ENGINEERING LTD',
  longName: 'Gensol Engineering Limited',
  corporateActions: [],
  regularMarketTime: 2025-08-25T10:00:00.000Z,
  exchange: 'NSI',
  messageBoardId: 'finmb_592837682',
  exchangeTimezoneName: 'Asia/Kolkata',
  exchangeTimezoneShortName: 'IST',
  gmtOffSetMilliseconds: 19800000,
  market: 'in_market',
  esgPopulated: false,
  regularMarketChangePercent: 0,
  regularMarketPrice: 37.68,
  hasPrePostMarketData: false,
  firstTradeDateMilliseconds: 2023-07-03T03:45:00.000Z,
  priceHint: 2,
  regularMarketChange: 0,
  regularMarketDayHigh: 37.68,
  regularMarketDayRange: { low: 37.68, high: 37.68 },
  regularMarketDayLow: 37.68,
  regularMarketVolume: 19114,
  regularMarketPreviousClose: 37.68,
  bid: 0,
  ask: 0,
  fullExchangeName: 'NSE',
  financialCurrency: 'INR',
  regularMarketOpen: 37.68,
  averageDailyVolume3Month: 107004,
  averageDailyVolume10Day: 4850,
  fiftyTwoWeekLowChange: 0,
  fiftyTwoWeekLowChangePercent: 0,
  fiftyTwoWeekRange: { low: 37.68, high: 1012.35 },
  fiftyTwoWeekHighChange: -974.67,
  fiftyTwoWeekHighChangePercent: -0.9627797,
  fiftyTwoWeekLow: 37.68,
  fiftyTwoWeekHigh: 1012.35,
  fiftyTwoWeekChangePercent: -95.96098,
  earningsTimestampStart: 2025-08-11T10:59:00.000Z,
  earningsTimestampEnd: 2025-08-15T12:00:00.000Z,
  earningsCallTimestampStart: 1739435400,
  earningsCallTimestampEnd: 1739435400,
  isEarningsDateEstimate: true,
  trailingAnnualDividendRate: 0,
  trailingPE: 1.6540825,
  trailingAnnualDividendYield: 0,
  epsTrailingTwelveMonths: 22.78,
  marketState: 'REGULAR',
  symbol: 'GENSOL.NS'
} _______QUOITE


so what i did used P/E ratio formula = current market price/ EPS or Earning per share

P/E = CMP/epsTrailingTwelveMonths

*BLOCKED the user if there are too many requests
I had never used this feature before, so I did some R&D and found a very useful package called express-rate-limit, which blocks a user's IP if they keep sending repeated requests.

*Hosting process in vercel
Vercel only allows HTTPS-based applications and blocks HTTP responses as a potential risk or threat. Since my APIs didn’t work over HTTP, I hosted the backend with HTTPS to get a secure URL, and then the APIs worked.