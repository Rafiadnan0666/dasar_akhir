import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Products from "./components/Products/Products";
import Admin from "./pages/Admin/Admin";
import Kategori from "./pages/Kategori/Kategori";
import NotFound from "./pages/NotFound/NotFound";
import Seller from "./pages/Seller/Seller";
import Cart from "./pages/Buyer/Cart";
import OrderB from "./pages/Buyer/OrderB";
import BarangJual from "./pages/Seller/BarangJual";
import Komen from "./pages/Seller/Komen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
          <Route path="/products/:pid" element={<Products />} />
          <Route path="/kategori/:kid" element={<Kategori/>} />
          <Route path="/:id/order" element={<OrderB/>} />
          <Route path="/:id/cart" element={<Cart/>} />
          <Route  path="/:id/seller/products" element={<BarangJual />} />
        <Route path=":id/" element={<Home />} />
        <Route path=":id/admin" element={<Admin/>} />
        <Route path=":id/seller" element={<Seller/>} />
        <Route path=":id/products" element={<Products />} />
        <Route path=":id/products/:pid" element={<Products />} />
        <Route path=":id/seller/comments" element={<Komen/>} />
        <Route path=":id/seller/order" element={<Komen/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;

