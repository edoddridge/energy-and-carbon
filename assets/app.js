import {
  compareAnnualPetrolVsEv,
  DEFAULT_CAR_COMPARISON_INPUTS,
} from "../src/calculations/carAnnualComparison.js";

import {
  compareAnnualGasVsRcac,
  DEFAULT_HEATING_COMPARISON_INPUTS,
} from "../src/calculations/heatingAnnualComparison.js";

// --- Car comparison ---

const carForm = document.querySelector("#car-form");
const carErrorEl = document.querySelector("#car-form-error");

const carOutputEls = {
  petrolCost: document.querySelector("#petrol-cost"),
  evCost: document.querySelector("#ev-cost"),
  costSavings: document.querySelector("#car-cost-savings"),
  costChangePct: document.querySelector("#car-cost-change-pct"),
  petrolEmissions: document.querySelector("#petrol-emissions"),
  petrolEmissionsLitres: document.querySelector("#petrol-emissions-litres"),
  evEmissions: document.querySelector("#ev-emissions"),
  evEmissionsLitres: document.querySelector("#ev-emissions-litres"),
  emissionsSavings: document.querySelector("#car-emissions-savings"),
  emissionsChangePct: document.querySelector("#car-emissions-change-pct"),
};

renderCar(DEFAULT_CAR_COMPARISON_INPUTS);

carForm.addEventListener("submit", (event) => {
  event.preventDefault();
  carErrorEl.textContent = "";

  try {
    renderCar(readInputs(carForm));
  } catch (error) {
    carErrorEl.textContent = error instanceof Error ? error.message : "Unable to calculate.";
  }
});

// --- Heating comparison ---

const heatingForm = document.querySelector("#heating-form");
const heatingErrorEl = document.querySelector("#heating-form-error");

const heatingOutputEls = {
  gasCost: document.querySelector("#gas-cost"),
  rcacCost: document.querySelector("#rcac-cost"),
  costSavings: document.querySelector("#heating-cost-savings"),
  costChangePct: document.querySelector("#heating-cost-change-pct"),
  gasEmissions: document.querySelector("#gas-emissions"),
  gasEmissionsLitres: document.querySelector("#gas-emissions-litres"),
  rcacEmissions: document.querySelector("#rcac-emissions"),
  rcacEmissionsLitres: document.querySelector("#rcac-emissions-litres"),
  emissionsSavings: document.querySelector("#heating-emissions-savings"),
  emissionsChangePct: document.querySelector("#heating-emissions-change-pct"),
};

renderHeating(DEFAULT_HEATING_COMPARISON_INPUTS);

const heatDemandInput = document.querySelector("#heat-demand-input");
const heatDemandUnitRadios = heatingForm.querySelectorAll('input[name="heatDemandUnit"]');

/** 1 kWh = 3.6 MJ */
const MJ_PER_KWH = 3.6;
const PETROL_KG_CO2E_PER_L = DEFAULT_CAR_COMPARISON_INPUTS.petrolKgCo2ePerL;

heatDemandUnitRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const currentValue = Number(heatDemandInput.value);
    if (radio.value === "kWh") {
      heatDemandInput.step = "25";
      if (Number.isFinite(currentValue) && currentValue > 0) {
        heatDemandInput.value = String(Math.round(currentValue / MJ_PER_KWH));
      }
    } else {
      heatDemandInput.step = "100";
      if (Number.isFinite(currentValue) && currentValue > 0) {
        heatDemandInput.value = String(Math.round(currentValue * MJ_PER_KWH));
      }
    }
  });
});

heatingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  heatingErrorEl.textContent = "";

  try {
    const inputs = readInputs(heatingForm);
    const selectedUnit = heatingForm.querySelector('input[name="heatDemandUnit"]:checked').value;
    if (selectedUnit === "kWh") {
      inputs.annualHeatDemandMj = inputs.annualHeatDemandMj * MJ_PER_KWH;
    }
    renderHeating(inputs);
  } catch (error) {
    heatingErrorEl.textContent = error instanceof Error ? error.message : "Unable to calculate.";
  }
});

/**
 * @param {HTMLFormElement} sourceForm
 */
function readInputs(sourceForm) {
  const formData = new FormData(sourceForm);
  const out = {};

  for (const [key, value] of formData.entries()) {
    const numberValue = Number(value);

    // Skip non-numeric fields such as unit-selector radio buttons
    if (Number.isNaN(numberValue)) continue;

    if (!Number.isFinite(numberValue)) {
      throw new Error(`Input ${key} must be a valid number.`);
    }

    out[key] = numberValue;
  }

  return out;
}

