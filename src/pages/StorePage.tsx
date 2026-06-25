import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StorePage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [fullImage, setFullImage] = useState<string | null>(null);

  useEffect(() => { fetchStoreDetails(); }, [vendorId]);

  const fetchStoreDetails = async () => {
  const [storeRes, prodRes] = await Promise.all([
    fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/stores/${vendorId}`),
    fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/products?vendorId=${vendorId}`)
  ]);
  const storeData = await storeRes.json();
  console.log("Store Data:", storeData); 
  setStore(storeData);
  setProducts(await prodRes.json());
};

  const groupedProducts = products.reduce((acc: any, product: any) => {
    const cat = product.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  if (!store) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Loading Store...</div>;

  return (
    <div className="min-h-screen bg-[#c5a67e] pb-20">
     
      <div className="bg-[#2D2A26] text-white p-10 rounded-b-[3rem] shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 font-bold opacity-70 hover:opacity-100 transition">← Back</button>
        <h1 className="text-5xl font-black">{store.storeName}</h1>
<div className="flex flex-wrap gap-4 mt-4 text-sm font-medium opacity-80">
  <span className="bg-white/10 px-4 py-1 rounded-full">{store.category}</span>
  <span>📞 {store.phone || "No Phone"}</span>
  {store.email && <span>📧 {store.email}</span>}
</div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        {Object.keys(groupedProducts).map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-black text-gray-800 mb-8 border-l-8 border-[#8B5E3C] pl-4">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {groupedProducts[category].map((product: any) => (
                <motion.div key={product._id} whileHover={{ y: -5 }} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img src={product.images[0]} className="w-full h-48 rounded-2xl object-cover mb-4" />
                  <h3 className="font-bold text-gray-900 truncate">{product.title}</h3>
                  <p className="text-[#8B5E3C] font-black mt-1">LKR {product.price.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white p-8 rounded-[2rem] max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-2xl font-bold bg-gray-100 p-2 rounded-full hover:bg-gray-200">✕</button>
              
              <img src={selectedProduct.images?.[0]} className="w-full h-64 object-cover rounded-2xl cursor-pointer" onClick={() => setFullImage(selectedProduct.images?.[0])} />
              
              <h2 className="text-3xl font-black mt-6">{selectedProduct.title}</h2>
              <p className="text-gray-600 mt-2 text-sm">{selectedProduct.description}</p>
              
              <div className="flex items-center justify-between mt-6 bg-gray-50 p-4 rounded-2xl">
                 <p className="text-2xl font-black text-[#2D2A26]">LKR {selectedProduct.price.toLocaleString()}</p>
                 {selectedProduct.deliveryCharge === 0 ? (
                    <span className="text-xs font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">✨ Free Delivery</span>
                 ) : (
                    <span className="text-xs font-bold text-gray-500">Delivery: LKR {selectedProduct.deliveryCharge?.toLocaleString()}</span>
                 )}
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(selectedProduct.variants || {}).map(([key, val]: any) => (
                  <div key={key}>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{key}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {val.split(",").map((opt: string) => (
                        <button key={opt} onClick={() => setSelectedOptions({...selectedOptions, [key]: opt})} className={`px-4 py-2 rounded-xl border-2 font-bold transition ${selectedOptions[key] === opt ? "bg-[#8B5E3C] text-white border-[#8B5E3C]" : "border-gray-200"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-4 bg-[#2D2A26] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition">Add to Cart</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     
      {fullImage && (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
          <button onClick={() => setFullImage(null)} className="absolute top-10 right-10 text-white text-4xl font-bold">✕</button>
          <img src={fullImage} className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default StorePage;