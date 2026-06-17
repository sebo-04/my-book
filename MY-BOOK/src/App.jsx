import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LibraryLanding from './Interfaces/LibraryLanding'; 
import LoginAndSign from './Interfaces/LoginAndSign'; 
import Home from './Interfaces/home'; 
import BookDetails from './Interfaces/book'; 
import LibraryManagement from './Interfaces/Librarymanagement'; 
import PersonalProfile from './Interfaces/Personalprofile'; 
import Users from './Interfaces/users'; 
import Statistics from './Interfaces/Statistics'; 
import Reading from './Interfaces/reading'; 
import Sidebar from './Interfaces/Sidebar'; 
function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ display: 'flex', minHeight: '100vh' }}>
       <Sidebar /> 
        <div className="main-content" style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/" element={<LibraryLanding />} />
            <Route path="/login" element={<LoginAndSign />} />
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/profile" element={<PersonalProfile />} />
            <Route path="/management" element={<LibraryManagement />} />
            <Route path="/users" element={<Users />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/reading/:id" element={<Reading />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;