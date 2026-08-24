import { Outlet } from 'react-router-dom';
import HomeNav from './HomeNav';
import PageBackground from './PageBackground';
import SiteFooter from './SiteFooter';

/**
 * Shared chrome for the real pages. The 404 sits outside this layout so it
 * renders as a bare full-viewport screen, with no nav, footer or backdrop.
 */
const SiteLayout = () => (
  <div className="relative bg-white">
    <PageBackground />
    <div className="relative z-10">
      <HomeNav />
      <Outlet />
      <SiteFooter />
    </div>
  </div>
);

export default SiteLayout;
