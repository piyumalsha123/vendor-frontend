import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Truck, Clock, Filter, AlertCircle } from 'lucide-react';

const VendorOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchVendorOrders();
  }, []);

 const fetchVendorOrders = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/orders/vendor/me", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
    });
    const result = await response.json();
    
    console.log("Order Data Response:", result); 
    
    setOrders(result.data || []);
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
  }
};

//  const fetchCustomerDetails = async (customerId: string) => {
//   if (!customerId) {
//     console.error("No Customer ID provided!");
//     alert("Error: Customer ID not found.");
//     return;
//   }
  
//   console.log("Attempting to fetch details for ID:", customerId);
  
//   try {
//     const response = await fetch(`http://localhost:5000/api/v1/user/details/${customerId}`, {
//       headers: { "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
//     });
    
//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log("API Response Data:", data); 
   
//     setSelectedCustomer(data); 
//   } catch (err) {
//     console.error("Fetch Error:", err);
//     alert("Failed to fetch customer details. Check console for details.");
//   }
// };

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Monitor and manage your incoming store orders</p>
        </div>
        <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-2">
          <Filter size={18} className="text-gray-400 ml-2" />
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
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                     {order.items?.[0]?.images?.[0] ? (
      <img 
        src={order.items?.[0]?.images?.[0]} 
        alt="product" 
        className="w-12 h-12 rounded-lg object-cover border" 
      />
    ) : (
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">No Image</div>
    )}
                      <div>
                        <div className="font-bold text-gray-900">{order.orderId}</div>
                        <div className="text-sm text-gray-500">
                          {order.items?.map((item: any) => item.title).join(", ") || "No Products"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-[#4A3728]">
<button 
  onClick={() => {
   
    if (order.debug_customerInfo) {
      setSelectedCustomer(order.debug_customerInfo);
    } else {
      alert("Customer details not available for this order.");
    }
  }} 
  className="underline hover:text-[#8B5E3C]"
>
  {order.customerName || "Guest User"}
</button>
</td>
                  <td className="p-6 font-semibold">Rs. {order.totalPrice?.toFixed(2)}</td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                      <StatusIcon size={14} /> {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {order.status === 'pending' && (
                      <button onClick={() => updateStatus(order._id, 'confirmed')} className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">ACCEPT</button>
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

     
  {selectedCustomer && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl">
      <h3 className="text-xl font-black text-[#4A3728] mb-6">Customer Details</h3>
      <div className="space-y-4 text-sm">
        <p><strong>Name:</strong> {selectedCustomer.name || "N/A"}</p>
        <p><strong>Email:</strong> {selectedCustomer.email || "N/A"}</p>
        <p><strong>Phone:</strong> {selectedCustomer.phone || "N/A"}</p>
        <p><strong>Address:</strong> {selectedCustomer.address || "N/A"}</p>
      </div>
      <button 
        onClick={() => setSelectedCustomer(null)} 
        className="mt-8 w-full bg-[#4A3728] text-white py-3 rounded-xl font-bold hover:bg-[#2D2A26]"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default VendorOrders;