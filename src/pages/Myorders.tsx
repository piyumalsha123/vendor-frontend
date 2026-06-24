import { useState, useEffect } from 'react';

import { FaTrash } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://vendor-backend-kr2j.vercel.app/api/v1/orders/customer/me", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
      });
      const data = await response.json();
      if (data.data) {
        const grouped = data.data.reduce((acc: any, order: any) => {
          if (!acc[order.orderId]) { acc[order.orderId] = { ...order }; } 
          else { acc[order.orderId].items.push(...order.items); acc[order.orderId].totalPrice += order.totalPrice; }
          return acc;
        }, {});
        setOrders(Object.values(grouped));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (loading) return <div className="p-8 text-center text-[#4A3728]">Loading your orders...</div>;

  return (
    <div className="p-8 min-h-screen bg-[#FAF9F6]">
      <h1 className="text-4xl font-black uppercase mb-8 text-[#4A3728] tracking-widest">My Orders</h1>
      
      <div className="bg-[#EBE5D6] rounded-3xl shadow-lg overflow-hidden border border-[#D4C4A8]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#D4C4A8]/30 text-[#4A3728] uppercase text-[10px] tracking-[0.2em] font-black">
              <th className="p-6">Order ID</th>
              <th className="p-6">Products</th>
              <th className="p-6">Total</th>
              <th className="p-6">Status</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4C4A8]/50">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-[#D4C4A8]/20 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <td className="p-6 font-bold text-[#4A3728]">{order.orderId}</td>
                <td className="p-6">
                  <div className="flex -space-x-2">
                    {order.items?.map((item: any, i: number) => (
                      <img key={i} src={item.images?.[0]} className="w-10 h-10 rounded-full border-2 border-[#EBE5D6] object-cover" />
                    ))}
                  </div>
                </td>
                <td className="p-6 font-bold text-[#2D2A26]">LKR {order.totalPrice.toLocaleString()}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6">
                  {order.status === 'pending' ? (
                    <button className="text-red-600 text-xs font-black hover:underline uppercase">Cancel</button>
                  ) : (
                    <button className="text-[#A89F91] hover:text-red-600"><FaTrash /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-[#D4C4A8]">
            <h2 className="text-2xl font-black mb-1 text-[#4A3728]">Order Details</h2>
            <p className="text-[#8B5E3C] mb-6 font-mono text-sm">{selectedOrder.orderId}</p>
            
            <div className="space-y-4 mb-6">
              {selectedOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-[#EBE5D6]/50 p-4 rounded-2xl border border-[#D4C4A8]">
                  <p className="font-black text-[#2D2A26] text-sm">{item.title}</p>
                  <p className="text-xs text-[#8B5E3C] font-bold">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedOrder(null)} className="w-full bg-[#4A3728] text-white py-3 rounded-2xl font-black hover:bg-[#2D2A26] transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;