import { useState } from "react";
import { login } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import marketplaceBg from "../assets/images/image1.jpeg"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

 const handleLogin = async (e: any) => {
    if (e) e.preventDefault();
    try {
      const loginData = await login(email, password);
      // මෙතැන Log එකක් දමන්න, data ලැබෙනවාදැයි බැලීමට
      console.log("Login Response:", loginData); 
      
      const accessToken = loginData?.accessToken || loginData?.data?.accessToken;
      const userData = loginData?.user || loginData?.data; 

      if (!accessToken) return alert("Login failed - No token received");
      
      localStorage.setItem("ACCESS_TOKEN", accessToken);
      localStorage.setItem("user", JSON.stringify(userData)); 

      setUser(userData); 

      window.location.href = userData.roles.includes("VENDOR") 
        ? "/vendor/dashboard" 
        : "/customer/dashboard";
      
    } catch (err: any) {
      // දෝෂය සවිස්තරාත්මකව බැලීමට මෙය උදව් වේ
      if (err.response) {
        console.error("Server Error:", err.response.data);
        alert(`Login failed: ${err.response.data.message || "Invalid credentials"}`);
      } else if (err.request) {
        console.error("Network Error - No response:", err.request);
        alert("Network Error: Could not connect to the server. Please check your internet or HTTPS settings.");
      } else {
        console.error("Error:", err.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row font-sans">
      
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center items-end p-12"
        style={{ backgroundImage: `url(${marketplaceBg})` }}
      >
        {/* <div className="text-white">
          <h2 className="text-4xl font-bold mb-4">Empower Your Shop.</h2>
          <p className="opacity-80">Manage your premium shop and orders with ease.</p>
        </div> */}
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF6EE]">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10">
            <h1 className="text-xs font-black tracking-[0.25em] text-[#78350F] uppercase">Cherish Marketplace</h1>
            <h2 className="text-3xl font-semibold text-[#2D2A26] mt-3">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in to manage your premium shop.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Username / Email</label>
              <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#78350F]/20 focus:border-[#78350F] transition-all bg-white placeholder:text-gray-300"
  placeholder="Username or Email"
/>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#78350F]/20 focus:border-[#78350F] transition-all bg-white placeholder:text-gray-300"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2 rounded border-gray-300" /> Remember me
              </label>
              <a href="#" className="text-[#78350F] font-bold hover:underline">Forget your password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#2D2A26] hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-8 text-center">
            Don't have an account? <button onClick={() => navigate("/register")} className="text-[#78350F] font-bold hover:underline">Create account →</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;