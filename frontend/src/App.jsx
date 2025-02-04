import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useUserStore from "./store/userStore";
import { useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

const App = () => {
    const { user, fetchSession, isLoading } = useUserStore();

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
