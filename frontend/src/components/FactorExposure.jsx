import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Target } from 'lucide-react';

const FactorExposure = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (data && data.market_beta !== undefined) {
        setChartData([
          { name: 'Market (MKT)', value: data.market_beta, type: 'market' },
          { name: 'Size (SMB)', value: data.smb_beta, type: 'size' },
          { name: 'Value (HML)', value: data.hml_beta, type: 'value' }
        ]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mt-8 text-center"
      >
        <h3 className="text-cyan-500 mb-4 text-xl font-semibold">📊 Factor Exposure Analysis</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </motion.div>
    );
  }

  const hasValidData = data.market_beta !== undefined && 
                       data.smb_beta !== undefined && 
                       data.hml_beta !== undefined &&
                       !isNaN(data.market_beta) && 
                       !isNaN(data.smb_beta) && 
                       !isNaN(data.hml_beta);

  if (!hasValidData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card mt-8"
      >
        <h3 className="text-amber-500 mb-4 text-xl font-semibold flex items-center gap-2">
          <Info size={20} />
          ⚠️ Factor Data Temporarily Unavailable
        </h3>
        <p className="text-gray-400 mb-4">
          We're working on integrating live Fama-French factor data. 
          In a production environment, this would connect to the Kenneth French data library.
        </p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30"
        >
          <strong className="text-amber-500">Demo Values:</strong>
          <ul className="text-gray-400 mt-2 space-y-1">
            <li>Market Beta: 1.2 (Typical for tech stocks)</li>
            <li>Size Factor: -0.3 (Large-cap tilt)</li>
            <li>Value Factor: -0.2 (Growth orientation)</li>
          </ul>
        </motion.div>
      </motion.div>
    );
  }

  const getBarColor = (type, value) => {
    const colors = {
      market: '#06b6d4',
      size: value > 0 ? '#10b981' : '#ef4444',
      value: value > 0 ? '#8b5cf6' : '#f59e0b'
    };
    return colors[type];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const factor = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl"
        >
          <p className="font-semibold text-cyan-400 mb-2">
            {factor.name}
          </p>
          <p className="text-sm mb-1">
            <strong>Exposure:</strong> {factor.value?.toFixed(3)}
          </p>
          <p className="text-xs text-gray-300">
            {getFactorDescription(factor.name, factor.value)}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const getFactorDescription = (name, value) => {
    if (name.includes('MKT')) {
      return value > 1 ? 'High market sensitivity' : 'Low market sensitivity';
    } else if (name.includes('SMB')) {
      return value > 0 ? 'Small-cap exposure' : 'Large-cap exposure';
    } else if (name.includes('HML')) {
      return value > 0 ? 'Value stock exposure' : 'Growth stock exposure';
    }
    return '';
  };

  const getSignificanceColor = (pvalue) => {
    return pvalue < 0.05 ? 'text-green-400' : 'text-red-400';
  };

  const getSignificanceIcon = (pvalue) => {
    return pvalue < 0.05 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card mt-8"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-cyan-500 mb-6 flex items-center gap-3"
      >
        <Target className="text-cyan-400" />
        Fama-French 3-Factor Exposure
      </motion.h3>
      
      {/* Animated Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="h-80 mb-8"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.type, entry.value)}
                  opacity={isVisible ? 1 : 0}
                  style={{
                    transition: 'opacity 0.5s ease-in-out',
                    transitionDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Factor Explanations with Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30 backdrop-blur-sm"
        >
          <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
            <TrendingUp size={16} />
            Market Factor (MKT)
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            Measures sensitivity to overall market movements. Beta {'>'} 1 indicates higher volatility than market.
          </p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className={`p-4 rounded-xl border backdrop-blur-sm ${
            data.smb_beta > 0 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
            data.smb_beta > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.smb_beta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            Size Factor (SMB)
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.smb_beta > 0 
              ? 'Small-cap exposure - higher risk/return potential' 
              : 'Large-cap exposure - more stable, lower risk'
            }
          </p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className={`p-4 rounded-xl border backdrop-blur-sm ${
            data.hml_beta > 0 
              ? 'bg-purple-500/10 border-purple-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
            data.hml_beta > 0 ? 'text-purple-400' : 'text-amber-400'
          }`}>
            {data.hml_beta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            Value Factor (HML)
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.hml_beta > 0 
              ? 'Value stock exposure - cheaper, often higher dividends' 
              : 'Growth stock exposure - higher earnings potential'
            }
          </p>
        </motion.div>
      </motion.div>

      {/* Statistical Significance with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <h4 className="text-cyan-400 font-semibold mb-4 text-lg flex items-center gap-2">
          <Info size={18} />
          Statistical Significance
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-2xl font-bold text-purple-400 mb-1"
            >
              {((data.r_squared || 0) * 100)?.toFixed(1)}%
            </motion.div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">R²</div>
          </div>
          
          {Object.entries(data.factor_pvalues || {MKT: 0.01, SMB: 0.05, HML: 0.05}).map(([factor, pvalue], index) => (
            <motion.div 
              key={factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {getSignificanceIcon(pvalue)}
                <div className={`text-lg font-bold ${getSignificanceColor(pvalue)}`}>
                  {(pvalue || 0.05)?.toFixed(4)}
                </div>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                {factor} P-Value
              </div>
              <div className={`text-xs font-semibold ${getSignificanceColor(pvalue)}`}>
                {(pvalue || 0.05) < 0.05 ? 'Significant' : 'Not Significant'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FactorExposure;