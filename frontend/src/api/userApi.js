import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async(formData) =>{
    try{
        const response = await axios.post(`${API_URL}/api/users/register`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return response.data;
    }catch(error){
        throw error.response?.data?.message || 'Registration Failed';
    }
};


export const getUserSession = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/users/session`, { withCredentials: true });
        return response.data; 
    } catch (error) {
        return null; 
    }
};

export const loginUser = async(data) => {
    const response = await axios.post(`${API_URL}/api/users/login`, data, {withCredentials: true});
    return response.data;
};

export const logoutUser = async() => {
    await axios.post(`${API_URL}${import.meta.env.VITE_LOGOUT}`, {}, {withCredentials: true});
};

const getAuthToken = () => localStorage.getItem("token");

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/api/users/users`, { withCredentials: true });
    return response.data;
};

export const updateUser = async (id, formData) => {
    const response = await axios.put(`${API_URL}/api/users/users/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};