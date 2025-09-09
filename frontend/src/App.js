import { Navigate,Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Layout/Login';
import Register from './Layout/Register';
import Home from './Layout/Home';
import { useState } from 'react';
import RefrshHandler from './Validation/refresh_handler';
import ForgotPassword from './Layout/ForgotPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }
  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;
