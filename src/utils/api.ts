interface ProfileResponse {
  message?: string;
  email?: string;
  dob?: string;
  gender?: string;
  profile_picture?: string;
  recommended_products?: {
    wallet?: string[];
    jewellery?: string[];
    clothing?: string[];
    handbag?: string[];
    watch?: string[];
  };
}

export const fetchUserProfile = async (token: string): Promise<ProfileResponse> => {
  try {
    const response = await fetch("https://ca91-106-212-8-154.ngrok-free.app/me", {
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
