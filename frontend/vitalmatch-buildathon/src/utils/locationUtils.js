// locationUtils.js

/**
 * Gets the user's current coordinates using the browser's Geolocation API.
 * @returns {Promise<{lat: number, lon: number}>}
 */
export const getUserCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Reverse geocodes coordinates into a readable address and state.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{state: string, address: string}>}
 */
export const getAddressFromCoords = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error("Failed to fetch location details");
    
    const data = await res.json();
    return {
      state: data.address?.state || '',
      address: data.display_name || ''
    };
  } catch (err) {
    console.error("Error fetching location details:", err);
    throw err;
  }
};