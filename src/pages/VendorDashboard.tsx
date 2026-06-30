// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// type StoreDetails = {
//   deliveryMethods: string[];
//   customAttributes: string;
//   deliveryCharge: string;
// };

// // type FinalStoreSettings = {
// //   deliveryMethods: string[];
// //   customAttributes: string[];
// //   deliveryCharge: string;
// // };



// const VendorDashboard = () => {
//   const navigate = useNavigate();
//   const [hasStore, setHasStore] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [storeName, setStoreName] = useState("Cherish Boutique");
//   const [logo, setLogo] = useState<string | null>(null);
//   const [stats, setStats] = useState({ totalRevenue: 0, activeOrders: 0, productCount: 0, recentOrders: [] });
  
//   const [storeDetails, setStoreDetails] = useState<StoreDetails>({
//     deliveryMethods: [],
//     customAttributes: "",
//     deliveryCharge: ""
//   });

//   // const [ setFinalStoreSettings] = useState<FinalStoreSettings | null>(null);
//  const suggestedAttributes = [
//   "Color",
//   "Size",
//   "Material",
//   "Style",
//   "Weight",
//   "Brand",
//   "Pattern",
//   "Occasion",
//   "Length",
//   "Care Instructions"
// ];

//  const fetchDashboardStats = async () => {
//   const token = localStorage.getItem("ACCESS_TOKEN");
//   try {
//     const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/vendor/dashboard-stats", {
//       method: "GET",
//       headers: { 
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });
    
//     if (res.status === 404) {
//       console.error("Error 404: The requested URL was not found on the server.");
//       return;
//     }
    
//     if (!res.ok) {
//       console.error(`Error: Received status ${res.status} from the server.`);
//       return;
//     }
    
//     const result = await res.json();
//     setStats(result);
//   } catch (err) {
//     console.error("Connection Error: Unable to reach the server. Please ensure the backend is running.", err);
//   }
// };


// useEffect(() => {
//   fetchDashboardStats(); 
// }, []);
  
//   useEffect(() => {
    
// const initDashboard = async () => {
//   setLoading(true);
//   try {
//     const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/check", {
//       headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
//     });
//     const data = await res.json();

//     if (res.ok && data.hasStore) {
//       setHasStore(true);
//       setSelectedCategory(data.category);
    
//       if (data.logo) {
//         setLogo(data.logo); 
//       }
      
//       setStoreDetails({
//         ...data.settings,
//         customAttributes: Array.isArray(data.settings.customAttributes) 
//           ? data.settings.customAttributes.join(", ") 
//           : data.settings.customAttributes
//       });

//       //if (data.category) fetchSuggestedAttributes(data.category);
//     }
//   } catch (err) {
//     console.error("Dashboard error:", err);
//   } finally {
//     setLoading(false); 
//   }
// };

//     initDashboard();
    
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       const userData = JSON.parse(userDataString);
//       setStoreName(userData.storeName || userData.data?.storeName || "My Store");
//     }
//   }, []);

// //   const fetchSuggestedAttributes = async (category: string) => {
// //     try {
// //       const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/generate-attributes", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ category })
// //       });
// //       const data = await res.json();
// //       console.log("Backend Response:", data);
// //       if (data.attributes && data.attributes.length > 0) {
// //   setSuggestedAttributes(data.attributes);

// //   setStoreDetails(prev => ({
// //     ...prev,
// //     customAttributes: data.attributes.join(", ")
// //   }));
// // }
// //     } catch (err) {
// //       console.error("AI Error:", err);
// //     }
// //   };

//   const handleCategorySelect = async (cat: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/create", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
//         },
//         body: JSON.stringify({ category: cat })
//       });
      
//       if (res.ok) {
//         setSelectedCategory(cat);
//         setHasStore(true);
//         //fetchSuggestedAttributes(cat);
//       }
//     } catch (err) {
//       console.error("Setup Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

