import { Outlet } from 'react-router-dom';
import MouseFollower from './fx/MouseFollower';
import RouteFade from './fx/RouteFade';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

/**
 * Chrome shared by every real route. The 404 renders outside this on
 * purpose, so a dead link does not get a working nav bar around it.
 *
 * The header is fixed rather than sticky: it has to sit *over* the bands so
 * it can read the theme of whichever one is beneath it, which a sticky bar
 * in normal flow cannot do.
 *
 * The cursor pill is mounted once, here, and listens at the document. Any
 * element anywhere in the tree can drive it by carrying data-mouse-content,
 * which keeps the effect out of the components that use it.
 */
const SiteLayout = () => (
  <div className="relative min-h-[100svh]">
    <SiteHeader />
    <RouteFade>
      <Outlet />
    </RouteFade>
    <SiteFooter />
    <MouseFollower />
  </div>
);

export default SiteLayout;
