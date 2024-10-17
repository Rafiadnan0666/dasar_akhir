import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Kategori = () => {
  const [expanded, setExpanded] = useState(false);
  const [barangs, setBarangs] = useState([]);
  const [user, setUser] = useState(null);
  const { id, kid } = useParams();
  const [kategori,setKategori] = useState([])

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get("http://localhost:8000/users");
          const currentUser = response.data.find((user) => user.id === id);
          setUser(currentUser || null);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchBarangs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/barangs/");
        console.log(response.data);
        
        setBarangs(response.data);
      } catch (error) {
        console.error("Error fetching Barang data:", error);
      }
    };
    fetchBarangs();
  }, []);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/kategoris/`);
        console.log(response.data);
        setKategori(response.data);
      } catch (error) {
        console.error("Error fetching Barang data:", error);
      }
    };
    fetchKategori();
  }, []);

  return (
    <Layout>
        {kategori.filter((kate) => kate.id === kid)
        .map((kate) => (
            <h1 className="text-6xl font-semibold">{kate.nama_kategori}</h1>
        ))
        }
        <h1>{kategori.nama_kategori}</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {barangs.length > 0 ? (
          barangs
            .filter((barang) => barang.kategori_id === kid)
            .map((barang) => (
              <Card
                key={barang.id}
                sx={{ maxWidth: 345, margin: 2, boxShadow: 3 }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="barang">
                      {barang.nama[0].toUpperCase()}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={barang.nama}
                  subheader={`Price: Rp ${barang.harga}`}
                />
                {barang.gambar_url && (
                  <CardMedia
                    component="img"
                    height="194"
                    image={barang.gambar_url}
                    alt={barang.nama}
                  />
                )}
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {barang.deskripsi}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>{barang.deskripsi}</Typography>
                  </CardContent>
                </Collapse>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    component={Link}
                    to={
                      user
                        ? `../../${id}/products/${barang.id}`
                        : `/products/${barang.id}`
                    }
                  >
                    Shop Now
                  </Button>
                </CardActions>
              </Card>
            ))
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            style={{ marginTop: "2rem" }}
          >
            No products found in this category.
          </Typography>
        )}
      </div>
    </Layout>
  );
};

export default Kategori;
