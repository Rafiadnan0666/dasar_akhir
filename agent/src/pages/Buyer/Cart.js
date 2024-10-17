import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';

const Cart = () => {
  const { id } = useParams(); 
  const [cart, setCart] = useState([]);
  const [sdahpilih, setSdahpilih] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/keranjangs');
        const filteredCart = response.data.filter(item => item.user_id === id);
        setCart(filteredCart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCart();
  }, [id]); 


  const toggleSelectItem = (item) => {
    const isSelected = sdahpilih.includes(item.id);
    if (isSelected) {
      setSdahpilih(sdahpilih.filter(itemId => itemId !== item.id));
      setTotal(total - item.price * item.kuantitas);
      setQuantity(quantity - item.kuantitas);
    } else {
      setSdahpilih([...sdahpilih, item.id]);
      setTotal(total + item.price * item.kuantitas);
      setQuantity(quantity + item.kuantitas);
    }
  };

  const handleCheckout = async () => {
    const checkoutItems = cart.filter(item => sdahpilih.includes(item.id));
    try {
      const pesananData = checkoutItems.map(item => ({
        pembeli_id: item.user_id,
        keranjang_id: item.id,
        kuantitas: item.kuantitas
      }));
      await Promise.all(pesananData.map(async pesanan => {
        await axios.post('http://localhost:8000/pesanans', pesanan);
      }));
      alert('Checkout successful!');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed!');
    }
  };

  return (
    <Layout>
    <div className="container py-5">
      <h1 className="display-4 text-center">Kerangjang</h1>
      <div className="row">
        <div className="col-md-8">
          {cart.map(item => (
            <div key={item.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    id={`item-${item.id}`}
                    onChange={() => toggleSelectItem(item)} 
                    checked={sdahpilih.includes(item.id)}
                  />
                  <label className="form-check-label" htmlFor={`item-${item.id}`}>
                    <h5>{item.barang_id}</h5> 
                    <p>Quantity: {item.kuantitas}</p>
                    <p>Price: ${item.harga}</p> 
                  </label>
                </div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center">
              <p>No items in your cart.</p>
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Order Summary</h4>
              <p>Total Quantity: {quantity}</p>
              <p>Total Price: ${total.toFixed(2)}</p>
              <button 
                className="btn btn-primary btn-block mt-3" 
                onClick={handleCheckout}
                disabled={sdahpilih.length === 0}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Cart;
