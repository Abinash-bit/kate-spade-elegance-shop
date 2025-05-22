import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VirtualTryOn = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load model image from profile
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      if (profile.profile_picture) {
        setModelImage(profile.profile_picture);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!modelImage) {
      toast.error("Please set up your profile picture first");
      return;
    }
    if (!garmentImage) {
      toast.error("Please enter a garment image URL");
      return;
    }

    setLoading(true);
    setResultImage(null);
    try {
      const apiUrl = "https://e284-34-55-132-208.ngrok-free.app/fashion-face-swap/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          garment_url: garmentImage,
          model_face_url: modelImage
        })
      });
      if (!response.ok) throw new Error("API request failed");

      // Read the response as a Blob (image)
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);

      toast.success("Virtual try-on generated successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate virtual try-on");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Get the dropped URL from the clipboard
    const url = e.dataTransfer.getData('text/plain');
    if (url) {
      setGarmentImage(url);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const url = e.clipboardData.getData('text/plain');
    if (url) {
      setGarmentImage(url);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
            <p className="text-gray-600 mb-8">Experience our products virtually</p>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Model Image Holder */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Model</h2>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {modelImage ? (
                      <img 
                        src={modelImage} 
                        alt="Model" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">No profile picture set</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Your profile picture will be used as the model
                  </p>
                </div>

                {/* Garment Image Holder */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Garment</h2>
                  <div 
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${
                      isDragging ? 'ring-2 ring-katespade-pink' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    tabIndex={0}
                  >
                    {garmentImage ? (
                      <img 
                        src={garmentImage} 
                        alt="Garment" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400?text=Invalid+URL";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-gray-500 mb-2">Drop garment image URL here</p>
                        <p className="text-sm text-gray-400">or paste URL (Ctrl/Cmd + V)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Result Image Holder */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Result</h2>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Generating...</p>
                      </div>
                    ) : resultImage ? (
                      <img 
                        src={resultImage} 
                        alt="Result" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Result will appear here</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-katespade-pink"
                    onClick={handleGenerate}
                    disabled={loading || !modelImage || !garmentImage}
                  >
                    {loading ? "Generating..." : "Generate Try-On"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VirtualTryOn; 