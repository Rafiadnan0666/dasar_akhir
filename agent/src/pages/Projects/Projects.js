import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { gsap } from 'gsap';
import { useParams } from 'react-router';

const Projects = () => {
  const {id} = useParams()
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [barangs, setBarangs] = useState([]);
  const [komentars, setKomentars] = useState([]);
  const [newKomentar, setNewKomentar] = useState('');

  // Fetch portfolio items from FastAPI endpoint
  useEffect(() => {
    const fetchBarangs = async () => {
      try {
        const response = await fetch('http://localhost:8000/barangs/');
        const data = await response.json();
        setBarangs(data);
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
      }
    };

    fetchBarangs();
  }, []);

  useEffect(() => {
    const fetchKomentars = async () => {
      if (selectedProjectIndex !== null) {
        const barangId = barangs[selectedProjectIndex].id;
        try {
          const response = await fetch(`http://localhost:8000/komentars/`);
          const data = await response.json();
          setKomentars(data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchKomentars();
  }, [selectedProjectIndex]);


  useEffect(() => {
    gsap.from('.portfolio-item', { opacity: 0, y: 50, duration: 0.5, stagger: 0.2 });
  }, [barangs]);


  const handleOpenModal = (index) => {
    setSelectedProjectIndex(index);
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setSelectedProjectIndex(null);
    setShowModal(false);
    setKomentars([]); 
  };

  const handleNextProject = () => {
    setSelectedProjectIndex((prevIndex) => (prevIndex + 1) % barangs.length);
  };

  const handlePreviousProject = () => {
    setSelectedProjectIndex((prevIndex) => (prevIndex - 1 + barangs.length) % barangs.length);
  };


  const handleKomentarSubmit = async (e) => {
    e.preventDefault();
    if (!newKomentar) return;

    const barangId = barangs[selectedProjectIndex].id;
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Replace with actual user ID if available

    try {
      const response = await fetch(`http://localhost:8000/komentars/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          komentar: newKomentar,
          barang_id: barangId,
          user_id: userId
        }),
      });
      
      const newKomentarData = await response.json();
      setKomentars((prev) => [...prev, newKomentarData]);
      setNewKomentar(''); // Reset input
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-800 text-white">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Barang</h2>
        <p className="mt-4 text-gray-300">Check out some of our work in Game and Web Development</p>
      </div>


      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barangs.map((item, index) => (
            <Draggable key={item.id}>
              <div
                className="portfolio-item relative bg-gray-700 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 cursor-pointer"
                onClick={() => handleOpenModal(index)}
              >
                <img src={`${item.gambar}`} className="w-full h-56 object-cover" alt={item.nama_barang} />
                <div className="px-4 py-2">
                  <p className="text-center font-semibold">{item.nama_barang}</p>
                </div>
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      {showModal && barangs[selectedProjectIndex] && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-800 rounded-lg overflow-hidden max-w-3xl mx-auto relative shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              onClick={handleCloseModal}
            >
              <i className="bx bx-x text-3xl"></i>
            </button>

            {/* Modal Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3"
              onClick={handlePreviousProject}
            >
              <i className="bx bx-chevron-left text-2xl"></i>
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3"
              onClick={handleNextProject}
            >
              <i className="bx bx-chevron-right text-2xl"></i>
            </button>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">{barangs[selectedProjectIndex].nama_barang}</h3>
              <p className="text-gray-300 mb-8">{barangs[selectedProjectIndex].deskripsi}</p>

              <div className="mb-8">
                <img
                  src={`${barangs[selectedProjectIndex].gambar}`}
                  className="w-full h-48 object-cover rounded-md"
                  alt={barangs[selectedProjectIndex].nama_barang}
                />
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold">Comments:</h4>
                <div className="max-h-48 overflow-y-auto">
                  {komentars.filter((komentar) => komentar.user_id == id).map((komentar) => (
                    <div key={komentar.id} className="mb-2 p-2 border-b border-gray-600">
                      <strong>User ID: {komentar.user_id}</strong>
                      <p>{komentar.komentar}</p>
                    </div>
                  ))}
                </div>
              </div>
             
              <form onSubmit={handleKomentarSubmit} className="flex">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newKomentar}
                onChange={(e) => setNewKomentar(e.target.value)}
                className="flex-grow p-2 border border-gray-600 rounded-l-md"
              />
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-r-md"
              >
                Post
              </button>
            </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
