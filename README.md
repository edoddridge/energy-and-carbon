# Energy and Carbon Dashboard

Public interactive dashboard to compare household energy choices and their annual cost and emissions impact in Australia.

## Features
### Transport Analysis
- Annual petrol vs EV cost and emissions comparison
- Input your distance, fuel/electricity prices, and vehicle efficiency
- Results show absolute costs/emissions plus percentage change

### Heating Analysis
- Annual gas heater vs reverse-cycle air conditioner (RCAC) cost and emissions comparison
- Input your annual heat demand, heater efficiency, RCAC COP, and tariffs
- Results show absolute costs/emissions plus percentage change
- Unit toggle for heat demand (MJ or kWh)

### Reference Section
Comprehensive reference tables with linked sources:
- Grid emissions intensity by region (AEMO CDEII 2024 data)
- Common petrol & diesel vehicles and their fuel consumption
- Common electric vehicles sold in Australia and their real-world energy consumption
- Typical household annual heating demand by climate zone
- Reverse-cycle air conditioner COP efficiency guide

## Stack
- Static HTML/CSS/JavaScript (ES modules, no build step required)
- Compatible with GitHub Pages static hosting
- Native Node.js test runner (`node --test`)

## Local Preview
Open `index.html` in a browser, or use any static file server:
```bash
# macOS
open index.html

# Or with a local server
python3 -m http.server
# Then visit http://localhost:8000
```

## Testing
Run unit tests with:
```bash
npm test
```

Tests cover:
- Car annual comparison calculation and edge cases
- Heating annual comparison calculation and edge cases
- Input validation and error handling

## Data Sources
- **Grid emissions**: AEMO CDEII 2024 annual averages (NEM regions); NGER / WA Gov (Western Australia)
- **Vehicle efficiency**: Green Vehicle Guide (ICE) and EV Database (EV) real-world figures
- **Heating demand**: 2021 Residential Baseline Study for Australia and New Zealand (energyrating.gov.au)
- **RCAC efficiency**: Australian Government energy.gov.au heating guidance (300–600% COP equivalents)

## GitHub Pages Deployment
This repository includes [deploy-pages.yml](.github/workflows/deploy-pages.yml), which deploys the repository root as a static Pages site on pushes to `main`.

### One-time repository settings
1. In GitHub, go to Settings > Pages.
2. Under Build and deployment, choose Source: GitHub Actions.
3. Push to `main` and wait for the workflow to complete.

## Project Structure
```
.
├── index.html                         # Dashboard page
├── package.json                       # Module type config and test script
├── .nojekyll                          # Disable Jekyll on GitHub Pages
├── README.md                          # This file
│
├── assets/
│   ├── app.js                         # Browser interaction logic
│   ├── styles.css                     # Site styling
│
├── src/
│   ├── calculations/
│   │   ├── carAnnualComparison.js     # Annual petrol vs EV calculator
│   │   └── heatingAnnualComparison.js # Annual gas vs RCAC calculator
│   │
│   └── data/
│       └── gridEmissionsFactors.js    # AEMO CDEII 2024 grid emissions by region
│
├── test/
│   ├── carAnnualComparison.test.js    # Car calculator tests
│   └── heatingAnnualComparison.test.js# Heating calculator tests
│
├── .github/
│   ├── agents/
│   │   └── energy-carbon-dashboard.agent.md  # VS Code agent customization
│   │
│   └── workflows/
│       └── deploy-pages.yml           # GitHub Actions deployment workflow
```

## Sign Conventions
- **Costs and emissions**: Lower is better for the alternative (EV/RCAC)
- **Change values**: Negative = improvement (lower cost/emissions), Positive = worse (higher cost/emissions)
- **Percentage change**: Shows the relative change vs the baseline scenario (petrol for cars, gas for heating)

## License
This project is licensed under the GNU General Public License v3.0.
See [LICENSE](LICENSE) for the full text.
