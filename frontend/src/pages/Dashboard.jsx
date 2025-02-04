import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getUsers } from "../api/userApi";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Box, Card, Container, Typography, Button } from "@mui/material";
import EditUserModal from "../components/EditUserModal";

const Dashboard = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { data: users, isLoading, error } = useQuery("users", getUsers);

  const openEditModal = (userId) => {
    setSelectedUserId(userId);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedUserId(null);
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h5" align="center">User Dashboard</Typography>
        {isLoading && <Typography align="center">Loading...</Typography>}
        {error && <Typography color="error">{error.message}</Typography>}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {users?.map((user) => (
            <Card key={user._id} sx={{ width: 300, padding: 2 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                {user.image && <img src={`http://localhost:5000${user.image}`} alt="User" width="100" height="100" />}
              </Box>
              <Typography><strong>Username:</strong> {user.username}</Typography>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Age:</strong> {user.age}</Typography>
              <Typography><strong>Phone:</strong> {user.phone}</Typography>
              <Typography><strong>Role:</strong> {user.role}</Typography>
              <Typography><strong>Salary:</strong> {user.salary}</Typography>
              <Button variant="contained" onClick={() => openEditModal(user._id)} sx={{ mt: 2 }}>Edit</Button>
            </Card>
          ))}
        </Box>

        <Button variant="outlined" onClick={logout} sx={{ mt: 2 }}>Logout</Button>
      </Card>

      {isEditOpen && <EditUserModal userId={selectedUserId} onClose={closeEditModal} />}
    </Container>
  );
};

export default Dashboard;
