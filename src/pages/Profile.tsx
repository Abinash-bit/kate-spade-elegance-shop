
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    dob: string | null;
    gender: string | null;
  }>({
    dob: null,
    gender: null,
  });

  const [inputDob, setInputDob] = useState("");
  const [inputGender, setInputGender] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      toast.error("Please login to access your profile");
      return;
    }

    // You would normally fetch existing profile data here
    setLoading(false);
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
      const response = await fetch("http://localhost:8000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        },
        body: JSON.stringify({
          dob: inputDob,
          gender: inputGender
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      
      setProfile({
        dob: data.dob,
        gender: data.gender
      });

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
    
    // The API returns the date in DD-MM-YYYY format
    try {
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
            
            {profile.dob || profile.gender ? (
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Current Profile</h2>
                <div className="space-y-3">
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
