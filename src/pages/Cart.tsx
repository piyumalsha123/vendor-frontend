import  { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext'; 
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const {} = useAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const colors = {
    background: "#DBCEA5", // Creamy paper tone
    primary: "#5A4A42",    // Deep coffee brown
    textMain: "#3E362E",   // Dark charcoal brown
    accent: "#A89F91",     // Muted taupe
  };

  const toggleSelect = (index: number) => {
    setSelectedItems(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const totalPrice = cart.reduce((acc: number, item: any, index: number) => {
    if (selectedItems.includes(index)) {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
      return acc + price;
    }
    return acc;
  }, 0);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
        // සියලුම තෝරාගත් භාණ්ඩ එකම Order එකකට සකසන්න
        const orderData = {
            items: selectedItems.map((index: number) => {
                const item = cart[index];
                return {
                    productId: item._id,
                    vendorId: item.vendorId, // අනිවාර්යයෙන්ම මෙය තිබිය යුතුයි
                    title: item.title,
                    price: parseFloat(item.price),
                    quantity: item.quantity || 1,
                    images: item.images,
                    status: 'pending' // item මට්ටමේ status
                };
            }),
            totalPrice: totalPrice,
            shippingAddress: "Main Street, Colombo", 
            phoneNumber: "0770000000"
        };

        const response = await fetch("http://localhost:5000/api/v1/orders", {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` 
            },
            body: JSON.stringify(orderData) // එකම request එකයි
        });

        if (!response.ok) throw new Error("Failed to place order");

        clearCart(); 
        alert("Order placed successfully!");
        window.location.href = "/customer/orders";
        
    } catch (err) {
        console.error(err);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsProcessing(false);
        setShowModal(false);
    }
};

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen" style={{ backgroundColor: colors.background }}>
      <h1 className="text-4xl font-black uppercase mb-8" style={{ color: colors.textMain }}>My Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p className="text-lg text-gray-500">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <input type="checkbox" className="w-5 h-5 cursor-pointer" checked={selectedItems.includes(index)} onChange={() => toggleSelect(index)} />
                <img src={item.images?.[0]} className="w-20 h-20 object-cover rounded-lg" alt={item.title} />
                <div>
                  <h2 className="font-bold text-lg" style={{ color: colors.textMain }}>{item.title}</h2>
                  <p className="font-semibold" style={{ color: colors.accent }}>LKR {item.price.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(index)} className="text-red-400 font-bold">Remove</button>
            </div>
          ))}

          <div className="mt-8 p-6 rounded-2xl text-white shadow-lg" style={{ backgroundColor: colors.textMain }}>
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold">Total Payable</h2>
               <span className="text-3xl font-black">LKR {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              disabled={selectedItems.length === 0}
              className="mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-green-700 transition-all disabled:opacity-50"
              onClick={() => setShowModal(true)}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
                <p className="text-gray-600 mb-6">Proceed with payment of LKR {totalPrice.toLocaleString()}?</p>
                <button 
                    disabled={isProcessing}
                    onClick={handleConfirmPayment}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    {isProcessing ? "Processing..." : "Confirm & Pay"}
                </button>
                <button onClick={() => setShowModal(false)} className="w-full mt-3 text-gray-500 hover:text-red-500">Cancel</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;