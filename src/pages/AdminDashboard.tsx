import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, vendors: 0, orders: 0 });
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("ACCESS_TOKEN");
  const API_URL = "https://vendor-backend-kr2j.vercel.app/api/v1";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  try {
    const headers = { "Authorization": `Bearer ${token}` };
    
    // API තුන වෙන වෙනම Call කිරීම (එකක් අසාර්ථක වුවත් අනෙක ක්‍රියාත්මක වේ)
    const [statsRes, orderRes, storeRes] = await Promise.all([
      fetch(`${API_URL}/admin/stats`, { headers }).catch(() => ({ json: () => ({ users: 0, vendors: 0, orders: 0 }) })),
      fetch(`${API_URL}/admin/orders`, { headers }).catch(() => ({ json: () => [] })),
      fetch(`${API_URL}/admin/stores`, { headers }).catch(() => ({ json: () => [] }))
    ]);

    const statsData = await statsRes.json();
    const orderData = await orderRes.json();
    const storeData = await storeRes.json();

    // Console logs මගින් දත්ත එන හැටි බලන්න (බොහොම වැදගත්!)
    console.log("Stats:", statsData, "Orders:", orderData, "Stores:", storeData);

    setStats(statsData || { users: 0, vendors: 0, orders: 0 });
    setOrders(Array.isArray(orderData) ? orderData : []);
    setStores(Array.isArray(storeData) ? storeData : []);
    
    setLoading(false);
  } catch (err) {
    console.error("Critical Error:", err);
    setLoading(false);
  }
};

  const toggleBlockVendor = async (storeId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/vendors/${storeId}/toggle-block`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading Admin Panel...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Users", val: stats.users },
          { label: "Total Vendors", val: stats.vendors },
          { label: "Total Orders", val: stats.orders }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm uppercase tracking-wider">{item.label}</p>
            <h2 className="text-4xl font-black mt-2 text-indigo-600">{item.val}</h2>
          </div>
        ))}
      </div>

      {/* Vendors Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Manage Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 rounded-tl-lg">Store & Contact</th>
                <th className="p-4 rounded-tr-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store: any) => (
                <tr key={store._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{store.storeName}</div>
                    <div className="text-sm text-gray-500">Owner: {store.vendorId?.name || "N/A"}</div>
                    <div className="text-xs text-blue-500">{store.vendorId?.email}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleBlockVendor(store._id)}
                      className={`px-5 py-2 rounded-lg font-medium text-white transition ${store.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {store.isActive ? 'Block Store' : 'Unblock Store'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Orders</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order: any) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-mono font-bold text-indigo-600">OD{order._id.toString().slice(-6).toUpperCase()}</td>
                <td className="p-4">{order.customerId?.name || "Guest"}</td>
                <td className="p-4"><span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase">{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;