import axios from "axios";

const API = axios.create({
    baseURL: "https://my-skill-swap-backend-production.up.railway.app/api",
    // baseURL: "http://localhost:1213/api",
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
// export const updateUser = (userId, data) => API.put(`/users/user/${userId}`, data);//
export const updateProfile = (data) => API.put(`/users/me`, data);
export const getUserById = (id) => API.get(`/users/profile/${id}`);
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
export const createSwapSession = (user2Id, data) => API.post(`/sessions/create/${user2Id}`, data);
export const getAllSessions = () => API.get("/sessions");
// export const getSessionBetweenUsers = (user1Id, user2Id) => API.get(`/sessions/session-between?user1Id=${user1Id}&user2Id=${user2Id}`);
export const getSessionBetweenUsers = (user1Id, user2Id) =>
    API.get(`/sessions/between/${user1Id}/${user2Id}`);
export const getSessionById = (sessionId) => API.get(`/sessions/${sessionId}`);
export const updateSessionStatus = (sessionId, status) => API.put(`/sessions/updateStatus/${sessionId}?status=${status}`);
export const getMyLearningSessions = () => API.get("/sessions/my-learning");
export const getMyTeachingSessions = () => API.get("/sessions/my-teaching");
export const deleteSession = (sessionId) => API.delete(`/sessions/delete/${sessionId}`);

// ================= CONTACT FORM =================
export const sendContactMessage = (data) => API.post(`/contact/create`, data);
export const getAllContactMessages = () => API.get(`/contact/all`);
export const deleteContact = (contactId) => API.delete(`/contact/delete/${contactId}`);

// ================= CHAT FORM =================
// export const createChatRoom = (data) => API.post("/chat/create-room", data);
// export const getRoomBySession = (swapSessionId) => API.get(`/chat/room/${swapSessionId}`);
// export const sendMessage = (data) => API.post("/chat/send", data);
// export const getChatMessages = (roomId) => API.get(`/chat/messages/${roomId}`);
// export const getAllRooms = () => API.get("/chat/rooms");
// export const deleteRoom = (roomId) => API.delete(`/chat/delete-room/${roomId}`);
// export const deleteMessage = (chatId) => API.delete(`/chat/delete/${chatId}`);
// export const getUserChatRooms = () => API.get("/chat/chats/rooms");

// ✅ Create Chat Room (Note: userBId is passed as a query param)
export const createChatRoom = (userBId) => API.post(`/chat/create-room?userBId=${userBId}`);
// ✅ Accept / Reject Requests
export const acceptChatRequest = (roomId) => API.put(`/chat/accept/${roomId}`);
export const rejectChatRequest = (roomId) => API.put(`/chat/reject/${roomId}`);
// ✅ Fetching Rooms
export const getPendingRequests = () => API.get("/chat/pending");
export const getAcceptedChatRooms = () => getLoginUserRooms();
// export const getAcceptedChatRooms = () => API.get("/chat/all-rooms");
export const getLastChatRooms = () => API.get("/chat/last-message");
export const getLoginUserRooms = () => API.get("/chat/my-chat-rooms");
// ✅ Messaging
export const getMessages = (roomId) => API.get(`/chat/messages/${roomId}`);
export const sendMessage = (messageData) => API.post("/chat/send", messageData);
// 🔥 DELETE FOR EVERYONE
export const deleteForEveryone = (chatId) => API.delete(`/chat/delete/everyone/${chatId}`);
// 🔥 DELETE FOR ME
export const deleteForMe = (chatId) => API.delete(`/chat/delete/me/${chatId}`);

export default API;