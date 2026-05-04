/**
 * Annual household heating comparison: gas heater vs reverse-cycle air conditioner.
 *
 * Formulas:
 *   Gas consumed (MJ)  = annualHeatDemandMj / gasEfficiency
 *   Gas cost (AUD)     = gasConsumedMj × gasPriceAudPerMj
 *   Gas emissions      = gasConsumedMj × gasKgCo2ePerMj
 *
 *   RCAC electricity (kWh) = annualHeatDemandMj / (rcacCop × 3.6)
 *   RCAC cost (AUD)        = electricityKwh × electricityTariffAudPerKwh
 *   RCAC emissions         = electricityKwh × gridKgCo2ePerKwh
 *
 * Notes on defaults:
 * - `gasPriceAudPerMj`      Retail gas tariff; varies by state and retailer.
 * - `gasKgCo2ePerMj`        Natural gas combustion; NGA Factors: ~51.33 kgCO2e/GJ = 0.05133 kgCO2e/MJ.
 * - `gasEfficiency`         Star-rating-derived seasonal efficiency; e.g. 6-star ducted ≈ 0.90.
 * - `rcacCop`               Reverse-cycle heating COP; typical AU unit ≈ 3.0–4.0.
 * - `gridKgCo2ePerKwh`      AEMO CDEII NEM-wide approximate 2024 annual average.
 *                           Use per-state values from src/data/gridEmissionsFactors.js for
 *                           region-specific analysis.
 */

import { NEM_AVERAGE_CDEII_2025 } from "../data/gridEmissionsFactors.js";

/**
 * @typedef {Object} HeatingComparisonInputs
 * @property {number} annualHeatDemandMj        Heat output required per year (MJ)
 * @property {number} gasEfficiency             Gas heater seasonal efficiency (0–1)
 * @property {number} gasPriceAudPerMj          Retail gas price (AUD/MJ)
 * @property {number} gasKgCo2ePerMj            Natural gas combustion factor (kgCO2e/MJ)
 * @property {number} rcacCop                   Reverse-cycle AC heating COP
 * @property {number} electricityTariffAudPerKwh Grid electricity retail tariff (AUD/kWh)
 * @property {number} gridKgCo2ePerKwh          Grid emissions intensity (kgCO2e/kWh)
 */

/**
 * @typedef {Object} GasScenarioResult
 * @property {number} annualGasMj              Gas consumed (MJ)
 * @property {number} annualCostAud            Annual cost (AUD)
 * @property {number} annualEmissionsKgCo2e    Annual emissions (kgCO2e)
 */

/**
 * @typedef {Object} RcacScenarioResult
 * @property {number} annualElectricityKwh     Electricity consumed (kWh)
 * @property {number} annualCostAud            Annual cost (AUD)
 * @property {number} annualEmissionsKgCo2e    Annual emissions (kgCO2e)
 */

/**
 * @typedef {Object} HeatingComparisonResult
 * @property {HeatingComparisonInputs} assumptions
 * @property {{ gas: GasScenarioResult, rcac: RcacScenarioResult }} scenarios
 * @property {{ costSavingsAud: number, emissionsSavingsKgCo2e: number }} difference
 */

/** Conversion factor: 1 kWh = 3.6 MJ */
const MJ_PER_KWH = 3.6;

/**
 * Default assumptions for an Australian household heating comparison.
 * These are indicative values; replace with household- and region-specific figures.
 * @type {HeatingComparisonInputs}
 */
export const DEFAULT_HEATING_COMPARISON_INPUTS = {
  annualHeatDemandMj: 12600,
  gasEfficiency: 0.9,
  gasPriceAudPerMj: 0.04,
  gasKgCo2ePerMj: 0.0513,
  rcacCop: 3.5,
  electricityTariffAudPerKwh: 0.20,
  gridKgCo2ePerKwh: NEM_AVERAGE_CDEII_2025,
};

/**
 * Compare annual gas heating vs reverse-cycle AC costs and emissions.
 *
 * @param {Partial<HeatingComparisonInputs>} [overrides]
 * @returns {HeatingComparisonResult}
 */
export function compareAnnualGasVsRcac(overrides = {}) {
  const assumptions = {
    ...DEFAULT_HEATING_COMPARISON_INPUTS,
    ...overrides,
  };

  validateInputs(assumptions);

  if (assumptions.gasEfficiency === 0) {
    throw new Error("Invalid input for gasEfficiency: value must be greater than zero.");
  }

  if (assumptions.rcacCop === 0) {
    throw new Error("Invalid input for rcacCop: value must be greater than zero.");
  }

  const annualGasMj = assumptions.annualHeatDemandMj / assumptions.gasEfficiency;
  const gasCostAud = annualGasMj * assumptions.gasPriceAudPerMj;
  const gasEmissionsKg = annualGasMj * assumptions.gasKgCo2ePerMj;

  const annualElectricityKwh =
    assumptions.annualHeatDemandMj / (assumptions.rcacCop * MJ_PER_KWH);
  const rcacCostAud = annualElectricityKwh * assumptions.electricityTariffAudPerKwh;
  const rcacEmissionsKg = annualElectricityKwh * assumptions.gridKgCo2ePerKwh;

  return {
    assumptions,
    scenarios: {
      gas: {
        annualGasMj,
        annualCostAud: gasCostAud,
        annualEmissionsKgCo2e: gasEmissionsKg,
      },
      rcac: {
        annualElectricityKwh,
        annualCostAud: rcacCostAud,
        annualEmissionsKgCo2e: rcacEmissionsKg,
      },
    },
    difference: {
      costSavingsAud: gasCostAud - rcacCostAud,
      emissionsSavingsKgCo2e: gasEmissionsKg - rcacEmissionsKg,
    },
  };
}

/**
 * @param {HeatingComparisonInputs} inputs
 */
function validateInputs(inputs) {
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error(`Invalid input for ${key}: expected a finite number.`);
    }

    if (value < 0) {
      throw new Error(`Invalid input for ${key}: value must be non-negative.`);
    }
  }
}
