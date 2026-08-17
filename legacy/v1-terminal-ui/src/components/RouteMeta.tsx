import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeMeta, fallbackMeta, siteMeta, siteUrl } from '../data/site';

/**
 * Keeps <title>, the meta description and the canonical/OG URLs in sync with
 * the active route. Without this every route in the SPA shares the landing
 * page's title, which hurts browser history, bookmarks and search results.
 */
const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta[pathname] ?? fallbackMeta;
    const title =
      pathname === '/' ? meta.title : `${meta.title} — ${siteMeta.name}`;
    const url = `${siteUrl}${pathname === '/' ? '/' : pathname}`;

    document.title = title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
  }, [pathname]);

  return null;
};

export default RouteMeta;
