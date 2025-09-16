import { useEffect, useState } from "react";
import "./site-header.css";
import logo from "../assets/kruiz-logo.png";



type Props = {
  active?: "home" | "about" | "partner" | "shop" | "blog" | "cart";
};

export default function SiteHeader({ active = "shop" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner">
        <a className="logo-container" href="/">

          <img
            className="logo"
            src={logo}
            alt="Kruiz"
            height={28}
          />
        </a>

        <nav className="nav" aria-label="Main">

          <a href="#" className={active === "home" ? "is-active" : ""}>Home</a>
          <a href="#" className={active === "about" ? "is-active" : ""}>About Us</a>
          <a href="#" className={active === "partner" ? "is-active" : ""}>Partner Program</a>
          <a href="#" className={active === "shop" ? "is-active" : ""}>Shop</a>
          <a href="#" className={active === "blog" ? "is-active" : ""}>Blog</a>
          <a href="#" className={active === "cart" ? "is-active" : ""}>Cart</a>

        </nav>

        <div className="header-right">
          <button
            className={`hamburger ${menuOpen ? "is-active" : ""}`}
            //not rlly implemented (just shows an x)
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="#" className="download-now">Download Now</a>
        </div>
        {/* <a href="#" className="download-now" aria-label="Download Now">
          Download Now
        </a> */}
      </div>
    </header>
  );
}