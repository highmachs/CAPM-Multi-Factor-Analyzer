import React, { useState } from 'react';

const financialTerms = {
  capm: {
    term: "Capital Asset Pricing Model (CAPM)",
    definition: "A financial model that calculates the expected return of an asset based on its beta and expected market returns. Formula: E(R) = Rf + β × (E(Rm) - Rf)",
    usage: "Used to determine if an asset is fairly valued given its risk level."
  },
  beta: {
    term: "Beta Coefficient (β)",
    definition: "Measures the volatility of an asset compared to the overall market. β = 1 (market volatility), β > 1 (more volatile), β < 1 (less volatile).",
    usage: "Higher beta means higher risk and potentially higher returns."
  },
  alpha: {
    term: "Alpha (α)",
    definition: "Excess return of an investment relative to the return of a benchmark index. Positive alpha indicates outperformance.",
    usage: "Measures active return on an investment compared to a market index."
  },
  r_squared: {
    term: "R-Squared (R²)",
    definition: "Statistical measure representing the percentage of a fund's or security's movements explained by movements in a benchmark index.",
    usage: "0-100% scale; higher values indicate more correlation with the market."
  },
  p_value: {
    term: "P-Value",
    definition: "Probability that results occurred by chance. Lower p-values indicate statistically significant results.",
    usage: "Typically, p < 0.05 indicates statistical significance."
  },
  confidence_interval: {
    term: "Confidence Interval",
    definition: "Range of values that likely contains the true population parameter with a certain level of confidence.",
    usage: "95% confidence interval means we're 95% confident the true value lies within this range."
  },
  risk_free_rate: {
    term: "Risk-Free Rate",
    definition: "Theoretical rate of return of an investment with zero risk, typically based on government treasury bonds.",
    usage: "Serves as the baseline for calculating risk premiums."
  },
  market_premium: {
    term: "Market Risk Premium",
    definition: "Excess return expected from the market over the risk-free rate. E(Rm) - Rf",
    usage: "Compensation for investors taking on higher risk than risk-free assets."
  },
  sml: {
    term: "Security Market Line (SML)",
    definition: "Visual representation of the CAPM, showing the relationship between expected return and systematic risk (beta).",
    usage: "Helps identify undervalued (above SML) and overvalued (below SML) securities."
  },
  fama_french: {
    term: "Fama-French Three-Factor Model",
    definition: "Asset pricing model that expands on CAPM by adding size and value factors to market risk.",
    usage: "Explains stock returns better than CAPM alone by considering company size and valuation."
  },
  market_factor: {
    term: "Market Factor (MKT)",
    definition: "The excess return of the market over the risk-free rate, same as in CAPM.",
    usage: "Captures systematic market risk exposure."
  },
  smb: {
    term: "Size Factor (SMB - Small Minus Big)",
    definition: "The historical excess return of small-cap stocks over large-cap stocks.",
    usage: "Measures exposure to company size risk; positive loading favors small companies."
  },
  hml: {
    term: "Value Factor (HML - High Minus Low)",
    definition: "The historical excess return of value stocks (high book-to-market) over growth stocks.",
    usage: "Measures exposure to value risk; positive loading favors value stocks."
  },
  multifactor: {
    term: "Multi-Factor Model",
    definition: "Financial model that uses multiple factors to explain asset returns and risks.",
    usage: "Provides more comprehensive risk analysis than single-factor models like CAPM."
  },
  portfolio_beta: {
    term: "Portfolio Beta",
    definition: "Weighted average of individual asset betas in a portfolio.",
    usage: "Measures overall portfolio volatility relative to the market."
  },
  diversification: {
    term: "Diversification",
    definition: "Risk management strategy that mixes a wide variety of investments within a portfolio.",
    usage: "Reduces unsystematic risk through asset allocation."
  },
  sharpe: {
    term: "Sharpe Ratio",
    definition: "Measures risk-adjusted return, calculated as (Return - Risk-Free Rate) / Standard Deviation.",
    usage: "Higher Sharpe ratio indicates better risk-adjusted performance."
  },
  treynor: {
    term: "Treynor Ratio",
    definition: "Measures risk-adjusted return using beta instead of standard deviation.",
    usage: "(Return - Risk-Free Rate) / Beta; useful for well-diversified portfolios."
  },
  jensen_alpha: {
    term: "Jensen's Alpha",
    definition: "Measures excess return over the expected CAPM return.",
    usage: "Positive alpha indicates manager outperformance after adjusting for risk."
  },
  systematic_risk: {
    term: "Systematic Risk",
    definition: "Market risk that cannot be eliminated through diversification.",
    usage: "Affects entire market; measured by beta in CAPM."
  },
  unsystematic_risk: {
    term: "Unsystematic Risk",
    definition: "Asset-specific risk that can be eliminated through diversification.",
    usage: "Company-specific factors like management, industry conditions."
  }
};

const ExplanationTooltip = ({ term, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const termData = financialTerms[term];

  if (!termData) {
    return <span>{children}</span>;
  }

  return (
    <span 
      style={{ 
        position: 'relative',
        display: 'inline-block',
        borderBottom: '1px dotted #06b6d4',
        cursor: 'help'
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #06b6d4',
          borderRadius: '8px',
          padding: '1rem',
          width: '300px',
          zIndex: 1000,
          fontSize: '0.875rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            color: '#06b6d4', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            fontSize: '1rem'
          }}>
            {termData.term}
          </div>
          <div style={{ color: '#e5e7eb', marginBottom: '0.75rem' }}>
            {termData.definition}
          </div>
          <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>
            💡 {termData.usage}
          </div>
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #06b6d4'
          }}></div>
        </div>
      )}
    </span>
  );
};

export default ExplanationTooltip;