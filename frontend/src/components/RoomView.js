import Sorting from './Sorting'
import './RoomView.css'
import Rooms from './Rooms'

const RoomView = () => {

    //Returns a sort component and all rooms in database
    return <>
        <Sorting type="left" />
        <Rooms hideUnbooked={false} />
    </>
}

export default RoomView