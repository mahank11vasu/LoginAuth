import { useState } from "react";
import { useMutation } from "react-query";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { Box, Card, Container, Typography, Button } from "@mui/material";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
    age: "",
    phone: "",
    role: "",
    salary: "",
    image: null,
  });

  const [error, setError] = useState("");

  const mutation = useMutation(registerUser, {
    onSuccess: () => {
      alert("User registered successfully!");
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        verifyPassword: "",
        age: "",
        phone: "",
        role: "",
        salary: "",
        image: null,
      });
      setError("");
    },
    onError: (err) => {
      if (err.response?.data?.message) {
        setError(err.response.data.message); 
      } else {
        setError("Registration failed. Please try again.");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB!");
      return;
    } else {
      setError(""); 
    }

    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }
    if (formData.password !== formData.verifyPassword) {
      setError("Passwords do not match!");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key !== "verifyPassword") {
        data.append(key, formData[key]);
      }
    }

    mutation.mutate(data);
  };

  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" className="form-container">
      <Card sx={{ padding: 3 }}>
        <Typography variant="h4" align="center">Register</Typography>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Player">Player</option>
            <option value="Organizer">Organizer</option>
          </select>
          <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
          <input type="file" onChange={handleFileChange} />
          <Button type="submit" variant="contained" fullWidth disabled={mutation.isLoading}>
            {mutation.isLoading ? "Registering..." : "Register"}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" fullWidth onClick={() => navigate('/login')}>Go to Login</Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default RegisterForm;
