import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <nav className="indigo">
        <div className="nav-wrapper">
          <div className="container">
            <a href="/" className="brand-logo">
              Testing
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
