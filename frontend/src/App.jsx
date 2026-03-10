import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './component/Home';
import LoginSignup from './component/page/auth/LoginSignup';
import About from './component/page/About';
import Header from './component/Header';
import Footer from './component/Footer';
import HowItWorks from './component/page/HowItWorks';

// Create a wrapper component to handle conditional header/footer
const Layout = ({ children }) => {
  const location = useLocation();

  // Paths where Header/Footer should be hidden
  const hideHeaderFooter = ["/auth"];

  const shouldHide = hideHeaderFooter.includes(location.pathname);

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
          <Route path='/about' element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;