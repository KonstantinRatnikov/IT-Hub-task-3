import './App.css';

import { Home } from './Home/Home';
import { SignIn } from './SignIn/SignIn';
import { SignUp } from './SignUp/signup';
import { Navigation } from './Navigation';
import { NotesList } from './NotesList/noteslist';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
function App() {
  return (
    <div className="container">
    <BrowserRouter>

    <Navigation/>

    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/NotesList" element={<NotesList />} />
     </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
