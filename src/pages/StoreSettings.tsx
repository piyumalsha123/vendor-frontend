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
    const fetchSettings = async () => {
  try {
    const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/settings", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
    });
    const data = await res.json();
  
    console.log("Backend Response:", data); 

    if (res.ok && data) {
      setStoreData({
        storeName: data.storeName || "",
        phone: data.phone || "",
        logo: data.logo || "",
        email: data.email || "",      
        address: data.address || "",  
        category: data.category || "",
        customAttributes: Array.isArray(data.customAttributes) ? data.customAttributes.join(", ") : (data.customAttributes || ""),
        deliveryMethods: Array.isArray(data.deliveryMethods) ? data.deliveryMethods.join(", ") : (data.deliveryMethods || "")
      });
    }
  } catch (err) { console.error("Error fetching settings:", err); }
};
    fetchSettings();
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
      const payload = {
        ...storeData,
        customAttributes: storeData.customAttributes.split(',').map((item: string) => item.trim()),
        deliveryMethods: storeData.deliveryMethods.split(',').map((item: string) => item.trim())
      };

      const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/store/save", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) alert("Settings saved successfully!");
      else alert("Save failed.");
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