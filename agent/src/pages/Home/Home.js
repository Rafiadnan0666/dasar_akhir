import React from "react";
import "./Home.css";
import Hero from "../../components/Hero/Hero";
import { Link, useParams } from "react-router-dom";
import Projects from "../Projects/Projects";
import Layout from "../../components/Layout/Layout";
import BarangCard from "../../components/Card/Card";

const Home = () => {
  
  return (
    <div>
      <Layout>
      <Hero />
      <BarangCard/>
      </Layout>
      
    </div>
  );
};

export default Home;
