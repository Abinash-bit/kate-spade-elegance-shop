import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner"; // Import toast for notifications

// Sample product data by category
const productsByCategory = {
  handbags: [
    { id: 1, name: "Knott Medium Satchel", price: 398, image: "https://katespade.scene7.com/is/image/KateSpade/KI555_001?$desktopProduct$" },
    { id: 2, name: "Manhattan Large Tote", price: 428, image: "https://katespade.scene7.com/is/image/KateSpade/KL045_250?$desktopProduct$" },
    { id: 3, name: "Smile Small Shoulder Bag", price: 298, image: "https://katespade.scene7.com/is/image/KateSpade/KL660_020?$desktopProduct$" },
    { id: 4, name: "Ruby Crossbody", price: 258, image: "https://katespade.scene7.com/is/image/KateSpade/KD085_001?$desktopProduct$" },
  ],
  wallets: [
    { id: 1, name: "Spencer Bifold Wallet", price: 158, image: "https://katespade.scene7.com/is/image/KateSpade/KK741_960?$desktopProduct$" },
    { id: 2, name: "Spade Flower Jacquard Wallet", price: 178, image: "https://katespade.scene7.com/is/image/KateSpade/K9799_960?$desktopProduct$" },
    { id: 3, name: "Slim Bifold Wallet", price: 128, image: "https://katespade.scene7.com/is/image/KateSpade/KK728_960?$desktopProduct$" },
  ],
  watches: [
    { id: 1, name: "Gold-Tone Metro Watch", price: 228, image: "https://katespade.scene7.com/is/image/KateSpade/KSW1861_700?$desktopProduct$" },
    { id: 2, name: "Rose Gold Park Row Watch", price: 198, image: "https://katespade.scene7.com/is/image/KateSpade/KSW1863_710?$desktopProduct$" },
    { id: 3, name: "Annadale Glitter Watch", price: 278, image: "https://katespade.scene7.com/is/image/KateSpade/KSW1852_700?$desktopProduct$" },
  ],
  jewellery: [
    { id: 1, name: "Pearl Drop Earrings", price: 78, image: "https://katespade.scene7.com/is/image/KateSpade/KK410_960?$desktopProduct$" },
    { id: 2, name: "Spade Flower Pendant", price: 88, image: "https://katespade.scene7.com/is/image/KateSpade/KM038_410?$desktopProduct$" },
    { id: 3, name: "Heritage Spade Bangle", price: 98, image: "https://katespade.scene7.com/is/image/KateSpade/KL992_960?$desktopProduct$" },
  ],
  clothing: [
    { id: 1, name: "Spade Flower Cardigan", price: 298, image: "https://katespade.scene7.com/is/image/KateSpade/KL691_001?$desktopProduct$" },
    { id: 2, name: "Ponte Fit and Flare Dress", price: 348, image: "https://katespade.scene7.com/is/image/KateSpade/KL180_250?$desktopProduct$" },
    { id: 3, name: "Tweed Jacket", price: 498, image: "https://katespade.scene7.com/is/image/KateSpade/KL711_404?$desktopProduct$" },
  ],
};

