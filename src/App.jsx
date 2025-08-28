import React, { useState } from "react";
import amazonIcon from "./assets/amazon.png";
import googleIcon from "./assets/google.png";
import ProductCard from "./ProductCard";

const Demo = () => {
  const [productName, setProductName] = useState("");
  const [googleData, setGoogleData] = useState([]);
  const [amazonData, setAmazonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const Amazon = { url: amazonIcon, title: "Amazon Shopping" };
  const Google = { url: googleIcon, title: "Google Shopping" };

  const googleApiKey = "7934bd78-61b0-451f-81b9-9865c29a316d";
  const amazonApiKey = "47ec0db7-925a-48e4-bd91-97b80cee0d75";

  const googleUrl = `https://api.hasdata.com/scrape/google/shopping?q=${encodeURIComponent(
    productName
  )}&location=Austin%2CTexas%2CUnited+States&deviceType=desktop`;
  const amazonUrl = `https://api.hasdata.com/scrape/amazon/search?q=${encodeURIComponent(
    productName
  )}`;

  // to convert USD price into INR
  function converUSDtoINR(price) {
    return price * 85;
  }

  function getPrice(item) {
    if (typeof item.price === "object") {
      const price =
        typeof item.price.currentPrice === "number"
          ? converUSDtoINR(item.price.currentPrice)
          : converUSDtoINR(Math.random() * 300);
      return price.toFixed(2);
    } else {
      const price =
        typeof item.extractedPrice === "number"
          ? converUSDtoINR(item.extractedPrice)
          : converUSDtoINR(Math.random() * 300);
      return price.toFixed(2);
    }
  }

  //fuction which which fetch on form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setLoading(true);
    setError(null);
    setGoogleData([]);
    setAmazonData([]);

    try {
      const [googleResponse, amazonResponse] = await Promise.all([
        fetch(googleUrl, { headers: { "x-api-key": googleApiKey } }),
        fetch(amazonUrl, { headers: { "x-api-key": amazonApiKey } }),
      ]);

      if (!googleResponse.ok || !amazonResponse.ok) {
        let errorMessage = "Failed to fetch data. Please check your API key.";
        if (googleResponse.status === 429 || amazonResponse.status === 429) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        }
        throw new Error(errorMessage);
      }

      const googleResult = await googleResponse.json();
      const amazonResult = await amazonResponse.json();

      //sorting results from api based on Price
      const sortedGoogle =
        googleResult.shoppingResults?.sort(
          (a, b) => getPrice(a) - getPrice(b)
        ) || [];
      const sortedAmazon =
        amazonResult.productResults?.sort(
          (a, b) => getPrice(a) - getPrice(b)
        ) || [];

      setGoogleData(sortedGoogle);
      setAmazonData(sortedAmazon);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 sm:mb-10">
          Price Comparison Tool
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
        >
          <div className="relative w-full sm:flex-1">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Search for a product, e.g., 'headphones'..."
              className="w-full p-4 pl-12 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-md"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span class="material-symbols-outlined align-middle">search</span>
            </span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {/* //error masages */}
        {error && (
          <div
            className="text-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {/* //Loading.... */}
        {loading && (
          <p className="text-center text-gray-600 animate-pulse text-lg">
            Loading search results...
          </p>
        )}
        {/* //container for Amazon products Column */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-700 mb-6 flex items-center justify-center space-x-2">
              <img src={Amazon.url} alt="Amazon Logo" className="w-8 h-8" />
              <span>Amazon Products</span>
            </h2>
            <div className="space-y-6">
              {amazonData.length > 0
                ? amazonData.map((product, index) => (
                    <ProductCard
                      key={index}
                      product={product}
                      getPrice={getPrice}
                      website={Amazon}
                    />
                  ))
                : !loading && (
                    <p className="text-center text-gray-500 text-base py-8">
                      Search for a product to see Amazon results.
                    </p>
                  )}
            </div>
          </div>
          {/* //container for Google products Column */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-700 mb-6 flex items-center justify-center space-x-2">
              <img src={Google.url} alt="Google Logo" className="w-8 h-8" />
              <span>Google Shopping Products</span>
            </h2>
            <div className="space-y-6">
              {googleData.length > 0
                ? googleData.map((product, index) => (
                    <ProductCard
                      key={index}
                      product={product}
                      getPrice={getPrice}
                      website={Google}
                    />
                  ))
                : !loading && (
                    <p className="text-center text-gray-500 text-base py-8">
                      Search for a product to see Google results.
                    </p>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
