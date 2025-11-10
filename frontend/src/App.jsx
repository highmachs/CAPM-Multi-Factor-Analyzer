import React, { useState } from 'react'
import TickerInput from './components/TickerInput'
import SMLChart from './components/SMLChart'
import FactorExposure from './components/FactorExposure'
import ExplanationTooltip from './components/ExplanationTooltip'
import PortfolioAnalyzer from './components/PortfolioAnalyzer'
import StockDetails from './components/StockDetails';
import AnimatedBackground from './components/AnimatedBackground';
import LiveMarketData from './components/LiveMarketData';
import PortfolioCharts from './components/PortfolioChart';

console.log('🚀 App.jsx is loading...')

function App() {
  console.log('🚀 App.jsx is loading...')
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [factorData, setFactorData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('capm')

  const handleTickerSubmit = async (ticker) => {
    setLoading(true)
    setError(null)
    setAnalysisData(null)
    setFactorData(null)
    
    try {
      console.log(`Analyzing ticker: ${ticker}`)
      
      // Fetch both CAPM and Factor analysis
      const [capmResponse, factorResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/capm?ticker=${ticker}`).then(r => r.json()),
        fetch(`http://localhost:8000/api/multifactor?ticker=${ticker}`).then(r => r.json())
      ])
      
      setAnalysisData(capmResponse)
      setFactorData(factorResponse)
      console.log('Analysis complete:', { capm: capmResponse, factors: factorResponse })
      
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(`Analysis failed: ${err.message}. Make sure backend is running on port 8000.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground />
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <header className="glass-card" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              📊 CAPM & Multi-Factor Analyzer
            </h1>
            <p style={{ color: '#9ca3af' }}>Professional Quantitative Analysis Platform</p>
          </header>
          {/* Add Live Market Data Dashboard */}
          <LiveMarketData />
          <TickerInput onTickerSubmit={handleTickerSubmit} loading={loading} />
          
          {/* Error Message */}
          {error && (
            <div className="glass-card" style={{ 
              marginTop: '2rem', 
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)'
            }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>❌ Error</h3>
              <p style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #06b6d4',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p>🔬 Running Quantitative Analysis...</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Calculating CAPM beta, alpha, and factor exposures
              </p>
            </div>
          )}

          {/* Single Stock Analysis Results */}
          {analysisData && !loading && (
            <div>
              {/* Tab Navigation */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '1rem'
              }}>
                <button
                  onClick={() => setActiveTab('capm')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: activeTab === 'capm' ? '#06b6d4' : 'transparent',
                    border: '1px solid #06b6d4',
                    borderRadius: '8px',
                    color: activeTab === 'capm' ? 'white' : '#06b6d4',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  📈 CAPM Analysis
                </button>
                <button
                  onClick={() => setActiveTab('factors')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: activeTab === 'factors' ? '#8b5cf6' : 'transparent',
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                    color: activeTab === 'factors' ? 'white' : '#8b5cf6',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  📊 Factor Exposure
                </button>
              </div>

              {/* CAPM Tab Content */}
              {activeTab === 'capm' && (
                <div>
                  {/* CAPM Section Header with Explanation */}
                  <div style={{ marginBottom: '1rem', marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', color: '#06b6d4' }}>
                      📈 <ExplanationTooltip term="capm">CAPM Analysis</ExplanationTooltip> for {analysisData.ticker}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      Analyzing how {analysisData.ticker} performs relative to market expectations and risk
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="glass-card" style={{ marginTop: '1rem' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4' }}>
                          {analysisData.beta?.toFixed(3)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                          <ExplanationTooltip term="beta">Beta Coefficient</ExplanationTooltip>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.25rem' }}>
                          {analysisData.beta > 1 ? 'Aggressive' : 'Defensive'}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: `1px solid ${analysisData.alpha > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontWeight: 'bold', 
                          color: analysisData.alpha > 0 ? '#10b981' : '#ef4444' 
                        }}>
                          {(analysisData.alpha * 100)?.toFixed(2)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                          <ExplanationTooltip term="alpha">Alpha</ExplanationTooltip>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: analysisData.alpha > 0 ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
                          {analysisData.alpha > 0 ? 'Outperforming' : 'Underperforming'}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                          {(analysisData.r_squared * 100)?.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                          <ExplanationTooltip term="r_squared">R²</ExplanationTooltip>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.25rem' }}>
                          Explained Variance
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                          {(analysisData.expected_return * 100)?.toFixed(2)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                          <ExplanationTooltip term="capm">Expected Return</ExplanationTooltip>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                          CAPM Prediction
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stats with Explanations */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: '2rem',
                      fontSize: '0.875rem'
                    }}>
                      <div>
                        <strong style={{ color: '#06b6d4' }}>📊 Risk Analysis:</strong>
                        <ul style={{ color: '#9ca3af', marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
                          <li>
                            <ExplanationTooltip term="beta">Beta</ExplanationTooltip> {analysisData.beta?.toFixed(2)}: 
                            {analysisData.beta > 1 ? ' More volatile' : ' Less volatile'} than market
                          </li>
                          <li>
                            <ExplanationTooltip term="p_value">P-Value</ExplanationTooltip>: {analysisData.p_value?.toFixed(4)} 
                            {analysisData.p_value < 0.05 ? ' ✅' : ' ⚠️'}
                          </li>
                          <li>
                            <ExplanationTooltip term="confidence_interval">Confidence Interval</ExplanationTooltip>: 
                            [{analysisData.confidence_interval[0]?.toFixed(3)}, {analysisData.confidence_interval[1]?.toFixed(3)}]
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <strong style={{ color: '#06b6d4' }}>💰 Market Context:</strong>
                        <ul style={{ color: '#9ca3af', marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
                          <li>
                            <ExplanationTooltip term="risk_free_rate">Risk-Free Rate</ExplanationTooltip>: 
                            {(analysisData.treasury_yield * 100)?.toFixed(2)}%
                          </li>
                          <li>
                            <ExplanationTooltip term="market_premium">Market Premium</ExplanationTooltip>: 
                            {(analysisData.market_premium * 100)?.toFixed(2)}%
                          </li>
                          <li>
                            Actual Return: <strong style={{color: analysisData.actual_return > analysisData.expected_return ? '#10b981' : '#ef4444'}}>
                              {(analysisData.actual_return * 100)?.toFixed(2)}%
                            </strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SML Chart Header */}
                  <div style={{ marginBottom: '1rem', marginTop: '2rem' }}>
                    <h3 style={{ color: '#06b6d4' }}>
                      📊 <ExplanationTooltip term="sml">Security Market Line Analysis</ExplanationTooltip>
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      Visualizing expected vs actual returns based on systematic risk (beta)
                    </p>
                  </div>

                  {/* SML Chart */}
                  <SMLChart data={analysisData} />
                </div>
              )}

              {/* Factor Exposure Tab Content */}
              {activeTab === 'factors' && factorData && (
                <FactorExposure data={factorData} />
              )}
            </div>
          )}

          {/* Portfolio Analysis - Always visible below everything */}
          <PortfolioAnalyzer onPortfolioDataChange={setPortfolioData} />

          {/* Portfolio Charts - Show when we have analysis data */}
          {/*analysisData && (
            <PortfolioCharts portfolioData={portfolioData} analysisData={analysisData} />
          )*/}

          {/* Stock Details - Show when portfolio data is available */}
          {portfolioData && (
            <StockDetails stocks={portfolioData.stocks} />
          )}
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default App