// const categories = ["Clothing", "Cakes", "Handmade Flowers", "Floral Arrangements", "Plants", "Bakery & Sweets", "Healthy Snacks", "Handmade Candles", "Home Decor", "Resin & Craft Art", "Personalized Gifts", "Handmade Soaps", "Beauty & Organic", "Stationery & Journals", "Fabric Bags", "Jewelry & Accessories", "Hand-painted Pottery", "Greeting Cards", "Gift Hampers", "Essential Oil Rollers", "Macrame Wall Decor", "Customized Mugs", "Hair Care Products", "Other"];

// const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

// const showNotification = (message: string, type: 'success' | 'error') => {
//   setNotification({ message, type });
//   setTimeout(() => setNotification(null), 3000);
// };
// const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("logo", file);

//   try {
//     const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/upload-logo", {
//       method: "POST",
//       headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
//       body: formData
//     });
    
//     const data = await res.json();
    
//     if (data.imageUrl) {
//         const newLogoUrl = data.imageUrl; 
        
//         const saveRes = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/save", {
//           method: "POST",
//           headers: { 
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
//           },
//           body: JSON.stringify({ 
//             logo: newLogoUrl, 
//             customAttributes: storeDetails.customAttributes.split(",").map(s => s.trim()),
//             deliveryMethods: storeDetails.deliveryMethods,
//             category: selectedCategory
//           })
//         });

