import test from "node:test";
import assert from "node:assert/strict";

import {
  compareAnnualPetrolVsEv,
  DEFAULT_CAR_COMPARISON_INPUTS,
} from "../src/calculations/carAnnualComparison.js";

test("calculates annual petrol vs EV comparison with defaults", () => {
  const result = compareAnnualPetrolVsEv();

  assert.equal(result.scenarios.petrol.annualEnergyUse, 888);
  assert.equal(result.scenarios.petrol.annualCostAud, 1731.6);
  assert.equal(result.scenarios.petrol.annualEmissionsKgCo2e, 2051.28);

  assert.equal(result.scenarios.ev.annualEnergyUse, 1920);
  assert.equal(result.scenarios.ev.annualCostAud, 633.6);
  assert.equal(result.scenarios.ev.annualEmissionsKgCo2e, 1248);

  assert.equal(result.difference.costSavingsAud, 1098);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 803.28);
  assert.equal(result.difference.energyReduction, -1032);
});

test("returns zero usage/cost/emissions for zero annual km", () => {
  const result = compareAnnualPetrolVsEv({ annualKm: 0 });

  assert.equal(result.scenarios.petrol.annualEnergyUse, 0);
  assert.equal(result.scenarios.petrol.annualCostAud, 0);
  assert.equal(result.scenarios.petrol.annualEmissionsKgCo2e, 0);

  assert.equal(result.scenarios.ev.annualEnergyUse, 0);
  assert.equal(result.scenarios.ev.annualCostAud, 0);
  assert.equal(result.scenarios.ev.annualEmissionsKgCo2e, 0);

  assert.equal(result.difference.costSavingsAud, 0);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 0);
  assert.equal(result.difference.energyReduction, 0);
});

test("supports custom vehicle and tariff assumptions", () => {
  const result = compareAnnualPetrolVsEv({
    annualKm: 15000,
    petrolPriceAudPerL: 2.1,
    petrolLPer100Km: 8.5,
    evTariffAudPerKwh: 0.25,
    evKwhPer100Km: 14.8,
    petrolKgCo2ePerL: 2.31,
    gridKgCo2ePerKwh: 0.55,
  });

  assert.equal(result.scenarios.petrol.annualEnergyUse, 1275);
  assert.equal(result.scenarios.petrol.annualCostAud, 2677.5);
  assert.equal(result.scenarios.petrol.annualEmissionsKgCo2e, 2945.25);

  assert.equal(result.scenarios.ev.annualEnergyUse, 2220);
  assert.equal(result.scenarios.ev.annualCostAud, 555);
  assert.equal(result.scenarios.ev.annualEmissionsKgCo2e, 1221);

  assert.equal(result.difference.costSavingsAud, 2122.5);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 1724.25);
  assert.equal(result.difference.energyReduction, -945);
});

test("throws for invalid negative inputs", () => {
  assert.throws(
    () => compareAnnualPetrolVsEv({ annualKm: -1 }),
    /annualKm: value must be non-negative/,
  );
});

test("exports default assumptions object", () => {
  assert.equal(DEFAULT_CAR_COMPARISON_INPUTS.annualKm, 12000);
  assert.equal(typeof DEFAULT_CAR_COMPARISON_INPUTS.petrolPriceAudPerL, "number");
});
