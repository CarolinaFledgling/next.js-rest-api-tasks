import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

export default function Task2() {

    const [dataCountriesApi, setDataCountriesApi] = useState([])
    const [randomCapitalsfromAPI, setRandomCapitalsFromAPI] = useState([])
    const [randomWeatherArrCapitals, setRandomWeatherArrCapitals] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log('Weather data: ', randomWeatherArrCapitals);
    }, [randomWeatherArrCapitals])


    useEffect(() => {
        getCapital()
    }, [])

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
                setIsLoading(false)
                setError(null)

            })
            .catch((err) => {
                setError(err.message)
            })
         }


    const getWeatherForRandom10Capitals = (capitalArray) => {
        capitalArray.forEach((capitalItem) => {
            console.log("capitalItem", capitalItem)

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capitalItem}&appid=${process.env.NEXT_PUBLIC_WEATHERAPI}`)
                .then((res) => {
                    // request reaches the server but the server sends an error back 
                    // console.log("response:", res)
                    if (!res.ok) {
                        // when we throw an err here it will be catches down in .catch
                        throw Error('Could not fetch the data for that resource')
                    }
                    if (res.status === 401) {
                        console.log('err 401')
                    }
                    if (res.status === 404) {
                        console.log('we have err 404')
                    }

                    return res.json()
                        .then((weatherData) => {
                            console.log("weatherData", { weatherData })
                            setRandomWeatherArrCapitals((prevArr) => {
                                return [
                                    ...prevArr,
                                    {
                                        capitalItem,
                                        weather: weatherData?.weather[0]?.description
                                    }
                                ]
                            })
                            setIsLoading(false)
                            setError(null)
                        })
                }).catch((err) => {
                    // catch any kind of network error
                    // we cant connect to the server
                    console.log("network error", err.message)
                    setError(err.message)
                })
        })
    }


    useEffect(() => {
        if (randomCapitalsfromAPI) {

            getWeatherForRandom10Capitals(randomCapitalsfromAPI)
        }
    }, [randomCapitalsfromAPI]);



    function getMultipleRandom(capitalArray, num) {
        // we use spread syntax to do shadow copy of origan capitalArray, because sort method mutate the origin capitalArray

        //The Math.random function returns a float from 0 to 1, so we picked a number in the middle (0.5) from which we subtract the result from Math.random.
        const shuffled = [...capitalArray].sort(() => 0.5 - Math.random());

        return shuffled.slice(0, num);
    }

    const handleRandomTenCities = (e) => {
        e.preventDefault()

        setRandomWeatherArrCapitals([]);

        const random10Country = getMultipleRandom(dataCountriesApi?.data, 10)

        console.log("random country", { random10Country })


        const randomCapitalArr = random10Country.map((item) => {
            return item.capital
        })


        //console.log("randomCapitalArr", randomCapitalArr)

        setRandomCapitalsFromAPI(randomCapitalArr)

        //console.log("random", randomWeatherArrCapitals)

    }
    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <div className={styles.description}>
                    <p >
                        Task nr 2
                    </p>
                    <p> Choose 10 capitals at random and view the weather for them.</p>
                </div>
                <div>
                    <form>
                        <button onClick={handleRandomTenCities}>Random</button>
                        {isLoading && <div>Loading...</div>}
                        <div >
                            <h2>Random cities and their weather</h2>
                            <ul>
                                {randomWeatherArrCapitals.map((item, index) => {
                                    return (
                                        <li key={item.capitalItem}>{item.capitalItem} - {item.weather}</li>
                                    )
                                })}
                            </ul>
                            {error && <p>{error}</p>}

                        </div>
                    </form>
                </div>
            </main>

        </div>
    )
}
