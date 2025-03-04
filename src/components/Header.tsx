import { useState } from "react";
import { MenuButton } from "./MenuButton";
import "../styles/Header.css";
import Modal from "./Modal";

const Header = () => {
  const [open, setIsOpen] = useState(false);
  const menuButtonStyle = {
    marginLeft: "2rem",
  };

  return (
    <nav>
      <MenuButton
        isOpen={open}
        onClick={() => setIsOpen(!open)}
        strokeWidth={8}
        color="#ff6666"
        lineProps={{ strokeLinecap: "round" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        width={50}
        height={64}
        style={menuButtonStyle}
      />
      <Modal setIsOpen={setIsOpen} isOpen={open} />
    </nav>
  );
};

export default Header;
