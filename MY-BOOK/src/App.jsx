import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LibraryLanding from './Interfaces/LibraryLanding'; 
import LoginAndSign from './Interfaces/LoginAndSign'; 
import Home from './Interfaces/home'; 
import BookDetails from './Interfaces/book'; 
import Librarymanagement from './Interfaces/Library management'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LibraryLanding />} />
          <Route path="/login" element={<LoginAndSign />} />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/management/:id" element={<Librarymanagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;