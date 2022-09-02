import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export default function Task3() {
    const [valueInput, setValueInput] = useState("")
    const [citiesAndPopulationData, setCitiesAndPopulationData] = useState([])
    const [error, setError] = useState(false)
    const [fetchError, setFetchError] = useState(false)



    const [foundCities, setFoundCities] = useState([])



    const handleChangeInput = (e) => {
        setValueInput(e.target.value)
    }


    // First API to get Country
    const getCitiesAndPopulationData = () => {
        fetch('https://countriesnow.space/api/v0.1/countries/population/cities')
            .then((res) => {
                if (!res.ok) {
                    throw Error('Could not fetch data')
                }
                return res.json()
            })
            .then((data) => {
                return setCitiesAndPopulationData(data)
            })
            .catch((err) => {
                console.log(err.message)
                setFetchError(true)
            })
    }


    useEffect(() => {
        getCitiesAndPopulationData()
    }, [])

    //console.log("CitiesAndPopulationData", { citiesAndPopulationData: citiesAndPopulationData.data })

    const handleSubmitForm = (e) => {
        e.preventDefault()

        const isTheSameCountry = (value) => {
            //console.log("value", value.country)

            if (valueInput.toLowerCase() === value.country.toLowerCase()) {
                return value.city

            }
        }
        const foundCitiesFromAPI = citiesAndPopulationData.data.filter(isTheSameCountry)

        console.log('find cities for entered country', { foundCitiesFromAPI })



        const citiesByCountry = foundCitiesFromAPI.map((item) => {
            console.log('city ', item.city)
            return item.city
        })

        setFoundCities(citiesByCountry)



    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.description}>
                    <p>Enter country and List the top 10 cities, calculate the highest temperature in these 10.</p>
                    <p>Display one  city with the highest temperature</p>
                </div>
                <form>
                    <p>Check the weather of {valueInput}</p>
                    <div className='form-group'>
                        <label htmlFor="country"> Enter Country: </label>
                        <input type="text" id="country" value={valueInput} onChange={handleChangeInput} />
                    </div>
                    <button onClick={handleSubmitForm}>Submit</button>

                    <ul>
                        {foundCities.slice(0, 10).map((city, index) => {
                            return <li key={`city-${index}`}>{city}</li>

                        })}
                    </ul>


                    {error && <p>Please write the name of country </p>}
                    {fetchError && <p>Something went wrong with API Call </p>}
                </form>


            </main>


        </div>
    )
}
