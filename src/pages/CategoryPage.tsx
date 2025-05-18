
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";

// Sample product data by category
const productsByCategory = {
  handbags: [
    { id: 1, name: "Knott Medium Satchel", price: 398, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Manhattan Large Tote", price: 428, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Smile Small Shoulder Bag", price: 298, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Ruby Crossbody", price: 258, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800" },
  ],
  wallets: [
    { id: 1, name: "Spencer Bifold Wallet", price: 158, image: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Spade Flower Jacquard Wallet", price: 178, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Slim Bifold Wallet", price: 128, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800" },
  ],
  watches: [
    { id: 1, name: "Gold-Tone Metro Watch", price: 228, image: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Rose Gold Park Row Watch", price: 198, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Annadale Glitter Watch", price: 278, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800" },
  ],
  jewellery: [
    { id: 1, name: "Pearl Drop Earrings", price: 78, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Spade Flower Pendant", price: 88, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Heritage Spade Bangle", price: 98, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800" },
  ],
  clothing: [
    { id: 1, name: "Spade Flower Cardigan", price: 298, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Ponte Fit and Flare Dress", price: 348, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Tweed Jacket", price: 498, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800" },
  ],
};

type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : "";
  const products = categoryId ? (productsByCategory[categoryId as keyof typeof productsByCategory] || []) : [];

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

          {products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-medium text-gray-600">
                No products found in this category
              </h2>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