//         if (saveRes.ok) {
//             setLogo(newLogoUrl);
//             showNotification("Logo saved successfully!", "success");
//         } else {
//             showNotification("Failed to save to database", "error");
//         }
//     } else {
//         console.error("Backend response did not contain imageUrl", data);
//     }
//   } catch (err) {
//     console.error("Upload error:", err);
//     showNotification("Error uploading logo", "error");
//   }
// };

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   if (!hasStore) {
//   return (
//     <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 relative">
     
//       {notification && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className={`fixed top-5 right-5 z-[] px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 ${
//             notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
//           }`}
//         >
//           {notification.type === 'success' ? '✨' : '⚠️'} {notification.message}
//         </motion.div>
//       )}

//       <h1 className="text-4xl font-black mb-10 text-[#4A3728]">Welcome! Select Your Store Category</h1>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
//         {categories.map((cat) => (
//           <button 
//             key={cat} 
//             onClick={() => handleCategorySelect(cat)} 
//             className="p-8 bg-white border-2 border-[#D4C4A8] rounded-3xl hover:bg-[#FDFBF7] transition font-bold text-[#4A3728] hover:border-[#8B5E3C] hover:shadow-lg"
//           >
//             {cat}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

//   return (
//     <div className="min-h-screen bg-[#FDFBF7] p-8 font-sans text-[#2D2A26]">
//       <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-8 gap-6 border-[#D4C4A8]">
//         <div className="flex items-center gap-6">
//           <label className="cursor-pointer group relative">
//   <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#D4C4A8] flex items-center justify-center bg-[#F3EFE7] overflow-hidden hover:border-[#8B5E3C] transition">
//     {logo ? (
//       <img src={logo} alt="Logo" className="w-full h-full object-cover" />
//     ) : (
//       <span className="text-[10px] text-[#8B5E3C]">Upload</span>
//     )}
//   </div>
//   <input 
//     type="file" 
//     className="hidden" 
//     accept="image/*" 
//     onChange={handleLogoUpload} 
//   />
// </label>
//           <div>
//             <p className="text-[#8B5E3C] text-sm uppercase tracking-[0.2em] font-bold">Category: {selectedCategory || "Not Set"} </p>
//              <h1 className="text-4xl font-black text-[#4A3728]">{storeName}</h1>
//           </div>
//         </div>
//         <button 
//   onClick={async () => {
//     // if (selectedCategory) {
//     //   await fetchSuggestedAttributes(selectedCategory);
//     // }

//     setIsEditModalOpen(true);
//   }} 
//   className="text-sm text-[#4A3728] font-bold underline decoration-[#D4C4A8] hover:text-[#8B5E3C]"
// >
//   Edit Store Details
// </button>
//       </header>

// {isEditModalOpen && (
//   <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//     <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
//       <h2 className="text-2xl font-bold mb-6 text-[#2D2A26]">Store Configuration</h2>
      
//       <div className="space-y-6">
       
 
// <div className="mt-4">
//   <label className="block text-sm font-bold mb-2 text-[#4A3728]">Store Attributes:</label>
//   <div className="flex flex-wrap gap-2">
//     {[...new Set([...suggestedAttributes, ...storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean)])].map((attr) => {
      
//       const isSelected = storeDetails.customAttributes.split(",").map(s => s.trim()).includes(attr);
      
//       return (
//         <label 
//           key={attr} 
//           className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-bold border transition ${
//             isSelected 
//             ? "bg-[#2D2A26] text-white border-[#2D2A26] shadow-md" 
//             : "bg-[#F3EFE7] text-[#4A3728] border-[#D4C4A8] hover:bg-[#E6DFD3]"
//           }`}
//         >
//           <input 
//             type="checkbox" 
//             className="hidden" 
//             checked={isSelected}
//             onChange={(e) => {
//               const currentList = storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean);
//               if (e.target.checked) {
//                 setStoreDetails({...storeDetails, customAttributes: [...currentList, attr].join(", ")});
//               } else {
//                 setStoreDetails({...storeDetails, customAttributes: currentList.filter(i => i !== attr).join(", ")});
//               }
//             }}
//           />
//           {isSelected && <span className="text-white">✓</span>}
//           {attr}
//         </label>
//       );
//     })}
//   </div>
// </div> 
   
//         <div>
//           <label className="block text-sm font-bold mb-2 text-[#4A3728]">Delivery Methods:</label>
//           <div className="grid grid-cols-2 gap-2">
//             {['Pickup', 'Delivery', 'Post', 'Courier'].map(m => (
//               <label key={m} className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer hover:bg-[#FDFBF7]">
//                 <input type="checkbox" checked={storeDetails.deliveryMethods.includes(m)} onChange={(e) => {
//                    const vals = e.target.checked ? [...storeDetails.deliveryMethods, m] : storeDetails.deliveryMethods.filter(i => i !== m);
//                    setStoreDetails({...storeDetails, deliveryMethods: vals});
//                 }} /> {m}
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex gap-4 mt-8">
//         <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
//  <button 
//   onClick={async () => {
    
//     const attributesArray = storeDetails.customAttributes.split(",").map(s => s.trim()).filter(Boolean);
//     const payload = {
//         ...storeDetails,
//         customAttributes: attributesArray
//     };

//     try {
//         const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/save", { 
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
//             },
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             setIsEditModalOpen(false);
//             showNotification("Store details saved successfully!", "success");
//         } else {
           
//             showNotification("Failed to save settings. Please try again.", "error");
//         }
//     } catch (err) {
//         showNotification("Something went wrong. Please check your connection.", "error");
//     }
//   }} 
//   className="flex-1 py-3 bg-[#2D2A26] text-white rounded-xl font-bold transition-all hover:bg-[#4A3728] active:scale-95"
// >
//     Save Settings
// </button>
//       </div>
//     </div>
//   </div>
// )}
    
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//   {[
//     { label: "Total Revenue", val: `LKR ${stats.totalRevenue.toLocaleString()}` },
//     { label: "Active Orders", val: stats.activeOrders },
//     { label: "My Products", val: stats.productCount }
//   ].map((item, idx) => (
//     <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-sm">
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5E3C] mb-1">{item.label}</p>
//       <h3 className="text-2xl font-bold text-[#2D2A26]">{item.val}</h3>
//     </div>
//   ))}
// </div>

//       <div className="bg-white p-8 rounded-[2rem] border border-[#E6DFD3] shadow-lg">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-xl font-bold text-[#2D2A26]">Recent Orders</h2>
//           <a href="/vendor/products" className="text-sm text-[#8B5E3C] font-bold underline hover:text-[#4A3728]">Manage Products</a>
//         </div>
//         <table className="w-full text-left">
//            <thead>
//              <tr className="text-[10px] uppercase font-black text-[#8B5E3C] border-b border-[#E6DFD3]">
//                <th className="pb-4">Order ID</th>
//                <th className="pb-4">Customer</th>
//                <th className="pb-4 text-right">Actions</th>
//              </tr>
//            </thead>
//  <tbody className="divide-y divide-[#E6DFD3]">
//   {stats.recentOrders.map((order: any) => (
//     <tr key={order._id} className="hover:bg-[#FDFBF7] transition">
//       <td className="py-5 font-bold text-[#4A3728]">#{order.orderId}</td>
//       <td className="py-5 italic">
//         {order.customerId?.name || "Guest Customer"}
//       </td>
//       <td className="py-5 text-right">
//  <button 
//   onClick={() => navigate("/vendor/orders")}
//   className="text-[#4A3728] font-bold text-sm underline"
// >
//   View
// </button>
//       </td>
//     </tr>
//   ))}
// </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type StoreDetails = {
  deliveryMethods: string[];
  customAttributes: string;
  deliveryCharge: string;
};

