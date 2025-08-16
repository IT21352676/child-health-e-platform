import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SplashScreen from "./screens/splashscreen";
import LoadingScreen from "./screens/loadingscreen";
import HomePage from "./screens/homescreen";
import AppointmentScreen from "./screens/appointment";
import GrowthChartScreen from "./screens/growthscreen";
import Blogs from "./screens/blog";
import Profile from "./screens/profile";
import ChildProfile from "./screens/childprofile";
import AddChildProfile from "./screens/addchildprofile";
import SignIn from "./screens/signin";
import SignUp from "./screens/signup";
import SelectDepartment from "./screens/selectdepartment";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectDepartment />} />
        <Route path="/splashscreen" element={<SplashScreen />} />
        <Route path="/loadingscreen" element={<LoadingScreen />} />
        <Route path="/homescreen" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentScreen />} />
        <Route path="/growthscreen" element={<GrowthChartScreen />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/childprofile" element={<ChildProfile />} />
        <Route path="/addchildprofile" element={<AddChildProfile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
