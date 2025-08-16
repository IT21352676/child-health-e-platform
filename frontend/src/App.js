import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddChildProfile from "./screens/addchildprofile";
import AppointmentScreen from "./screens/appointment";
import Blogs from "./screens/blog";
import ChildProfile from "./screens/childprofile";
import GrowthChartScreen from "./screens/growthscreen";
import HomePage from "./screens/homescreen";
import LoadingScreen from "./screens/loadingscreen";
import Profile from "./screens/profile";
import SelectDepartment from "./screens/selectdepartment";
import SignIn from "./screens/signin";
import SignUp from "./screens/signup";
import SplashScreen from "./screens/splashscreen";

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
