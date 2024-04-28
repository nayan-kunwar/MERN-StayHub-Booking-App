import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
// import ManageHotelForm from "./forms/ManageHotelForm/ManageHotelForm";  
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><p>Home Page</p></Layout>} />
        <Route path="/search" element={<Layout><p>Search Page</p></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/sign-in" element={<Layout><SignIn /></Layout>} />
        {isLoggedIn &&
          <>
            <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
            <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
          </>}
        <Route path="*" element={<Navigate to="/" />} /> {/*If user visit any endpoint other than above mentioned navigate user to Home Page */}
      </Routes>
    </Router>
  )
}

export default App;
