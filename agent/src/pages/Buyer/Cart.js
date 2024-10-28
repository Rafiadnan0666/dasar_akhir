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
  const [barangs, setBarangs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/keranjangs');
      const filteredCart = response.data.filter(keranjang => keranjang.user_id === id);
      setCart(filteredCart);
    } catch (error) {
      setError('Error fetching cart items');
      console.error(error);
    }
  };

  const fetchBarangs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/barangs");
      setBarangs(response.data);
    } catch (error) {
      setError('Error fetching barang data');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCart();
      await fetchBarangs();
      setLoading(false); 
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const selek = cart.filter(keranjang => sdahpilih.includes(keranjang.id));
    const newTotal = selek.reduce((acc, keranjang) => {
      const barang = barangs.find(b => b.id === keranjang.barang_id); 
      return acc + (barang ? barang.harga * keranjang.kuantitas : 0);
    }, 0);
    const newQuantity = selek.reduce((acc, keranjang) => acc + keranjang.kuantitas, 0);

    setTotal(newTotal);
    setQuantity(newQuantity);
  }, [sdahpilih, cart, barangs]);

  const toggleSelectItem = (keranjang) => {
    const isSelected = sdahpilih.includes(keranjang.id);
    setSdahpilih(isSelected ? sdahpilih.filter(itemId => itemId !== keranjang.id) : [...sdahpilih, keranjang.id]);
  };

  const handleCekout = async () => {
    const checkoutItems = cart.filter(keranjang => sdahpilih.includes(keranjang.id));
    const pesananData = checkoutItems.map(keranjang => ({
      pembeli_id: id,
      keranjang_id: keranjang.id,
      barang_id: keranjang.barang_id, 
      kuantitas: keranjang.kuantitas
    }));

    console.log('Pesanan Data:', pesananData);

    try {
      const response = await axios.post('http://localhost:8000/pesanans/', pesananData);
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Error during checkout. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="display-4 text-center">Keranjang</h1>
        <div className="row">
          <div className="col-md-8">
            {cart.length > 0 ? cart.map(keranjang => {
              const { id, barang_id, kuantitas } = keranjang; // Destructure keranjang
              const barang = barangs.find(b => b.id === barang_id); // Get barang data

              return (
                <div key={id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        id={`keranjang-${id}`}
                        onChange={() => toggleSelectItem(keranjang)} 
                        checked={sdahpilih.includes(id)}
                      />
                      <label className="form-check-label" htmlFor={`keranjang-${id}`}>
                        <h5>{barang ? barang.nama : 'Unknown Item'}</h5> 
                        <p>Quantity: {kuantitas}</p>
                        <p>Harga: ${barang ? barang.harga : 'N/A'}</p> 
                      </label>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center">
                <p>Ora ADA</p> 
              </div>
            )}
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4>Ringkasan Pesanan</h4> 
                <p>Total Quantity: {quantity}</p>
                <p>Total Harga: ${total}</p> 
                <button 
                  className="btn btn-primary btn-block mt-3" 
                  onClick={handleCekout}
                  disabled={sdahpilih.length === 0}
                >
                  Cek Out 
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
