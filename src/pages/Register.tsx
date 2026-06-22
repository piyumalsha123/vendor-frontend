import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/auth";
import backgroundImage from "../assets/images/background.png";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [address, setAddress] = useState(""); 
  const [role, setRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !conPassword || !address) {
      return setError("Please fill all required fields.");
    }
    if (password !== conPassword) {
      return setError("Passwords do not match.");
    }
    if (role === "VENDOR" && (!storeName || !phone)) {
      return setError("Please provide your Store Name and Contact Number.");
    }

    try {
      setLoading(true);
     
      await register(
        name,
        email,
        password,
        [role],
        role === "VENDOR" ? storeName : "",
        phone,
        address
      );

      alert("Registration Successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center md:justify-end p-4 md:p-10 lg:p-16 bg-cover bg-center bg-no-repeat relative select-none font-sans"
      style={{ 
        backgroundImage: `linear-gradient(to right, rgba(38, 35, 32, 0.7), rgba(38, 35, 32, 0.45)), url(${backgroundImage})`
      }}
    >
      <div className="absolute left-6 top-10 md:left-16 lg:left-24 md:top-1/4 z-10 text-[#F9F6F0] max-w-xl hidden md:block">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#E5D3B3] leading-none drop-shadow-2xl">
          Cherish <br />
          <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white block mt-2 opacity-95">
            Marketplace
          </span>
        </h1>
        <p className="mt-6 text-sm lg:text-base text-gray-200 italic tracking-widest drop-shadow-sm opacity-90">
          Curating Fine Crafts & Timeless Creations.
        </p>
        <blockquote className="text-xs lg:text-sm border-l-2 border-[#E5D3B3] pl-4 italic text-gray-300 leading-relaxed mt-12 opacity-75 max-w-sm">
          "The beauty of hand-crafted elegance, brought together in one shared collective."
        </blockquote>
      </div>
    
      <div className="w-full max-w-md bg-[#FAF6EE] p-6 sm:p-8 md:p-9 rounded-2xl shadow-2xl border border-[#E6DFD3] relative z-10 md:mr-6 lg:mr-16 xl:mr-32 transition-all duration-300">
        <div className="mb-5">
          <h2 className="text-2xl lg:text-3xl font-medium text-[#2D2A26] tracking-wide">
            Create Account
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-1">Join our exclusive multi-vendor network.</p>
        </div>

        <div className="flex bg-[#EFE9DD] p-1 rounded-xl mb-4 border border-[#DFD6C6]">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              role === "CUSTOMER"
                ? "bg-[#2D2A26] text-[#F9F6F0] shadow-md"
                : "text-[#5C554D] hover:text-[#2D2A26]"
            }`}
            onClick={() => { setRole("CUSTOMER"); setError(""); }}
          >
            Customer
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              role === "VENDOR"
                ? "bg-[#2D2A26] text-[#F9F6F0] shadow-md"
                : "text-[#5C554D] hover:text-[#2D2A26]"
            }`}
            onClick={() => { setRole("VENDOR"); setError(""); }}
          >
            Vendor
          </button>
        </div>

        {error && (
          <div className="bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-semibold text-center mb-4">
            {error}
          </div>
        )}

        <form className="space-y-3.5" onSubmit={handleRegister}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#4E4A45] block mb-1 uppercase tracking-wider">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Piyumalsha Isurandi"
                className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4E4A45] block mb-1 uppercase tracking-wider">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@domain.com"
                className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4E4A45] block mb-1 uppercase tracking-wider">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="123, Galle Road, Colombo"
                className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
              />
            </div>

            {role === "VENDOR" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#EFE9DD]/60 rounded-xl border border-[#DFD6C6] animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-[#612705] block mb-1 uppercase tracking-wider">Store Name</label>
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    type="text"
                    placeholder="your store name"
                     className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#612705] block mb-1 uppercase tracking-wider">Contact Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    placeholder="0771234567"
                     className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#4E4A45] block mb-1 uppercase tracking-wider">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                 className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4E4A45] block mb-1 uppercase tracking-wider">Confirm Password</label>
              <input
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                 className="w-full px-3.5 py-2 border border-[#C4B9AC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] bg-[#FCFAFA] text-sm text-gray-900 font-medium placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-[#2D2A26] hover:bg-[#413D39] text-[#F9F6F0] text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-md disabled:bg-gray-400 transform active:scale-[0.98]"
          >
            {loading ? "Registering..." : `Register as ${role}`}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-4 font-medium tracking-wide">
          Already have an account?{" "}
          <button
            className="text-[#78350F] font-bold hover:underline focus:outline-none ml-1"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;