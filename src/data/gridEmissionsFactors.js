/**
 * AEMO Carbon Dioxide Equivalent Intensity Index (CDEII) per-region defaults.
 *
 * Values are approximate 2025 annual averages derived from AEMO CDEII summary results.
 * Precise historical and current-year figures can be downloaded from:
 *   https://www.nemweb.com.au/Reports/Current/CDEII/CO2EII_SUMMARY_RESULTS.CSV
 *
 * These values are declining year-on-year as renewable generation expands.
 * Update this file regularly from the AEMO CDEII summary results CSV.
 *
 * Units: kgCO2e/kWh (sent-out energy basis)
 */

/**
 * @typedef {"NSW" | "QLD" | "SA" | "TAS" | "VIC" | "NEM" | "WA"} GridRegion
 */

/**
 * Approximate 2025 annual average grid emissions intensity per region, in kgCO2e/kWh.
 *
 * NEM regions (NSW, QLD, SA, TAS, VIC, NEM):
 *   Source: AEMO CDEII Summary Results 2025
 *   https://www.nemweb.com.au/Reports/Current/CDEII/CO2EII_SUMMARY_RESULTS.CSV
 *
 * WA (South West Interconnected System):
 *   Source: approximate 2024 figure; WA is not part of NEM and is not covered by
 *   the AEMO CDEII. WA emissions data is published by the WA Government and the
 *   Clean Energy Regulator under NGER.
 *
 * @type {Record<GridRegion, number>}
 */
export const GRID_EMISSIONS_INTENSITY_2025 = {
  NSW: 0.59,   // New South Wales and ACT
  QLD: 0.64,   // Queensland
  SA:  0.13,   // South Australia
  TAS: 0.01,   // Tasmania
  VIC: 0.69,   // Victoria
  NEM: 0.58,   // NEM-wide average
  WA:  0.414,  // Western Australia (SWIS)
};

/**
 * The NEM-wide average; use this when a state has not been specified.
 */
export const NEM_AVERAGE_CDEII_2025 = GRID_EMISSIONS_INTENSITY_2025.NEM;

/**
 * Approximate 2024 annual average grid emissions intensity per region, in kgCO2e/kWh.
 *
 * NEM regions (NSW, QLD, SA, TAS, VIC, NEM):
 *   Source: AEMO CDEII Summary Results 2024
 *   https://www.nemweb.com.au/Reports/Current/CDEII/CO2EII_SUMMARY_RESULTS.CSV
 *
 * WA (South West Interconnected System):
 *   Source: approximate 2024 figure from NGER reporting.
 *
 * @type {Record<GridRegion, number>}
 */
export const GRID_EMISSIONS_INTENSITY_2024 = {
  NSW: 0.63,   // New South Wales and ACT
  QLD: 0.66,   // Queensland
  SA:  0.15,   // South Australia
  TAS: 0.02,   // Tasmania
  VIC: 0.75,   // Victoria
  NEM: 0.61,   // NEM-wide average
  WA:  0.435,  // Western Australia (SWIS)
};

/**
 * The NEM-wide average for 2024; use this when a state has not been specified.
 */
export const NEM_AVERAGE_CDEII_2024 = GRID_EMISSIONS_INTENSITY_2024.NEM;
