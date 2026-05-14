import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LibraryLanding from './Interfaces/LibraryLanding'; 
import LoginAndSign from './Interfaces/LoginAndSign'; // استيراد صفحة الدخول

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* الصفحة الرئيسية (المكتبة) */}
          <Route path="/" element={<LibraryLanding />} />
          
          {/* صفحة تسجيل الدخول */}
      <Route path="/login" element={<LoginAndSign />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;