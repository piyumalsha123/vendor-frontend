import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN"); 
    navigate("/login"); 
  };
  const [stats, setStats] = useState({ users: 0, vendors: 0, orders: 0 });
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
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
      const [statsRes, orderRes, storeRes, userRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/orders`, { headers }),
        fetch(`${API_URL}/admin/stores`, { headers }),
        fetch(`${API_URL}/admin/users`, { headers })
      ]);

      const statsData = await statsRes.json();
      const orderData = await orderRes.json();
      const storeData = await storeRes.json();
      const userData = await userRes.json();

      setStats(statsData || { users: 0, vendors: 0, orders: 0 });
      setOrders(Array.isArray(orderData) ? orderData : []);
      setStores(Array.isArray(storeData) ? storeData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const toggleBlockVendor = async (storeId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/vendors/${storeId}/toggle-block`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setStores(stores.map(s => s._id === storeId ? { ...s, isActive: !s.isActive } : s));
      }
    } catch (err) { console.error(err); }
  };

  const toggleBlockUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/toggle-block`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, approved: !u.approved } : u));
      }
    } catch (err) { console.error(err); }
  };

  const removeUser = async (userId: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) { console.error(err); }
  };

 const removeStore = async (storeId: string) => {
  if (!window.confirm("Are you sure you want to remove this store?")) return;
  try {
    const res = await fetch(`${API_URL}/admin/stores/${storeId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setStores(stores.filter(s => s._id !== storeId)); // දත්ත ලැයිස්තුව යාවත්කාලීන කිරීම
    }
  } catch (err) { 
    console.error("Delete error:", err); 
  }
};

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading Admin Panel...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
        <button onClick={handleLogout} className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition">Logout</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Users", val: stats.users },
          { label: "Total Vendors", val: stats.vendors },
          { label: "Total Orders", val: stats.orders }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 uppercase">{item.label}</p>
            <h2 className="text-3xl font-black mt-2 text-indigo-600">{item.val}</h2>
          </div>
        ))}
      </div>

      {/* Vendors Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Manage Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50">
              <tr><th className="p-4">Store & Contact</th><th className="p-4 text-right">Action</th></tr>
            </thead>
           
<tbody>
  {stores.map((store: any) => (
    <tr key={store._id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <Link to={`/store/${store.vendorId?._id || store.vendorId}`} className="text-blue-600 font-bold block">
          {store.storeName || "Unknown Store"}
        </Link>
        <div className="text-xs text-gray-500">Owner: {store.vendorId?.name || "N/A"}</div>
      </td>
      <td className="p-4 text-right flex justify-end gap-2">
        <button 
          onClick={() => toggleBlockVendor(store._id)} 
          className={`px-4 py-2 rounded-lg text-white text-sm ${store.isActive ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {store.isActive ? 'Block' : 'Unblock'}
        </button>
        
        <button 
  onClick={() => removeStore(store._id)}
  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
>
  <FaTrash />
</button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Registered Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50">
              <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => toggleBlockUser(user._id)} className={`px-3 py-1 rounded-lg text-white text-sm ${user.approved ? 'bg-red-500' : 'bg-green-500'}`}>{user.approved ? 'Block' : 'Unblock'}</button>
                    <button onClick={() => removeUser(user._id)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">Remove</button>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50">
              <tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order._id} className="border-b">
                  <td className="p-4 font-mono text-indigo-600">OD{order._id?.toString().slice(-6).toUpperCase()}</td>
                  <td className="p-4">{order.customerId?.name || "Guest"}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;