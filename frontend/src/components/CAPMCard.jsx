import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, BarChart3, Zap, AlertTriangle } from 'lucide-react'

const StatCard = ({ title, value, subtitle, icon: Icon, color = "cyan", delay = 0 }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay }}
    className={`glass-card p-6 border-l-4 border-${color}-500`}
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
    <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
  </motion.div>
)

const CAPMCard = ({ data }) => {
  if (!data) return null

  const getBetaInterpretation = (beta) => {
    if (beta > 1.2) return { text: "Aggressive Stock", color: "red", risk: "High" }
    if (beta > 0.8) return { text: "Moderate Stock", color: "yellow", risk: "Medium" }
    return { text: "Defensive Stock", color: "green", risk: "Low" }
  }

  const betaInfo = getBetaInterpretation(data.beta)

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Beta Coefficient"
          value={data.beta?.toFixed(3) || 'N/A'}
          subtitle="Market Sensitivity"
          icon={TrendingUp}
          color={betaInfo.color}
          delay={0}
        />
        <StatCard
          title="Alpha"
          value={`${(data.alpha * 100)?.toFixed(2)}%`}
          subtitle="Excess Return"
          icon={Target}
          color={data.alpha > 0 ? "green" : "red"}
          delay={0.1}
        />
        <StatCard
          title="R-Squared"
          value={(data.r_squared * 100)?.toFixed(1) + '%'}
          subtitle="Explained Variance"
          icon={BarChart3}
          color="blue"
          delay={0.2}
        />
        <StatCard
          title="Expected Return"
          value={`${(data.expected_return * 100)?.toFixed(2)}%`}
          subtitle="CAPM Prediction"
          icon={Zap}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>Risk Analysis</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Beta Interpretation</span>
              <span className={`font-semibold text-${betaInfo.color}-400`}>
                {betaInfo.text}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Risk Level</span>
              <span className={`font-semibold text-${betaInfo.color}-400`}>
                {betaInfo.risk}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">P-Value</span>
              <span className={`font-semibold ${data.p_value < 0.05 ? 'text-green-400' : 'text-red-400'}`}>
                {data.p_value?.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-300">Confidence Interval</span>
              <span className="font-semibold text-cyan-400">
                [{data.confidence_interval[0]?.toFixed(3)}, {data.confidence_interval[1]?.toFixed(3)}]
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Actual Return</span>
              <span className={`font-semibold ${data.actual_return > data.expected_return ? 'text-green-400' : 'text-red-400'}`}>
                {(data.actual_return * 100)?.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Expected Return</span>
              <span className="font-semibold text-cyan-400">
                {(data.expected_return * 100)?.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Market Premium</span>
              <span className="font-semibold text-yellow-400">
                {(data.market_premium * 100)?.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-300">Risk-Free Rate</span>
              <span className="font-semibold text-blue-400">
                {(data.treasury_yield * 100)?.toFixed(2)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interpretation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Quantitative Interpretation</h3>
        <div className="text-gray-300 space-y-2">
          <p>
            <strong>Beta {data.beta?.toFixed(2)}</strong> indicates this stock is{' '}
            {Math.abs(data.beta - 1) > 0.2 ? (data.beta > 1 ? 'more volatile' : 'less volatile') : 'similarly volatile'}{' '}
            than the market. {data.beta > 1 ? 'It tends to amplify market movements.' : 'It provides some protection during market downturns.'}
          </p>
          <p>
            <strong>Alpha {(data.alpha * 100)?.toFixed(2)}%</strong> suggests the stock has{' '}
            {data.alpha > 0 ? 'outperformed' : 'underperformed'} its CAPM-predicted returns by{' '}
            {Math.abs(data.alpha * 100)?.toFixed(2)}% annually.
          </p>
          <p>
            <strong>R² {(data.r_squared * 100)?.toFixed(1)}%</strong> means{' '}
            {(data.r_squared * 100)?.toFixed(1)}% of the stock's volatility is explained by market movements.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default CAPMCard