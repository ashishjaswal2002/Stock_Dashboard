import { useEffect, useState,useRef } from 'react';


interface Stock {
  name: string;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | string;
  latestEarnings: string;
  sector: string;
  portfolioPercentage: string;
}


interface SectorSummary {
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
}

interface GroupedStocks {
  [sector: string]: {
    stocks: Stock[];
    summary: SectorSummary;
  };
}

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedStocks, setGroupedStocks] = useState<GroupedStocks>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalInvestment: 0,
    totalPresentValue: 0,
    totalGainLoss: 0,
  });

    const firstLoad = useRef(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
         if (firstLoad.current) {
          setLoading(true); 
        }
  
        const response = await fetch('https://stock-dashboard-three-smoky.vercel.app/api/v1/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        setStocks(data);
        groupStocksBySector(data);
        calculatePortfolioSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
       if (firstLoad.current) {
          setLoading(false);
          firstLoad.current = false; // after first load, don’t show spinner anymore
        }
      }
    };

    fetchStocks();
   const intervalId = setInterval(fetchStocks, 15000);

    return () => clearInterval(intervalId); 
  }, []);
  const calculatePortfolioSummary = (stocksData: Stock[]) => {
    const summary = stocksData.reduce(
      (acc, stock) => {
        acc.totalInvestment += stock.investment;
        acc.totalPresentValue += stock.presentValue;
        acc.totalGainLoss += stock.gainLoss;
        return acc;
      },
      { totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 }
    );
    setPortfolioSummary(summary);
  };

  const groupStocksBySector = (stocksData: Stock[]) => {
    const grouped: GroupedStocks = {};

    stocksData.forEach((stock) => {
      if (!grouped[stock.sector]) {
        grouped[stock.sector] = {
          stocks: [],
          summary: {
            totalInvestment: 0,
            totalPresentValue: 0,
            gainLoss: 0,
          },
        };
      }

      grouped[stock.sector].stocks.push(stock);
      grouped[stock.sector].summary.totalInvestment += stock.investment;
      grouped[stock.sector].summary.totalPresentValue += stock.presentValue;
      grouped[stock.sector].summary.gainLoss += stock.gainLoss;
    });

    setGroupedStocks(grouped);
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  if (loading) return (
  <div className="flex justify-center items-center h-screen">
  <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
</div>

  );
  
  if (error) return (
    <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
      <p className="font-bold">Error:</p>
      <p>{error}</p>
    </div>
  );

  const sectors = Object.keys(groupedStocks);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dynamic Portfolio Dashboard</h1>
      
    
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-md">
            <p className="text-gray-400 text-sm">Total Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalInvestment)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalPresentValue)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <p className="text-gray-400 text-sm">Gain/Loss</p>
            <p className={`text-2xl font-bold ${portfolioSummary.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(portfolioSummary.totalGainLoss)}
              <span className="text-sm ml-1">
                ({((portfolioSummary.totalGainLoss / portfolioSummary.totalInvestment) * 100).toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-block py-2 px-4 rounded-t-lg ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              All Stocks
            </button>
          </li>
          {sectors.map((sector) => (
            <li key={sector} className="mr-2">
              <button
                onClick={() => setActiveTab(sector)}
                className={`inline-block py-2 px-4 rounded-t-lg ${activeTab === sector ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
              >
                {sector}
              </button>
            </li>
          ))}
        </ul>
      </div>

      
      {activeTab === 'all' ? (
        // All stocks view
        <div>
          {sectors.map((sector) => (
            <div key={sector} className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{sector}</h2>
                <div className="flex space-x-4">
                  <div>
                    <span className="text-gray-400 text-sm">Investment:</span>
                    <span className="ml-2">{formatCurrency(groupedStocks[sector].summary.totalInvestment)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Value:</span>
                    <span className="ml-2">{formatCurrency(groupedStocks[sector].summary.totalPresentValue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Gain/Loss:</span>
                    <span className={`ml-2 ${groupedStocks[sector].summary.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(groupedStocks[sector].summary.gainLoss)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Particulars</th>
                      <th className="py-3 px-4 text-right">Purchase Price</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Investment</th>
                      <th className="py-3 px-4 text-right">Portfolio (%)</th>
                      <th className="py-3 px-4 text-left">NSE/BSE</th>
                      <th className="py-3 px-4 text-right">CMP</th>
                      <th className="py-3 px-4 text-right">Present Value</th>
                      <th className="py-3 px-4 text-right">Gain/Loss</th>
                      <th className="py-3 px-4 text-right">P/E Ratio</th>
                      <th className="py-3 px-4 text-right">Latest Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {groupedStocks[sector].stocks.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-4 font-medium">{stock.name}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(stock.purchasePrice)}</td>
                        <td className="py-3 px-4 text-right">{stock.quantity}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(stock.investment)}</td>
                        <td className="py-3 px-4 text-right">{stock.portfolioPercentage}</td>
                        <td className="py-3 px-4">{stock.symbol}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(stock.cmp)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(stock.presentValue)}</td>
                        <td className={`py-3 px-4 text-right font-medium ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(stock.gainLoss)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {typeof stock.peRatio === 'number' ? stock.peRatio.toFixed(2) : stock.peRatio}
                        </td>
                        <td className="py-3 px-4 text-right">{stock.latestEarnings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Single sector view
        <div>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Total Investment:</span>
                <span className="ml-2 text-lg font-semibold">{formatCurrency(groupedStocks[activeTab].summary.totalInvestment)}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Total Present Value:</span>
                <span className="ml-2 text-lg font-semibold">{formatCurrency(groupedStocks[activeTab].summary.totalPresentValue)}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Gain/Loss:</span>
                <span className={`ml-2 text-lg font-semibold ${groupedStocks[activeTab].summary.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(groupedStocks[activeTab].summary.gainLoss)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Particulars</th>
                  <th className="py-3 px-4 text-right">Purchase Price</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Investment</th>
                  <th className="py-3 px-4 text-right">Portfolio (%)</th>
                  <th className="py-3 px-4 text-left">NSE/BSE</th>
                  <th className="py-3 px-4 text-right">CMP</th>
                  <th className="py-3 px-4 text-right">Present Value</th>
                  <th className="py-3 px-4 text-right">Gain/Loss</th>
                  <th className="py-3 px-4 text-right">P/E Ratio</th>
                  <th className="py-3 px-4 text-right">Latest Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {groupedStocks[activeTab].stocks.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 font-medium">{stock.name}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(stock.purchasePrice)}</td>
                    <td className="py-3 px-4 text-right">{stock.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(stock.investment)}</td>
                    <td className="py-3 px-4 text-right">{stock.portfolioPercentage}</td>
                    <td className="py-3 px-4">{stock.symbol}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(stock.cmp)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(stock.presentValue)}</td>
                    <td className={`py-3 px-4 text-right font-medium ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(stock.gainLoss)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {typeof stock.peRatio === 'number' ? stock.peRatio.toFixed(2) : stock.peRatio}
                    </td>
                    <td className="py-3 px-4 text-right">{stock.latestEarnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;