const DATAGOV_KEY = process.env.DATAGOV_KEY

export function getSolarEstimate(LAT: number, LON: number, azimuth: number, tilt: number): Promise<{ raw_data: any; estimate: number[]; system_msg: string; }> {
  const url = 'https://developer.nrel.gov/api/pvwatts/v6.json';

  // Set the parameters for the request
  const parameters = new URLSearchParams({
    api_key: DATAGOV_KEY || "",
    system_capacity: '0.25',  // kW (standard residential size is about 250 W)
    module_type: '0',  // 0: Standard, 1: Premium, 2: Thin film
    losses: '15',  // % (default value)
    array_type: '0',  // 0: Fixed open rack, 1: Fixed roof mount, 2: 1-axis tracking, 3: 1-axis backtracking, 4: 2-axis tracking
    tilt: tilt.toString(),  // degrees
    azimuth: azimuth.toString(),  // degrees
    lat: LAT.toString(),
    lon: LON.toString(),
    timeframe: 'hourly',
  });

  return fetch(`${url}?${parameters.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Oops! The database could not be accessed. Please try again later.");
      }
      return response.json();
    })
    .then((data) => {
      const SYSTEM_MSG = `Estimates are based on real weather observed at Station No. ${data.station_info.location}, located ${data.station_info.distance} m away from the queried address.`;
      return {
        raw_data: data,
        estimate: data.outputs.ac,
        system_msg: SYSTEM_MSG
      };
    });
}