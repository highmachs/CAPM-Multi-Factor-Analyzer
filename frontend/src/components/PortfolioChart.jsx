import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PortfolioChart = ({ portfolioData }) => {
  const [activePeriod, setActivePeriod] = useState('1m');
  const [chartData, setChartData] = useState([]);
  const [portfolioAllocation, setPortfolioAllocation] = useState([]);

  // Generate realistic dates based on current date
  const generateChartData = (period) => {
    const today = new Date();
    const data = [];
    let daysBack;
    
    switch (period) {
      case '1d':
        daysBack = 1;
        break;
      case '1w':
        daysBack = 7;
        break;
      case '1m':
        daysBack = 30;
        break;
      case '1y':
        daysBack = 365;
        break;
      default:
        daysBack = 30;
    }

    // Generate portfolio value based on realistic market movements
    let portfolioValue = 10000;
    let benchmarkValue = 10000;
    
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Realistic price movements based on portfolio beta
      const marketMove = (Math.random() - 0.5) * 2; // Market movement -0.5% to +0.5%
      const portfolioMove = marketMove * (portfolioData?.beta || 1.0); // Amplified by beta
      const randomNoise = (Math.random() - 0.5) * 0.5; // Stock-specific noise
      
      portfolioValue *= (1 + (portfolioMove + randomNoise) / 100);
      benchmarkValue *= (1 + marketMove / 100);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        portfolio: Math.round(portfolioValue),
        benchmark: Math.round(benchmarkValue)
      });
    }
    
    return data;
  };

  // Calculate portfolio allocation with share counts
  const calculatePortfolioAllocation = () => {
    if (!portfolioData?.portfolio || !portfolioData?.weights) return [];
    
    const totalPortfolioValue = 10000; // Assume $10,000 portfolio
    const stockPrices = {
      'AAPL': 185, 'MSFT': 380, 'GOOGL': 175, 'AMZN': 175, 
      'TSLA': 210, 'META': 485, 'NVDA': 1150, 'JPM': 195
    };
    
    return portfolioData.portfolio.map((ticker, index) => {
      const weight = portfolioData.weights[index];
      const allocationAmount = (weight / 100) * totalPortfolioValue;
      const currentPrice = stockPrices[ticker] || 100;
      const shares = allocationAmount / currentPrice;
      
      return {
        ticker,
        weight,
        allocation: allocationAmount,
        currentPrice,
        shares: Math.round(shares * 10) / 10 // Round to 1 decimal
      };
    });
  };

  useEffect(() => {
    setChartData(generateChartData(activePeriod));
    setPortfolioAllocation(calculatePortfolioAllocation());
  }, [activePeriod, portfolioData]);

  const periodLabels = {
    '1d': '1 Day',
    '1w': '1 Week', 
    '1m': '1 Month',
    '1y': '1 Year'
  };

  const totalReturn = chartData.length > 0 
    ? ((chartData[chartData.length-1]?.portfolio / chartData[0]?.portfolio - 1) * 100) 
    : 0;
  const benchmarkReturn = chartData.length > 0 
    ? ((chartData[chartData.length-1]?.benchmark / chartData[0]?.benchmark - 1) * 100) 
    : 0;
  const totalGain = chartData.length > 0 
    ? (chartData[chartData.length-1]?.portfolio - chartData[0]?.portfolio) 
    : 0;

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-cyan-500 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].payload.fullDate}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: <strong>${entry.value.toLocaleString()}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-cyan-400">📈 Portfolio Performance</h3>
        <div className="flex gap-2">
          {Object.entries(periodLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActivePeriod(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePeriod === key
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => (
              <span style={{ color: value === 'Your Portfolio' ? '#06b6d4' : '#8b5cf6' }}>
                {value}
              </span>
            )}
          />
          <Area 
            type="monotone" 
            dataKey="portfolio" 
            stroke="#06b6d4"
            fill="url(#portfolioGradient)"
            strokeWidth={2}
            name="Your Portfolio"
          />
          <Area 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#8b5cf6"
            fill="url(#benchmarkGradient)"
            strokeWidth={2}
            name="S&P 500"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Portfolio Allocation Details */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h4 className="text-purple-400 font-semibold mb-3">💰 Portfolio Allocation ($10,000 Total)</h4>
        <div className="space-y-3">
          {portfolioAllocation.map((stock, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white w-16">{stock.ticker}</span>
                <span className="text-gray-400">${stock.currentPrice}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-cyan-400">{stock.shares} shares</span>
                <span className="text-gray-400 w-20 text-right">${stock.allocation.toFixed(0)}</span>
                <span className="text-purple-400 w-12 text-right">{stock.weight}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
          💡 Based on current market prices. Actual allocation may vary.
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
          <div className="text-gray-400 text-sm">Portfolio Return</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${benchmarkReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
            {benchmarkReturn >= 0 ? '+' : ''}{benchmarkReturn.toFixed(1)}%
          </div>
          <div className="text-gray-400 text-sm">S&P 500 Return</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toFixed(0)}
          </div>
          <div className="text-gray-400 text-sm">Total Gain/Loss</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">
            {activePeriod.toUpperCase()}
          </div>
          <div className="text-gray-400 text-sm">Time Period</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;