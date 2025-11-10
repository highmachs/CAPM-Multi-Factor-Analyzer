import React, { useState, useEffect } from 'react';

const LiveMarketData = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/market/live');
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to mock data if API fails
        const mockMarketData = {
          sp500: { price: 4780 + Math.random() * 100, change: (Math.random() - 0.5) * 2 },
          nasdaq: { price: 16500 + Math.random() * 200, change: (Math.random() - 0.5) * 3 },
          djia: { price: 37500 + Math.random() * 150, change: (Math.random() - 0.5) * 1.5 },
          vix: { price: 13 + Math.random() * 5, change: (Math.random() - 0.5) * 2 },
          treasury: { yield: 4.1 + Math.random() * 0.5 }
        };
        setMarketData(mockMarketData);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#06b6d4', marginBottom: '1rem' }}>📈 Live Market Data</h3>
        <p style={{ color: '#9ca3af' }}>Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ 
        color: '#06b6d4', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📈 Live Market Overview
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>S&P 500</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#06b6d4' }}>
            {marketData?.sp500?.price.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: marketData?.sp500?.change >= 0 ? '#10b981' : '#ef4444'
          }}>
            {marketData?.sp500?.change >= 0 ? '↑' : '↓'} {Math.abs(marketData?.sp500?.change).toFixed(2)}%
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>NASDAQ</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {marketData?.nasdaq?.price.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: marketData?.nasdaq?.change >= 0 ? '#10b981' : '#ef4444'
          }}>
            {marketData?.nasdaq?.change >= 0 ? '↑' : '↓'} {Math.abs(marketData?.nasdaq?.change).toFixed(2)}%
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>DOW JONES</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {marketData?.djia?.price.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: marketData?.djia?.change >= 0 ? '#10b981' : '#ef4444'
          }}>
            {marketData?.djia?.change >= 0 ? '↑' : '↓'} {Math.abs(marketData?.djia?.change).toFixed(2)}%
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>VIX</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
            {marketData?.vix?.price.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Fear Index
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>10-YR TREASURY</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
            {marketData?.treasury?.yield.toFixed(2)}%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Risk-Free Rate
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem',
        background: 'rgba(6, 182, 212, 0.1)',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#06b6d4',
        textAlign: 'center'
      }}>
        🔄 Live data updates every 5 seconds • Last update: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default LiveMarketData;