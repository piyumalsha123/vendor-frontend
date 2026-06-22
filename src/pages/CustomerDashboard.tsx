import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const CustomerDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  const c = {
    brown: "#8B5E3C",
    cream: "#DBCEA5",
    black: "#2D2A26",
    white: "#FFFFFF",
  };

const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearch(searchTerm);
    }, 500); 

    return () => clearTimeout(handler);
}, [searchTerm]);

useEffect(() => {
    fetchProducts();
}, [debouncedSearch, selectedCategory]); 

const fetchProducts = async () => {
    
    const url = `http://localhost:5000/api/v1/products/public-products?search=${debouncedSearch}&category=${selectedCategory}`;
    const res = await fetch(url);
    const result = await res.json();
    if (res.ok) setProducts(result.data);
};
  

  const toggleWishlist = (product: any) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isExists = existingWishlist.find((item: any) => item._id === product._id);
    let newWishlist;
    if (isExists) {
      newWishlist = existingWishlist.filter((item: any) => item._id !== product._id);
      alert("Removed from Wishlist");
    } else {
      newWishlist = [...existingWishlist, product];
      alert("Added to Wishlist");
    }
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const filteredProducts = products.filter((p) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const titleLower = p.title.toLowerCase().trim();    
    
    const matchesSearch = 
        titleLower.includes(searchLower) || 
        p.description?.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower);
        
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
});

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: c.cream }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest" style={{ color: c.black }}>Marketplace</h1>
            <p className="mt-2 font-medium italic" style={{ color: c.brown }}>Discover premium products curated for you</p>
          </div>
         
<div className="relative w-full max-w-md">
 
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <span className="text-gray-400">🔍</span>
  </div>
  
  <input
    type="text"
    placeholder="Search products (e.g. Frock)..."
    className="w-full pl-12 pr-10 py-3 rounded-full border-2 outline-none transition-all shadow-sm"
    style={{ 
        borderColor: c.brown, 
        backgroundColor: c.white, 
        color: c.black 
    }}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {searchTerm && (
    <button 
      onClick={() => setSearchTerm("")} 
      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-black"
    >
      ✕
    </button>
  )}
</div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-6 py-2 rounded-full font-bold transition-all border-2"
              style={{
                backgroundColor: selectedCategory === cat ? c.brown : "transparent",
                color: selectedCategory === cat ? c.white : c.black,
                borderColor: c.brown
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div
  className="bg-white p-8 rounded-3xl max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
  onClick={(e) => e.stopPropagation()}
>
  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-2xl">✕</button>
  
  <img src={selectedProduct.images?.[0]} className="w-full h-64 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition" onClick={() => setFullImage(selectedProduct.images?.[0])} />
  
  <h2 className="text-3xl font-black mt-4">{selectedProduct.title}</h2>
  
 
  <div className="mt-4">
    <h4 className="text-xs font-black uppercase text-gray-400">Description</h4>
    <p className="text-gray-700 text-sm mt-1">{selectedProduct.description}</p>
  </div>

  <div className="flex flex-col gap-2 mt-4 font-bold text-[#8B5E3C]">
    <p className="text-2xl">LKR {selectedProduct.price.toLocaleString()}</p>
    <p className="text-sm">• Stock: {selectedProduct.stock}</p>
    <div>
      {selectedProduct.deliveryCharge === 0 ? (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-center border-2 border-green-200 font-black uppercase text-xs">✨ Free Delivery</div>
      ) : (
        <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-center border-2 border-gray-200 font-bold text-xs">Delivery Charge: LKR {selectedProduct.deliveryCharge?.toLocaleString()}</div>
      )}
    </div>
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
              className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${selectedOptions[key] === opt ? "bg-[#2D2A26] text-white border-[#2D2A26]" : "bg-white border-gray-200 text-[#2D2A26]"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>

  <button
    onClick={() => { addToCart({ ...selectedProduct, selectedOptions }); setSelectedProduct(null); setSelectedOptions({}); }}
    className="mt-8 w-full py-4 bg-[#2D2A26] text-white rounded-2xl font-bold uppercase tracking-widest"
  >
    Add to Cart
  </button>
</motion.div>
          </div>
        )}

        {fullImage && (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <button onClick={() => setFullImage(null)} className="absolute top-6 right-6 p-3 bg-white/20 rounded-full text-white text-3xl hover:bg-white/40 transition">✕</button>
            <img src={fullImage} className="max-w-full max-h-screen p-4 object-contain" alt="Full view" />
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <AnimatePresence>
    {filteredProducts.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full py-20 text-center text-gray-500 font-bold"
      >
        No products found matching your search.
      </motion.div>
    ) : (
      filteredProducts.map((product) => (
        <motion.div
          key={product._id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          whileHover={{ y: -5 }}
          className="p-5 rounded-2xl shadow-lg border-2 cursor-pointer transition-all duration-300"
          onClick={() => setSelectedProduct(product)}
          style={{ backgroundColor: c.white, borderColor: `${c.brown}30` }}
        >
          <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
            <img 
              src={product.images?.[0] || "https://via.placeholder.com/400"} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
            <button 
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} 
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md" 
              style={{ color: c.brown }}
            >
              ❤️
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold truncate" style={{ color: c.black }}>{product.title}</h3>
            
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {product.variants &&
                Object.entries(product.variants).slice(0, 2).map(([key, value]: any) => (
                  <span key={key} className="text-[9px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600 truncate max-w-[80px]">
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value.split(',')[0]}
                  </span>
                ))}
            </div>

            <div className="mt-2">
              {product.deliveryCharge === 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-2 py-1 rounded-md">Free Delivery</span>
              ) : (
                <span className="text-[10px] font-bold text-gray-500">LKR {product.deliveryCharge?.toLocaleString()} Delivery</span>
              )}
            </div>

            <p className="font-bold mt-2 text-lg" style={{ color: c.brown }}>LKR {product.price.toLocaleString()}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product); }} 
              className="mt-4 w-full py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all active:scale-95 border-2" 
              style={{ backgroundColor: c.black, color: c.white, borderColor: c.black }}
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      ))
    )}
  </AnimatePresence>
</motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;