type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type RecommendedProducts = {
  wallet: string[];
  jewellery: string[];
  clothing: string[];
  handbag: string[];
  watch: string[];
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProducts | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modelImage, setModelImage] = useState<string | null>(null); // State for model image
  const [tryOnResults, setTryOnResults] = useState<{ [key: string]: string }>({}); // State for try-on results
  const [loadingTryOns, setLoadingTryOns] = useState(false); // State for loading try-on images
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for enlarged image view

  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : "";
  const products = categoryId ? (productsByCategory[categoryId as keyof typeof productsByCategory] || []) : [];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profileData = JSON.parse(userProfile);
        if (profileData.profile_picture) {
          setModelImage(profileData.profile_picture);
        }
        if (profileData.recommended_products) {
          setRecommendedProducts(profileData.recommended_products);
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }

    // Load try-on results from localStorage if they exist
    const storedTryOnResults = localStorage.getItem(`tryOnResults_${categoryId}`);
    console.log("Stored results in localStorage for category:", categoryId, storedTryOnResults);
    if (storedTryOnResults) {
      try {
        const parsedResults = JSON.parse(storedTryOnResults);
        console.log("Parsed results for category:", categoryId, parsedResults);
        setTryOnResults(parsedResults);
      } catch (error) {
        console.error("Error parsing stored try-on results:", error);
      }
    }
  }, [categoryId]); // Add categoryId as dependency

  // Effect to clear try-on results when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      // Clear all category results
      const categories = ['handbags', 'wallets', 'watches', 'jewellery', 'clothing'];
      categories.forEach(category => {
        localStorage.removeItem(`tryOnResults_${category}`);
      });
      setTryOnResults({});
    }
  }, [isLoggedIn]);

  // Effect to generate try-on images when recommended products and model image are available
  useEffect(() => {
    if (recommendedProducts && modelImage && categoryId) {
      const categoryMap: { [key: string]: string } = {
        handbags: "handbag",
        wallets: "wallet",
        watches: "watch",
        jewellery: "jewellery",
        clothing: "clothing"
      };
      const category = categoryMap[categoryId];

      if (category && recommendedProducts[category as keyof RecommendedProducts]) {
        const garmentUrls = recommendedProducts[category as keyof RecommendedProducts].slice(0, 4);
        
        if (garmentUrls.length > 0) {
          console.log("Starting generation for category:", category);
          setLoadingTryOns(true);
          const results: { [key: string]: string } = {};

          // Sequential processing with delay
          const processNextUrl = async (index: number) => {
            if (index >= garmentUrls.length) {
              setLoadingTryOns(false);
              return;
            }

            const garmentUrl = garmentUrls[index];
            console.log("Processing URL:", garmentUrl);
            
            try {
              const apiUrl = "https://803f-34-55-132-208.ngrok-free.app/fashion-face-swap/";
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  garment_url: garmentUrl,
                  model_face_url: modelImage
                })
              });

              if (!response.ok) throw new Error("API request failed");

              const blob = await response.blob();
              // Convert blob to base64
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result as string;
                results[garmentUrl] = base64data; // Store base64 data
                
                // Update state with current results
                setTryOnResults({ ...results });

                // Wait for 20 seconds before processing the next URL
                setTimeout(() => {
                  processNextUrl(index + 1);
                }, 20000); // 20 seconds delay
              };

            } catch (error) {
              console.error("Error generating try-on for", garmentUrl, ":", error);
              results[garmentUrl] = "error"; // Indicate error for this URL
              
              // Update state with current results
              setTryOnResults({ ...results });

              // Continue to the next URL even if there's an error
              setTimeout(() => {
                processNextUrl(index + 1);
              }, 20000); // 20 seconds delay
            }
          };

          // Start processing the first URL
          processNextUrl(0);
        }
      }
    }
  }, [recommendedProducts, modelImage, categoryId]); // Dependencies for the effect

  const getRecommendedImages = () => {
    if (!recommendedProducts || !categoryId) return [];
    
    const categoryMap: { [key: string]: string } = {
      handbags: "handbag",
      wallets: "wallet",
      watches: "watch",
      jewellery: "jewellery",
      clothing: "clothing"
    };
    
    const category = categoryMap[categoryId];
    if (!category || !recommendedProducts[category as keyof RecommendedProducts]) return [];
    
    // Return original URLs, try-on results will be looked up during rendering
    return recommendedProducts[category as keyof RecommendedProducts].slice(0, 4);
  };

  const recommendedImages = getRecommendedImages();

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            <p className="text-gray-600">
              Explore our collection of {categoryName.toLowerCase()}
            </p>
          </div>

          {isLoggedIn && recommendedImages.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loadingTryOns ? (
                  <div className="col-span-full text-center text-gray-600">Generating try-on images...</div>
                ) : (
                  recommendedImages.map((originalImageUrl, index) => (
                    <div key={index} className="card-hover group cursor-pointer" onClick={() => setSelectedImage(tryOnResults[originalImageUrl] || originalImageUrl)}>
                      <div className="relative overflow-hidden rounded-lg mb-4" style={{ width: '280px', height: '400px' }}>
                        {tryOnResults[originalImageUrl] && tryOnResults[originalImageUrl] !== 'error' ? (
                          <img
                            src={tryOnResults[originalImageUrl]}
                            alt={`Try-on result for ${categoryName} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : tryOnResults[originalImageUrl] === 'error' ? (
                          <div className="w-full h-full flex items-center justify-center text-center text-gray-500 p-2">Failed to generate try-on</div>
                        ) : (
                          <img
                            src={originalImageUrl}
                            alt={`Recommended ${categoryName} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-2 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button className="w-full py-2 bg-katespade-pink text-white hover:bg-opacity-90">
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-medium text-gray-600">
                    No products found in this category
                  </h2>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: ProductType) => (
                    <div key={product.id} className="card-hover group">
                      <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-2 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button className="w-full py-2 bg-katespade-pink text-white hover:bg-opacity-90">
                            Add to Bag
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <p className="font-medium mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enlarged Image View */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged product view" className="max-w-screen-lg max-h-screen-lg object-contain" />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryPage;
