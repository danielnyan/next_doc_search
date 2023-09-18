import {getSolarEstimate} from '@/lib/solar-estimator/pvwatts'
import {getSunInfo, getOptimalAngles} from '@/lib/solar-estimator/solarposition'
import {getDemandEstimate, getHoursElapsed} from '@/lib/solar-estimator/demand'
import {geocode} from '@/lib/solar-estimator/geocode'

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  // To do: handle event where SYSTEM_MSG is null, or when the geocode is too general. 
  const {lat: lat, lon: lon, message: geocode_message, error: error} = 
    await geocode("464, Pasir Ris Street 41", process.env.TOMTOM_API_KEY);
  const now = new Date();
  const dt = now.toISOString();
  const exposureTimes = await getSunInfo(lat, lon, dt);
  const [azi, tilt] = await getOptimalAngles(lat, lon, exposureTimes);
  const {estimate: pv_estimate, system_msg: pv_message}
    = getSolarEstimate(lat, lon, azi, tilt);
  
  response.status(200).json({
    // body: request.body,
    query: request.query,
    // cookies: request.cookies,
  });
}