# 📊 CAPM & Multi-Factor Analyzer

A professional quantitative analysis platform for Capital Asset Pricing Model (CAPM) analysis, Fama-French multi-factor modeling, and portfolio optimization. Built with React frontend and FastAPI backend.

![Status](https://img.shields.io/badge/Status-Production%25100Ready-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![Python](https://img.shields.io/badge/Python-3.11-blue)


## 🌟 Features

### 📈 Real-time Market Data
- Live S&P 500, NASDAQ, Dow Jones indices  
- VIX Fear Index monitoring  
- 10-Year Treasury yield (risk-free rate)  
- Auto-refresh every 10 seconds  

### 🔬 Single Stock Analysis
- **CAPM Analysis:** Beta, Alpha, R-squared calculations  
- **Security Market Line:** Visual risk-return positioning  
- **Statistical Significance:** P-values and confidence intervals  
- **Expected vs Actual Returns:** Performance comparison  

### 📊 Multi-Factor Models
- Fama-French 3-Factor exposure analysis  
- Market, Size, and Value factor loadings  
- Statistical validation with p-values  
- Interactive factor exposure charts  

### 💼 Portfolio Optimization
- Multi-stock portfolio builder  
- Weight allocation with validation  
- Portfolio-level CAPM metrics  
- Performance charts (1D, 1W, 1M, 1Y)  
- Share allocation calculations  

### 🎓 Educational Features
- Hover-based financial term explanations  
- Professional risk assessment  
- Comprehensive financial insights  
- Academic and industry standard methodologies  


## 🚀 Quick Start

### Prerequisites
- Python 3.11+  
- Node.js 16+  
- npm or yarn  

### Installation

**Clone the repository**
git clone <repository-url>
cd QUANTPROJECT1


## Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

## Frontend Setup (new terminal)
cd frontend
npm install
npm run dev

Access the Application

Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/docs

📁 Project Structure
Root/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Container configuration
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.jsx          # Main application
    │   └── main.jsx         # React entry point
    ├── package.json         # Node dependencies
    └── vite.config.js       # Build configuration

### Usage Guide

## Single Stock Analysis
Enter a stock ticker (e.g., AAPL, TSLA, GOOGL)
View real-time price and fundamentals
Analyze CAPM metrics and factor exposures
Interpret statistical significance

## Portfolio Construction
Add multiple stocks with weight allocation
Ensure total weights sum to 100%
Analyze portfolio risk metrics
View performance across time periods
Review share allocation

## Market Monitoring
Watch live market indices in the dashboard
Monitor volatility with VIX index
Track risk-free rate changes

## API Endpoints
Core Endpoints
GET /api/capm?ticker={symbol} - CAPM analysis
GET /api/multifactor?ticker={symbol} - Factor exposure
GET /api/portfolio/capm?tickers={list}&weights={list} - Portfolio analysis
GET /api/market/live - Real-time market data
GET /api/stock-details?ticker={symbol} - Stock fundamentals

Example API Call
curl "http://localhost:8000/api/capm?ticker=AAPL"

## 🛠️ Technical Details

### 🧩 Backend Stack
- **FastAPI** – Modern Python web framework  
- **pandas / numpy** – Data analysis and numerical computing  
- **yfinance** – Yahoo Finance market data integration  
- **statsmodels** – Statistical modeling and regression  
- **cachetools** – Performance caching and optimization  

### 🎨 Frontend Stack
- **React 18** – Modern, component-based UI library  
- **Vite** – Fast build tool and development server  
- **Tailwind CSS** – Utility-first CSS framework for rapid design  
- **Recharts** – Composable charting library for financial data visualization  
- **Framer Motion** – Advanced animation and motion handling  


## 📈 Financial Models Implemented
- **Capital Asset Pricing Model (CAPM)**  
- **Fama–French 3-Factor Model**  
- **Portfolio Theory & Diversification**  
- **Statistical Regression Analysis**


## 🐛 Troubleshooting Guide

### ⚙️ Backend Not Starting
- Check Python version (**requires 3.11+**)  
- Verify all dependencies are installed  
- Ensure **port 8000** is not in use  

### 🧱 Frontend Build Errors
- Clear and reinstall dependencies:
  ```rm -rf node_modules && npm install```
Check Node.js version (requires 16+)

### Market Data Not Loading
Verify your internet connection
Check Yahoo Finance API status
The backend provides fallback data if the API fails

## ⚙️ Debug Mode

**Enable detailed logging by setting environment variables:**

### **Backend**  
export DEBUG=true  
python main.py  

### **Frontend**  
npm run dev -- --debug  

## 📈 Performance Features

- **Real-time Updates:** Market data refreshes every 10 seconds  
- **Caching:** 1-hour TTL for performance optimization  
- **Error Handling:** Graceful fallbacks for API failures  
- **Responsive Design:** Works on desktop, tablet, and mobile  

## 🤝 Contributing

We welcome contributions! Please see our **Contributing Guidelines** for details.

### **Development Setup**
1. **Fork** the repository  
2. **Create** a feature branch  
3. **Make** your changes  
4. **Add** tests if applicable  
5. **Submit** a pull request  

## 📊 Financial Models Reference

### **Capital Asset Pricing Model (CAPM)**

**Formula:**  
E(R) = Rf + β * (E(Rm) - Rf)

**Where:**  
- **E(R):** Expected return  
- **Rf:** Risk-free rate  
- **β:** Beta coefficient  
- **E(Rm):** Expected market return  

### **Fama-French 3-Factor Model**

**Formula:**  
E(R) = Rf + β₁*(Rm - Rf) + β₂*SMB + β₃*HML + α  

**Where:**  
- **SMB:** Small Minus Big (size factor)  
- **HML:** High Minus Low (value factor)  
- **α:** Alpha (excess return)  

## 🆘 Support

- **Documentation:** Check **PROGRESS.md** for detailed development history  
- **Issues:** Use **GitHub Issues** for bug reports  
- **Questions:** Open a **Discussion** for general questions  

## 📄 License

This project is licensed under the **MIT License** – see the **LICENSE** file for details.  

## 🙏 Acknowledgments

- **Yahoo Finance** for market data API  
- **FastAPI** and **React** communities  
- **Financial academia** for quantitative model foundations  
