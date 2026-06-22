import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const { addToCart } = useCart();

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#DBCEA5" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase mb-8 text-[#2D2A26]">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-xl font-bold text-[#8B5E3C]">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div 
                key={product._id} 
                className="bg-white p-5 rounded-2xl shadow-lg border-2 border-[#8B5E3C]/20 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.images?.[0]} className="w-full h-48 object-cover rounded-xl" />
                <h3 className="text-lg font-bold mt-4">{product.title}</h3>
                <p className="font-bold text-[#8B5E3C]">LKR {product.price.toLocaleString()}</p>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="flex-1 py-2 bg-[#2D2A26] text-white rounded-lg font-bold text-xs uppercase"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Section */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div
              className="bg-white p-8 rounded-3xl max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-2xl">✕</button>
              
              <img src={selectedProduct.images?.[0]} className="w-full h-64 object-cover rounded-2xl cursor-pointer" onClick={() => setFullImage(selectedProduct.images?.[0])} />
              
              <h2 className="text-3xl font-black mt-4">{selectedProduct.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{selectedProduct.description}</p>

              <div className="flex flex-col gap-2 mt-4 font-bold text-[#8B5E3C]">
                <p className="text-2xl">LKR {selectedProduct.price.toLocaleString()}</p>
                <p className="text-sm">• Stock: {selectedProduct.stock}</p>
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(selectedProduct.variants || {}).map(([key, val]: any) => (
                  <div key={key}>
                    <h4 className="text-xs font-black uppercase text-gray-400">{key}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {val.split(",").map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [key]: opt })}
                          className={`px-4 py-2 rounded-xl border-2 font-bold ${selectedOptions[key] === opt ? "bg-[#2D2A26] text-white" : "bg-white border-gray-200"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { addToCart({ ...selectedProduct, selectedOptions }); setSelectedProduct(null); }}
                className="mt-8 w-full py-4 bg-[#2D2A26] text-white rounded-2xl font-bold uppercase tracking-widest"
              >
                Add to Cart
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Image Preview */}
      {fullImage && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4" onClick={() => setFullImage(null)}>
          <img src={fullImage} className="max-w-full max-h-screen object-contain" />
        </div>
      )}
    </div>
  );
};

export default Wishlist;