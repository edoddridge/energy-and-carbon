import {
  compareAnnualPetrolVsEv,
  DEFAULT_CAR_COMPARISON_INPUTS,
} from "../src/calculations/carAnnualComparison.js";

const form = document.querySelector("#comparison-form");
const errorEl = document.querySelector("#form-error");

const outputEls = {
  petrolCost: document.querySelector("#petrol-cost"),
  evCost: document.querySelector("#ev-cost"),
  costSavings: document.querySelector("#cost-savings"),
  petrolEmissions: document.querySelector("#petrol-emissions"),
  evEmissions: document.querySelector("#ev-emissions"),
  emissionsSavings: document.querySelector("#emissions-savings"),
};

render(DEFAULT_CAR_COMPARISON_INPUTS);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorEl.textContent = "";

  try {
    const inputValues = readInputs(form);
    render(inputValues);
  } catch (error) {
    errorEl.textContent = error instanceof Error ? error.message : "Unable to calculate.";
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

function render(inputs) {
  const result = compareAnnualPetrolVsEv(inputs);

  outputEls.petrolCost.textContent = formatCurrency(result.scenarios.petrol.annualCostAud);
  outputEls.evCost.textContent = formatCurrency(result.scenarios.ev.annualCostAud);
  outputEls.costSavings.textContent = formatCurrency(result.difference.costSavingsAud);

  outputEls.petrolEmissions.textContent = formatKg(result.scenarios.petrol.annualEmissionsKgCo2e);
  outputEls.evEmissions.textContent = formatKg(result.scenarios.ev.annualEmissionsKgCo2e);
  outputEls.emissionsSavings.textContent = formatKg(result.difference.emissionsSavingsKgCo2e);
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
