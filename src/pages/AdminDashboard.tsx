import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, vendors: 0, orders: 0 });
  const [stores, setStores] = useState<any[]>([]); // Vendor ලා (Stores) සඳහා
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  try {
    const headers = { "Authorization": `Bearer ${token}` };
    
    // දත්ත ලබා ගැනීම
    const [statsRes, orderRes, storeRes] = await Promise.all([
      fetch("https://vendor-backend-kr2j.vercel.app/api/v1/admin/stats", { headers }),
      fetch("https://vendor-backend-kr2j.vercel.app/api/v1/admin/orders", { headers }),
      fetch("https://vendor-backend-kr2j.vercel.app/api/v1/admin/stores", { headers })
    ]);

    const statsData = await statsRes.json();
    const orderData = await orderRes.json();
    const storeData = await storeRes.json();

    // දත්ත Array දැයි පරීක්ෂා කර පසුව set කරන්න
    setStats(statsData);
    setOrders(Array.isArray(orderData) ? orderData : []);
    setStores(Array.isArray(storeData) ? storeData : []);
    
    setLoading(false);
  } catch (err) {
    console.error("Error fetching admin data:", err);
    setLoading(false);
  }
};

  const toggleBlockVendor = async (storeId: string) => {
    try {
      const res = await fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/admin/vendors/${storeId}/toggle-block`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchData(); // දත්ත යාවත්කාලීන කරන්න
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-xl shadow"><p className="text-gray-500">Users</p><h2 className="text-4xl font-black">{stats.users}</h2></div>
        <div className="p-6 bg-white rounded-xl shadow"><p className="text-gray-500">Vendors</p><h2 className="text-4xl font-black">{stats.vendors}</h2></div>
        <div className="p-6 bg-white rounded-xl shadow"><p className="text-gray-500">Orders</p><h2 className="text-4xl font-black">{stats.orders}</h2></div>
      </div>

      {/* 2. Vendor Management (Manage Vendors) */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Manage Vendors</h2>
        <table className="w-full text-left">
          <tbody>
            {stores.map((store: any) => (
              <tr key={store._id} className="border-b">
                <td className="p-3 font-semibold">{store.storeName}</td>
                <td className="p-3">
                  <button 
                    onClick={() => toggleBlockVendor(store._id)}
                    className={`px-4 py-2 rounded text-white ${store.isActive ? 'bg-red-500' : 'bg-green-500'}`}
                  >
                    {store.isActive ? 'Block Store' : 'Unblock Store'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Order Overview */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <table className="w-full text-left">
          <thead><tr className="border-b"><th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {orders.slice(0, 5).map((order: any) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">#{order._id.slice(-6)}</td>
                <td className="p-3">{order.customerId?.name || "Guest"}</td>
                <td className="p-3 font-bold">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;