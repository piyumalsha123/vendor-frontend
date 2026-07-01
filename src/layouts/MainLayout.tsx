import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaBars, FaTimes } from "react-icons/fa"; 

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isVendor = user?.roles?.includes("VENDOR");

  const navLinks = isVendor
    ? [
        { name: "Dashboard", path: "/vendor/dashboard" },
        { name: "My Products", path: "/vendor/products" },
        { name: "Orders", path: "/vendor/orders" },
        { name: "Store Settings", path: "/vendor/store-settings" },
      ]
    : [
        { name: "Marketplace", path: "/customer/dashboard" },
        { name: "My Cart", path: "/customer/cart" },
        { name: "Wishlist", path: "/customer/wishlist" },
        { name: "My Orders", path: "/customer/orders" },
        { name: "Profile", path: "/customer/profile" },
      ];

  const asideBg = isVendor ? "bg-[#3D352A]" : "bg-[#EBE5D6]";
  const textColor = isVendor ? "text-[#F5E6CA]" : "text-[#4A3728]";
  const subTextColor = isVendor ? "text-[#A89F91]" : "text-[#8B5E3C]";
  const activeLink = isVendor 
    ? "text-white border-l-4 border-[#D4A373] bg-[#5C5048] pl-6 py-2" 
    : "text-[#2D2A26] border-l-4 border-[#8B5E3C] bg-[#D6CDC2] pl-6 py-2";
  const hoverLink = isVendor ? "text-white" : "text-[#4A3728]";
  const inactiveLink = isVendor ? "text-[#A89F91]" : "text-[#8B5E3C]";

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] relative">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 flex justify-between items-center w-full fixed bg-white z-50 border-b">
        <h1 className="font-black text-lg">Menu</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Aside - Mobile එකේදී absolute, Desktop එකේදී static */}
      <aside className={`fixed lg:static w-72 h-full ${asideBg} p-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div>
          <div className="mt-12 lg:mt-0 mb-12 border-b border-[#6A5D54]/30 pb-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#5C5048] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg border-2 border-[#D4A373]">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className={`text-xl uppercase tracking font-black ${textColor} text-center`}>
              {user?.name || "My Boutique"}
            </h2>
            <p className={`text-[10px] uppercase tracking-[0.2em] ${subTextColor} mt-1 font-bold`}>
              {isVendor ? "Premium Vendor" : "Valued Customer"}
            </p>
          </div>

          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block text-[13px] font-bold uppercase pl-4 py-2 transition-all duration-300 rounded-r-lg ${
                  location.pathname === link.path 
                    ? activeLink 
                    : `${inactiveLink} hover:${hoverLink} hover:pl-6`
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <button 
          onClick={logout} 
          className={`w-full py-3 px-4 border ${isVendor ? "border-[#D4A373]/30 text-[#D4A373]" : "border-[#8B5E3C]/30 text-[#8B5E3C]"} rounded-lg font-black uppercase hover:bg-[#D4A373] hover:text-white transition-all duration-300`}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-10">
          {children ? children : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;