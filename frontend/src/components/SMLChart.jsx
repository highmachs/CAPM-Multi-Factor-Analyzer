import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Info } from 'lucide-react';

const SMLChart = ({ data }) => {
  if (!data || !data.beta || !data.expected_return) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 text-center"
      >
        <AlertTriangle className="mx-auto text-amber-400 mb-4" size={32} />
        <h3 className="text-amber-400 text-lg mb-2">Chart Data Unavailable</h3>
        <p className="text-gray-400">Complete analysis data required for SML visualization.</p>
      </motion.div>
    );
  }

  // Generate Security Market Line points
  const generateSML = () => {
    const points = [];
    const riskFree = data.treasury_yield || 0.04;
    const marketReturn = riskFree + (data.market_premium || 0.06);
    
    for (let beta = 0; beta <= 2.5; beta += 0.25) {
      points.push({
        beta: beta,
        return: riskFree + beta * (marketReturn - riskFree),
        type: 'sml'
      });
    }
    return points;
  };

  const smlData = generateSML();
  
  // Current stock data point
  const stockPoint = {
    beta: data.beta,
    return: data.actual_return || data.expected_return,
    type: 'stock',
    ticker: data.ticker,
    expectedReturn: data.expected_return,
    alpha: data.alpha
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      
      if (point.type === 'stock') {
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl min-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-cyan-400" size={16} />
              <strong className="text-cyan-400">{point.ticker}</strong>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Beta:</span>
                <span className="font-semibold">{point.beta?.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Actual Return:</span>
                <span className={`font-semibold ${point.return > point.expectedReturn ? 'text-green-400' : 'text-red-400'}`}>
                  {(point.return * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Expected Return:</span>
                <span className="text-cyan-400 font-semibold">
                  {(point.expectedReturn * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Alpha:</span>
                <span className={`font-semibold ${point.alpha > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(point.alpha * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className={`mt-2 p-2 rounded text-xs font-semibold text-center ${
              point.alpha > 0 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {point.alpha > 0 ? '📈 Outperforming' : '📉 Underperforming'}
            </div>
          </motion.div>
        );
      }
    }
    return null;
  };

  const riskLevel = data.beta > 1.2 ? 'High Risk' : data.beta > 0.8 ? 'Moderate Risk' : 'Low Risk';
  const riskColor = data.beta > 1.2 ? 'text-red-400' : data.beta > 0.8 ? 'text-amber-400' : 'text-green-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
        <div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2"
          >
            <Target className="text-cyan-400" />
            Security Market Line Analysis
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm"
          >
            Visualizing expected vs actual returns based on systematic risk (beta)
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <div className={`px-3 py-2 rounded-lg backdrop-blur-sm border ${riskColor} border-opacity-30 bg-opacity-10`}>
            <div className="text-xs text-gray-400">Risk Level</div>
            <div className={`font-semibold ${riskColor}`}>{riskLevel}</div>
          </div>
          <div className="px-3 py-2 rounded-lg backdrop-blur-sm border border-cyan-400 border-opacity-30 bg-cyan-400 bg-opacity-10">
            <div className="text-xs text-gray-400">Market Beta</div>
            <div className="font-semibold text-cyan-400">{data.beta?.toFixed(3)}</div>
          </div>
        </motion.div>
      </div>

      {/* Chart Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="h-96 relative"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            
            <XAxis 
              type="number" 
              dataKey="beta" 
              name="Beta"
              domain={[0, 2.5]}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ 
                value: 'Systematic Risk (Beta)', 
                position: 'insideBottom', 
                offset: -10,
                fill: '#9ca3af',
                fontSize: 12
              }}
            />
            
            <YAxis 
              type="number" 
              dataKey="return" 
              name="Return"
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ 
                value: 'Expected Return', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                fill: '#9ca3af',
                fontSize: 12
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Security Market Line */}
            <Line 
              type="monotone" 
              dataKey="return" 
              data={smlData} 
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="SML"
            />
            
            {/* Risk-free rate reference line */}
            <ReferenceLine 
              y={data.treasury_yield || 0.04} 
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: 'Risk-Free Rate',
                position: 'left',
                fill: '#10b981',
                fontSize: 10
              }}
            />
            
            {/* Market portfolio point (Beta=1) */}
            <Scatter data={[{ beta: 1, return: (data.treasury_yield || 0.04) + (data.market_premium || 0.06), type: 'market' }]} fill="#8b5cf6">
            </Scatter>
            
            {/* Current stock point with animation */}
            <Scatter data={[stockPoint]} fill="#ef4444">
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend and Interpretation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
            <Info size={16} />
            Chart Legend
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Current Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-400 bg-dashed"></div>
              <span className="text-gray-300">Security Market Line</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Market Portfolio (β=1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-400"></div>
              <span className="text-gray-300">Risk-Free Rate</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Interpretation
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              • <strong>Above SML:</strong> Stock is outperforming expectations (Positive Alpha)
            </p>
            <p>
              • <strong>Below SML:</strong> Stock is underperforming expectations (Negative Alpha)
            </p>
            <p>
              • <strong>Beta {'>'} 1:</strong> More volatile than market
            </p>
            <p>
              • <strong>Beta {'<'} 1:</strong> Less volatile than market
            </p>
          </div>
        </div>
      </motion.div>

      {/* Performance Summary */}
      {data.alpha && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className={`mt-6 p-4 rounded-xl border backdrop-blur-sm text-center ${
            data.alpha > 0 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            {data.alpha > 0 ? '🚀' : '📉'}
            {data.alpha > 0 ? 'Outperforming Market' : 'Underperforming Market'}
            {data.alpha > 0 ? '🚀' : '📉'}
          </div>
          <div className="text-sm mt-1">
            Alpha: <strong>{(data.alpha * 100).toFixed(2)}%</strong> • 
            {data.alpha > 0 ? ' Beating CAPM expectations' : ' Below CAPM expectations'}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SMLChart;