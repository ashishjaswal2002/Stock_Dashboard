import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // const response = await fetch('https://finance-portfolio-dashboard-backend.onrender.com/api/stocks');
        const response = await fetch(`http://localhost:5001/api/stocks`)
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
       
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const intervalId = setInterval(fetchStockData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10 text-lg font-semibold">{error}</div>;
  }

  // Group stocks by sector
  const stocksBySector = stocks.reduce((acc, stock) => {
    const sector = stock.sector || 'Unknown Sector';
    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(stock);
    return acc;
  }, {});

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6 drop-shadow-sm">
        Stock Portfolio Dashboard
      </h1>

      {Object.entries(stocksBySector).map(([sector, sectorStocks]) => (
        <div key={sector} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b border-blue-400 pb-1">
            {sector}
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Stock Name</th>
                  <th className="py-3 px-4">NSE/BSE</th>
                  <th className="py-3 px-4">Purchase Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Investment</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Present Value</th>
                  <th className="py-3 px-4">Gain / Loss</th>
                  <th className="py-3 px-4">P/E Ratio</th>
                  <th className="py-3 px-4">Latest Earnings</th>
                  <th className="py-3 px-4">Portfolio %</th>
                </tr>
              </thead>
              <tbody>
                {sectorStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="py-2 px-4 font-bold">{stock.name}</td>
                    <td className="py-2 px-4">{stock.symbol}</td>
                    <td className="py-2 px-4">₹{stock.purchasePrice}</td>
                    <td className="py-2 px-4">{stock.quantity}</td>
                    <td className="py-2 px-4">₹{stock.investment}</td>
                    <td className="py-2 px-4">₹{stock.cmp || 'N/A'}</td>
                    <td className="py-2 px-4">₹{stock.presentValue || '0'}</td>
                    <td className={`py-2 px-4 font-semibold ${stock.gainLoss >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                      ₹{stock.gainLoss}
                    </td>
                    <td className="py-2 px-4">{stock.peRatio || 'N/A'}</td>
                    <td className="py-2 px-4">{stock.latestEarnings || 'N/A'}</td>
                    <td className="py-2 px-4">{stock.portfolioPercentage || '0%'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

