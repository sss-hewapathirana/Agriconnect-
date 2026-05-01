import React from 'react';
import { UserButton, useUser, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Sprout, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Sprout className="logo-icon" />
          <span>Agriconnect</span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/farmers" className="nav-link">Find Farmers</Link>
          <Link to="/products" className="nav-link">Marketplace</Link>
          
          <SignedIn>
            <Link to="/dashboard" className="nav-link dashboard-btn">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="login-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>

        <button className="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
