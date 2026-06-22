import { useEffect, useState } from "react";

const MyProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [storeAttrs, setStoreAttrs] = useState<{ label: string; options: string }[]>([]);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  const [viewProduct, setViewProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    variants: {} as any,
    category: "clothing",
    images: [] as string[],
    deliveryCharge:0
  });

  const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/v1/products/my-products", { 
      headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
    });
    const result = await res.json();
    console.log("Products:", result); 
    if (res.ok) setProducts(result.data);
  } catch (err) { console.error(err); }
};

  const fetchStoreSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/stores/settings", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
      });
      if (!res.ok) return;
      const result = await res.json();
      if (result && Array.isArray(result.customAttributes)) {
        const parsedAttrs = result.customAttributes.map((attr: string) => ({ label: attr, options: "" }));
        setStoreAttrs(parsedAttrs);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProducts();
    fetchStoreSettings();
  }, []);

  const uploadImageToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("image", file);
    const res = await fetch("http://localhost:5000/api/v1/upload", {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
      body: data,
    });
    const result = await res.json();
    return result.imageUrl;
  };

 const deleteProduct = async (id: string) => {
  if (!confirm("Are you sure?")) return;
  try {
   
    const res = await fetch(`http://localhost:5000/api/v1/products/delete/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
    });
    
    if (res.ok) {
      alert("Product deleted!");
      fetchProducts();
    } else {
      const errorData = await res.json();
      console.error("Error:", errorData);
      alert("Failed to delete product.");
    }
  } catch (err) { 
    console.error("Network error:", err);
  }
};

  const handleSave = async () => {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
    alert("Please upload a product image!");
    return;
  }
  if (formData.deliveryCharge === undefined || formData.deliveryCharge < 0) {
    alert("Please enter a valid delivery charge (use 0 for free delivery).");
    return;
  }

    let imageUrl = "";
    if (file) imageUrl = await uploadImageToCloudinary(file);

    const payload = { 
      ...formData, 
      description: formData.description || "No description provided",
      isAvailable: true, 
      deliveryCharge: isFreeDelivery ? 0 : formData.deliveryCharge,
      images: imageUrl ? [imageUrl] : [] 
    };

    const res = await fetch("http://localhost:5000/api/v1/products/save", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Product saved!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", price: 0, stock: 0, variants: {}, category: "clothing", images: [],deliveryCharge:0 });
      fetchProducts();
    }
  };

  const handleUpdate = async () => {
    const fileInput = document.getElementById('editImageInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let imageUrl = selectedProduct.images[0];

    if (file) {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const payload = {
      ...selectedProduct,
      images: [imageUrl]
    };

    const res = await fetch(`http://localhost:5000/api/v1/products/update/${selectedProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Product updated!");
      setIsEditModalOpen(false);
      fetchProducts();
    }
  };
   
  return (
    <div className="p-10 bg-[#ccba97] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-extrabold text-[#2D2A26] italic">My Products</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#2D2A26] text-[#E5D3B3] px-6 py-3 rounded-lg font-bold">+ Add New Product</button>
      </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((p) => (
        <div key={p._id}className="bg-white p-5 rounded-3xl shadow-lg border border-[#E6DFD3] cursor-pointer hover:shadow-2xl transition"
  onClick={() => setViewProduct(p)}>
          
          {p.images?.length > 0 ? <img src={p.images[0]} className="w-full h-48 object-cover rounded-2xl mb-4" /> : <div className="w-full h-48 bg-[#FDFBF7] flex items-center justify-center rounded-2xl mb-4 text-[#8B5E3C] font-bold">No Image</div>}
          <h3 className="text-2xl font-black text-[#2D2A26]">{p.title}</h3>
          <p className="text-sm text-[#8B5E3C] italic mt-1 line-clamp-2">{p.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-black text-[#4A3728]">LKR {p.price.toLocaleString()}</span>
            <span className="text-[10px] font-bold uppercase bg-[#FAF6EE] px-2 py-1 rounded-md text-[#8B5E3C]">Stock: {p.stock}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(p.variants || {}).map(([key, val]: any) => (
               val && <div key={key} className="text-[10px] bg-[#2D2A26] text-white px-2 py-1 rounded-md">
                 <span className="font-bold">{key}:</span> {val}
               </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => { setSelectedProduct(p); setIsEditModalOpen(true); }} className="flex-1 py-3 bg-[#f8f8f8] text-[#1d802d] rounded-xl font-bold hover:bg-green-100 transition border border-green-100">Edit</button>
            <button onClick={() => deleteProduct(p._id)} className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition border border-red-100">Delete</button>
          </div>
        </div>
      ))}
     </div>

     {/* ADD MODAL */}
     {isModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 className="text-3xl font-black text-[#2D2A26] mb-6">Add New Product</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Product Title</label>
              <input className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Description</label>
              <textarea className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Category</label>
                <select className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="clothing">Clothing</option>
                  <option value="foods">Foods</option>
                  <option value="flowers">Flowers</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Price</label>
                <input type="number" className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Stock</label>
              <input type="number" className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
            <div className="p-4 bg-[#FDFBF7] border border-[#E6DFD3] rounded-2xl">
              <label className="block text-sm font-bold text-[#2D2A26] mb-3">Attributes</label>
              {storeAttrs.map((item, index) => {
                const isMultiSelect = ["Size", "Gender"].includes(item.label);
                const options = isMultiSelect ? (item.label === "Size" ? ["S", "M", "L", "XL", "XXL"] : ["Male", "Female", "Unisex"]) : [];
                return (
                  <div key={index} className="mb-4">
                    <label className="text-[10px] font-black uppercase text-[#8B5E3C]">{item.label}</label>
                    {isMultiSelect ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {options.map(opt => (
                          <label key={opt} className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border ${formData.variants[item.label]?.includes(opt) ? "bg-[#2D2A26] text-white" : "bg-white"}`}>
                            <input type="checkbox" className="hidden" onChange={(e) => {
                              const current = formData.variants[item.label] || "";
                              const list = current ? current.split(",") : [];
                              const newList = e.target.checked ? [...list, opt] : list.filter((i: string) => i !== opt);
                              setFormData({...formData, variants: {...formData.variants, [item.label]: newList.join(",")}});
                            }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input className="w-full p-3 mt-1 border border-[#D4C4A8] rounded-xl" onChange={(e) => setFormData({...formData, variants: {...formData.variants, [item.label]: e.target.value}})} />
                    )}
                  </div>
                );
              })}
            </div>
        
<div className="flex items-center gap-2 my-4">
  <input 
    type="checkbox" 
    checked={isFreeDelivery} 
    onChange={(e) => {
      setIsFreeDelivery(e.target.checked);
      if (e.target.checked) setFormData({...formData, deliveryCharge: 0}); 
    }} 
  />
  <label className="text-sm font-bold text-[#2D2A26]">Free Delivery</label>
</div>


{!isFreeDelivery && (
  <div>
    <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Delivery Charge (LKR)</label>
    <input 
      type="number" 
      className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" 
      onChange={(e) => setFormData({...formData, deliveryCharge: Number(e.target.value)})} 
    />
  </div>
)}

<div className="mt-4">
  <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Product Image (Required)</label>
  <input type="file" id="imageInput" required className="w-full mt-2" />
</div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 rounded-2xl font-bold">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-4 bg-[#2D2A26] text-white rounded-2xl font-bold">Post Now</button>
          </div>
        </div>
      </div>
     )}

   
{viewProduct && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-black text-[#2D2A26]">Product Details</h2>
        <button onClick={() => setViewProduct(null)} className="text-gray-500 font-bold text-xl">✕</button>
      </div>

      <img src={viewProduct.images[0]} className="w-full h-80 object-cover rounded-3xl mb-6 shadow-inner" />
      
      <h2 className="text-4xl font-black text-[#2D2A26]">{viewProduct.title}</h2>
      <p className="text-[#8B5E3C] mt-2 text-lg italic">{viewProduct.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E6DFD3]">
          <p className="text-[10px] text-[#8B5E3C] font-black uppercase">Price</p>
          <p className="text-xl font-black text-[#2D2A26]">LKR {viewProduct.price.toLocaleString()}</p>
        </div>
        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E6DFD3]">
          <p className="text-[10px] text-[#8B5E3C] font-black uppercase">Stock</p>
          <p className="text-xl font-black text-[#2D2A26]">{viewProduct.stock} Units</p>
        </div>
        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E6DFD3]">
          <p className="text-[10px] text-[#8B5E3C] font-black uppercase">Delivery</p>
          <p className="text-xl font-black text-[#2D2A26]">
            {viewProduct.deliveryCharge === 0 ? "Free Delivery" : `LKR ${viewProduct.deliveryCharge}`}
          </p>
        </div>
        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E6DFD3]">
          <p className="text-[10px] text-[#8B5E3C] font-black uppercase">Category</p>
          <p className="text-xl font-black text-[#2D2A26] capitalize">{viewProduct.category}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-black text-[#2D2A26] mb-3 uppercase text-xs">Attributes:</h4>
        <div className="flex flex-wrap gap-2">
           {viewProduct.variants && Object.entries(viewProduct.variants).map(([key, val]: any) => (
             <div key={key} className="bg-[#2D2A26] text-white px-4 py-2 rounded-xl text-sm font-bold">
               <span className="opacity-70">{key}: </span> {val}
             </div>
           ))}
        </div>
      </div>

      <button onClick={() => setViewProduct(null)} className="w-full mt-8 py-4 bg-[#2D2A26] text-[#E5D3B3] rounded-2xl font-bold hover:opacity-90 transition">
        Close Details
      </button>
    </div>
  </div>
)}

     {isEditModalOpen && selectedProduct && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 className="text-3xl font-black text-[#2D2A26] mb-6">Edit Product</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Product Title</label>
              <input value={selectedProduct.title} className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setSelectedProduct({...selectedProduct, title: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Description</label>
              <textarea value={selectedProduct.description} className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Category</label>
                <select value={selectedProduct.category} className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}>
                  <option value="clothing">Clothing</option>
  <option value="foods">Foods</option>
  <option value="flowers">Flowers</option>
  <option value="handmade">Handmade</option>
  <option value="bakery">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Price</label>
                <input type="number" value={selectedProduct.price} className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Stock</label>
              <input type="number" value={selectedProduct.stock} className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})} />
            </div>
          <div className="p-4 bg-[#FDFBF7] border border-[#E6DFD3] rounded-2xl">
  <label className="block text-sm font-bold text-[#2D2A26] mb-3">Product Attributes</label>
  {storeAttrs.map((item, index) => {
  
    if (item.label.toLowerCase().includes("date")) {
      return (
        <div key={index} className="mb-4">
          <label className="text-[10px] font-black uppercase text-[#8B5E3C]">{item.label}</label>
          <input type="date" className="w-full p-3 mt-1 border border-[#D4C4A8] rounded-xl" 
            onChange={(e) => setFormData({...formData, variants: {...formData.variants, [item.label]: e.target.value}})} />
        </div>
      );
    }

    const dropdownAttributes = ["Flavor", "Sweetness Level", "Material", "Color", "Gender", "Size"];
    if (dropdownAttributes.includes(item.label)) {
      const options = item.label === "Size" ? ["S", "M", "L", "XL"] : ["Option 1", "Option 2", "Option 3"]; 
      return (
        <div key={index} className="mb-4">
          <label className="text-[10px] font-black uppercase text-[#8B5E3C]">{item.label}</label>
          <select className="w-full p-3 mt-1 border border-[#D4C4A8] rounded-xl"
            onChange={(e) => setFormData({...formData, variants: {...formData.variants, [item.label]: e.target.value}})}>
            <option value="">Select {item.label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }

    return (
      <div key={index} className="mb-4">
        <label className="text-[10px] font-black uppercase text-[#8B5E3C]">{item.label}</label>
        <input className="w-full p-3 mt-1 border border-[#D4C4A8] rounded-xl" 
          onChange={(e) => setFormData({...formData, variants: {...formData.variants, [item.label]: e.target.value}})} />
      </div>
    );
  })}
</div>
    
<div className="flex items-center gap-2 my-4">
  <input 
    type="checkbox" 
    checked={isFreeDelivery} 
    onChange={(e) => {
      setIsFreeDelivery(e.target.checked);
      if (e.target.checked) setFormData({...formData, deliveryCharge: 0});
    }} 
  />
  <label className="text-sm font-bold text-[#2D2A26]">Free Delivery</label>
</div>

{!isFreeDelivery && (
  <div>
    <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Delivery Charge (LKR)</label>
    <input 
      type="number" 
      className="w-full p-3 mt-1 border-2 border-[#E6DFD3] rounded-2xl" 
      onChange={(e) => setFormData({...formData, deliveryCharge: Number(e.target.value)})} 
    />
  </div>
)}

<div className="mt-4">
  <label className="text-[10px] font-black uppercase text-[#8B5E3C]">Change Product Image </label>
  <input type="file" id="imageInput" required className="w-full mt-2" />
</div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border-2 rounded-2xl font-bold">Cancel</button>
            <button onClick={handleUpdate} className="flex-1 py-4 bg-[#2D2A26] text-white rounded-2xl font-bold">Save Changes</button>
          </div>
        </div>
      </div>
     )}
    </div>
  );
};



export default MyProducts;