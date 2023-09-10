import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import RoomView from './components/RoomView';
import UserPage from './components/UserPage';
import Navigation from './components/Navigation'

function App() {

    return <>
        <BrowserRouter>
            <div>
                <Navigation />
                <div >
                    <Routes>
                        <Route
                            exact path="/"
                            element={<RoomView/>}
                        />
                        <Route
                            exact path="/login"
                            element={<Login/>}
                        />
                        <Route
                            exact path="/rooms"
                            element={<RoomView/>}
                        />
                        <Route
                            exact path="/userPage"
                            element={<UserPage/>}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    </>
}

export default App;
