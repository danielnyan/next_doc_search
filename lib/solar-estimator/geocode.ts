import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

/**
 * 1. GEOCODING API (TOMTOM):
 * Get (lat, lon) coordinates from the input address
 * Accept only addresses in Singapore
 */

// Format input with suffix, ", Singapore" to localize fuzzy match
function formatAddress(s: string): string {
  return s.replace(" ", "+") + ",+Singapore";
}

// Geocode address and return LAT, LON, SYSTEM_MSG
export async function geocode(ADDRESS: string): Promise<[number, number, string]> {
  ADDRESS = formatAddress(ADDRESS);
  try {
    const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${ADDRESS}.json?storeResult=false&view=Unified&key=${TOMTOM_API_KEY}`);
    const data = response.data;

    // Address outside Singapore causes AssertionError
    if (data.results[0].address.country !== "Singapore") {
      throw new Error("Oops! The address you have queried was not found in Singapore.");
    }

    const LAT = data.results[0].position.lat;
    const LON = data.results[0].position.lon;

    let SYSTEM_MSG = '';
    if (data.results[0].address.freeformAddress === "Singapore") {
      SYSTEM_MSG = "The address you are querying is too general. Providing an island-averaged estimate instead.";
      console.log(SYSTEM_MSG);
    } else {
      SYSTEM_MSG = `The address you are querying is: ${data.results[0].address.freeformAddress}.`;
      console.log(SYSTEM_MSG);
      console.log(`This address has the following coordinates:
    Latitude: ${LAT}
    Longitude: ${LON}`);
    }

    return [LAT, LON, SYSTEM_MSG];
  } catch (error: any) {
    console.error(error.message);
    return [0, 0, '']; // Return default values in case of an error
  }
}

// Example usage:
const ADDRESS = 'Your Address Here'; // Replace with the address you want to geocode

async function main() {
  const [LAT, LON, SYSTEM_MSG] = await geocode(ADDRESS);
  // You can use LAT, LON, and SYSTEM_MSG in your further processing
}

main();