type OrderType = {
  _id: string;
  orderId: string;
  customerId?: {
    name?: string;
  };
};

type StatsType = {
  totalRevenue: number;
  activeOrders: number;
  productCount: number;
  recentOrders: OrderType[];
};

const API_URL = "https://vendor-backend-kr2j.vercel.app/api/v1";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [storeName, setStoreName] = useState("My Store");

  const [logo, setLogo] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [stats, setStats] = useState<StatsType>({
    totalRevenue: 0,
    activeOrders: 0,
    productCount: 0,
    recentOrders: [],
  });

  const [storeDetails, setStoreDetails] = useState<StoreDetails>({
    deliveryMethods: [],
    customAttributes: "",
    deliveryCharge: "",
  });

  const categories = [
    "Clothing",
    "Cakes",
    "Handmade Flowers",
    "Floral Arrangements",
    "Plants",
    "Bakery & Sweets",
    "Healthy Snacks",
    "Handmade Candles",
    "Home Decor",
    "Resin & Craft Art",
    "Personalized Gifts",
    "Handmade Soaps",
    "Beauty & Organic",
    "Stationery & Journals",
    "Fabric Bags",
    "Jewelry & Accessories",
    "Hand-painted Pottery",
    "Greeting Cards",
    "Gift Hampers",
    "Essential Oil Rollers",
    "Macrame Wall Decor",
    "Customized Mugs",
    "Hair Care Products",
    "Other",
  ];

  // const suggestedAttributes = [
  //   "Color",
  //   "Size",
  //   "Material",
  //   "Style",
  //   "Weight",
  //   "Brand",
  //   "Pattern",
  //   "Occasion",
  //   "Length",
  //   "Care Instructions",
  // ];

   const [aiAttributes, setAiAttributes] = useState<string[]>([]);

  const showNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const token = localStorage.getItem("ACCESS_TOKEN");

  // FETCH DASHBOARD
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);

        const userString = localStorage.getItem("user");

        if (userString) {
          const user = JSON.parse(userString);

          setStoreName(
            user?.storeName ||
              user?.data?.storeName ||
              "My Store"
          );
        }

        const res = await fetch(`${API_URL}/store/check`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data?.hasStore) {
          setHasStore(true);

          setSelectedCategory(data?.category || null);

          if (data?.logo) {
            setLogo(data.logo);
          }

          setStoreDetails({
            deliveryMethods:
              data?.settings?.deliveryMethods || [],
            customAttributes: Array.isArray(
              data?.settings?.customAttributes
            )
              ? data.settings.customAttributes.join(", ")
              : "",
            deliveryCharge:
              data?.settings?.deliveryCharge || "",
          });
        }

        await fetchDashboardStats();
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  // FETCH STATS
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(
        `${API_URL}/vendor/dashboard-stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Stats Fetch Failed");
        return;
      }

      const data = await res.json();

      setStats({
        totalRevenue: data?.totalRevenue || 0,
        activeOrders: data?.activeOrders || 0,
        productCount: data?.productCount || 0,
        recentOrders: data?.recentOrders || [],
      });
    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  // CATEGORY SELECT
  const handleCategorySelect = async (category: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedCategory(category);
        setHasStore(true);

        showNotification(
          "Store category selected successfully!",
          "success"
        );
      } else {
        showNotification(
          data?.message || "Failed to create store",
          "error"
        );
      }
    } catch (err) {
      console.error(err);

      showNotification(
        "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGO UPLOAD
  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("logo", file);

      const uploadRes = await fetch(
        `${API_URL}/store/upload-logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (!uploadData?.imageUrl) {
        showNotification(
          "Logo upload failed",
          "error"
        );
        return;
      }

      const saveRes = await fetch(
        `${API_URL}/store/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            logo: uploadData.imageUrl,
            category: selectedCategory,
            deliveryMethods:
              storeDetails.deliveryMethods,
            customAttributes:
              storeDetails.customAttributes
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            deliveryCharge:
              storeDetails.deliveryCharge,
          }),
        }
      );

      if (saveRes.ok) {
        setLogo(uploadData.imageUrl);

        showNotification(
          "Logo uploaded successfully!",
          "success"
        );
      } else {
        showNotification(
          "Failed to save logo",
          "error"
        );
      }
    } catch (err) {
      console.error(err);

      showNotification(
        "Logo upload failed",
        "error"
      );
    }
  };

  // SAVE SETTINGS
  const handleSaveSettings = async () => {
    try {
      const payload = {
        category: selectedCategory,
        deliveryMethods:
          storeDetails.deliveryMethods,
        customAttributes:
          storeDetails.customAttributes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        deliveryCharge:
          storeDetails.deliveryCharge,
        logo,
      };

      const res = await fetch(
        `${API_URL}/store/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showNotification(
          "Store settings saved!",
          "success"
        );

        setIsEditModalOpen(false);
      } else {
        showNotification(
          data?.message || "Save failed",
          "error"
        );
      }
    } catch (err) {
      console.error(err);

      showNotification(
        "Something went wrong",
        "error"
      );
    }
  };


