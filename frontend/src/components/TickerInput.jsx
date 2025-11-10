import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Star, Zap, Loader2, X, ArrowUp, ArrowDown } from 'lucide-react';

const TickerInput = ({ onTickerSubmit, loading }) => {
  const [ticker, setTicker] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple', color: 'from-gray-600 to-gray-800' },
    { symbol: 'MSFT', name: 'Microsoft', color: 'from-blue-500 to-blue-700' },
    { symbol: 'GOOGL', name: 'Alphabet', color: 'from-red-500 to-red-700' },
    { symbol: 'AMZN', name: 'Amazon', color: 'from-amber-500 to-amber-700' },
    { symbol: 'TSLA', name: 'Tesla', color: 'from-red-600 to-red-800' },
    { symbol: 'META', name: 'Meta', color: 'from-blue-600 to-purple-700' },
    { symbol: 'NVDA', name: 'NVIDIA', color: 'from-green-500 to-green-700' },
    { symbol: 'JPM', name: 'JPMorgan', color: 'from-blue-400 to-blue-600' },
  ];

  // Fetch real-time stock data when ticker changes
  useEffect(() => {
    if (ticker && ticker.length >= 2) {
      const fetchStockPrice = async () => {
        setPriceLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/api/stock-details?ticker=${ticker}`);
          const data = await response.json();
          setStockData(data);
        } catch (error) {
          console.error('Error fetching stock price:', error);
          setStockData(null);
        } finally {
          setPriceLoading(false);
        }
      };

      const timeoutId = setTimeout(fetchStockPrice, 500); // Debounce
      return () => clearTimeout(timeoutId);
    } else {
      setStockData(null);
    }
  }, [ticker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim() && !loading) {
      onTickerSubmit(ticker.trim().toUpperCase());
    }
  };

  const handleQuickPick = (stockSymbol) => {
    setTicker(stockSymbol);
    if (!loading) {
      onTickerSubmit(stockSymbol);
    }
  };

  const clearInput = () => {
    setTicker('');
    setStockData(null);
  };

  const isPositive = stockData?.change >= 0;
  const changeColor = isPositive ? '#10b981' : '#ef4444';
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Quantitative Analysis Platform
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-center mb-6 text-lg"
      >
        Professional CAPM & Factor Exposure Analysis
      </motion.p>

      <form onSubmit={handleSubmit} className="mb-6">
        <motion.div 
          className={`relative transition-all duration-300 ${
            isFocused ? 'scale-105' : 'scale-100'
          }`}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter stock ticker (e.g., AAPL)"
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium backdrop-blur-sm"
              disabled={loading}
            />
            
            {ticker && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                type="button"
                onClick={clearInput}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            )}
          </div>

          {/* Real-time Stock Price Display */}
          {stockData && !priceLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-white font-bold text-lg">
                    {ticker}
                  </div>
                  <div className="text-white font-bold text-xl">
                    ${stockData.currentPrice?.toFixed(2) || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center gap-2" style={{ color: changeColor }}>
                  <ChangeIcon size={16} />
                  <div className="font-semibold">
                    ${Math.abs(stockData.change).toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
                  </div>
                </div>
              </div>
              
              {/* Additional Stock Info */}
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <div className="text-gray-400">Market Cap</div>
                  <div className="text-white font-semibold">
                    ${(stockData.fundamentals?.marketCap / 1e9).toFixed(1)}B
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">P/E Ratio</div>
                  <div className="text-white font-semibold">
                    {stockData.fundamentals?.peRatio?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Dividend Yield</div>
                  <div className="text-white font-semibold">
                    {stockData.fundamentals?.dividendYield?.toFixed(2)}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {priceLoading && ticker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 text-center"
            >
              <Loader2 className="animate-spin mx-auto text-cyan-400" size={20} />
              <div className="text-gray-400 text-sm mt-2">Loading real-time data...</div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={!ticker.trim() || loading}
            className={`w-full mt-4 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              ticker.trim() && !loading
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 shadow-lg shadow-cyan-500/25'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            whileHover={ticker.trim() && !loading ? { scale: 1.02 } : {}}
            whileTap={ticker.trim() && !loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Analyze Stock
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Popular Stocks Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="text-amber-400" size={18} />
          <span className="text-gray-400 text-sm font-semibold">POPULAR STOCKS</span>
          <Zap className="text-amber-400" size={18} />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AnimatePresence>
            {popularStocks.map((stock, index) => (
              <motion.button
                key={stock.symbol}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickPick(stock.symbol)}
                disabled={loading}
                className={`relative p-3 rounded-xl bg-gradient-to-br ${stock.color} backdrop-blur-sm border border-white/10 text-white font-semibold text-sm transition-all duration-300 group overflow-hidden ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {/* Background shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs opacity-90">{stock.symbol}</span>
                    <Star className="text-yellow-300" size={12} />
                  </div>
                  <div className="text-xs opacity-75 text-left">{stock.name}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
        >
          <div className="text-cyan-400 text-sm font-semibold">CAPM Analysis</div>
          <div className="text-gray-400 text-xs">Beta, Alpha, Risk Metrics</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
        >
          <div className="text-green-400 text-sm font-semibold">Factor Models</div>
          <div className="text-gray-400 text-xs">Fama-French 3-Factor</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
        >
          <div className="text-purple-400 text-sm font-semibold">Live Data</div>
          <div className="text-gray-400 text-xs">Real-time Updates</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TickerInput;