import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, TextField, Button } from "@mui/material";
import axios from "axios";
import LayoutAdmin from "../Admin/LayoutAdmin";
import swal from 'sweetalert'

const BarangJual = () => {
  const { id } = useParams();
  const [barangs, setBarangs] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [iniBarang, setiniBarang] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    quantity :  "",
    gambar_url: "",
    kategori_id: "",
  });

  const fetchKategori = async () => {
    try {
      const response = await axios.get("http://localhost:8000/kategoris/");
      setKategori(response.data);
    } catch (error) {
      console.error("Error fetching kategori data:", error);
    }
  };

  const fetchBarangs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/barangs/");
      setBarangs(response.data);
    } catch (error) {
      console.error("Error fetching barangs:", error);
    }
  };

  useEffect(() => {
    fetchKategori();
    fetchBarangs();
  }, []);

  const handleOpenModal = (type, barang = null) => {
    setModalType(type);
    if (barang) {
      setiniBarang(barang);
    } else {
      setiniBarang({
        nama: "",
        deskripsi: "",
        harga: "",
        quantity : "",
        gambar_url: "",
        kategori_id: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setiniBarang({
      nama: "",
      deskripsi: "",
      harga: "",
      quantity : "",
      gambar_url: "",
      kategori_id: "",
    });
  };

  const handleChange = (e) => {
    setiniBarang({
      ...iniBarang,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBarang = async () => {
    try {
      const newBarang = { ...iniBarang, penjual_id: id };
      await axios.post("http://localhost:8000/barangs/", newBarang);
      setBarangs([...barangs, newBarang]);
      handleCloseModal();
      window.location.reload();
      swal("YEYYYY tambah barang");
    } catch (error) {
      console.error("Error adding barang:", error);
    }
  };

  const handleUpdateBarang = async () => {
    if (!iniBarang.id) {
      console.error("Barang ID is missing");
      return;
    }
    try {
      await axios.put(`http://localhost:8000/barangs/${iniBarang.id}`, iniBarang);
      setBarangs(
        barangs.map((barang) =>
          barang.id === iniBarang.id ? iniBarang : barang
        )
      );
      handleCloseModal();
      swal("YEYYYY update barang");
    } catch (error) {
      console.error("Error updating barang:", error);
    }
  };

  const handleDeleteBarang = async (barangId) => {
    if (!barangId) {
      console.error("Barang ID is missing");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/barangs/${barangId}`);
      setBarangs(barangs.filter((barang) => barang.id !== barangId));
      swal("YEYYYY apus barang");
    } catch (error) {
      console.error("Error deleting barang:", error);
    }
  };

  return (
    <LayoutAdmin>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Daftar Barang Jualan</h1>

        <Button
          variant="contained"
          onClick={() => handleOpenModal("add")}
          className="bg-blue-500 text-white"
        >
          Tambah Barang
        </Button>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {barangs
            .filter((barang) => barang.penjual_id === id)
            .map((barang) => (
              <div key={barang.id} className="border rounded-lg p-4 shadow-lg">
                <h2 className="text-lg font-semibold">{barang.nama}</h2>
                <p>{barang.deskripsi}</p>
                <p className="font-bold">Rp{barang.harga}</p>
                <img
                  src={barang.gambar_url}
                  alt={barang.nama}
                  className="w-full h-40 object-cover mt-2"
                />
                <div className="mt-4 space-x-2">
                  <Button
                    variant="outlined"            
                    color="primary"
                    onClick={() => handleOpenModal("edit", barang)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteBarang(barang.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20">
            <h2 className="text-lg font-bold mb-4">
              {modalType === "add" ? "Tambah Barang" : "Edit Barang"}
            </h2>
            <TextField
              label="Nama Barang"
              name="nama"
              value={iniBarang.nama}
              onChange={handleChange}
              fullWidth
              className="mb-4"
            />
            <TextField
              label="Deskripsi"
              name="deskripsi"
              value={iniBarang.deskripsi}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="mb-4"
            />
            <TextField
              label="Harga"
              name="harga"
              value={iniBarang.harga}
              onChange={handleChange}
              fullWidth
              type="number"
              className="mb-4"
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={iniBarang.quantity}
              onChange={handleChange}
              fullWidth
              type="number"
              className="mb-4"
            />
            <TextField
              label="URL Gambar"
              name="gambar_url"
              value={iniBarang.gambar_url}
              onChange={handleChange}
              fullWidth
              className="mb-4"
            />

            <label htmlFor="kategori_id">Kategori</label>
            <select
              id="kategori_id"
              name="kategori_id"
              value={iniBarang.kategori_id}
              onChange={handleChange}
              fullWidth
              className="mb-4"
            >
              <option value="">Pilih Kategori</option>
              {kategori.map((kate) => (
                <option key={kate.id} value={kate.id}>
                  {kate.nama_kategori}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-4">
              <Button
                variant="contained"
                color="primary"
                onClick={modalType === "add" ? handleAddBarang : handleUpdateBarang}
              >
                {modalType === "add" ? "Tambah" : "Update"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
              >
                Batal
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </LayoutAdmin>
  );
};

export default BarangJual;
