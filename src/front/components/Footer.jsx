import React from "react";

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#222",
        color: "#fff",
        textAlign: "center",
        padding: "1rem",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <p>© {new Date().getFullYear()} Mi App con Flask & React</p>
    </footer>
  );
};
