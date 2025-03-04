import { motion, AnimatePresence } from "framer-motion";
import "../styles/modal.css";
import NewQuestionForm from "./NewQuestionForm";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const overlayVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: 0.3,
        delayChildren: 0.4,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        duration: 0.3,
        delay: 0.4,
      },
    },
  };

  return (
    <div className="App">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="modal-overlay"
          >
            <motion.div
              className="modal"
              initial={{ y: "100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              transition={{ duration: 0.5 }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Submit Your Own Questions!!</h5>
              </div>
              <NewQuestionForm />
              <div className="modal-footer">
                <button
                  className="modal-button"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modal;
