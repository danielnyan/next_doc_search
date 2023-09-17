import {getSolarEstimate} from '@/lib/solar-estimator/pvwatts'
import {getSunInfo, getOptimalAngles} from '@/lib/solar-estimator/solarposition'
import {getDemandEstimate, getHoursElapsed} from '@/lib/solar-estimator/demand'
import {geocode} from '@/lib/solar-estimator/geocode'

import { NextApiRequest, NextApiResponse } from 'next';

export async function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log("Hello world!");
  console.log(await geocode("464, Pasir Ris Street 41", process.env.TOMTOM_API_KEY));
  console.log(await geocode("Bras basah", process.env.TOMTOM_API_KEY));
  console.log(await geocode("123 Rainbow Street", process.env.TOMTOM_API_KEY));
  response.status(200).json({
    // body: request.body,
    query: request.query,
    // cookies: request.cookies,
  });
}