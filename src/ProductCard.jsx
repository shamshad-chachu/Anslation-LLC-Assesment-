import React from 'react'

const ProductCard = ({ product, getPrice, website }) => {
  function getRating(prod) {
    return prod.reviews?.rating || prod.rating || "N/A";
  }

  function getUrl(prod) {
    return prod.productLink || prod.url || "/";
  }

  const title = product.title || "Untitled Product";
  const truncatedTitle = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <img
        src={product.thumbnail || product.image || "https://via.placeholder.com/150"}
        alt={title}
        className="w-24 h-24 object-contain rounded-lg flex-shrink-0 border border-gray-200"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
          {truncatedTitle}
        </h3>
        <p className="text-blue-600 mt-2 font-bold text-xl">₹{getPrice(product)}</p>
        <div className="flex items-center justify-center sm:justify-start mt-1 space-x-2 text-sm text-gray-600">
          <span> {getRating(product)}</span>
          <span className="text-gray-400">|</span>
          <a
            href={getUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <img className='w-4 h-4' src={website.url} alt={website.title} />
            <span>{website.title}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard