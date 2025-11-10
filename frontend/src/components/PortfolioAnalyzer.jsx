import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, PieChart, TrendingUp, Target, Zap, Calculator, RefreshCw } from 'lucide-react';
import PortfolioChart from './PortfolioChart';

const PortfolioAnalyzer = () => {
  const [stocks, setStocks] = useState([{ symbol: '', weight: '' }]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple', color: 'from-gray-600 to-gray-800' },
    { symbol: 'MSFT', name: 'Microsoft', color: 'from-blue-500 to-blue-700' },
    { symbol: 'GOOGL', name: 'Alphabet', color: 'from-red-500 to-red-700' },
    { symbol: 'AMZN', name: 'Amazon', color: 'from-amber-500 to-amber-700' },
    { symbol: 'TSLA', name: 'Tesla', color: 'from-red-600 to-red-800' },
    { symbol: 'META', name: 'Meta', color: 'from-blue-600 to-purple-700' },
  ];

  const addStock = () => {
    setStocks([...stocks, { symbol: '', weight: '' }]);
  };

  const removeStock = (index) => {
    if (stocks.length > 1) {
      const newStocks = stocks.filter((_, i) => i !== index);
      setStocks(newStocks);
    }
  };

  const updateStock = (index, field, value) => {
    const newStocks = stocks.map((stock, i) => 
      i === index ? { ...stock, [field]: value } : stock
    );
    setStocks(newStocks);
  };

  const quickAddStock = (symbol) => {
    const emptySlot = stocks.findIndex(stock => !stock.symbol);
    if (emptySlot !== -1) {
      updateStock(emptySlot, 'symbol', symbol);
    } else {
      setStocks([...stocks, { symbol, weight: '' }]);
    }
  };

  const calculateTotalWeight = () => {
    return stocks.reduce((total, stock) => total + (parseFloat(stock.weight) || 0), 0);
  };

  const analyzePortfolio = async () => {
    const validStocks = stocks.filter(stock => stock.symbol && stock.weight);
    
    if (validStocks.length === 0) {
      setError('Please add at least one stock with weight');
      return;
    }

    const totalWeight = calculateTotalWeight();
    if (Math.abs(totalWeight - 100) > 0.1) {
      setError(`Total weight must be 100%. Current: ${totalWeight.toFixed(1)}%`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare URL parameters matching backend expectations
      const tickersParam = validStocks.map(stock => stock.symbol).join(',');
      const weightsParam = validStocks.map(stock => stock.weight).join(',');
      
      const url = `http://localhost:8000/api/portfolio/capm?tickers=${encodeURIComponent(tickersParam)}&weights=${encodeURIComponent(weightsParam)}`;
      
      console.log('Fetching portfolio analysis from:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Portfolio analysis failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('Portfolio analysis result:', data);
      setPortfolioData(data);
    } catch (err) {
      console.error('Portfolio analysis error:', err);
      setError(`Failed to analyze portfolio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetPortfolio = () => {
    setStocks([{ symbol: '', weight: '' }]);
    setPortfolioData(null);
    setError('');
  };

  const totalWeight = calculateTotalWeight();
  const isValid = totalWeight === 100 && stocks.some(stock => stock.symbol && stock.weight);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 mt-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
        <div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-purple-400 mb-2 flex items-center gap-3"
          >
            <PieChart className="text-purple-400" />
            Portfolio Analyzer
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm"
          >
            Build and analyze multi-stock portfolios with CAPM metrics
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetPortfolio}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </motion.button>
        </motion.div>
      </div>

      {/* Quick Add Stocks */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-amber-400" size={16} />
          <span className="text-gray-400 text-sm font-semibold">QUICK ADD STOCKS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {popularStocks.map((stock, index) => (
            <motion.button
              key={stock.symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => quickAddStock(stock.symbol)}
              className={`p-2 rounded-lg bg-gradient-to-br ${stock.color} backdrop-blur-sm border border-white/10 text-white font-semibold text-xs transition-all`}
            >
              {stock.symbol}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stock Inputs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-4 mb-6"
      >
        <AnimatePresence>
          {stocks.map((stock, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm font-semibold mb-1 block">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    value={stock.symbol}
                    onChange={(e) => updateStock(index, 'symbol', e.target.value.toUpperCase())}
                    placeholder="e.g., AAPL"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-semibold mb-1 block">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={stock.weight}
                    onChange={(e) => updateStock(index, 'weight', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeStock(index)}
                disabled={stocks.length === 1}
                className={`p-2 rounded-lg transition-all ${
                  stocks.length === 1 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300'
                }`}
              >
                <Trash2 size={16} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Stock Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addStock}
          className="w-full p-4 border-2 border-dashed border-purple-400/30 hover:border-purple-400/50 rounded-xl text-purple-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <Plus size={20} />
          Add Another Stock
        </motion.button>
      </motion.div>

      {/* Weight Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`p-4 rounded-xl mb-6 backdrop-blur-sm border ${
          Math.abs(totalWeight - 100) < 0.1 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Portfolio Weight</span>
          <span className="text-lg font-bold">{totalWeight.toFixed(1)}%</span>
        </div>
        <div className="text-sm mt-1">
          {Math.abs(totalWeight - 100) < 0.1 
            ? '✅ Portfolio weights are properly allocated' 
            : `⚠️ Weights must sum to 100% (${(100 - totalWeight).toFixed(1)}% remaining)`
          }
        </div>
      </motion.div>

      {/* Analyze Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={analyzePortfolio}
        disabled={!isValid || loading}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isValid && !loading
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 shadow-lg shadow-purple-500/25'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
        whileHover={isValid && !loading ? { scale: 1.02 } : {}}
        whileTap={isValid && !loading ? { scale: 0.98 } : {}}
      >
        {loading ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Analyzing Portfolio...
          </>
        ) : (
          <>
            <Calculator size={20} />
            Analyze Portfolio
          </>
        )}
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Results */}
      <AnimatePresence>
        {portfolioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
          >
            <h4 className="text-purple-400 text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Portfolio Analysis Results
            </h4>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {portfolioData.beta?.toFixed(3)}
                </div>
                <div className="text-xs text-gray-400">Portfolio Beta</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {(portfolioData.alpha * 100)?.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">Portfolio Alpha</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-cyan-500/30">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {(portfolioData.expected_return * 100)?.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">Expected Return</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-amber-500/30">
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {(portfolioData.r_squared * 100)?.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">R²</div>
              </div>
            </div>

            {/* Stock Weights Visualization */}
            <div className="mb-4">
              <h5 className="text-gray-400 font-semibold mb-3">Portfolio Composition</h5>
              <div className="space-y-2">
                {portfolioData.portfolio?.map((ticker, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{ticker}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${portfolioData.weights[index]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">
                        {portfolioData.weights[index]?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`p-4 rounded-lg border ${
              portfolioData.beta > 1.2 
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : portfolioData.beta > 0.8
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-green-500/10 border-green-500/30 text-green-400'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                <Target size={16} />
                Risk Assessment: {' '}
                {portfolioData.beta > 1.2 
                  ? 'Aggressive Portfolio' 
                  : portfolioData.beta > 0.8
                  ? 'Moderate Portfolio'
                  : 'Conservative Portfolio'
                }
              </div>
              <div className="text-sm mt-1">
                Portfolio Beta of {portfolioData.beta?.toFixed(2)} indicates{' '}
                {portfolioData.beta > 1 ? 'higher' : 'lower'} volatility than market
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Performance Chart */}
      <AnimatePresence>
        {portfolioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PortfolioChart portfolioData={portfolioData} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PortfolioAnalyzer;