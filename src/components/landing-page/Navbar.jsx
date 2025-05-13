import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import MenuIcon from "../../assets/images/menu-icon.svg";

const Navbar = ({ hideLogin, loggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [navLinks, setNavLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      setNavLinks([
        { name: "Home", route: "/" },
        { name: "Pricing", route: "/pricing" },
        { name: "Account", route: "/user" },
      ]);
    } else {
      setNavLinks([
        { name: "Home", route: "/" },
        { name: "Pricing", route: "/pricing" },
        { name: "Login", route: "/login" },
      ]);
    }

    if (hideLogin) {
      setNavLinks([
        { name: "Home", route: "/" },
        { name: "Pricing", route: "/pricing" },
      ]);
    }
  }, [loggedIn, hideLogin]);

  // Close menu on route change (optional, for better UX)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div>
      <nav
        className="relative w-full flex flex-wrap items-center justify-between py-3 bg-white text-gray-200 border-b xl:border-none"
        style={{
          background: "white",
          color: "rgba(41, 47, 77, 1)",
          borderBottom: "2px solid #dfeeff"
          // borderColor: "#dfeeff",
          // borderBottomWidth: "2px",
        }}
      >
        <div
          className="container-fluid w-full flex flex-wrap items-center justify-end max-w-7xl m-auto"
          style={{ width: "95%", maxWidth: "1700px" }}
        >
          {/* Hamburger menu button (mobile only) */}
          <button
            className="navbar-toggler text-gray-200 border-0 hover:shadow-none hover:no-underline py-2 px-2.5 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none w-full flex justify-end md:hidden"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {Logo && <img src={Logo ? MenuIcon : undefined} alt="menu" style={{ height: "20px" }} />}
          </button>

          {/* Logo (desktop only) */}
          {Logo && (
            <>
              <img
                src={Logo ? Logo : undefined}
                alt="logo"
                style={{ width: "60px" }}
                onClick={() => navigate("/")}
                className="desktop-logo cursor-pointer hidden md:block"
              />
              <div>
                <p className="text-green-600 font-bold" style={{fontSize: 'x-large'}}>Tee Time</p>
                <p className="font-bold" style={{fontSize: 'large'}}>Radar</p>
              </div>
            </>
          )}

          {/* Nav links and CTA button */}
          <div
            className={clsx(
              "flex-grow items-center w-full md:flex md:w-auto",
              menuOpen ? "block" : "hidden",
              "md:block"
            )}
            style={{textAlign: 'right'}}
          >
            <ul
              className="navbar-nav flex flex-col md:flex-row pl-0 list-style-none ml-auto"
              style={{ marginRight: "20px" }}
            >
              {navLinks.map((linkObj, index) => (
                <li
                  key={index}
                  className="nav-item p-2 cursor-pointer"
                  onClick={() => {
                    navigate(linkObj.route);
                  }}
                >
                  <Link
                    to={linkObj.route}
                    className={clsx(
                      "nav-link text-xs xl:text-sm 2xl:text-base hover:text-blue-500 transition duration-100 ease-in-out",
                      location.pathname === linkObj.route &&
                        !(location.pathname !== "/" && linkObj.route === "/") &&
                        "text-blue-500"
                    )}
                    style={{
                      fontWeight: linkObj.name === "Login" && "900",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {linkObj.name}
                  </Link>
                  <span
                    className={clsx(
                      "nav-line bottom-0 bg-blue-500 transition-all ease-in-out duration-200",
                      location.pathname === linkObj.route &&
                        !(location.pathname !== "/" && linkObj.route === "/") &&
                        "active-nav delay-200"
                    )}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out justify-center"
              style={{
                padding: "14px 28px",
                width: "252px",
                height: "52px",
                // background: "#03314bcc",
                borderRadius: "12px",
                color: "#F5F8FD",
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "150%",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                navigate("/join");
              }}
            >
              SET UP ALERT NOW
            </button>
          </div>

          {/* Logo (mobile only, absolutely positioned) */}
          <div
            className="flex items-center relative md:hidden"
            style={{
              position: "absolute",
              left: "20px",
              top: "10px",
            }}
          >
            {Logo && (
              <img
                src={Logo ? Logo : undefined}
                alt="logo"
                className="pr-2"
                style={{ height: "45px" }}
              />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
