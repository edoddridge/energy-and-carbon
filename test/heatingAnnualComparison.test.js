import test from "node:test";
import assert from "node:assert/strict";

import {
  compareAnnualGasVsRcac,
  DEFAULT_HEATING_COMPARISON_INPUTS,
} from "../src/calculations/heatingAnnualComparison.js";

test("calculates annual gas vs RCAC comparison with defaults", () => {
  const result = compareAnnualGasVsRcac();

  // Gas: 12600 / 0.9 = 14000 MJ consumed
  assert.equal(result.scenarios.gas.annualGasMj, 14000);
  assert.equal(result.scenarios.gas.annualCostAud, 350);
  assert.equal(result.scenarios.gas.annualEmissionsKgCo2e, 718.2);

  // RCAC: 12600 / (3.5 × 3.6) = 1000 kWh consumed
  assert.equal(result.scenarios.rcac.annualElectricityKwh, 1000);
  assert.equal(result.scenarios.rcac.annualCostAud, 330);
  assert.equal(result.scenarios.rcac.annualEmissionsKgCo2e, 650);

  assert.equal(result.difference.costSavingsAud, 20);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 68.2);
});

test("returns zero usage/cost/emissions for zero heat demand", () => {
  const result = compareAnnualGasVsRcac({ annualHeatDemandMj: 0 });

  assert.equal(result.scenarios.gas.annualGasMj, 0);
  assert.equal(result.scenarios.gas.annualCostAud, 0);
  assert.equal(result.scenarios.gas.annualEmissionsKgCo2e, 0);

  assert.equal(result.scenarios.rcac.annualElectricityKwh, 0);
  assert.equal(result.scenarios.rcac.annualCostAud, 0);
  assert.equal(result.scenarios.rcac.annualEmissionsKgCo2e, 0);

  assert.equal(result.difference.costSavingsAud, 0);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 0);
});

test("RCAC emissions advantage is significant in low-emissions grid state (SA)", () => {
  // In South Australia the grid is much cleaner, so RCAC emissions drop substantially
  const result = compareAnnualGasVsRcac({ gridKgCo2ePerKwh: 0.28 });

  // 1000 kWh × 0.28 = 280 kgCO2e for RCAC
  assert.equal(result.scenarios.rcac.annualEmissionsKgCo2e, 280);
  // Gas emissions unchanged at 718.2
  assert.equal(result.scenarios.gas.annualEmissionsKgCo2e, 718.2);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 438.2);
});

test("supports custom high-efficiency gas heater and custom RCAC COP", () => {
  const result = compareAnnualGasVsRcac({
    annualHeatDemandMj: 18000,
    gasEfficiency: 0.9,
    gasPriceAudPerMj: 0.02,
    gasKgCo2ePerMj: 0.0513,
    rcacCop: 4.0,
    electricityTariffAudPerKwh: 0.30,
    gridKgCo2ePerKwh: 0.65,
  });

  // Gas: 18000 / 0.9 = 20000 MJ; cost = 20000 × 0.02 = 400; emissions = 20000 × 0.0513 = 1026
  assert.equal(result.scenarios.gas.annualGasMj, 20000);
  assert.equal(result.scenarios.gas.annualCostAud, 400);
  assert.equal(result.scenarios.gas.annualEmissionsKgCo2e, 1026);

  // RCAC: 18000 / (4.0 × 3.6) = 18000 / 14.4 = 1250 kWh; cost = 1250 × 0.30 = 375; emissions = 1250 × 0.65 = 812.5
  assert.equal(result.scenarios.rcac.annualElectricityKwh, 1250);
  assert.equal(result.scenarios.rcac.annualCostAud, 375);
  assert.equal(result.scenarios.rcac.annualEmissionsKgCo2e, 812.5);

  assert.equal(result.difference.costSavingsAud, 25);
  assert.equal(result.difference.emissionsSavingsKgCo2e, 213.5);
});

test("throws for negative input", () => {
  assert.throws(
    () => compareAnnualGasVsRcac({ annualHeatDemandMj: -1 }),
    /annualHeatDemandMj: value must be non-negative/,
  );
});

test("throws for zero gas efficiency", () => {
  assert.throws(
    () => compareAnnualGasVsRcac({ gasEfficiency: 0 }),
    /gasEfficiency: value must be greater than zero/,
  );
});

test("throws for zero RCAC COP", () => {
  assert.throws(
    () => compareAnnualGasVsRcac({ rcacCop: 0 }),
    /rcacCop: value must be greater than zero/,
  );
});

test("exports default assumptions object with expected keys", () => {
  assert.equal(DEFAULT_HEATING_COMPARISON_INPUTS.annualHeatDemandMj, 12600);
  assert.equal(typeof DEFAULT_HEATING_COMPARISON_INPUTS.gasEfficiency, "number");
  assert.equal(typeof DEFAULT_HEATING_COMPARISON_INPUTS.gridKgCo2ePerKwh, "number");
});
