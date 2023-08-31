
import './App.css';
import Navbar from './components/Navbar';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import UserProfileEdit from './pages/secure/Profile';
import Main from './pages/public/Main';
import Proposals from "./pages/public/Proposals"
import PrivateRoute from './components/PrivateRoute';

function App() {


  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/proposals"
            element={<Proposals />}
          />
          <Route path="/profile" element={<PrivateRoute><UserProfileEdit /></PrivateRoute>} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;
