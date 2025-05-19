import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const CustomizeAI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("handbags");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: "handbags", name: "Handbags" },
    { id: "jewellery", name: "Jewellery" },
    { id: "watches", name: "Watches" },
    { id: "clothing", name: "Clothing" },
    { id: "wallet", name: "Wallet" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (style: string) => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    // TODO: Implement actual AI generation logic here
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setResultImage(selectedImage); // Replace with actual generated image
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container-custom py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Customize with AI</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload and Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Upload Your Product</h2>
              
              {/* Category Selection */}
              <div className="mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Menu className="mr-2 h-4 w-4" />
                      {categories.find(cat => cat.id === selectedCategory)?.name || "Select Category"}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="py-4">
                      <h2 className="text-lg font-semibold mb-4">Select Category</h2>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label htmlFor="image-upload">Upload Product Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                
                {selectedImage && (
                  <div className="mt-4">
                    <img
                      src={selectedImage}
                      alt="Selected product"
                      className="w-full h-64 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Generation Buttons */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Generate Images</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleGenerate("lifestyle")}
                  disabled={!selectedImage || isGenerating}
                  className="w-full"
                >
                  Generate Lifestyle
                </Button>
                <Button
                  onClick={() => handleGenerate("studio")}
                  disabled={!selectedImage || isGenerating}
                  className="w-full"
                >
                  Generate Studio Shoot
                </Button>
                <Button
                  onClick={() => handleGenerate("mannequin")}
                  disabled={!selectedImage || isGenerating}
                  className="w-full"
                >
                  Generate Mannequin
                </Button>
                <Button
                  onClick={() => handleGenerate("high-fashion")}
                  disabled={!selectedImage || isGenerating}
                  className="w-full"
                >
                  Generate High Fashion
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Result Display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Generated Result</h2>
            <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-katespade-pink mx-auto mb-4"></div>
                  <p>Generating your image...</p>
                </div>
              ) : resultImage ? (
                <img
                  src={resultImage}
                  alt="Generated result"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-gray-500">Your generated image will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomizeAI; 