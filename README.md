# Would You Rather - Frontend

Would You Rather is an interactive web application where users vote between two options in a poll. Built with React, Redux, and TanStack Query, the app provides a seamless user experience with smooth navigation and state management.

## 🚀 Features
- Vote on thought-provoking 'Would You Rather' questions
- View poll results and community voting trends
- Infinite scrolling for a continuous question stream
- Optimized state management with Redux
- API-driven architecture for fetching questions and submitting votes

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Redux Toolkit, Reack-Hook-Form, Framer Motion
- **State Management:** Redux Toolkit, TanStack Query
- **Styling:** CSS
- **Backend:** [Would_You_Rather_backend](https://github.com/rajeshkrishnait/Would_You_Rather_backend) (Node/express)

## 📦 Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/rajeshkrishnait/Would_You_Rather_frontend.git
   cd Would_You_Rather_frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. The app should now be running at `http://localhost:5173/`

## ⚙️ Configuration
- The frontend interacts with a FastAPI backend.
- To configure API endpoints, update `src/config.js`:
  ```js
  export const API_BASE_URL = "http://localhost:8000/api";
  ```

## 🏗️ Project Structure
```
📦 src
 ┣ 📂components       # UI components
 ┣ 📂pages            # Application pages
 ┣ 📂redux            # Redux state management
 ┣ 📂services         # API interaction logic
 ┣ 📂utils            # Utility functions
 ┣ 📜App.tsx          # Main app component
 ┗ 📜main.tsx         # Entry point
```

## 📝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---
🚀 **Happy coding!** Feel free to open issues or suggestions for improvements.

