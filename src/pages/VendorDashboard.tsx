import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 1. Types නිර්වචනය කිරීම
type StoreDetails = {
  deliveryMethods: string[];
  customAttributes: string;
  deliveryCharge: string;
};

// Save සඳහා අවශ්‍ය පිරිසිදු කරන ලද දත්ත වර්ගය
type FinalStoreSettings = {
  deliveryMethods: string[];
  customAttributes: string[];
  deliveryCharge: string;
};

const VendorDashboard = () => {
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [storeName, setStoreName] = useState("Cherish Boutique");
  const [logo, setLogo] = useState<string | null>(null);
  
  const [storeDetails, setStoreDetails] = useState<StoreDetails>({
    deliveryMethods: [],
    customAttributes: "",
    deliveryCharge: ""
  });

  const [finalStoreSettings, setFinalStoreSettings] = useState<FinalStoreSettings | null>(null);
  const [suggestedAttributes, setSuggestedAttributes] = useState<string[]>([]);

  // දත්ත ආරම්භ කිරීම (Fetch Data)
  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/v1/store/check", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
        });
        const data = await res.json();

       if (res.ok && data.hasStore) {
  setHasStore(true);
  setSelectedCategory(data.category);
  
  // Database එකේ Array එකක් එන නිසා සෘජුවම join කරන්න හෝ state එක වෙනස් කරන්න
  setStoreDetails({
    ...data.settings,
    customAttributes: Array.isArray(data.settings.customAttributes) 
      ? data.settings.customAttributes.join(", ") 
      : data.settings.customAttributes
  });

  if (data.category) fetchSuggestedAttributes(data.category);
}
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false); // මෙතනදී loading false කිරීම අනිවාර්යයි
      }
    };

    initDashboard();
    
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setStoreName(userData.storeName || userData.data?.storeName || "My Store");
    }
  }, []);

  const fetchSuggestedAttributes = async (category: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/generate-attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      setSuggestedAttributes(data.attributes || []);
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  const handleCategorySelect = async (cat: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/store/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
        },
        body: JSON.stringify({ category: cat })
      });
      
      if (res.ok) {
        setSelectedCategory(cat);
        setHasStore(true);
        fetchSuggestedAttributes(cat);
      }
    } catch (err) {
      console.error("Setup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Clothing", "Cakes", "Handmade Flowers", "Floral Arrangements", "Plants", "Bakery & Sweets", "Healthy Snacks", "Handmade Candles", "Home Decor", "Resin & Craft Art", "Personalized Gifts", "Handmade Soaps", "Beauty & Organic", "Stationery & Journals", "Fabric Bags", "Jewelry & Accessories", "Hand-painted Pottery", "Greeting Cards", "Gift Hampers", "Essential Oil Rollers", "Macrame Wall Decor", "Customized Mugs", "Hair Care Products", "Other"];

const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

// පණිවිඩය පෙන්වා තත්පර 3කින් එය අතුරුදහන් වීමට
const showNotification = (message: string, type: 'success' | 'error') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 3000);
};

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!hasStore) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 relative">
      
      {/* මෙතැනටත් Notification එක දාන්න, එවිට Store එකක් නැති වෙලාවටත් errors පෙන්නනවා */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-5 right-5 z-[100] px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.type === 'success' ? '✨' : '⚠️'} {notification.message}
        </motion.div>
      )}

      <h1 className="text-4xl font-black mb-10 text-[#4A3728]">Welcome! Select Your Store Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => handleCategorySelect(cat)} 
            className="p-8 bg-white border-2 border-[#D4C4A8] rounded-3xl hover:bg-[#FDFBF7] transition font-bold text-[#4A3728] hover:border-[#8B5E3C] hover:shadow-lg"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 font-sans text-[#2D2A26]">
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-8 gap-6 border-[#D4C4A8]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#D4C4A8] flex items-center justify-center bg-[#F3EFE7] overflow-hidden">
            {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#8B5E3C]">Logo</span>}
          </div>
          <div>
            <p className="text-[#8B5E3C] text-sm uppercase tracking-[0.2em] font-bold">Category: {selectedCategory || "Not Set"} </p>
             <h1 className="text-4xl font-black text-[#4A3728]">{storeName}</h1>
          </div>
        </div>
        <button 
  onClick={() => {
    if (selectedCategory) fetchSuggestedAttributes(selectedCategory);
    setIsEditModalOpen(true);
  }} 
  className="text-sm text-[#4A3728] font-bold underline decoration-[#D4C4A8] hover:text-[#8B5E3C]"
>
  Edit Store Details
</button>
      </header>

      {/* Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2D2A26]">Store Configuration</h2>
      
      <div className="space-y-6">
        {/* Attributes Section */}

<div className="mt-4">
  <label className="block text-sm font-bold mb-2 text-[#4A3728]">Store Attributes:</label>
  <div className="flex flex-wrap gap-2">
    {[...new Set([...suggestedAttributes, ...storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean)])].map((attr) => {
      
      const isSelected = storeDetails.customAttributes.split(",").map(s => s.trim()).includes(attr);
      
      return (
        <label 
          key={attr} 
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-bold border transition ${
            isSelected 
            ? "bg-[#2D2A26] text-white border-[#2D2A26] shadow-md" 
            : "bg-[#F3EFE7] text-[#4A3728] border-[#D4C4A8] hover:bg-[#E6DFD3]"
          }`}
        >
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isSelected}
            onChange={(e) => {
              const currentList = storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean);
              if (e.target.checked) {
                setStoreDetails({...storeDetails, customAttributes: [...currentList, attr].join(", ")});
              } else {
                setStoreDetails({...storeDetails, customAttributes: currentList.filter(i => i !== attr).join(", ")});
              }
            }}
          />
          {isSelected && <span className="text-white">✓</span>}
          {attr}
        </label>
      );
    })}
  </div>
</div>
    {/* Delivery Options */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#4A3728]">Delivery Methods:</label>
          <div className="grid grid-cols-2 gap-2">
            {['Pickup', 'Delivery', 'Post', 'Courier'].map(m => (
              <label key={m} className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer hover:bg-[#FDFBF7]">
                <input type="checkbox" checked={storeDetails.deliveryMethods.includes(m)} onChange={(e) => {
                   const vals = e.target.checked ? [...storeDetails.deliveryMethods, m] : storeDetails.deliveryMethods.filter(i => i !== m);
                   setStoreDetails({...storeDetails, deliveryMethods: vals});
                }} /> {m}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
 <button 
  onClick={async () => {
    // 1. Attributes ටික Array එකක් විදිහට හදාගන්න
    const attributesArray = storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean);
    
    // 2. Backend එකට යවන Payload එක
    const payload = {
        ...storeDetails,
        customAttributes: attributesArray
    };

    try {
        const res = await fetch("http://localhost:5000/api/v1/store/save", { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            // 3. සාර්ථක නම් Notification එක පෙන්වන්න
            setFinalStoreSettings({
                ...storeDetails,
                customAttributes: attributesArray
            });
            setIsEditModalOpen(false);
            showNotification("Store details saved successfully!", "success");
        } else {
            // 4. දෝෂයක් ඇත්නම් Notification එක පෙන්වන්න
            showNotification("Failed to save settings. Please try again.", "error");
        }
    } catch (err) {
        showNotification("Something went wrong. Please check your connection.", "error");
    }
  }} 
  className="flex-1 py-3 bg-[#2D2A26] text-white rounded-xl font-bold transition-all hover:bg-[#4A3728] active:scale-95"
>
    Save Settings
</button>
      </div>
    </div>
  </div>
)}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { id: "rev", label: "Total Revenue", val: "LKR 24,500" },
          { id: "ord", label: "Active Orders", val: 5 },
          { id: "prod", label: "My Products", val: 12 }
        ].map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5E3C] mb-1">{item.label}</p>
            <h3 className="text-2xl font-bold text-[#2D2A26]">{item.val}</h3>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#E6DFD3] shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[#2D2A26]">Recent Orders</h2>
          <a href="/vendor/products" className="text-sm text-[#8B5E3C] font-bold underline hover:text-[#4A3728]">Manage Products</a>
        </div>
        <table className="w-full text-left">
           <thead>
             <tr className="text-[10px] uppercase font-black text-[#8B5E3C] border-b border-[#E6DFD3]">
               <th className="pb-4">Order ID</th>
               <th className="pb-4">Customer</th>
               <th className="pb-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-[#E6DFD3]">
              <tr className="hover:bg-[#FDFBF7] transition">
                <td className="py-5 font-bold text-[#4A3728]">#CH-9481</td>
                <td className="py-5 italic">Piyumalsha</td>
                <td className="py-5 text-right"><button className="text-[#4A3728] font-bold text-sm underline">Review</button></td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;