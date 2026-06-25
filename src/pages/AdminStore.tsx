import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const StoreProducts = () => {
  const { id } = useParams(); // Store ID eka ganna
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Backend eken me store eke products tika ganna
    fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/products/store/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Store Products</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((p: any) => (
          <div key={p._id} className="p-4 bg-white shadow rounded">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
            <h2 className="font-bold mt-2">{p.name}</h2>
            <p>Rs. {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StoreProducts;