
import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const [valueInput, setValueInput] = useState("")
    const [dataCountriesApi, setDataCountriesApi] = useState([])
    const [error, setError] = useState(false)
    const [fetchError, setFetchError] = useState(false)


    const [capital, setCapital] = useState("")
    const [weatherInfo, setWeatherInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Array of country , capital , weather Info 
    const [detailsDataList, setDetailsDataList] = useState([])

    // Edit functionality 

    const [inputSaveValue, setInputSaveValue] = useState("")
    const [isEdit, setIsEdit] = useState(false)
    const [savedIdEditElement, setSavedIDEditElement] = useState(false)



    const handleChangeInput = (e) => {

        setValueInput(e.target.value)
    }

    const handleChangeSaveInput = (e) => {

        setInputSaveValue(e.target.value)
    }


    const getCapital = () => {
        fetch('https://countriesnow.space/api/v0.1/countries/capital')
            .then((res) => {
                if (!res.ok) {
                    throw Error('Could not fetch data')
                }
                return res.json()
            })
            .then((data) => {
                setDataCountriesApi(data)


            })
            .catch((err) => {
                console.log(err.message)
                setFetchError(true)
            })
    }


    // na mauncie pobieram wszystkie stolice 
    useEffect(() => {
        getCapital()
    }, [])


    const findCapital = (providedCountry) => {
        const dataApi = dataCountriesApi?.data
        //Find the value of the first element
        const foundCountry = dataApi?.find((item) => {
            const countryFromApi = item.name
            //console.log(countryFromApi)
            if (providedCountry.toLowerCase() === countryFromApi.toLowerCase()) {
                return true;
            }
            return false;
        })

        console.log('find capital', foundCountry?.capital)

        return foundCountry?.capital
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()

        if (!valueInput) {
            setError(true)
            return;
        } else {
            setError(false)
        }

        setIsLoading(true)


        const findedCapital = findCapital(valueInput)



        // Second API to get Weather info
        if (findedCapital) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${findedCapital}&appid=${process.env.NEXT_PUBLIC_WEATHERAPI}`)
                .then((res) => {
                    if (!res.ok) {
                        throw Error('Could not fetch data')
                    }
                    return res.json()
                })
                .then((data) => {
                    console.log('weatherDataApi details: ', { data, dataName: data.name, dataWeather: data.weather });
                    const weatherDetails = data.weather.map((detail) => {
                        return detail.main;
                    })
                    console.log('weatherDetails: ', weatherDetails);

                    //console.log(weatherDetails);
                    setFetchError(false)

                    const newElementDetail = {
                        country: valueInput,
                        capital: findedCapital,
                        weather: weatherDetails,
                        id: uuidv4(),
                    }

                    setDetailsDataList((prevState) => {
                        return [
                            ...prevState,
                            newElementDetail,

                        ]
                    })

                })

                .catch((err) => {
                    console.log("error", err)
                    setFetchError(true)
                })
        }


        setIsLoading(false)

        setValueInput('')

    }


    console.log('detailsDataList', detailsDataList)

    // DELETING ELEMENT 
    const handleDeleteElement = (e, id) => {
        e.preventDefault()

        const filteredElement = detailsDataList.filter((elem) => {
            console.log("elem", elem.id)
            console.log("id", id)
            return elem.id !== id
        })

        console.log("filteredElement", filteredElement)

        setDetailsDataList(filteredElement)
    }

    // EDITING ELEMENT 

    const handleEditClick = (e, element, id) => {
        e.preventDefault()
        console.log('Edit id', id)
        console.log('Edit element', element)


        setIsEdit(true)
        setSavedIDEditElement(id)


    }


    const handlerChangeSaveEditing = (e) => {
        e.preventDefault()

        let findElement = detailsDataList.find((elem) => {
            return elem.id === savedIdEditElement
        })

        console.log('findElement w Edit', findElement)

        findElement.country = inputSaveValue

        console.log('findElement w Edit', findElement)
        // [todo] fix, after editing a new value we need to invoke functionality for featching 
        setDetailsDataList([...detailsDataList])
        setIsEdit(false)

    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.description}>
                    <p >
                        Task nr 4
                    </p>
                    <p> Create input where you can enter a country</p>
                    <p> After entering the name of the country you should get information in one row :</p>
                    <ul>
                        <li>Entered country</li>
                        <li>Capital of the country</li>
                        <li>Weather information</li>
                        <li>Button to delete</li>
                    </ul>
                    <p>e.g, Enter: Poland  result: Poland Warsaw Clouds Button Delete</p>
                    <p>Create a list with information and the option to delete an individual row in the list. </p>
                </div>
                <div>
                    <form>

                        <div className='form-group'>
                            <label htmlFor="country"> Enter Country: </label>
                            <input type="text" id="country" value={valueInput} onChange={handleChangeInput} />
                        </div>
                        <button disabled={isLoading} onClick={handleSubmitForm}>{isLoading ? 'Loading...' : 'Add to the List'}</button>
                        <div>
                            <table>
                                <tbody>
                                    {detailsDataList.map((element, index) => {
                                        return (
                                            <>
                                                {isEdit ?
                                                    <EditingTemplate index={index} inputSaveValue={inputSaveValue} handleChangeSaveInput={handleChangeSaveInput} handlerChangeSaveEditing={handlerChangeSaveEditing} />
                                                    :
                                                    <SingleTemplate index={index} element={element} handleDeleteElement={handleDeleteElement} handleEditClick={handleEditClick} />}
                                            </>

                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {error && <p>Please write the name of country </p>}
                        {fetchError && <p>Something went wrong with API Call </p>}
                    </form>
                </div>
            </main>
        </div>
    )
}
function SingleTemplate({ index, element, handleDeleteElement, handleEditClick }) {
    return <tr key={`elem-${index}`}>
        <td>{index + 1}.</td>
        <td>{element.country}</td>
        <td>{element.capital}</td>
        <td>{element.weather}</td>
        <button onClick={(e) => handleDeleteElement(e, element.id)}>Delete</button>
        <button onClick={(e) => handleEditClick(e, element, element.id)}>Edit</button>
    </tr>;
}

function EditingTemplate({ inputSaveValue, handleChangeSaveInput, handlerChangeSaveEditing, index }) {
    return <div key={`elem-${index}`}>
        <label htmlFor="input-name">
            Edit entered value: &nbsp;
        </label>
        <input value={inputSaveValue} onChange={handleChangeSaveInput} id="input-name" type="text" />
        <button onClick={handlerChangeSaveEditing}>Save</button>
    </div>;
}

