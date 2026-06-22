import  { useState, useEffect } from 'react';
import {  CheckCircle, XCircle, Truck, Clock, Filter, AlertCircle } from 'lucide-react';

const VendorOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/orders/vendor/me", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
      });
      const result = await response.json();
      setOrders(result.data || []);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/orders/status/${orderId}`, {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
        },
        body: JSON.stringify({ status })
      });
      fetchVendorOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const statusConfig: any = {
    pending: { color: 'bg-amber-100 text-amber-800', icon: Clock },
    confirmed: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    shipped: { color: 'bg-blue-100 text-blue-800', icon: Truck },
    cancelled: { color: 'bg-rose-100 text-rose-800', icon: XCircle }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Monitor and manage your incoming store orders</p>
        </div>
        <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-2">
            <Filter size={18} className="text-gray-400 ml-2"/>
            <select className="outline-none px-2 py-1" onChange={(e) => setFilter(e.target.value)}>
                {['all', 'pending', 'confirmed', 'shipped', 'cancelled'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
        </div>
      </div>

     
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-xs uppercase tracking-wider text-gray-500">
              <th className="p-6">Order Details</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Price</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? filteredOrders.map((order: any) => {
              const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;
              return (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
  <div className="font-bold text-gray-900">{order.orderId}</div>
  <div className="text-sm text-gray-500">
     {order.items?.map((item: any) => item.title).join(", ") || "No Products"}
  </div>
</td>
                  <td className="p-6 text-sm text-gray-600">
  {order.customerDetails?.email || "N/A"}
</td>
                  <td className="p-6 font-semibold">Rs. {order.totalPrice?.toFixed(2)}</td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                      <StatusIcon size={14} /> {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {order.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(order._id, 'confirmed')} className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">ACCEPT</button>
                      </div>
                    )}
                    {order.status === 'confirmed' && (
                      <button onClick={() => updateStatus(order._id, 'shipped')} className="text-xs font-bold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">SHIP</button>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="p-12 text-center text-gray-400">No orders available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrders;