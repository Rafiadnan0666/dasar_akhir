import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useParams } from 'react-router';
import axios from 'axios';

const OrderB = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pesanans');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-md-12 text-center">
            <h1 className="display-4">Pesanan</h1>
            <p className="lead">Pesamam</p>
          </div>
        </div>
        <div className="row">
          {orders.filter(order => order.pembeli_id === id).map((order) => (
            <div key={order.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order.id}</h5>
                  <p className="card-text">Cart ID: {order.keranjang_id}</p>
                  <p className="card-text">Berapa: {order.kuantitas}</p>
                  <button className="btn btn-primary btn-block">View Details</button>
                </div>
              </div>
            </div>
          ))}
          {orders.filter(order => order.pembeli_id === id).length === 0 && (
            <div className="col-md-12 text-center">
              <p>Blom Order apa apa</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderB;
