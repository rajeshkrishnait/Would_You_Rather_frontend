import { useState } from "react";
import { MenuButton } from "./MenuButton";
import "../styles/Header.css";
import Modal from "./Modal";
import clearCache from '../assets/clear_cookies.png'
const Header = () => {
  const [open, setIsOpen] = useState(false);
  const menuButtonStyle = {
    marginLeft: "2rem",
  };
  const handleClearCache = ()=>{
    window.localStorage.clear();
    window.location.reload(); // Relo
  }
  return (
    <nav>
          <img title={'Clear LocalStorage'} src={clearCache} onClick={handleClearCache}/>
        <MenuButton
          isOpen={open}
          onClick={() => setIsOpen(!open)}
          strokeWidth={8}
          color="white"
          lineProps={{ strokeLinecap: "round" }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          width={50}
          height={50}
          style={menuButtonStyle}
        />

      <Modal setIsOpen={setIsOpen} isOpen={open} />
    </nav>
  );
};

export default Header;
