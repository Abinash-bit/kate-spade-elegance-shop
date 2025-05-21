import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const categories = [
  {
    id: 1,
    name: "Handbags",
    image: "https://katespade.scene7.com/is/image/KateSpade/KK820_250?$desktopProduct$",
    path: "/category/handbags",
  },
  {
    id: 2,
    name: "Wallets",
    image: "https://katespade.scene7.com/is/image/KateSpade/KD120_960?$desktopProduct$",
    path: "/category/wallets",
  },
  {
    id: 3,
    name: "Watches",
    image: "https://katespade.scene7.com/is/image/KateSpade/KSS0195E_TBD?$desktopProduct$",
    path: "/category/watches",
  },
  {
    id: 4,
    name: "Jewellery",
    image: "https://katespade.scene7.com/is/image/KateSpade/KH678_700_1?$desktopProduct$",
    path: "/category/jewellery",
  },
  {
    id: 5,
    name: "Clothing",
    image: "https://katespade.scene7.com/is/image/KateSpade/KK363_403?$desktopProduct$",
    path: "/category/clothing",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Knott Medium Satchel",
    price: 398,
    image: "https://katespade.scene7.com/is/image/KateSpade/KK783_960?$desktopProduct$",
    category: "Handbags",
  },
  {
    id: 2,
    name: "Spade Flower Jacquard Wallet",
    price: 158,
    image: "https://katespade.scene7.com/is/image/KateSpade/KL600_300?$desktopProduct$",
    category: "Wallets",
  },
  {
    id: 3,
    name: "Gold-Tone Metro Watch",
    price: 228,
    image: "https://katespade.scene7.com/is/image/KateSpade/KSW1852_700?$desktopProduct$",
    category: "Watches",
  },
  {
    id: 4,
    name: "Pearl Drop Earrings",
    price: 78,
    image: "https://katespade.scene7.com/is/image/KateSpade/KL368_960?$desktopProduct$",
    category: "Jewellery",
  },
];

const Homepage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div
          className="bg-cover bg-center h-[80vh]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container-custom relative h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Summer Collection 2025
              </h1>
              <p className="text-xl mb-8">
                Discover our latest designs that blend sophistication with playful charm
              </p>
              <div className="space-x-4">
                <Button size="lg" className="bg-katespade-pink hover:bg-opacity-90">
                  Shop Now
                </Button>
                <Button size="lg" className="bg-katespade-pink text-white hover:bg-opacity-90">
                  Explore Collections
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600">
              Discover our wide range of kate spade products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group card-hover overflow-hidden rounded-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">
              Our most popular items that are trending right now
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
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
                <p className="text-gray-500 mb-1">{product.category}</p>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-katespade-pink/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime
              deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-katespade-pink"
              />
              <Button className="bg-katespade-pink hover:bg-opacity-90 min-w-[120px]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
