import { BrowserRouter as Router, Routes, Route } from "react-router";
import SideBarLayout from "../Side-Bar/Side-Bar-Layout";

function SideBarRoutes() {
  return (
    <Router>
      <Routes>
        {/* Routes that use the sidebar as the master layout */}
        <Route path="/side-bar" element={<SideBarLayout />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default SideBarRoutes;
