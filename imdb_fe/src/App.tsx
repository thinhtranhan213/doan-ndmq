
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import GenrePage from './pages/GenrePage/GenrePage';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Search from './pages/Search/Search';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      {/* <div className="min-h-screen bg-imdb-dark pt-16"> */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Layout>

      {/* </div> */}
    </BrowserRouter>
  );
};

export default App;
