import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { getUsers, updateUser } from "../api/userApi";
import { Box, Card, Typography, Button } from "@mui/material";

const EditUserModal = ({ userId, onClose }) => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        age: "",
        phone: "",
        role: "",
        salary: "",
        image: null,
    });

    const { data: users, isLoading, error } = useQuery("users", getUsers, {
        onSuccess: (users) => {
            const userToEdit = users.find((user) => user._id === userId);
            if (userToEdit) {
                setFormData({
                    username: userToEdit.username,
                    name: userToEdit.name,
                    email: userToEdit.email,
                    age: userToEdit.age,
                    phone: userToEdit.phone,
                    role: userToEdit.role,
                    salary: userToEdit.salary,
                    image: userToEdit.image || null,
                });
            }
        },
        enabled: !!userId,
    });

    const updateMutation = useMutation((updatedData) => updateUser(userId, updatedData), {
        onSuccess: () => {
            alert("User updated successfully!");
            onClose();
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Error updating user");
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        for (const key in formData) {
            updatedData.append(key, formData[key]);
        }
        updateMutation.mutate(updatedData);
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <Box className="modal-overlay">
            <Card sx={{ padding: 3, maxWidth: 400, margin: "auto", mt: 5 }}>
                <Typography variant="h5" align="center">Edit User</Typography>
                <form onSubmit={handleSubmit} className="form">
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="Player">Player</option>
                        <option value="Organizer">Organizer</option>
                    </select>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
                    <input type="file" onChange={handleFileChange} />

                    <Button type="submit" variant="contained" fullWidth disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? "Updating..." : "Update User"}
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
                        Cancel
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default EditUserModal;
