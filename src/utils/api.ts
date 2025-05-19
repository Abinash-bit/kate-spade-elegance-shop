
interface ProfileResponse {
  message?: string;
  email?: string;
  dob?: string;
  gender?: string;
}

export const fetchUserProfile = async (token: string): Promise<ProfileResponse> => {
  try {
    const response = await fetch("https://8c51-122-172-10-42.ngrok-free.app/me", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