function renderCar(inputs) {
  const result = compareAnnualPetrolVsEv(inputs);

  carOutputEls.petrolCost.textContent = formatCurrency(result.scenarios.petrol.annualCostAud);
  carOutputEls.evCost.textContent = formatCurrency(result.scenarios.ev.annualCostAud);
  carOutputEls.costSavings.textContent = formatCurrency(-result.difference.costSavingsAud);
  carOutputEls.costChangePct.textContent = formatPercentChangeVsBaseline(
    result.scenarios.petrol.annualCostAud,
    result.scenarios.ev.annualCostAud,
  );

  carOutputEls.petrolEmissions.textContent = formatKg(result.scenarios.petrol.annualEmissionsKgCo2e);
  if (carOutputEls.petrolEmissionsLitres) {
    carOutputEls.petrolEmissionsLitres.textContent = formatPetrolEquivalentLitres(
      result.scenarios.petrol.annualEmissionsKgCo2e,
      result.assumptions.petrolKgCo2ePerL,
    );
  }
  carOutputEls.evEmissions.textContent = formatKg(result.scenarios.ev.annualEmissionsKgCo2e);
  if (carOutputEls.evEmissionsLitres) {
    carOutputEls.evEmissionsLitres.textContent = formatPetrolEquivalentLitres(
      result.scenarios.ev.annualEmissionsKgCo2e,
      result.assumptions.petrolKgCo2ePerL,
    );
  }
  carOutputEls.emissionsSavings.textContent = formatKg(-result.difference.emissionsSavingsKgCo2e);
  carOutputEls.emissionsChangePct.textContent = formatPercentChangeVsBaseline(
    result.scenarios.petrol.annualEmissionsKgCo2e,
    result.scenarios.ev.annualEmissionsKgCo2e,
  );
}

function renderHeating(inputs) {
  const result = compareAnnualGasVsRcac(inputs);

  heatingOutputEls.gasCost.textContent = formatCurrency(result.scenarios.gas.annualCostAud);
  heatingOutputEls.rcacCost.textContent = formatCurrency(result.scenarios.rcac.annualCostAud);
  heatingOutputEls.costSavings.textContent = formatCurrency(-result.difference.costSavingsAud);
  heatingOutputEls.costChangePct.textContent = formatPercentChangeVsBaseline(
    result.scenarios.gas.annualCostAud,
    result.scenarios.rcac.annualCostAud,
  );

  heatingOutputEls.gasEmissions.textContent = formatKg(result.scenarios.gas.annualEmissionsKgCo2e);
  if (heatingOutputEls.gasEmissionsLitres) {
    heatingOutputEls.gasEmissionsLitres.textContent = formatPetrolEquivalentLitres(
      result.scenarios.gas.annualEmissionsKgCo2e,
      PETROL_KG_CO2E_PER_L,
    );
  }
  heatingOutputEls.rcacEmissions.textContent = formatKg(result.scenarios.rcac.annualEmissionsKgCo2e);
  if (heatingOutputEls.rcacEmissionsLitres) {
    heatingOutputEls.rcacEmissionsLitres.textContent = formatPetrolEquivalentLitres(
      result.scenarios.rcac.annualEmissionsKgCo2e,
      PETROL_KG_CO2E_PER_L,
    );
  }
  heatingOutputEls.emissionsSavings.textContent = formatKg(-result.difference.emissionsSavingsKgCo2e);
  heatingOutputEls.emissionsChangePct.textContent = formatPercentChangeVsBaseline(
    result.scenarios.gas.annualEmissionsKgCo2e,
    result.scenarios.rcac.annualEmissionsKgCo2e,
  );
}

/**
 * @param {number} value
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * @param {number} value
 */
function formatKg(value) {
  return `${new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 0,
  }).format(value)} kgCO2e/yr`;
}

/**
 * @param {number} emissionsKg
 * @param {number} petrolKgCo2ePerL
 */
function formatPetrolEquivalentLitres(emissionsKg, petrolKgCo2ePerL) {
  const litres = emissionsKg / petrolKgCo2ePerL;
  return `${new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 0,
  }).format(litres)} L petrol/yr`;
}

/**
 * @param {number} baseline
 * @param {number} comparison
 */
function formatPercentChangeVsBaseline(baseline, comparison) {
  if (baseline === 0) {
    return "0%";
  }

  const percentChange = ((comparison - baseline) / baseline) * 100;

  return `${new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  }).format(percentChange)}%`;
}
