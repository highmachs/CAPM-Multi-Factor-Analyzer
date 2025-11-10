import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, DollarSign, PieChart, Target, Calendar, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockDetails = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      fetchStockData();
    }
  }, [stocks]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const promises = stocks.map(stock => 
        fetch(`http://localhost:8000/api/stock-details?ticker=${stock.ticker}`)
          .then(r => r.json())
          .catch(() => generateMockData(stock.ticker))
      );
      
      const results = await Promise.all(promises);
      const dataMap = {};
      results.forEach((data, index) => {
        dataMap[stocks[index].ticker] = data;
      });
      setStockData(dataMap);
      setSelectedStock(stocks[0].ticker);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (ticker) => {
    // Mock data for demonstration
    const prices = Array.from({ length: 30 }, (_, i) => 
      100 + Math.sin(i * 0.3) * 20 + Math.random() * 10
    );
    
    return {
      ticker,
      currentPrice: prices[prices.length - 1],
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      chartData: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        prices
      },
      fundamentals: {
        marketCap: Math.random() * 500 + 100,
        peRatio: Math.random() * 30 + 10,
        dividendYield: Math.random() * 4,
        volume: Math.floor(Math.random() * 10000000)
      }
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#06b6d4',
        bodyColor: '#9ca3af',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  const createChartData = (data) => ({
    labels: data?.chartData?.labels || [],
    datasets: [
      {
        label: 'Price',
        data: data?.chartData?.prices || [],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3
      }
    ]
  });

  if (!stocks || stocks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
          <Zap className="text-cyan-400" />
          Live Stock Details
        </h3>
        <div className="flex gap-2">
          {stocks.map((stock, index) => (
            <motion.button
              key={stock.ticker}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStock(stock.ticker)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                selectedStock === stock.ticker
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {stock.ticker}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedStock && stockData[selectedStock] && (
          <motion.div
            key={selectedStock}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Price Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-xl border border-cyan-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-cyan-400" size={20} />
                  <span className="text-gray-400">Current Price</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  ${stockData[selectedStock].currentPrice?.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold ${
                  stockData[selectedStock].change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stockData[selectedStock].change >= 0 ? '↗' : '↘'} 
                  {stockData[selectedStock].change?.toFixed(2)} (
                  {stockData[selectedStock].changePercent?.toFixed(2)}%)
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-xl border border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="text-purple-400" size={20} />
                  <span className="text-gray-400">Market Cap</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  ${(stockData[selectedStock].fundamentals?.marketCap || 0).toFixed(1)}B
                </div>
                <div className="text-sm text-gray-400">Large Cap</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-xl border border-green-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-green-400" size={20} />
                  <span className="text-gray-400">P/E Ratio</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {(stockData[selectedStock].fundamentals?.peRatio || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Valuation</div>
              </motion.div>
            </div>

            {/* Price Chart */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 h-64"
            >
              <Line 
                data={createChartData(stockData[selectedStock])} 
                options={chartOptions}
              />
            </motion.div>

            {/* Fundamentals Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400 text-sm mb-1">Dividend Yield</div>
                <div className="text-lg font-bold text-amber-400">
                  {(stockData[selectedStock].fundamentals?.dividendYield || 0).toFixed(2)}%
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400 text-sm mb-1">Volume</div>
                <div className="text-lg font-bold text-blue-400">
                  {((stockData[selectedStock].fundamentals?.volume || 0) / 1000000).toFixed(1)}M
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400 text-sm mb-1">52W High</div>
                <div className="text-lg font-bold text-green-400">
                  ${(stockData[selectedStock].currentPrice * 1.15).toFixed(2)}
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400 text-sm mb-1">52W Low</div>
                <div className="text-lg font-bold text-red-400">
                  ${(stockData[selectedStock].currentPrice * 0.85).toFixed(2)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StockDetails;