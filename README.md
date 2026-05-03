# Energy and Carbon Dashboard

Public interactive dashboard to compare household energy choices in Australia.

## Current Feature
- Annual petrol vs EV comparison for running energy cost and operational emissions.

## Stack
- Static HTML/CSS/JavaScript (ES modules)
- No build step required
- Compatible with GitHub Pages static hosting

## Local Preview
Open `index.html` in a browser, or use any static file server.

## Data Sources for Assumptions
- Fuel price (ULP): Australian Institute of Petroleum historical TGP data
- Fuel efficiency: Green Vehicle Guide
- EV efficiency: Green Vehicle Guide or EV Database

## GitHub Pages Deployment
This repository includes [deploy-pages.yml](.github/workflows/deploy-pages.yml), which deploys the repository root as a static Pages site on pushes to `main`.

### One-time repository settings
1. In GitHub, go to Settings > Pages.
2. Under Build and deployment, choose Source: GitHub Actions.
3. Push to `main` and wait for the workflow to complete.

## Project Structure
- `index.html`: Dashboard page
- `assets/styles.css`: Site styling
- `assets/app.js`: Browser interaction logic
- `src/calculations/carAnnualComparison.js`: Annual petrol vs EV calculator
- `test/carAnnualComparison.test.js`: Calculator tests
