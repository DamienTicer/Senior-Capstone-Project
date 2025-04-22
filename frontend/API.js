const API_URL = "mockAPI.json";

export async function fetchSchoolProfile() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch school profile data.");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
