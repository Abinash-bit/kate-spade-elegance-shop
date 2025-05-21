import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  const categories = [
    { name: "Handbags", path: "/category/handbags" },
    { name: "Wallets", path: "/category/wallets" },
    { name: "Watches", path: "/category/watches" },
    { name: "Jewellery", path: "/category/jewellery" },
    { name: "Clothing", path: "/category/clothing" },
    { name: "Virtual Try-On", path: "/virtual-try-on" },
  ];

  const handleLogout = () => {
    // Clear both token and user profile from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Force refresh to update login state
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-tighter">kate spade</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`text-base font-medium hover:text-katespade-pink transition-colors ${
                  location.pathname === category.path
                    ? "text-katespade-pink"
                    : "text-gray-700"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost">Logout</Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-gray-200 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block py-2 px-4 text-base hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-gray-100">
              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 px-4 text-base hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left py-2 px-4 text-base hover:bg-gray-50"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 px-4 text-base hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 px-4 text-base hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
