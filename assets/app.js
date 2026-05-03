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
  petrolEmissions: document.querySelector("#petrol-emissions"),
  evEmissions: document.querySelector("#ev-emissions"),
  emissionsSavings: document.querySelector("#car-emissions-savings"),
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
  gasEmissions: document.querySelector("#gas-emissions"),
  rcacEmissions: document.querySelector("#rcac-emissions"),
  emissionsSavings: document.querySelector("#heating-emissions-savings"),
};

renderHeating(DEFAULT_HEATING_COMPARISON_INPUTS);

heatingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  heatingErrorEl.textContent = "";

  try {
    renderHeating(readInputs(heatingForm));
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
  carOutputEls.costSavings.textContent = formatCurrency(result.difference.costSavingsAud);

  carOutputEls.petrolEmissions.textContent = formatKg(result.scenarios.petrol.annualEmissionsKgCo2e);
  carOutputEls.evEmissions.textContent = formatKg(result.scenarios.ev.annualEmissionsKgCo2e);
  carOutputEls.emissionsSavings.textContent = formatKg(result.difference.emissionsSavingsKgCo2e);
}

function renderHeating(inputs) {
  const result = compareAnnualGasVsRcac(inputs);

  heatingOutputEls.gasCost.textContent = formatCurrency(result.scenarios.gas.annualCostAud);
  heatingOutputEls.rcacCost.textContent = formatCurrency(result.scenarios.rcac.annualCostAud);
  heatingOutputEls.costSavings.textContent = formatCurrency(result.difference.costSavingsAud);

  heatingOutputEls.gasEmissions.textContent = formatKg(result.scenarios.gas.annualEmissionsKgCo2e);
  heatingOutputEls.rcacEmissions.textContent = formatKg(result.scenarios.rcac.annualEmissionsKgCo2e);
  heatingOutputEls.emissionsSavings.textContent = formatKg(result.difference.emissionsSavingsKgCo2e);
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
