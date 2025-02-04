import { useState } from "react";
import { useMutation } from "react-query";
import { loginUser } from "../api/userApi";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Box, Card, Container, Typography, Button } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [error, setError] = useState("");

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: (data) => {
      login(data);
      navigate("/dashboard");
      setError(""); 
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Invalid username or password");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill out both fields!");
      return;
    }

    mutate(formData);
  };

  return (
    <Container maxWidth="sm" className="form-container">
      <Card sx={{ padding: 5}}>
        <Typography variant="h5" align="center">Login</Typography>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="emailOrUsername" placeholder="Email or Username" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <br/>
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="contained" fullWidth onClick={() => navigate('/register')}>New User?? Click Here</Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
