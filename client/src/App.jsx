import './App.css';
import Dashboard from "./components/Dashboard"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';

function App() {
  return (
    <div >
     
       <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/api/stocks" replace />} />
             <Route path="/api/stocks" element={<Dashboard/>} />
          </Routes>
         </Router>
    </div>
  );
}

export default App;
