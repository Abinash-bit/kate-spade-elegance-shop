interface ProfileResponse {
  message?: string;
  email?: string;
  dob?: string;
  gender?: string;
  profile_picture?: string;
  skin_tone?: string;
  country?: string;
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
    const response = await fetch("http://localhost:8000/me", {
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
