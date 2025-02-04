import { useState } from "react";
import RegisterForm from "../components/RegistrationForm";
import EditUserModal from "../components/EditUserModal";
import { Box, Card, Button, Typography } from "@mui/material";

const Register = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const openEditModal = (userId) => {
        setSelectedUserId(userId);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedUserId(null);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
            <Card sx={{ padding: 3, maxWidth: 500 }}>
                <Typography variant="h4" align="center">Register</Typography>
                <RegisterForm />
            </Card>

            <Button sx={{ mt: 2 }} variant="contained" onClick={() => openEditModal("USER_ID_HERE")}>
                Edit User
            </Button>

            {isEditOpen && <EditUserModal userId={selectedUserId} onClose={closeEditModal} />}
        </Box>
    );
};

export default Register;
