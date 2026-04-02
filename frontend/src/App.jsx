import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './component/Home';
import LoginSignup from './component/page/auth/LoginSignup';
import About from './component/page/About';
import Header from './component/Header';
import Footer from './component/Footer';
import HowItWorks from './component/page/HowItWorks';
import TrendingSwaps from './component/page/TrendingSwaps';
import AllSkills from './component/page/AllSkills';
import LearnPage from './component/page/LearnPage';
import EarnTokens from './component/page/EarnTokens';
import TeachPage from './component/page/TeachPage';
import ContactPage from './component/page/ContactPage';
import ExchangeMarket from './component/page/ExchangeMarket';
import UserDashboard from './component/page/UserDashboard';
import LiveClassroom from './component/page/LiveClassroom';
import ProfilePortfolio from './component/page/ProfilePortfolio';
import UpdateProfile from './component/page/UpdateProfile';
import Profile from './component/page/Profile';
import ContactFormsData from './component/page/ContactFormsData';
import ViewProfile from './component/page/ViewProfile';
import AddSkill from './component/page/pages/AddSkill';
import CreateRequest from './component/page/pages/CreateRequest';
import MentorRequests from './component/page/pages/MentorRequests';
import AddReview from './component/page/pages/AddReview';
import AllReviews from './component/page/pages/AllReviews';
import UserData from './component/page/pages/UserData';
import ChatRoomFetch from './component/page/pages/ChatRoomFetch';
import WelcomePage from './component/page/auth/WelcomePage';
import MaintenancePage from './component/page/auth/MaintenancePage';
import ChatDashboard from './component/page/pages/chat/ChatDashboard';

// Create a wrapper component to handle conditional header/footer
const Layout = ({ children }) => {
  const location = useLocation();

  const shouldHide =
    location.pathname === "/auth" ||
    location.pathname.startsWith("/chats");

  return (
    <>
      {!shouldHide && <Header />}
      <main>{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/auth' element={<LoginSignup />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />

          <Route path='/about' element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/trending-swaps" element={<TrendingSwaps />} />
          <Route path="/all-skills" element={<AllSkills />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/earn-tokens" element={<EarnTokens />} />
          <Route path="/teach" element={<TeachPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/market" element={<ExchangeMarket />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Profile/edit" element={<UpdateProfile />} />
          {/* <Route path="/classroom/:sessionId" element={<LiveClassroom />} /> */}
          <Route path="/user-profile/:user2Id" element={<ProfilePortfolio />} />

          {/* Admin Routes */}
          <Route path="/admin/contacts" element={<ContactFormsData />} />
          <Route path="/profile/:email" element={<ViewProfile />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/request/:mentorId/:skillId" element={<CreateRequest />} />
          <Route path="/mentor/requests" element={<MentorRequests />} />
          <Route path="/review/:userId" element={<AddReview />} />
          <Route path="/dashboard/reviews" element={<AllReviews />} />
          <Route path="/dashboard/users" element={<UserData />} />
          <Route path="/chat-room" element={<ChatRoomFetch />} />
          {/* <Route path="/notificationbar" element={<Notification />} /> */}
          {/* ✅ Main dashboard - handles everything */}
          <Route path="/chats" element={<ChatDashboard />} />
          <Route path="/chats/:roomId" element={<ChatDashboard />} />
          <Route path="/chats/:roomId/:userId" element={<ChatDashboard />} />
          {/* <Route path="/notifications" element={<NotificationsPage loggedInUser={loggedInUser} />} /> */}

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;