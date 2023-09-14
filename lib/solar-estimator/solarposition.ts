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

async function getSunInfo(LAT: number, LON: number, DT: string): Promise<void> {
  const url = `https://api.openuv.io/api/v1/uv?lat=${LAT}&lng=${LON}&alt=15&dt=${DT}`;
  const headers = { 'x-access-token': OPENUV_API_KEY };
  try {
    const response = await axios.get(url, { headers });
    const data = response.data.result;

    // Get key times of solar exposure today and print data
    const exposureTimes: { [key: string]: string } = {};
    for (const key of ['dawn', 'sunrise', 'sunriseEnd', 'solarNoon', 'sunsetStart', 'sunset', 'dusk']) {
      exposureTimes[key] = data.sun_info.sun_times[key];
    }

    const currentUV = data.uv;
    const currentAzimuth = (data.sun_info.sun_position.azimuth * 180 / Math.PI) + 180;
    const currentAltitude = (data.sun_info.sun_position.altitude * 180 / Math.PI).toFixed(2);

    let image = '';
    if (data.uv_time < exposureTimes['dawn'] || data.uv_time > exposureTimes['dusk']) {
      image = 'nosun.svg';
    } else if (data.uv_time <= exposureTimes['sunriseEnd'] || data.uv_time >= exposureTimes['sunsetStart']) {
      image = 'halfsun.svg';
    } else {
      image = 'fullsun.svg';
    }

    console.log(`
The current time is: ${timeReadable(utcToSgt(data.uv_time))}
Current Solar Bearing: ${toBearing(currentAzimuth)}
Current Solar Angle: ${currentAltitude}°
Current UV Index: ${currentUV}
Icon: ${image}

Today's Projected Solar Exposure:
\t${timeReadable(utcToSgt(exposureTimes['dawn']))} -- DAWN
\t${timeReadable(utcToSgt(exposureTimes['sunrise']))} -- SUNRISE
\t${timeReadable(utcToSgt(exposureTimes['solarNoon']))} -- SOLAR NOON
\t${timeReadable(utcToSgt(exposureTimes['sunset']))} -- SUNSET
\t${timeReadable(utcToSgt(exposureTimes['dusk']))} -- DUSK

Computing the optimal tilt of the solar panel ...
`);
  } catch (error) {
    console.error(error.message);
  }
}

export async function getOptimalAngles(LAT: number, LON: number, exposureTimes: { [key: string]: string }): Promise<[number, number]> {
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
        const response = await axios.get(url, { headers });
        const sunPosition = response.data.result.sun_info.sun_position;
        azimuthAngles.push((sunPosition.azimuth * 180 / Math.PI) + 180);
        altitudeAngles.push((sunPosition.altitude * 180 / Math.PI));
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  const optimalAzimuth = azimuthAngles.reduce((acc, angle) => acc + angle, 0) / azimuthAngles.length;
  const optimalAltitude = altitudeAngles.reduce((acc, angle) => acc + angle, 0) / altitudeAngles.length;

  return [optimalAzimuth, optimalAltitude];
}

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

main();
