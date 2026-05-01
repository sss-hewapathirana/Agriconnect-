import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Agriconnect. Bridging the gap between farmers and sellers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
