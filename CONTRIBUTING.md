# Contributing to CAPM & Multi-Factor Analyzer

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug  
- Discussing the current state of the code  
- Submitting a fix  
- Proposing new features  
- Becoming a maintainer  

## Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests.

1. Fork the repo and create your branch from `main`  
2. If you've added code that should be tested, add tests  
3. If you've changed APIs, update the documentation  
4. Ensure the test suite passes  
5. Make sure your code lints  
6. Issue that pull request!  

## Any contributions you make will be under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.  
Feel free to contact the maintainers if that's a concern.  

## Report bugs using GitHub's issue tracker

We use GitHub issues to track public bugs.  
Report a bug by **opening a new issue** — it's that easy!  

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:  

- A quick summary and/or background  
- Steps to reproduce  
  - Be specific!  
  - Include sample code if possible  
- What you expected would happen  
- What actually happens  
- Notes (why you think this might be happening, or what you tried that didn’t work)  

## Local Development

### **Backend Setup**
cd backend  
python -m venv venv  
source venv/bin/activate  # Windows: venv\Scripts\activate  
pip install -r requirements.txt  
python main.py  

### **Frontend Setup**
cd frontend  
npm install  
npm run dev  

## Code Style

### **Python**
- Follow **PEP 8** guidelines  
- Use **type hints** where possible  
- Include **docstrings** for functions  
- Use **meaningful variable names**  

### **JavaScript / React**
- Use **functional components with hooks**  
- Follow **ESLint configuration**  
- Use **meaningful component and variable names**  
- Include **PropTypes** for component props  


## Pull Request Process

- Update the **README.md** with details of changes if applicable  
- Update the **PROGRESS.md** if you've added significant features  
- The PR will be merged once you have the sign-off of other developers  

## License

By contributing, you agree that your contributions will be licensed under the project’s **MIT License**.  
