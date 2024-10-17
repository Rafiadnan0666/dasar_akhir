import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import LayoutAdmin from '../Admin/LayoutAdmin';
import { Bar } from 'react-chartjs-2';
import { CircularProgress } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import swal from 'sweetalert';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Seller = () => {
  const { id } = useParams(); 
  const [barangsData, setBarangsData] = useState([]);
  const [keranjangsData, setKeranjangsData] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const fetchUser = async () => {
    try {
      const usersResponse = await axios.get(`http://localhost:8000/users`);
      setUser(usersResponse.data);
    } catch (error) {
      console.error(error); 
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const barangsResponse = await axios.get('http://localhost:8000/barangs/');
        setBarangsData(barangsResponse.data);
        const keranjangsResponse = await axios.get('http://localhost:8000/keranjangs/');
        setKeranjangsData(keranjangsResponse.data);
        const commentsResponse = await axios.get('http://localhost:8000/komentars/');
        setComments(commentsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchAllData();
  }, [id]);

  useEffect(() => {
    if (!loading && user.length > 0) {
      const currentUser = user.find((u) => u.id === id);
      if (currentUser) {
        swal(`Welcome ${currentUser.nama}!`);
      }
    }
  }, [loading, user, id]);

  if (loading) {
    return <CircularProgress />;
  }

  const filteredBarangs = barangsData.filter(barang => barang.penjual_id === id);

  const salesData = {
    labels: filteredBarangs.map(barang => barang.nama),
    datasets: [
      {
        label: 'Sales Quantity',
        data: filteredBarangs.map(barang => barang.jumlah_terjual || 0), 
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const cartData = {
    labels: filteredBarangs.map(barang => barang.nama),
    datasets: [
      {
        label: 'Cart Quantity',
        data: filteredBarangs.map(barang => {
          const matchingKeranjangs = keranjangsData.filter(keranjang => keranjang.barang_id === barang.id);
          return matchingKeranjangs.reduce((total, keranjang) => total + keranjang.kuantitas, 0); 
        }),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const filteredComments = comments.filter(comment =>
    filteredBarangs.some(barang => barang.id === comment.barang_id)
  );

  return (
    <LayoutAdmin>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Barang Terjual</h1>
        <div className="flex flex-wrap gap-6">
          <div className="bg-white p-4 shadow rounded-lg flex-1">
            <h2 className="text-xl font-semibold mb-4">Terpesan</h2>
            <Bar data={salesData} />
          </div>
          <div className="bg-white p-4 shadow rounded-lg flex-1">
            <h2 className="text-xl font-semibold mb-4">Yang Udah Masukin Kerangjang</h2>
            <Bar data={cartData} />
          </div>
        </div>

        <div className="mt-8 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Komentar</h2>
          <ul>
            {filteredComments.map(comment => (
              <li key={comment.id} className="mb-2">
                {comment.teks_komentar}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Seller;
