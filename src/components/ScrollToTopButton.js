import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: visible ? "block" : "none",
        padding: "10px 15px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      ⬆ Top
    </button>
  );
}