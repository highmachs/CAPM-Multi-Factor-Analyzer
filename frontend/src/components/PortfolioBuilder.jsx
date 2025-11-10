import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, PieChart, Calculator } from 'lucide-react'

const PortfolioBuilder = () => {
  const [tickers, setTickers] = useState([{ symbol: '', weight: 100 }])
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const addTicker = () => {
    setTickers([...tickers, { symbol: '', weight: 0 }])
  }

  const removeTicker = (index) => {
    if (tickers.length > 1) {
      const newTickers = tickers.filter((_, i) => i !== index)
      setTickers(newTickers)
    }
  }

  const updateTicker = (index, field, value) => {
    const newTickers = tickers.map((ticker, i) => 
      i === index ? { ...ticker, [field]: value } : ticker
    )
    setTickers(newTickers)
  }

  const calculatePortfolio = async () => {
    const validTickers = tickers.filter(t => t.symbol.trim() !== '')
    if (validTickers.length === 0) return

    setLoading(true)
    try {
      const tickerList = validTickers.map(t => t.symbol.toUpperCase())
      const weightList = validTickers.map(t => parseFloat(t.weight) / 100)

      const response = await fetch(`/api/portfolio/capm?${tickerList.map((t, i) => `tickers=${t}&weights=${weightList[i]}`).join('&')}`)
      const data = await response.json()
      setPortfolioAnalysis(data)
    } catch (error) {
      console.error('Portfolio analysis failed:', error)
      alert('Portfolio analysis failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  const totalWeight = tickers.reduce((sum, ticker) => sum + parseFloat(ticker.weight || 0), 0)

  return (
    <div className="space-y-6">
      {/* Portfolio Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <PieChart className="w-6 h-6 text-cyan-400" />
          <span>Portfolio Builder</span>
        </h3>

        <div className="space-y-4">
          {tickers.map((ticker, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-2">
                    Stock Ticker
                  </label>
                  <input
                    type="text"
                    value={ticker.symbol}
                    onChange={(e) => updateTicker(index, 'symbol', e.target.value)}
                    placeholder="e.g., AAPL"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-2">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={ticker.weight}
                    onChange={(e) => updateTicker(index, 'weight', e.target.value)}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <button
                onClick={() => removeTicker(index)}
                disabled={tickers.length === 1}
                className="btn-secondary mt-6 md:mt-8 flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
            <button
              onClick={addTicker}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>

            <div className="text-sm text-gray-300">
              Total Weight: <span className={totalWeight === 100 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {totalWeight}%
              </span>
            </div>

            <button
              onClick={calculatePortfolio}
              disabled={loading || totalWeight !== 100}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator className="w-4 h-4" />
              <span>{loading ? 'Calculating...' : 'Analyze Portfolio'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Portfolio Analysis Results */}
      <AnimatePresence>
        {portfolioAnalysis && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Portfolio Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">
                  {portfolioAnalysis.beta?.toFixed(3)}
                </div>
                <div className="text-sm text-gray-400">Portfolio Beta</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className={`text-2xl font-bold ${portfolioAnalysis.alpha > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(portfolioAnalysis.alpha * 100)?.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-400">Portfolio Alpha</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {(portfolioAnalysis.r_squared * 100)?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">R²</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {(portfolioAnalysis.expected_return * 100)?.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-400">Expected Return</div>
              </div>
            </div>

            {/* Portfolio Composition */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-3">Portfolio Composition</h4>
              <div className="space-y-2">
                {portfolioAnalysis.portfolio.map((ticker, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-cyan-300">{ticker}</span>
                    <span className="text-white">{(portfolioAnalysis.weights[index] * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PortfolioBuilder