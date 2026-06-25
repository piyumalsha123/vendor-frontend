import { useState, useEffect } from "react";

const StoreSettings = () => {
  const [storeData, setStoreData] = useState({ 
    storeName: "", 
    phone: "", 
    logo: "", 
    email: "", 
    address: "",
    category: "",
    customAttributes: "",
    deliveryMethods: ""
  });
  const [loading, setLoading] = useState(false);

useEffect(() => {
  fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/settings", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Fetched Settings Data:", data); // මෙය බලන්න, data එකේ ඇතුලේ තව object එකක් තියෙනවද?

    if (data) {
      // දත්ත ලැබෙන ව්‍යුහය අනුව (සමහර විට data.store හෝ data පමණක් විය හැක)
      const targetData = data.store || data; 
      
      setStoreData({
        storeName: targetData.storeName || "",
        phone: targetData.phone || "",
        logo: targetData.logo || "",
        email: targetData.email || "",      
        address: targetData.address || "",  
        category: targetData.category || "",
        customAttributes: Array.isArray(targetData.customAttributes) ? targetData.customAttributes.join(", ") : targetData.customAttributes || "",
        deliveryMethods: Array.isArray(targetData.deliveryMethods) ? targetData.deliveryMethods.join(", ") : targetData.deliveryMethods || ""
      });
    }
  })
  .catch(err => console.error("Error fetching settings:", err));
}, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/upload-logo", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
        body: formData
      });
      const data = await res.json();
      if (data.imageUrl) setStoreData(prev => ({ ...prev, logo: data.imageUrl }));
    } catch (err) { alert("Upload failed"); }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/save", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
        },
        body: JSON.stringify(storeData)
      });
      alert("Settings saved successfully!");
    } catch (err) { alert("Save failed"); } 
    finally { setLoading(false); }
  };

  
  const renderInput = (label: string, field: keyof typeof storeData, type: string = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1">{label}</label>
      <input 
        type={type}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4A373] outline-none" 
        value={storeData[field]} 
        onChange={(e) => setStoreData({...storeData, [field]: e.target.value})}
      />
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-3xl shadow-lg border border-[#E6DFD3] max-w-3xl mx-auto">
      <h2 className="text-3xl font-black mb-8 text-[#2D2A26]">Store Settings</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <img src={storeData.logo || "/placeholder.png"} className="w-24 h-24 rounded-full object-cover border-4 border-[#E6DFD3]" />
        <input type="file" onChange={handleLogoUpload} className="text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {renderInput("Store Name", "storeName")}
        {renderInput("Email Address", "email", "email")}
        {renderInput("Phone Number", "phone")}
        {renderInput("Store Address", "address")}
        <div className="col-span-2">
            {renderInput("Custom Attributes (comma separated)", "customAttributes")}
        </div>
      </div>

      <button onClick={saveSettings} disabled={loading} className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-bold hover:bg-black transition-all">
        {loading ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default StoreSettings;