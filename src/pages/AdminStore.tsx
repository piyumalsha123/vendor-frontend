import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const StoreProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/products/store/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center text-xl">Loading Products...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>
      
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Store Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found for this store.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p: any) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 overflow-hidden">
              {/* Product Image */}
              <img 
                src={p.image || "https://via.placeholder.com/300"} 
                alt={p.name} 
                className="w-full h-48 object-cover" 
              />
              
              {/* Product Info */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 truncate">{p.name}</h2>
                <p className="text-indigo-600 font-bold mt-2 text-xl">Rs. {p.price.toLocaleString()}</p>
                
                <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreProducts;