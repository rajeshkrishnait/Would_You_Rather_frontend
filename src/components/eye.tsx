import { useState, useEffect, useRef } from "react";
import "../styles/eye.css"; // Make sure this file contains your styles

const Eye = () => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [lidPosition, setLidPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!eyeRef.current) return;
      const eye = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;
      
      // Get mouse position relative to the eye
      const deltaX = event.clientX - eyeCenterX;
      const deltaY = event.clientY - eyeCenterY;
      
      // Limit movement range for a realistic effect
      const maxMove = 12; // Maximum movement in any direction
      const eyeMoveX = Math.min(Math.max(deltaX / 10, -maxMove), maxMove);
      const eyeMoveY = Math.min(Math.max(deltaY / 10, -maxMove), maxMove);

      const lidMoveX = Math.min(Math.max(deltaX / 20, -maxMove / 2), maxMove / 2);
      const lidMoveY = Math.min(Math.max(deltaY / 15, -maxMove / 2), maxMove / 2);

      setEyePosition({ x: eyeMoveX, y: eyeMoveY });
      setLidPosition({ x: lidMoveX, y: lidMoveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="eyeContainer">
      <div
        className="eyeLid"
        ref={lidRef}
        style={{ transform: `translate(${lidPosition.x}px, ${lidPosition.y}px)` }}
      >
        <div
          className="eyes"
          ref={eyeRef}
          style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}
        >
          <div className="eye"></div>
        </div>
      </div>
    </div>
  );
};

export default Eye;
