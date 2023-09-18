import {getSolarEstimate} from '@/lib/solar-estimator/pvwatts'
import {getSunInfo, getOptimalAngles} from '@/lib/solar-estimator/solarposition'
import {getDemandEstimate, getHoursElapsed} from '@/lib/solar-estimator/demand'
import {geocode, GeocodeResult} from '@/lib/solar-estimator/geocode'

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {LAT: LAT, LON: LON} = await geocode("464, Pasir Ris Street 41", process.env.TOMTOM_API_KEY);
  const now = new Date();
  const DT = now.toISOString();
  console.log(await getSunInfo(LAT, LON, DT));
  
  response.status(200).json({
    // body: request.body,
    query: request.query,
    // cookies: request.cookies,
  });
}