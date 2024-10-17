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
  const [mentionId, setMentionId] = useState(null); // ID of comment being replied to
  const [showModal, setShowModal] = useState(false); // Modal for registration prompt
  const { id, pid } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

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

  const handleCartSubmit = async () => {
    if (id && pid) {
      try {
        const cartData = {
          barang_id: pid,
          user_id: id,
          kuantitas: 1,
          penanan_num: 0,
        };
        await axios.post(`http://localhost:8000/keranjangs`, cartData);
        console.log("Product added to cart successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      console.log("User is not logged in or no product ID provided.");
    }
  };

  const handleReply = (commentId) => {
    setMentionId(commentId);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/register");
  };

  useEffect(() => {
    fetchUser();
    fetchProduct();
    if (pid) {
      fetchComments();
    }
  }, [pid]);

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
                  onClick={handleCartSubmit}
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
                      {user
                        .filter((user) => user.id === comment.user_id)
                        .map((user) => (
                          <span key={user.id}>{user.name}</span>
                        ))}
                      : {comment.teks_komentar}
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
                            {user
                              .filter((user) => user.id === reply.user_id)
                              .map((user) => (
                                <span key={user.id}>{user.name}</span>
                              ))}
                            {"> "}
                            {user
                              .filter((user) => user.id === comment.user_id)
                              .map((user) => (
                                <span key={user.id}>{user.name}</span>
                              ))}
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

      <Modal open={showModal} onClose={handleModalClose}>
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
            Please Register
          </Typography>
          <Typography sx={{ mt: 2 }}>
            You need to register to view and purchase products.
          </Typography>
          <Button
            onClick={handleModalClose}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Go to Registration
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Products;
