import * as path from 'path';
import * as xlsx from 'xlsx';
import { DateTime } from 'luxon';

// Read the Excel file
let df = null;

function assertDefined<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message || 'Assertion failed: Value is undefined or null');
  }
  return value;
}

export default function getDemandEstimate(DT: string, DWELLING: string): [number, number] {
  if (df === null) {
    const url = "https://www.ema.gov.sg/content/dam/corporate/singapore-energy-statistics/excel/SES_Public_2022.xlsx.coredownload.xlsx";
    const file = await (await fetch(url)).arrayBuffer();
    console.log("SES 2022 data is fetched from EMA");

    const workbook = xlsx.read(file);
    const sheetName = 'T3.5';
    df = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
  
  if (DWELLING === 'Landed Property') {
    DWELLING = 'Landed Properties';
  }

  // 2021 is the latest complete year, filter by dwelling type
  const demand: any[] = df.filter(
    (entry: any) => entry.year === 2021 && entry.dwelling_type === DWELLING
  );

  const annual = 12 * demand.find(
    (entry: any) =>
      entry.month === 'Annual' &&
      entry.Region === 'Overall' &&
      entry.Description === 'Overall'
  )?.kwh_per_acc || 0;

  console.log(demand);
  console.log(annual);

  // Parse the input datetime string
  assertDefined(DT);
  const dateTime = DateTime.fromISO(DT);
  assertDefined(dateTime);
 
  // Compute year to date demand and days elapsed
  let ytd = 0;
  for (let mm = 1; mm <= dateTime.month; mm++) {
    const monthEntry = demand.find(
      (entry: any) =>
        entry.month === mm &&
        entry.Region === 'Overall' &&
        entry.Description === 'Overall'
    );
    if (monthEntry) {
      ytd += monthEntry.kwh_per_acc;
    }
  }

  return [annual, ytd];
}

export function getHoursElapsed(DT: string): number {
  assertDefined(DT);
  
  // Parse the input datetime string
  const dateTime = DateTime.fromISO(DT);
  assertDefined(dateTime);

  // Compute days elapsed
  let daysElapsed = 0;
  for (let mm = 1; mm <= dateTime.month; mm++) {
    const dateTime2 = DateTime.fromObject({ year: dateTime.year, month: mm }).daysInMonth;
    if (dateTime2 !== undefined) {
      daysElapsed += dateTime2;
    } else {
      throw new Error(`Unable to get the number of days in month`)
    }
  }

  const hoursElapsed = (daysElapsed - 1) * 24 + dateTime.hour;

  return hoursElapsed;
}