import {getSolarEstimate} from '@/lib/solar-estimator/pvwatts'
import {getSunInfo, getOptimalAngles} from '@/lib/solar-estimator/solarposition'
import {getDemandEstimate, getHoursElapsed} from '@/lib/solar-estimator/demand'
import {geocode} from '@/lib/solar-estimator/geocode'

export function test() {
  console.log("Hello world!");
  console.log(geocode("464, Pasir Ris Street 41"));
  console.log(geocode("Bras basah"));
  console.log(geocode("123 Rainbow Street"));
}