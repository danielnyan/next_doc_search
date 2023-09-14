import * as path from 'path';
import * as xlsx from 'xlsx';
import { DateTime } from 'luxon';

// Define the path to the Excel file
const excelFilePath = './SES_Public_2022_tidy.xlsx';

// Read the Excel file
const workbook = xlsx.readFile(excelFilePath);
const sheetName = 'T3.5';
const df = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

function assertDefined<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message || 'Assertion failed: Value is undefined or null');
  }
  return value;
}

export function getDemandEstimate(DT: string, DWELLING: string): [number, number] {
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
    assertDefined(dateTime2);
    daysElapsed += dateTime2;
  }

  const hoursElapsed = (daysElapsed - 1) * 24 + dateTime.hour;

  return hoursElapsed;
}

// Example usage:
const DT = '2023-09-14T15:30:00'; // Replace with your datetime string
const DWELLING = 'Some Dwelling'; // Replace with your dwelling type
const [annualDemand, ytdDemand] = getDemandEstimate(DT, DWELLING);
const hoursElapsed = getHoursElapsed(DT);

console.log(`Annual Demand: ${annualDemand} kWh`);
console.log(`Year-to-Date Demand: ${ytdDemand} kWh`);
console.log(`Hours Elapsed: ${hoursElapsed} hours`);