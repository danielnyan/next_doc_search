import axios from 'axios';

/**
 * 1. GEOCODING API (TOMTOM):
 * Get (lat, lon) coordinates from the input address
 * Accept only addresses in Singapore
 */

// Format input with suffix, ", Singapore" to localize fuzzy match
function formatAddress(s: string): string {
  return s.replace(" ", "+") + ",+Singapore";
}

export interface GeocodeResult {
  LAT: number;
  LON: number;
  SYSTEM_MSG: string;
}

// Geocode address and return LAT, LON, SYSTEM_MSG
export async function geocode(ADDRESS: string, TOMTOM_API_KEY: string): Promise<GeocodeResult> {
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

    return {LAT, 
      LON, 
      SYSTEM_MSG
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      LAT: 0,
      LON: 0,
      SYSTEM_MSG: ''
    }; // Return default values in case of an error
  }
}
