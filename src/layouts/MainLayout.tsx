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
    <div className="flex h-screen w-full bg-[#FAF9F6] overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden p-4 flex justify-between items-center w-full fixed bg-[#FAF9F6]/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
        <h1 className="font-black text-lg italic tracking-widest text-[#4A3728]">VelvetMart</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-[#4A3728]">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Aside - Sidebar */}
      <aside className={`fixed lg:static w-64 h-full ${asideBg} p-4 flex flex-col justify-between shadow-xl transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* Brand Name - Compact */}
          <div className="hidden lg:flex justify-center mb-2">
            <h1 className="text-xl font-black uppercase italic tracking-widest text-[#D4A373]">VelvetMart</h1>
          </div>

          {/* User Profile - Compact */}
<div className="mb-4 border-b border-black/5 pb-2 flex flex-col items-center">
  <div className="w-14 h-14 rounded-full bg-[#5C5048] flex items-center justify-center text-white text-xl font-black mb-1 shadow-md border border-[#D4A373]">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </div>
  <h2 className={`text-xs uppercase tracking-wide font-black ${textColor} text-center`}>
    {user?.name || "My Boutique"}
  </h2>
  {/* මෙතැනදී subTextColor එක භාවිතා කර ඇත */}
  <p className={`text-[9px] uppercase tracking-[0.2em] ${subTextColor} mt-0.5 font-bold`}>
    {isVendor ? "Premium Vendor" : "Valued Customer"}
  </p>
</div>

          {/* Nav Links - Compact */}
          <nav className="flex-1 overflow-hidden space-y-0.5"> 
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block text-[11px] font-bold uppercase pl-3 py-1.5 transition-all duration-200 rounded-r-md ${
                  location.pathname === link.path 
                    ? activeLink 
                    : `${inactiveLink} hover:${hoverLink} hover:pl-5`
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button - Compact */}
        <button 
          onClick={logout} 
          className={`w-full py-2 px-3 text-xs border ${isVendor ? "border-[#D4A373]/50 text-[#D4A373]" : "border-[#8B5E3C]/50 text-[#8B5E3C]"} rounded-md font-black uppercase hover:bg-[#D4A373] hover:text-white transition-all duration-200`}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 bg-[#FAF9F6]">
        <div className="h-full p-4 lg:p-8">
          {children ? children : <Outlet />}
        </div>
      </main>
      
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-black/20 z-30" />
      )}
    </div>
  );
};

export default MainLayout;