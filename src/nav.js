import React from "react";
import { NavLink, Link } from "react-router-dom";
import AvatarLogo from "./assets/27356e86-442d-4f8e-96be-3e48cba26b0c.jpg";
import "./nav.css"; // Import your CSS file
import Logo from "./assets/three (1).png";

import Logo3 from "./assets/img100.png";
import Logo4 from "./assets/logo120.png";
import Logo5 from "./assets/logo121.png";
const Nav = ({ handleLogout }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    //window.location.href = "/login";
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-black fixed-top p-0 ">
        <div>
          <img src={Logo4} className="img-fluid imgh" />
        </div>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            <img
              src={AvatarLogo}
              alt="Avatar Logo"
              style={{ width: "50px" }}
              className="rounded-pill"
            />
          </Link>
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link text-light fw-semibold "
                  to="/home"
                  activeClassName="active"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link text-light fw-semibold "
                  to="/devotees"
                  activeClassName="active"
                >
                  Devotees
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link text-light fw-semibold "
                  to="/courses"
                  activeClassName="active"
                >
                  Courses
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link text-light fw-semibold "
                  to="/donation"
                  activeClassName="active"
                >
                  Donation
                </NavLink>
              </li>
            </ul>
            <form className="d-flex">
              <a
                className="nav-link "
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
              >
                <img src={Logo} className="btn-sm shadow  rounded  img-fluid sun" />
              </a>
            </form>
          </div>
        </div>
        <div>
          <img src={Logo5} className="img-fluid imgh" />
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-end bg-black flex-lg-column "
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title text-secondary  fw-bold "
            id="offcanvasExampleLabel"
          >
            SIVA KUNDALINI SADHANA
            
          </h5>
          <button
            type="button"
            className="btn-close text-reset bg-light"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body pb-0 ">
          <div className="d-grid">
            <NavLink
              to="/register"
              className="btn btn-light rounded shadow fw-bold   "
              activeClassName="active"
            >
              Devotees Register
            </NavLink>
            <br />
            {/* <button
              type="button"
              className="btn btn-light rounded-pill"
              onClick={handleLogoutClick}
            >
              Logout
            </button> */}
            <NavLink to="/login" className="d-grid" activeClassName="active">
              <button
                type="button"
                className="btn btn-light rounded shadow fw-bold "
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </NavLink>
            <div>
              <img src={Logo3} className="img-fluid hi" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