const fetchAiAttributes = async (
  category: string
) => {
  try {
    setAiLoading(true);

    const res = await fetch(
      `${API_URL}/ai/generate-attributes`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
        }),
      }
    );

    const data = await res.json();

    console.log("AI DATA:", data);

    if (data?.success) {
      setAiAttributes(
        data.attributes || []
      );
    } else {
      showNotification(
        data?.message ||
          "AI failed",
        "error"
      );
    }
  } catch (err) {
    console.log(err);

    showNotification(
      "AI fetch failed",
      "error"
    );
  } finally {
    setAiLoading(false);
  }
};



  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-xl font-bold text-[#4A3728]">
          Loading...
        </p>
      </div>
    );
  }

  // CATEGORY PAGE
  if (!hasStore) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 relative">

        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl font-bold z-50 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification.message}
          </motion.div>
        )}

        <h1 className="text-4xl font-black mb-10 text-[#4A3728] text-center">
          Welcome! Select Your Store Category
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                handleCategorySelect(cat)
              }
              className="p-6 bg-white border-2 border-[#D4C4A8] rounded-3xl hover:bg-[#FDFBF7] transition font-bold text-[#4A3728] hover:border-[#8B5E3C] hover:shadow-lg"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 text-[#2D2A26]">

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl font-bold z-50 ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-8 gap-6 border-[#D4C4A8]">

        <div className="flex items-center gap-6">

          <label className="cursor-pointer">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#D4C4A8] bg-[#F3EFE7] overflow-hidden flex items-center justify-center">
              {logo ? (
                <img
                  src={logo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-[#8B5E3C]">
                  Upload
                </span>
              )}
            </div>

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </label>

          <div>
            <p className="text-[#8B5E3C] text-sm uppercase tracking-[0.2em] font-bold">
              Category:{" "}
              {selectedCategory || "Not Set"}
            </p>

            <h1 className="text-4xl font-black text-[#4A3728]">
              {storeName}
            </h1>
          </div>
        </div>

        <button
  onClick={() => {
    setIsEditModalOpen(true);
    if (selectedCategory) fetchAiAttributes(selectedCategory);
  }}
          className="text-sm text-[#4A3728] font-bold underline hover:text-[#8B5E3C]"
        >
          Edit Store Details
        </button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {[
          {
            label: "Total Revenue",
            val: `LKR ${stats.totalRevenue.toLocaleString()}`,
          },
          {
            label: "Active Orders",
            val: stats.activeOrders,
          },
          {
            label: "My Products",
            val: stats.productCount,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-[#E6DFD3] shadow-sm"
          >
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#8B5E3C] mb-1">
              {item.label}
            </p>

            <h3 className="text-2xl font-bold text-[#2D2A26]">
              {item.val}
            </h3>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#E6DFD3] shadow-lg">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>

          <button
            onClick={() =>
              navigate("/vendor/products")
            }
            className="text-sm text-[#8B5E3C] font-bold underline"
          >
            Manage Products
          </button>
        </div>

        <table className="w-full text-left">

          <thead>
            <tr className="text-[10px] uppercase font-black text-[#8B5E3C] border-b border-[#E6DFD3]">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E6DFD3]">

            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-[#FDFBF7]"
                >
                  <td className="py-5 font-bold text-[#4A3728]">
                    #{order.orderId}
                  </td>

                  <td className="py-5 italic">
                    {order.customerId?.name ||
                      "Guest Customer"}
                  </td>

                  <td className="py-5 text-right">
                    <button
                      onClick={() =>
                        navigate("/vendor/orders")
                      }
                      className="text-[#4A3728] font-bold text-sm underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="py-10 text-center text-gray-500"
                >
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6 text-[#2D2A26]">
              Store Configuration
            </h2>

{/* ATTRIBUTES SECTION */}
<div className="mb-6">
  <label className="block text-sm font-bold mb-3 text-[#4A3728]">
    Store Attributes (AI Suggested)
  </label>

 <div className="flex flex-wrap gap-2">

{aiLoading ? ( <p className="text-xs text-[#8B5E3C] italic">
Loading AI suggestions... </p>
) : aiAttributes.length === 0 ? ( <p className="text-xs text-red-500 italic">
No AI suggestions found </p>
) : (
aiAttributes.map((attr) => {
const selected = storeDetails.customAttributes
.split(",")
.map((item) => item.trim())
.includes(attr);

  return (
    <label
      key={attr}
      className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-bold border transition-all ${
        selected
          ? "bg-[#2D2A26] text-white border-[#2D2A26]"
          : "bg-[#F3EFE7] border-[#D4C4A8] hover:border-[#8B5E3C]"
      }`}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={selected}
        onChange={(e) => {
          const current = storeDetails.customAttributes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

          const updatedAttributes = e.target.checked
            ? [...current, attr]
            : current.filter((i) => i !== attr);

          setStoreDetails({
            ...storeDetails,
            customAttributes:
              updatedAttributes.join(", "),
          });
        }}
      />

      {attr}
    </label>
  );
})
)}
</div>
</div>

            {/* DELIVERY */}
            <div className="mb-6">

              <label className="block text-sm font-bold mb-3 text-[#4A3728]">
                Delivery Methods
              </label>

              <div className="grid grid-cols-2 gap-2">

                {[
                  "Pickup",
                  "Delivery",
                  "Post",
                  "Courier",
                ].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={storeDetails.deliveryMethods.includes(
                        method
                      )}
                      onChange={(e) => {
                        const updated =
                          e.target.checked
                            ? [
                                ...storeDetails.deliveryMethods,
                                method,
                              ]
                            : storeDetails.deliveryMethods.filter(
                                (m) =>
                                  m !== method
                              );

                        setStoreDetails({
                          ...storeDetails,
                          deliveryMethods:
                            updated,
                        });
                      }}
                    />

                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* DELIVERY CHARGE */}
            <div className="mb-6">

              <label className="block text-sm font-bold mb-3 text-[#4A3728]">
                Delivery Charge
              </label>

              <input
                type="text"
                placeholder="Ex: 350"
                value={
                  storeDetails.deliveryCharge
                }
                onChange={(e) =>
                  setStoreDetails({
                    ...storeDetails,
                    deliveryCharge:
                      e.target.value,
                  })
                }
                className="w-full border border-[#D4C4A8] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-8">

              <button
                onClick={() =>
                  setIsEditModalOpen(false)
                }
                className="flex-1 py-3 border rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveSettings}
                className="flex-1 py-3 bg-[#2D2A26] text-white rounded-xl font-bold hover:bg-[#4A3728]"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;