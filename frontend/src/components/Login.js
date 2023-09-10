import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import './Login.css'
import { Dropdown, DropdownButton } from 'react-bootstrap';

const Login = () => {

    const navigate = useNavigate();

    //States are initialized with '' to avoid undefined starting values
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    //Login is set as default view
    const [register, setRegister] = useState(false);

    //Uses wrapping component AppContext to updateisMobileView across all components
    const { isMobileView, setUser } = useContext(AppContext)

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRepeatedPasswordChange = (e) => setRepeatedPassword(e.target.value);

    //Switches back and forth between login and register view and attempts to make new user
    const toggleRegister = () => {
        setRegister(!register)
    };

    const [selectedType, setSelectedType] = useState("");

    const handleDropdownSelect = (eventKey) => {
        setSelectedType(eventKey);
    };

    //Tries to find login match in users_db.json
    const handleLogin = async (e) => {

        //Prevents page from reloading on form submission
        e.preventDefault();

        if (!loginIsValid()) return;

        //Prevents null or empty values
        const userData = {
            "mail": email,
            "password": password
        }

        try {
            // Send a POST request to the server with userData
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                console.log('Found match, logging in...');

                //Change current user
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))

                //Redirect to a different page
                navigate('/rooms')
            } else {
                console.error('Error logging in:', response.status);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const guestLogin = () => {
        localStorage.removeItem('user')
        setUser(null)
        navigate('/rooms')
    }

    //Helper function for checking validity of login input
    const loginIsValid = () => {
        if (email == '' || password == '') {
            console.log("Empty input field")
            return false
        }
        if (!email.includes("@") || !email.includes(".")) {
            console.log("Mail doesn't contain either an '@' or a '.'")
            return false
        }

        console.log("Valid inputs")
        return true
    }

    //Tries to register new user in users_db.json
    const handleRegister = async (e) => {

        //Prevents page from reloading on form submission
        e.preventDefault();

        if (!newUserInformationIsValid()) return;

        const userData = {
            name: name,
            mail: email,
            password: password,
            type: selectedType == "" ? "Other" : selectedType
        }

        try {
            // Send a POST request to the server with userData
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('User created successfully');
                toggleRegister()
            } else {
                console.error('Error creating user:', response.status);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    //Helper function for checking validity of register input
    const newUserInformationIsValid = () => {
        if (email == '' || password == '' || repeatedPassword == '' || name == '') {
            console.log("Empty input field")
            return false
        }
        if (password != repeatedPassword) {
            console.log("Passwords do not match")

            return false
        }
        if (!email.includes("@") || !email.includes(".")) {
            console.log("Mail doesn't contain either an '@' or a '.'")

            return false
        }

        console.log("Valid inputs")
        return true
    }

    //Dynamically shows the mobile view or the desktop view based on isMobileView
    return (
        <section className={"vh-100 position-absolute top-0 w-100 h-100 ml-n200"}>

            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    {!isMobileView &&
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                                className="img-fluid img" alt="Sample image" />
                        </div>

                    }
                    {/* If on login view */}
                    {!register ?
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <div className="header">
                                Welcome to <br /> ITU Booking
                            </div>
                            <form onSubmit={handleLogin}>

                                <div className="form-outline mb-4">
                                    <input type="email" id="email" className="form-control form-control-lg"
                                        placeholder="Enter a valid email address"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="password" className="form-control form-control-lg"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={handlePasswordChange} />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check mb-0">
                                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                        <label className="form-check-label" htmlFor="form2Example3">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#!" className="text-body">Forgot password?</a>
                                </div>

                                <div className="text-lg-start mt-4 pt-2">
                                    <div className='d-flex justify-content-between'>

                                        <button type="submit" className="wide btn btn-primary btn-lg login custom-padding">Login</button>
                                        <button onClick={guestLogin} className="wide btn btn-primary btn-lg login custom-padding">Guest View</button>
                                    </div>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a onClick={toggleRegister}
                                        href="#" className="link-danger">Register</a></p>
                                </div>

                            </form>
                        </div> :

                        /* If on register view */
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <div className="header">
                                Create a New User
                            </div>
                            <form onSubmit={handleRegister}>

                                <div className="form-outline mb-4">
                                    <input type="name" id="name" className="form-control form-control-lg"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="email" id="email" className="form-control form-control-lg"
                                        placeholder="Enter a new email address"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="password" className="form-control form-control-lg"
                                        placeholder="Enter a new password"
                                        value={password}
                                        onChange={handlePasswordChange} />
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="repeatedPassword" className="form-control form-control-lg"
                                        placeholder="Repeat the password"
                                        value={repeatedPassword}
                                        onChange={handleRepeatedPasswordChange} />
                                </div>

                                <div className="text-lg-start mb-4 custom-button">
                                    <div className='d-flex justify-content-between'>
                                        <DropdownButton className="text-lg mb-4 custom-button"
                                            title={selectedType || 'Select Role'}
                                            onSelect={handleDropdownSelect}
                                        >
                                            <Dropdown.Item eventKey="Teacher">Teacher</Dropdown.Item>
                                            <Dropdown.Item eventKey="Student">Student</Dropdown.Item>
                                            <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
                                        </DropdownButton>
                                        <button type="submit" className="btn btn-primary btn-lg login custom-button2">Create User</button>

                                    </div>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a onClick={toggleRegister}
                                        href="#" className="link-danger">Back to Login</a></p>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </section>
    );
};

export default Login;