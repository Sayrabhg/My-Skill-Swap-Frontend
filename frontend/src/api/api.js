import axios from "axios";

const API = axios.create({
    baseURL: "https://my-skill-swap-backend-production.up.railway.app/api",
    // baseURL: "https://localhost:1213/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ================= AUTH =================
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/signup", data);

// ================= USERS =================
export const getProfile = () => API.get(`/users/me`);
export const updateProfile = (data) => API.put(`/users/me`, data);
export const deleteProfile = () => API.delete(`/users/me`);

// ================= SKILLS =================
export const createSkill = (data) => API.post(`/skills/add`, data);
export const getAllSkills = () => API.get(`/skills/all`);
export const getSkillsBySkillsId = (skillsId) => API.get(`/skills/skill/${skillsId}`);
export const getSkillsByUserId = (userId) => API.get(`/skills/user/${userId}`);
export const deleteSkill = (skillId) => API.delete(`/skills/delete/${skillId}`);

// ================= ADMIN =================
export const getAllUsers = () => API.get(`/debug/users`);
export const getUserByEmail = (email) => API.get(`/debug/user/${email}`);
export const deleteUserByEmail = (email) => API.delete(`/debug/user/${email}`);
export const createAdmin = (data) => API.post(`/debug/create-admin`, data);

// ================= REVIEWS =================
export const addReview = (data, userId) => API.post(`/reviews/add/${userId}`, data);
export const getAllReviewsByUserId = (userId) => API.get(`/reviews/user/${userId}`);
export const getAllReviews = () => API.get(`/reviews/all`);
export const deleteReviewById = (reviewId) => API.delete(`/reviews/${reviewId}`);
export const getReviewsAverageByUserId = (userId) => API.get(`/reviews/average/${userId}`); // ensure backend has /average endpoint

// ================= TOKEN WALLET =================
export const getWallet = (userId) => API.get(`/wallet/${userId}`);
export const createTokens = (userId) => API.post(`/wallet/create/${userId}`);
export const addTokens = (userId, amount) => API.put(`/wallet/add/${userId}`, { amount });
export const spendTokens = (userId, amount) => API.put(`/wallet/spend/${userId}`, { amount });

// ================= SKILL REQUEST =================
export const createRequest = (data, mentorId) => API.post(`/requests/send/${mentorId}`, data);
export const getRequestsByMentorId = (mentorId) => API.get(`/requests/mentor/${mentorId}`);
export const acceptRequest = (requestId) => API.put(`/requests/accept/${requestId}`);
export const rejectRequest = (requestId) => API.put(`/requests/reject/${requestId}`); // PUT matches backend action

// ================= SWAP SESSION =================
export const createSwapSession = (swapUserId, sessionData) => API.post(`/sessions/create/${swapUserId}`, sessionData);
export const getMySwapSessions = () => API.get(`/sessions/my-sessions`);
export const getAllSwapSessions = () => API.get(`/sessions/all`);
export const updateSwapSessionStatus = (sessionId, status) => API.put(`/sessions/updateStatus/${sessionId}?status=${status}`);
export const deleteExpiredSessions = () => API.delete(`/sessions/deleteExpired`);

// ================= CONTACT FORM =================
export const sendContactMessage = (data) => API.post(`/contact/create`, data);
export const getAllContactMessages = () => API.get(`/contact/all`);
export const deleteContact = (contactId) => API.delete(`/contact/delete/${contactId}`);

// ================= CHAT FORM =================
export const createChatRoom = (data) => API.post("/chat/create-room", data);
export const getChatRoom = (swapSessionId) => API.get(`/chat/room/${swapSessionId}`);
export const sendMessage = (data) => API.post("/chat/send", data);
export const getChatMessages = (roomId) => API.get(`/chat/messages/${roomId}`);
export const deleteMessage = (chatId) => API.delete(`/chat/delete/${chatId}`);

export default API;