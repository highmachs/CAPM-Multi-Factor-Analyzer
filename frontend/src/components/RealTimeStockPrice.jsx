import React, { useState, useEffect } from 'react';

const RealTimeStockPrice = ({ ticker }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stock-details?ticker=${ticker}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [ticker]);

  if (loading) {
    return (
      <div style={{ padding: '0.5rem', textAlign: 'center' }}>
        <div style={{ 
          width: '16px', 
          height: '16px', 
          border: '2px solid #06b6d4',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? '#10b981' : '#ef4444';
  const changeIcon = isPositive ? '↗' : '↘';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      border: `1px solid ${changeColor}30`,
      marginBottom: '0.5rem'
    }}>
      <div style={{ fontWeight: 'bold', color: '#06b6d4' }}>
        {ticker}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff' }}>
        ${stockData.currentPrice?.toFixed(2) || 'N/A'}
      </div>
      <div style={{ color: changeColor, fontWeight: 'bold' }}>
        {changeIcon} ${Math.abs(stockData.change).toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        color: '#9ca3af',
        marginLeft: 'auto'
      }}>
        Live
      </div>
    </div>
  );
};

export default RealTimeStockPrice;