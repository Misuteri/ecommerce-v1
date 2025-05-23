import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
    calculateTotal(items);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return;

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total
      };

      await axios.post('/api/orders', orderData);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCartItems([]);
      setTotal(0);
      
      // Redirect to home page
      navigate('/', { state: { message: 'Order placed successfully!' } });
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded-l hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-r hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xl font-medium">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full mt-4 px-6 py-3 rounded-md text-white transition-colors ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 