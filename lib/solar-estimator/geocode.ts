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
  lat: number;
  lon: number;
  message: string;
  error: string | null;
}

// Geocode address and return lat, lon, message
export async function geocode(ADDRESS: string, TOMTOM_API_KEY: string): Promise<GeocodeResult> {
  ADDRESS = formatAddress(ADDRESS);
  try {
    const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${ADDRESS}.json?storeResult=false&view=Unified&key=${TOMTOM_API_KEY}`);
    const data = response.data;

    // Address outside Singapore causes AssertionError
    if (data.results[0].address.country !== "Singapore") {
      throw new Error("Oops! The address you have queried was not found in Singapore.");
    }

    const lat = data.results[0].position.lat;
    const lon = data.results[0].position.lon;

    let message = '';
    if (data.results[0].address.freeformAddress === "Singapore") {
      message = "The address you are querying is too general. Providing an island-averaged estimate instead.";
    } else {
      message = `The address you are querying is: ${data.results[0].address.freeformAddress}.`;;
    }

    return {lat, 
      lon, 
      message,
      error: null
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      lat: 0,
      lon: 0,
      message: '',
      error: error.message
    }; // Return default values in case of an error
  }
}
