
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="container-custom py-24 text-center">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-3xl font-medium mb-8">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          We're sorry, the page you're looking for cannot be found.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-katespade-pink hover:bg-opacity-90">
            Back to Homepage
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
