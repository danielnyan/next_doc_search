import axios from 'axios';
import { DateTime } from 'luxon';
import { toBearing } from '@/lib/solar-estimator/conversions';

// Read local .env file and store API keys
import dotenv from 'dotenv';
dotenv.config();

const OPENUV_API_KEY = process.env.OPENUV_API_KEY;

/**
 * 2. SUN POSITION API (OPENUV):
 * Get the position of the sun at notable dates and times in the year
 * to compute the optimal tilt of a solar panel for energy generation.
 */

// Query solar position on notable dates: perihelion, 2 x solstice, 2 x equinox
const notableDates = ['2023-01-03'];
// '2023-03-21', '2023-06-21', '2023-09-22', '2023-12-22'];

function utcToSgt(utc: string): DateTime {
  const fromZone = 'UTC';
  const toZone = 'Asia/Singapore';
  const sgt = DateTime.fromISO(utc, { zone: fromZone }).setZone(toZone);
  return sgt;
}

function timeReadable(sgt: DateTime): string {
  const HHMM = sgt.toFormat('HH:mm');
  return HHMM + ' SGT';
}

interface SolarPosition {
  dawn: string;
  sunrise: string;
  sunriseEnd: string;
  solarNoon: string;
  sunsetStart: string;
  sunset: string;
  dusk: string;
}

interface SolarResponse {
  result: {
    sun_info: {
      sun_times: SolarPosition;
      sun_position: {
        azimuth: number;
        altitude: number;
      };
    };
    uv_time: string;
    uv: number;
  };
}

export async function getSunInfo(LAT: number, LON: number, DT: string): Promise<void> {
  const url = `https://api.openuv.io/api/v1/uv?lat=${LAT}&lng=${LON}&alt=15&dt=${DT}`;
  const headers = { 'x-access-token': OPENUV_API_KEY };
  try {
    const response = await axios.get<SolarResponse>(url, { headers });
    const exposure_times: SolarPosition = {} as SolarPosition;
    
    for (const key of [
      'dawn',
      'sunrise',
      'sunriseEnd',
      'solarNoon',
      'sunsetStart',
      'sunset',
      'dusk',
    ]) {
      exposure_times[key] = response.data.result.sun_info.sun_times[key];
    }

    const current_time = response.data.result.uv_time;
    const current_uv = response.data.result.uv;
    const current_azimuth =
      (response.data.result.sun_info.sun_position.azimuth * (180 / Math.PI)) + 180;
    const current_altitude =
      (response.data.result.sun_info.sun_position.altitude * (180 / Math.PI));

    let image = '';
    if (current_time < exposure_times.dawn || current_time > exposure_times.dusk) {
      image = 'nosun.svg';
    } else if (
      current_time <= exposure_times.sunriseEnd ||
      current_time >= exposure_times.sunsetStart
    ) {
      image = 'halfsun.svg';
    } else {
      image = 'fullsun.svg';
    }

    console.log(`\nThe current time is: ${time_readable(utc_to_sgt(current_time))}\n\
    Current Solar Bearing: ${to_bearing(current_azimuth)}\n\
    Current Solar Angle: ${current_altitude.toFixed(2)}°\n\
    Current UV Index: ${current_uv}\n\
    Icon: ${image}\n\
    \n\
    Today's Projected Solar Exposure:\n\
    \t${time_readable(utc_to_sgt(exposure_times.dawn))} -- DAWN\n\
    \t${time_readable(utc_to_sgt(exposure_times.sunrise))} -- SUNRISE\n\
    \t${time_readable(utc_to_sgt(exposure_times.solarNoon))} -- SOLAR NOON\n\
    \t${time_readable(utc_to_sgt(exposure_times.sunset))} -- SUNSET\n\
    \t${time_readable(utc_to_sgt(exposure_times.dusk))} -- DUSK\n\n\
    Computing optimal tilt of solar panel ...`);

    return exposure_times;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function getOptimalAngles(LAT: number, LON: number, exposureTimes: SolarPosition): Promise<[number, number]> {
  const azimuthAngles: number[] = [];
  const altitudeAngles: number[] = [];

  for (const date of notableDates) {
    for (const delta of [5.75]) {
      const time = DateTime.fromISO(exposureTimes['solarNoon']).plus({ hours: delta });
      const formattedTime = time.toFormat("'T'HH:mm:ss.SSS'Z'");
      const query = date + formattedTime;

      const url = `https://api.openuv.io/api/v1/uv?lat=${LAT}&lng=${LON}&alt=15&dt=${query}`;
      const headers = { 'x-access-token': OPENUV_API_KEY };

      try {
        const response = await axios.get<SolarResponse>(url, { headers });
        const sunPosition = response.data.result.sun_info.sun_position;
        azimuthAngles.push((sunPosition.azimuth * 180 / Math.PI) + 180);
        altitudeAngles.push((sunPosition.altitude * 180 / Math.PI));
      } catch (error : any) {
        console.error(error.message);
      }
    }
  }

  const optimalAzimuth = azimuthAngles.reduce((acc, angle) => acc + angle, 0) / azimuthAngles.length;
  const optimalAltitude = altitudeAngles.reduce((acc, angle) => acc + angle, 0) / altitudeAngles.length;

  return [optimalAzimuth, optimalAltitude];
}

/*
// Example usage:
const LAT = 1.23; // Replace with your latitude
const LON = 4.56; // Replace with your longitude
const DT = '2023-09-14T15:30:00Z'; // Replace with your datetime string

async function main() {
  const exposureTimes = await getSunInfo(LAT, LON, DT);
  const [optimalAzimuth, optimalAltitude] = await getOptimalAngles(LAT, LON, exposureTimes);
  console.log(`Optimal Azimuth Angle: ${optimalAzimuth}°`);
  console.log(`Optimal Altitude Angle (Tilt): ${optimalAltitude}°`);
}

main();*/
