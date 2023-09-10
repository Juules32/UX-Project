const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require("body-parser")

const rooms_path = "rooms_db.json";
const users_path = "users_db.json";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let roomsDb = JSON.parse(fs.readFileSync(rooms_path));
let usersDb = JSON.parse(fs.readFileSync(users_path));

//Get request to get list of all rooms
app.get("/rooms", (req, res) => {
    let result = roomsDb.rooms;
    res.status(200).send(result);
})

//Get request to get list of rooms filtered with given parameters
app.get("/rooms/", (req, res) => {
    
})

//Helper function to get user from database
function getUser(mail) {
    return usersDb.users.find(entry => entry.mail == mail)
}

//Helper function to authenticate user. Returns user if mail and password match else return undefined
function authenticateUser(mail, password) {
    const user = getUser(mail);
    if(user !== undefined && user.password === password) return user;
    else return undefined;
}

//Post request to authenticate user
app.post("/login", (req, res) => {
    const foundUser = authenticateUser(req.body.mail, req.body.password)
    if(foundUser !== undefined) {
        res.status(200).json({
            "status": "success",
            "code": 200,
            "message": "Login Successful",
            "user": foundUser
        })
    }
    else res.status(401)
})

//Post request to authenticate user
app.post("/changeUser", (req, res) => {
    sendUserInformation(req.body.mail, res)
})

const sendUserInformation = (mail, res) => {
    const foundUser = getUser(mail)
    if (foundUser !== undefined) {
        res.status(200).json({
            "status": "success",
            "code": 200,
            "message": "Sending user information...",
            "user": foundUser
        })
    }
    else res.status(401)
}

// Post request to add user
app.post("/register", (req, res) => {
    // Get the user data from the request body
    const user = req.body;
    user.bookings = [];
    user.userid = usersDb.numberOfUsers;
    usersDb.numberOfUsers++;
  
    // Add the new user data to the existing data
    usersDb.users.push(user);
  
    // Write the updated data back to the file
    fs.writeFileSync('users_db.json', JSON.stringify(usersDb, null, 4));
  
    // Send a response indicating the successful addition of the user
    res.status(200).json({ message: 'User added successfully' });
});

//Get request to get bookings of user
app.get("/user/bookings", (req, res) => {
    const user = getUser(req.body.mail);
    if (user.password === req.body.password) {
        const bookings = user.bookings;
        res.status(200).send(bookings);
    }
    else res.sendStatus(401);
})

//Put request to add booking
app.put("/user/bookings", (req, res) => {
    const user = getUser(req.body.user.mail);
    if(user === undefined) return res.sendStatus(401)
    const userIndex = usersDb.users.findIndex(e => e.userid === user.userid)
    //The room id
    const roomid = req.body.roomid
    const start = req.body.startHour
    const end = req.body.endHour
    //Get index of room ind roomsDb
    const roomIndex = roomsDb.rooms.findIndex(e => e.roomid === roomid)
    //Check if room with given id exists
    if(roomIndex === -1) return res.sendStatus(400)
    //Check if user has acces to booking
    if(roomsDb.rooms[roomIndex].teacherOnly && user.type != "Teacher") return res.sendStatus(403)

    //Check if time slot is available
    let available = true
    for(let i = start; i < end; i++) {
        if(roomsDb.rooms[roomIndex].bookings.includes(i)) available = false;
    }
    if(!available) return res.sendStatus(400)
    //Write to rooms_db
    for(let i = start; i < end; i++) roomsDb.rooms[roomIndex].bookings.push(i)
    fs.writeFileSync('rooms_db.json', JSON.stringify(roomsDb, null, 4));

    //Write to users_db
    usersDb.users[userIndex].bookings.push({
        roomid: roomid,
        start: start,
        end: end
    })
    fs.writeFileSync('users_db.json', JSON.stringify(usersDb, null, 4))
    sendUserInformation(req.body.user.mail, res)
})

//Delete request to delete a booking of a user
app.delete("/user/bookings", (req, res) => {

    const user = getUser(req.body.user.mail)

    console.log(user)

    if(user === undefined) return res.sendStatus(401)

    const userIndex = usersDb.users.findIndex(e => e.userid === user.userid)

    //The room id
    const roomid = req.body.roomid
    const relevantBooking = req.body.user.bookings.find(booking => booking.roomid === roomid)
    
    //Starting hour of the booking, inclusive
    const start = relevantBooking.start

    //End hour of the booking, inclusive
    const end = relevantBooking.start

    const bookingIndex = user.bookings.findIndex(e => e.roomid === roomid)
    //Check that the user indeed has the booking
    if(bookingIndex === -1) return res.sendStatus(400)
    //Changes the booking at bookingIndex to the first element
    usersDb.users[userIndex].bookings[bookingIndex] = usersDb.users[userIndex].bookings[0]
    //Removes the first element
    usersDb.users[userIndex].bookings.shift()
    fs.writeFileSync('users_db.json', JSON.stringify(usersDb, null, 4))
    //Filter array to not have the booking time slots
    roomsDb.rooms[roomid].bookings = roomsDb.rooms[roomid].bookings.filter(hour => {
        if(hour >= start && hour <= end) false
        else true
    })
    fs.writeFileSync('rooms_db.json', JSON.stringify(roomsDb, null, 4));

    sendUserInformation(req.body.user.mail, res)
})

//Specifies the port to listen to
app.listen(8080, () => {
    console.log("Listening to port 8080");
})