import { Route, Routes } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { BuilderPage } from "./pages/Builder";
import { DiscoverPage } from "./pages/Discover";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { ProfilePage } from "./pages/Profile";
import { SharePage } from "./pages/Share";
import { SignUpPage } from "./pages/SignUp";
import { WishlistPage } from "./pages/Wishlist";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/share/:itineraryId" element={<SharePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Shell>
  );
}
