// import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseButton } from "./CloseButton.tsx";
import '../styles/Notification.css'
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
