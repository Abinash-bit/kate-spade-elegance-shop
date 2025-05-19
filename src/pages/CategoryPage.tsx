import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";

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
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : "";
  const products = categoryId ? (productsByCategory[categoryId as keyof typeof productsByCategory] || []) : [];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profileData = JSON.parse(userProfile);
        if (profileData.recommended_products) {
          setRecommendedProducts(profileData.recommended_products);
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
  }, []);

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
                {recommendedImages.map((image, index) => (
                  <div key={index} className="card-hover group">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                      <img
                        src={image}
                        alt={`Recommended ${categoryName} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-2 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-full py-2 bg-katespade-pink text-white hover:bg-opacity-90">
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </Layout>
  );
};

export default CategoryPage;
