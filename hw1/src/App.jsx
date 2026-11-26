import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import RootLayout from './layouts/RootLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import GallerySkeleton from './components/GallerySkeleton.jsx';

const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<GallerySkeleton />}>
              <GalleryPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
