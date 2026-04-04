import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import Loading from './component/page/components/Loading';

// Lazy imports
const Home = lazy(() => import('./component/Home'));
const LoginSignup = lazy(() => import('./component/page/auth/LoginSignup'));
const About = lazy(() => import('./component/page/About'));
const HowItWorks = lazy(() => import('./component/page/HowItWorks'));
const TrendingSwaps = lazy(() => import('./component/page/TrendingSwaps'));
const AllSkills = lazy(() => import('./component/page/AllSkills'));
const LearnPage = lazy(() => import('./component/page/LearnPage'));
const EarnTokens = lazy(() => import('./component/page/EarnTokens'));
const TeachPage = lazy(() => import('./component/page/TeachPage'));
const ContactPage = lazy(() => import('./component/page/ContactPage'));
const ExchangeMarket = lazy(() => import('./component/page/ExchangeMarket'));
const UserDashboard = lazy(() => import('./component/page/UserDashboard'));
const Profile = lazy(() => import('./component/page/Profile'));
const UpdateProfile = lazy(() => import('./component/page/UpdateProfile'));
const ProfilePortfolio = lazy(() => import('./component/page/ProfilePortfolio'));

const ContactFormsData = lazy(() => import('./component/page/ContactFormsData'));
const ViewProfile = lazy(() => import('./component/page/ViewProfile'));
const AddSkill = lazy(() => import('./component/page/pages/AddSkill'));
const CreateRequest = lazy(() => import('./component/page/pages/CreateRequest'));
const MentorRequests = lazy(() => import('./component/page/pages/MentorRequests'));
const AddReview = lazy(() => import('./component/page/pages/AddReview'));
const AllReviews = lazy(() => import('./component/page/pages/AllReviews'));
const UserData = lazy(() => import('./component/page/pages/UserData'));
const ChatRoomFetch = lazy(() => import('./component/page/pages/ChatRoomFetch'));

const WelcomePage = lazy(() => import('./component/page/auth/WelcomePage'));
const MaintenancePage = lazy(() => import('./component/page/auth/MaintenancePage'));
const ChatDashboard = lazy(() => import('./component/page/pages/chat/ChatDashboard'));


// Layout wrapper
const Layout = ({ children }) => {
  const location = useLocation();

  const shouldHide =
    location.pathname === "/auth" ||
    location.pathname === "/welcome" ||
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
        {/* Suspense fallback loader */}
        <Suspense fallback={<Loading />}>
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
            <Route path="/user-profile/:user2Id" element={<ProfilePortfolio />} />

            {/* Admin */}
            <Route path="/admin/contacts" element={<ContactFormsData />} />
            <Route path="/profile/:email" element={<ViewProfile />} />
            <Route path="/add-skill" element={<AddSkill />} />
            <Route path="/request/:mentorId/:skillId" element={<CreateRequest />} />
            <Route path="/mentor/requests" element={<MentorRequests />} />
            <Route path="/review/:userId" element={<AddReview />} />
            <Route path="/dashboard/reviews" element={<AllReviews />} />
            <Route path="/dashboard/users" element={<UserData />} />
            <Route path="/chat-room" element={<ChatRoomFetch />} />

            {/* Chat */}
            <Route path="/chats" element={<ChatDashboard />} />
            <Route path="/chats/:roomId" element={<ChatDashboard />} />
            <Route path="/chats/:roomId/:userId" element={<ChatDashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;