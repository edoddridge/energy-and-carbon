/**
 * Annual car energy comparison for an Australian household.
 *
 * Notes on defaults:
 * - `petrolPriceAudPerL` should be updated from AIP historical ULP data.
 * - `petrolLPer100Km` and `evKwhPer100Km` should be set from vehicle-specific data
 *   from Green Vehicle Guide or EV Database.
 * - `gridKgCo2ePerKwh` should be set from the relevant Australian grid emissions factor.
 */

/**
 * @typedef {Object} CarComparisonInputs
 * @property {number} annualKm
 * @property {number} petrolPriceAudPerL
 * @property {number} petrolLPer100Km
 * @property {number} evTariffAudPerKwh
 * @property {number} evKwhPer100Km
 * @property {number} petrolKgCo2ePerL
 * @property {number} gridKgCo2ePerKwh
 */

/**
 * @typedef {Object} ScenarioResult
 * @property {number} annualEnergyUse
 * @property {number} annualCostAud
 * @property {number} annualEmissionsKgCo2e
 */

/**
 * @typedef {Object} CarComparisonResult
 * @property {CarComparisonInputs} assumptions
 * @property {{ petrol: ScenarioResult, ev: ScenarioResult }} scenarios
 * @property {{
 *   costSavingsAud: number,
 *   emissionsSavingsKgCo2e: number,
 *   energyReduction: number
 * }} difference
 */

/**
 * Default assumptions for an Australian household comparison.
 * These are placeholders intended to be replaced by fresh sourced values.
 * @type {CarComparisonInputs}
 */
export const DEFAULT_CAR_COMPARISON_INPUTS = {
  annualKm: 12000,
  petrolPriceAudPerL: 1.95,
  petrolLPer100Km: 7.4,
  evTariffAudPerKwh: 0.20,
  evKwhPer100Km: 14.0,
  petrolKgCo2ePerL: 2.31,
  gridKgCo2ePerKwh: 0.65,
};

/**
 * Compare annual petrol vs EV energy costs and emissions.
 *
 * @param {Partial<CarComparisonInputs>} [overrides]
 * @returns {CarComparisonResult}
 */
export function compareAnnualPetrolVsEv(overrides = {}) {
  const assumptions = {
    ...DEFAULT_CAR_COMPARISON_INPUTS,
    ...overrides,
  };

  validateInputs(assumptions);

  const petrolLitres = assumptions.annualKm * (assumptions.petrolLPer100Km / 100);
  const petrolCostAud = petrolLitres * assumptions.petrolPriceAudPerL;
  const petrolEmissionsKg = petrolLitres * assumptions.petrolKgCo2ePerL;

  const evKwh = assumptions.annualKm * (assumptions.evKwhPer100Km / 100);
  const evCostAud = evKwh * assumptions.evTariffAudPerKwh;
  const evEmissionsKg = evKwh * assumptions.gridKgCo2ePerKwh;

  return {
    assumptions,
    scenarios: {
      petrol: {
        annualEnergyUse: petrolLitres,
        annualCostAud: petrolCostAud,
        annualEmissionsKgCo2e: petrolEmissionsKg,
      },
      ev: {
        annualEnergyUse: evKwh,
        annualCostAud: evCostAud,
        annualEmissionsKgCo2e: evEmissionsKg,
      },
    },
    difference: {
      costSavingsAud: petrolCostAud - evCostAud,
      emissionsSavingsKgCo2e: petrolEmissionsKg - evEmissionsKg,
      energyReduction: petrolLitres - evKwh,
    },
  };
}

/**
 * @param {CarComparisonInputs} inputs
 */
function validateInputs(inputs) {
  const numericFields = Object.entries(inputs);

  for (const [key, value] of numericFields) {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error(`Invalid input for ${key}: expected a finite number.`);
    }

    if (value < 0) {
      throw new Error(`Invalid input for ${key}: value must be non-negative.`);
    }
  }
}
