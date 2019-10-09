import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false
    };
  }
  render() {
    return (
      <nav className="indigo">
        <div className="nav-wrapper">
          <div className="container">
            <a href="/" className="brand-logo">
              Testing
            </a>
            <ul className="right">
              {this.state.isAuthenticated ? (
                <li>
                  <Link
                    to="/logout"
                    onClick={e => {
                      this.setState({
                        isAuthenticated: false
                      });
                    }}
                  >
                    {" "}
                    Logout
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="login"
                    onClick={e => {
                      this.setState({
                        isAuthenticated: true
                      });
                    }}
                  >
                    {" "}
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
