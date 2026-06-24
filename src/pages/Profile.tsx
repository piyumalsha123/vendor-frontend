import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/profile", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name || "", email: data.email || "", phone: data.phone || "", address: data.address || "" });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = isEditing ? { ...user, ...passwords } : user;
      const res = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/profile", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        setPasswords({ oldPassword: "", newPassword: "" });
        alert("Profile Updated Successfully!");
      } else {
       setError(data.message);
      }
    } catch (err) { setError("Server error. Please try again."); }
  };

  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  if (loading) return <div className="min-h-screen bg-[#1A1714] flex items-center justify-center text-[#D4C4A8]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#1A1714] p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full p-8 rounded-3xl border border-[#4A3728] shadow-2xl bg-[#26211C]"
      >
        <h2 className="text-3xl font-black text-[#D4C4A8] mb-8 uppercase tracking-widest text-center">My Profile</h2>
        
        <div className="space-y-6">
          {[
            { label: "Full Name", key: "name" },
            { label: "Email Address", key: "email" },
            { label: "Phone Number", key: "phone" },
            { label: "Delivery Address", key: "address" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#A89F91] tracking-[0.2em] ml-1">{field.label}</label>
              <input 
                type="text"
                disabled={!isEditing || field.key === 'email'}
                value={user[field.key as keyof typeof user]}
                onChange={(e) => setUser({...user, [field.key]: e.target.value})}
                className="w-full p-4 rounded-xl bg-[#1A1714] border border-[#4A3728] font-bold text-[#FDFBF7] outline-none focus:border-[#D4C4A8] transition-all"
              />
            </div>
          ))}

          {isEditing && (
            <div className="space-y-4 pt-4 border-t border-[#4A3728]">
              <h3 className="text-[#D4C4A8] font-bold">Change Password</h3>
              {error && <p className="text-red-400 text-xs font-bold text-center bg-red-900/20 p-2 rounded">{error}</p>}
              <input type="password" placeholder="Old Password" onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full p-4 rounded-xl bg-[#1A1714] border border-[#4A3728] text-white" />
              <input type="password" placeholder="New Password" onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full p-4 rounded-xl bg-[#1A1714] border border-[#4A3728] text-white" />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={() => setIsEditing(!isEditing)} className="flex-1 py-4 rounded-xl font-bold border-2 border-[#D4C4A8] text-[#D4C4A8] hover:bg-[#D4C4A8] hover:text-[#26211C] transition-all">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button onClick={handleSave} className="flex-1 py-4 rounded-xl font-bold bg-[#8B5E3C] text-white hover:bg-[#A6754E] transition-all">
              Save Changes
            </button>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-[#4A3728] text-center">
          <button onClick={logout} className="text-[#A89F91] font-bold hover:text-red-400 transition">Logout Account</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;