import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchUserProfile } from "@/utils/api";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    email?: string;
    dob: string | null;
    gender: string | null;
    profile_picture?: string | null;
  }>({
    email: undefined,
    dob: null,
    gender: null,
    profile_picture: null,
  });

  const [inputDob, setInputDob] = useState("");
  const [inputGender, setInputGender] = useState("");
  const [inputProfilePicture, setInputProfilePicture] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      toast.error("Please login to access your profile");
      return;
    }

    const loadProfileData = async () => {
      try {
        // First check if we have a cached profile
        const cachedProfile = localStorage.getItem("userProfile");
        
        if (cachedProfile) {
          const parsedProfile = JSON.parse(cachedProfile);
          setProfile({
            email: parsedProfile.email,
            dob: parsedProfile.dob,
            gender: parsedProfile.gender,
            profile_picture: parsedProfile.profile_picture
          });
          
          // Pre-fill the form fields if we have data
          if (parsedProfile.dob) {
            setInputDob(parsedProfile.dob);
          }
          if (parsedProfile.gender) {
            setInputGender(parsedProfile.gender);
          }
          if (parsedProfile.profile_picture) {
            setInputProfilePicture(parsedProfile.profile_picture);
          }
        } else {
          // If no cached profile, try to fetch from API
          try {
            const fetchedProfile = await fetchUserProfile(token);
            if (fetchedProfile.dob || fetchedProfile.gender || fetchedProfile.profile_picture) {
              setProfile({
                email: fetchedProfile.email || undefined,
                dob: fetchedProfile.dob || null,
                gender: fetchedProfile.gender || null,
                profile_picture: fetchedProfile.profile_picture || null
              });
              
              // Store profile data in localStorage
              localStorage.setItem("userProfile", JSON.stringify(fetchedProfile));
              
              // Pre-fill the form fields if we have data
              if (fetchedProfile.dob) {
                setInputDob(fetchedProfile.dob);
              }
              if (fetchedProfile.gender) {
                setInputGender(fetchedProfile.gender);
              }
              if (fetchedProfile.profile_picture) {
                setInputProfilePicture(fetchedProfile.profile_picture);
              }
            }
          } catch (error) {
            console.error("Error fetching profile from API:", error);
            // If API call fails, we continue without the profile data
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputDob) {
      toast.error("Date of birth is required");
      return;
    }

    if (!inputGender) {
      toast.error("Gender is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("https://ca91-106-212-8-154.ngrok-free.app/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        },
        body: JSON.stringify({
          dob: inputDob,
          gender: inputGender,
          profile_picture: inputProfilePicture
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      
      // Update profile state
      setProfile({
        ...profile,
        dob: data.dob,
        gender: data.gender,
        profile_picture: data.profile_picture
      });

      // Update localStorage cache
      const existingProfile = localStorage.getItem("userProfile");
      const updatedProfile = existingProfile 
        ? { ...JSON.parse(existingProfile), dob: data.dob, gender: data.gender, profile_picture: data.profile_picture }
        : { dob: data.dob, gender: data.gender, profile_picture: data.profile_picture };
      
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      toast.success("Profile updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    
    // Try to format the date consistently
    try {
      // Check if date is in ISO format (YYYY-MM-DD)
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr);
        return format(date, "MMMM d, yyyy");
      }
      
      // If in DD-MM-YYYY format
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        // Use format from date-fns for consistency 
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return format(date, "MMMM d, yyyy");
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  // Update the Header component to clear localStorage on logout
  useEffect(() => {
    const clearProfileOnLogout = () => {
      // Listen for logout events
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "token" && e.newValue === null) {
          localStorage.removeItem("userProfile");
        }
      };
      
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    };
    
    clearProfileOnLogout();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600 mb-8">Update your personal information</p>
            
            {(profile.email || profile.dob || profile.gender || profile.profile_picture) ? (
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Current Profile</h2>
                <div className="space-y-3">
                  {profile.profile_picture && (
                    <div className="flex flex-col items-center mb-4">
                      <img 
                        src={profile.profile_picture} 
                        alt="Profile" 
                        className="w-32 h-32 object-cover rounded-full mb-2"
                      />
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex">
                      <span className="font-medium w-32">Email:</span>
                      <span>{profile.email}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="font-medium w-32">Date of Birth:</span>
                    <span>{formatDisplayDate(profile.dob)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Gender:</span>
                    <span>{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not set"}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-medium mb-4">{profile.dob || profile.gender ? "Update Profile" : "Complete Your Profile"}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium mb-2">
                        Date of Birth
                      </label>
                      <Input
                        id="dob"
                        type="date"
                        value={inputDob}
                        onChange={(e) => setInputDob(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        Gender
                      </label>
                      <Select onValueChange={setInputGender} value={inputGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="profile_picture" className="block text-sm font-medium mb-2">
                        Profile Picture URL
                      </label>
                      <Input
                        id="profile_picture"
                        type="text"
                        value={inputProfilePicture}
                        onChange={(e) => setInputProfilePicture(e.target.value)}
                        placeholder="Enter image URL"
                        className="w-full"
                      />
                      {inputProfilePicture && (
                        <div className="mt-2">
                          <img 
                            src={inputProfilePicture} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/150?text=Invalid+URL";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-katespade-pink"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
