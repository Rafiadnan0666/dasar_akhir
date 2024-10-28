import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import Layout from "../Layout/Layout";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  textAlign: "center",
  boxShadow: "none",
}));

const ProductImage = styled("img")({
  maxWidth: "100%",
  borderRadius: "12px",
});

const ProductDetails = styled("div")({
  textAlign: "left",
  color: "#333",
  padding: "1.5rem",
});

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "12px 24px",
  fontSize: "18px",
  borderRadius: "9999px",
  backgroundColor: "#0071e3",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#005bb5",
  },
}));

const CommentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const Products = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [mentionId, setMentionId] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1); 
  const { id, pid } = useParams();
  const navigate = useNavigate();

  // Fetch Product, User, and Comments Data
  useEffect(() => {
    fetchUser();
    fetchProduct();
    if (pid) {
      fetchComments();
    }
  }, [pid]);

  const fetchProduct = async () => {
    if (!pid) {
      setShowModal(true);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/barangs/${pid}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/komentars`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(`http://localhost:8000/komentars`, {
          teks_komentar: newComment,
          barang_id: pid,
          user_id: id,
          mention_id: mentionId,
        });
        setNewComment("");
        setMentionId(null);
        fetchComments();
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleAddToCartClick = () => {
    setQuantityModalOpen(true);
  };

  const handleCartSubmit = async () => {
    if (!id) {
      alert("Please log in to add items to your cart.");
      return;
    }
  
    if (quantity < 1 || quantity > product.quantity) {
      alert(`Please enter a valid quantity (1 to ${product.quantity}).`);
      return;
    }
  
    try {
      const cartData = {
        barang_id: pid,
        user_id: id,
        kuantitas: quantity,
        penanan_num: 0,
      };
      await axios.post(`http://localhost:8000/keranjangs`, cartData);
      console.log("Product added to cart successfully!");
      setQuantityModalOpen(false);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("There was an error adding the product to your cart. Please try again.");
    }
  };
  

  const handleReply = (commentId) => {
    setMentionId(commentId);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/register");
  };

  const handleQuantityChange = (e) => {
    const value = Math.min(e.target.value, product.quantity);
    setQuantity(value);
  };

  if (!product) {
    return (
      <Layout>
        <Typography variant="h5" align="center" style={{ padding: "2rem" }}>
          Loading...
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container sx={{ padding: "4rem 0" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Item>
              <ProductImage src={product.gambar_url} alt={product.nama} />
            </Item>
          </Grid>

          <Grid item xs={12} md={6}>
            <Item>
              <ProductDetails>
                <Typography variant="h3" component="h1" gutterBottom>
                  {product.nama}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Price: Rp {product.harga}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.deskripsi}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCartClick}
                  style={{ marginTop: "1rem" }}
                >
                  {id ? "Add to Cart" : "Login to Cart"}
                </Button>
              </ProductDetails>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5">Comments</Typography>

            <Box my={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={
                  mentionId ? "Reply to comment..." : "Add a comment..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
                style={{ marginTop: "1rem" }}
              >
                {mentionId ? "Reply" : "Post Comment"}
              </Button>
            </Box>
            {comments
              .filter(
                (comment) => comment.barang_id === pid && !comment.mention_id
              )
              .map((comment) => (
                <div key={comment.id}>
                  <CommentBox>
                    <Typography variant="body1">
                      {user.find((user) => user.id === comment.user_id)?.name} :{" "}
                      {comment.teks_komentar}
                    </Typography>
                    <Button onClick={() => handleReply(comment.id)}>
                      Reply
                    </Button>
                  </CommentBox>
                  {comments
                    .filter((reply) => reply.mention_id === comment.id)
                    .map((reply) => (
                      <div
                        key={reply.id}
                        style={{ paddingLeft: "20px", marginTop: "10px" }}
                      >
                        <CommentBox>
                          <Typography variant="body1">
                            {user.find((user) => user.id === reply.user_id)?.name}
                            {"> "}
                            {user.find((user) => user.id === comment.user_id)?.name}{" "}
                            : {reply.teks_komentar}
                          </Typography>
                          <Button onClick={() => handleReply(reply.id)}>
                            Reply
                          </Button>
                        </CommentBox>
                      </div>
                    ))}
                </div>
              ))}
          </Grid>
        </Grid>
      </Container>

      <Modal open={quantityModalOpen} onClose={() => setQuantityModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Select Quantity
          </Typography>
          <TextField
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1, max: product.quantity }}
            fullWidth
          />
          <Button
            onClick={handleCartSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Products;
