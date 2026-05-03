/**
 * AEMO Carbon Dioxide Equivalent Intensity Index (CDEII) per-region defaults.
 *
 * Values are approximate 2024 annual averages derived from AEMO CDEII summary results.
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
 * Approximate 2024 annual average grid emissions intensity per region, in kgCO2e/kWh.
 *
 * NEM regions (NSW, QLD, SA, TAS, VIC, NEM):
 *   Source: AEMO CDEII Summary Results 2024
 *   https://www.nemweb.com.au/Reports/Current/CDEII/CO2EII_SUMMARY_RESULTS.CSV
 *
 * WA (South West Interconnected System):
 *   Source: approximate 2024 figure; WA is not part of NEM and is not covered by
 *   the AEMO CDEII. WA emissions data is published by the WA Government and the
 *   Clean Energy Regulator under NGER.
 *
 * @type {Record<GridRegion, number>}
 */
export const GRID_EMISSIONS_INTENSITY_2024 = {
  NSW: 0.73,   // New South Wales and ACT
  QLD: 0.77,   // Queensland
  SA:  0.28,   // South Australia
  TAS: 0.14,   // Tasmania
  VIC: 0.82,   // Victoria
  NEM: 0.65,   // NEM-wide average
  WA:  0.60,   // Western Australia (SWIS) — approximate
};

/**
 * The NEM-wide average; use this when a state has not been specified.
 */
export const NEM_AVERAGE_CDEII_2024 = GRID_EMISSIONS_INTENSITY_2024.NEM;
