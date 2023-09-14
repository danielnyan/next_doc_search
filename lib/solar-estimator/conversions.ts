function toBearing(a: number): string {
  // Ensure the azimuth angle is between 0 and 360 degrees
  while (a > 360) {
    a -= 360;
  }
  while (a < 0) {
    a += 360;
  }

  if ((a >= 348.75 && a < 360) || (a >= 0 && a < 11.25)) {
    return "N";
  } else if (a >= 11.25 && a < 33.75) {
    return "NNE";
  } else if (a >= 33.75 && a < 56.25) {
    return "NE";
  } else if (a >= 56.25 && a < 78.75) {
    return "ENE";
  } else if (a >= 78.75 && a < 101.25) {
    return "E";
  } else if (a >= 101.25 && a < 123.75) {
    return "ESE";
  } else if (a >= 123.75 && a < 146.25) {
    return "SE";
  } else if (a >= 146.25 && a < 168.75) {
    return "SSE";
  } else if (a >= 168.75 && a < 191.25) {
    return "S";
  } else if (a >= 191.25 && a < 213.75) {
    return "SSW";
  } else if (a >= 213.75 && a < 236.25) {
    return "SW";
  } else if (a >= 236.25 && a < 258.75) {
    return "WSW";
  } else if (a >= 258.75 && a < 281.25) {
    return "W";
  } else if (a >= 281.25 && a < 303.75) {
    return "WNW";
  } else if (a >= 303.75 && a < 326.25) {
    return "NW";
  } else if (a >= 326.25 && a < 348.75) {
    return "NNW";
  } else {
    return "Unknown";
  }
}

// Example usage:
const azimuthAngle = 45; // Replace with your azimuth angle in degrees
const bearing = toBearing(azimuthAngle);
console.log(`Bearing: ${bearing}`);
