// import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseButton } from "./CloseButton.tsx";
import '../styles/Notification.css'
import ScrollIcon from '../assets/scroll_icon.jpg'
import rightArrow from '../assets/right_arrow_key.jpg'
import LeftArrow from '../assets/keyboard_key_left.png'
const Notification = () => {
  const [notifications, setNotifications] = useState(true);
  useEffect(()=>{
    setTimeout(()=>{
        setNotifications(false)
    }, 4000)
  })
  return (
    <div className="container">
      <ul>
        <AnimatePresence initial={false} mode="popLayout">
          {notifications &&
            <motion.li
              key={0}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
                <div className="container__controller">                
                    <img src={ScrollIcon}/>
                    <img src={rightArrow}/>
                    <img src={LeftArrow}/>
                    <span>Use these to Switch between cards</span></div>

              <CloseButton
                close={() => setNotifications(false)}
              />
            </motion.li>
        }
        </AnimatePresence>
      </ul>
    </div>
  );
};
export default Notification;
