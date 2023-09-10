import { AppContext } from '../AppContext'
import { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import './Sorting.css'

const Sorting = (props) => {
    const { isMobileView, rooms, setVisibleRooms } = useContext(AppContext)

    //Currently selected options and requirements
    const [selectedSortOption, setSelectedSortOption] = useState('capacity')
    const [selectedOrderOption, setSelectedOrderOption] = useState('descending')
    const [selectedRequirements, setSelectedRequirements] = useState([])

    const handleSelectedSortOption = (e) => {
        setSelectedSortOption(e.target.value);
    };

    const handleSelectedOrderOption = (e) => {
        setSelectedOrderOption(e.target.value);
    };

    const handleSelectedRequirements = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        setSelectedRequirements((prevOptions) => {
            if (isChecked) {
                //Adds value at the end of the list
                return [...prevOptions, value];
            } else {
                //Updates list to keep everything but value
                return prevOptions.filter((option) => option !== value);
            }
        });
    };

    //When page is reloaded, set visible rooms to selected options
    useEffect(() => {
        setVisibleRooms(
            customSort(
                roomsThatHave(rooms, selectedRequirements),
                selectedSortOption, selectedOrderOption
            )
        )
    }, [rooms])

    //Update visible rooms when form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();

        setVisibleRooms(
            customSort(
                roomsThatHave(rooms, selectedRequirements),
                selectedSortOption, selectedOrderOption
            )
        )
    }

    //Filters out rooms from requirements
    const roomsThatHave = (rooms, requirements) => {
        let foundMatches = []
        for (let i = 0; i < rooms.length; i++) {
            if (requirements.includes('audioVideo') && rooms[i].audioVideo == false) continue;
            if (requirements.includes('blackboard') && rooms[i].blackboard == false) continue;
            else foundMatches.push(rooms[i])
        }
        return foundMatches
    }

    //Sorts rooms based on option and order
    const customSort = (rooms, sortOption, order) => {
        if (sortOption == "name") {
            return rooms.sort((a, b) => {
                return (order == "ascending" ?
                    a.name.localeCompare(b.name) :
                    b.name.localeCompare(a.name)
                )
            })
        }

        else if (sortOption == "room type") {
            return rooms.sort((a, b) => {
                return (order == "ascending" ?
                    a.type.localeCompare(b.type) :
                    b.type.localeCompare(a.type)
                )
            })

        }

        else if (sortOption == "capacity") {
            return rooms.sort((a, b) => {
                return (order == "ascending" ?
                    a.capacity - b.capacity :
                    b.capacity - a.capacity
                )
            })
        }
    }

    //Returns a form containing a mix of radio and checkbox fields
    return <>
        {!(props.type == "left" && isMobileView) &&
            <div className={props.type == "left" ? 'd-flex flex-column sort-parent p-3 shadow bg-white rounded' : ''}>
                <h5>Sort by:</h5>
                <Form onSubmit={handleSubmit} className='children'>
                    <Form.Check
                        type="radio"
                        label="Capacity"
                        name="radioGroup1"
                        value="capacity"
                        checked={selectedSortOption === 'capacity'}
                        onChange={handleSelectedSortOption}
                    />
                    <Form.Check
                        type="radio"
                        label="Name"
                        name="radioGroup1"
                        value="name"
                        checked={selectedSortOption === 'name'}
                        onChange={handleSelectedSortOption}
                    />
                    <Form.Check
                        type="radio"
                        label="Room Type"
                        name="radioGroup1"
                        value="room type"
                        checked={selectedSortOption === 'room type'}
                        onChange={handleSelectedSortOption}
                    />
                    <h5>Sort order:</h5>
                    <Form.Check
                        type="radio"
                        label="Ascending"
                        name="radioGroup2"
                        value="ascending"
                        checked={selectedOrderOption === 'ascending'}
                        onChange={handleSelectedOrderOption}
                    />
                    <Form.Check
                        type="radio"
                        label="Descending"
                        name="radioGroup2"
                        value="descending"
                        checked={selectedOrderOption === 'descending'}
                        onChange={handleSelectedOrderOption}
                    />
                    <h5>Rooms must have:</h5>
                    <Form.Check
                        type="checkbox"
                        label="Audio-Video"
                        name="checkboxgroup1"
                        value="audioVideo"
                        checked={selectedRequirements.includes('audioVideo')}
                        onChange={handleSelectedRequirements}
                    />
                    <Form.Check
                        type="checkbox"
                        label="Blackboard"
                        name="checkboxgroup1"
                        value="blackboard"
                        checked={selectedRequirements.includes('blackboard')}
                        onChange={handleSelectedRequirements}
                    />
                    <button type="submit" className="btn btn-primary btn-lg">Submit</button>
                </Form>
            </div>
        }
    </>
}

export default Sorting