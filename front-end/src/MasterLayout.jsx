import { Outlet, useLocation } from 'react-router';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

function MasterLayout() {
  const location = useLocation();
  const isSidebarRoute = location.pathname.startsWith('/side-bar');

  return (
    <>
      {!isSidebarRoute && <Header />}
      <Outlet />
      {!isSidebarRoute && <Footer />}
    </>
  );
}

export default MasterLayout;