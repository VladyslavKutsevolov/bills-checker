# Bill Checker

Application that calls the Quickbooks Online APIs to return a list of added or modified bills since the last time of invoking the application

## Getting started

Clone the repo:
```bash
git clone https://github.com/VladyslavKutsevolov/bills-checker.git
```

Install dependencies:
```bash
cd api && npm install
cd client && npm install
```
Set environment variables:
```bash
cd api && cp .env.example .env.local
```

Run:
```bash
npm start from the root to start concurently
```

Run Test:
```bash
cd api && npm test
```

