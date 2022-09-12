import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";

export default function Task3() {
    const [valueInput, setValueInput] = useState("");
    const [citiesAndPopulationData, setCitiesAndPopulationData] = useState([]);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const [isSortbyTemp, setIsSortByTemp] = useState(false);
    const [foundCities, setFoundCities] = useState([]);
    const [cityWeatherInfo, setCityWeatherInfo] = useState([]);

    // Modeling Cities
    const filterCities = () => {
        // important filter  return true when is true that item is going to array
        // The filter () function returns a new array that contains the filtered elements
        const isTheSameCountry = (value) => {
            //console.log("value", value.country)
            return valueInput.toLowerCase() === value.country.toLowerCase();
        };
        const foundCitiesFromAPI =
            citiesAndPopulationData.data.filter(isTheSameCountry);
        foundCitiesFromAPI.sort(function (elementA, elementB) {
            const populationA = Number(elementA.populationCounts[0].value);
            const populationB = Number(elementB.populationCounts[0].value);
            return populationB - populationA;
        });

        const citiesByCountry = foundCitiesFromAPI.slice(0, 10).map((item) => {
            //console.log('city ', item.city)
            return item.city;
        });

        //console.log('sorted cities', { citiesByCountry })
        setFoundCities(citiesByCountry);
    };

    const handleChangeInput = (e) => {
        setValueInput(e.target.value);
    };

    const getTemperatureInfo = (cities) => {
        cities.forEach((city, index) => {
            // displaying city first before fetching weather data
            setCityWeatherInfo((prevArr) => {
                prevArr[index] = {
                    city,
                };
                return [...prevArr];
            });

            console.log("city api", city, index);
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHERAPI}`
            )
                .then((res) => {
                    if (!res.ok) {
                        console.log(res.status);
                        throw {
                            status: res.status,
                            message: "City not found in the  Weather API",
                        };
                    }
                    return res.json();
                })
                .then((weatherData) => {
                    console.log("seCityWeatherInfo", { weatherData });

                    setCityWeatherInfo((prevArr) => {
                        prevArr[index] = {
                            city,
                            temp: weatherData?.main?.temp,
                        };
                        return [...prevArr];
                    });
                    setError(null);
                })
                .catch((errorObject) => {
                    console.log("err from catch", { errorObject });
                    setCityWeatherInfo((prevArr) => {
                        prevArr[index] = {
                            city,
                            status: errorObject.status,
                            message: errorObject.message,
                        };
                        return [...prevArr];
                    });
                    setError("Request failed");
                });
        });
    };

    useEffect(() => {
        if (foundCities) {
            getTemperatureInfo(foundCities);
        }
    }, [foundCities, isSortbyTemp]);

    //console.log("cityWeatherInfo", cityWeatherInfo)

    const getCitiesAndPopulationData = () => {
        fetch("https://countriesnow.space/api/v0.1/countries/population/cities")
            .then((res) => {
                if (!res.ok) {
                    throw Error("Could not fetch data");
                }
                return res.json();
            })
            .then((data) => {
                setFetchError(false);
                return setCitiesAndPopulationData(data);
            })
            .catch((err) => {
                console.log(err.message);
                setFetchError(true);
            });
    };

    useEffect(() => {
        getCitiesAndPopulationData();
    }, []);

    //console.log("CitiesAndPopulationData", { citiesAndPopulationData: citiesAndPopulationData.data })

    const handleSortbyPopulation = (e) => {
        e.preventDefault();

        setCityWeatherInfo([]);

        filterCities();

        setIsSortByTemp(false);
    };

    const handleSortByTemperature = (e) => {
        e.preventDefault();

        setIsSortByTemp(true);

        setCityWeatherInfo([]);

        filterCities();
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.description}>
                    <p>Sort cities in: {valueInput} by population or temperature</p>
                </div>
                <form>
                    <div className="form-group">
                        <label htmlFor="country"> Enter Country: </label>
                        <input
                            type="text"
                            id="country"
                            value={valueInput}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <button onClick={handleSortbyPopulation}>Sort by population</button>
                    <button onClick={handleSortByTemperature}>Sort by Temp</button>

                    {isSortbyTemp ? (
                        <CitiesListByTemp cityWeatherInfo={cityWeatherInfo} />
                    ) : (
                        <CitiesList cityWeatherInfo={cityWeatherInfo} />
                    )}

                    {error && <p>{error}</p>}
                </form>
            </main>
        </div>
    );
}

function CitiesList({ cityWeatherInfo }) {
    return (
        <ul>
            {cityWeatherInfo.map((item, index) => {
                const temp = Math.round(item?.temp);
                const status = item?.status;
                return status ? (
                    <li key={`city-${index}`}>
                        {item?.city} Failed: {status}
                    </li>
                ) : (
                    <li key={`city-${index}`}>
                        {item?.city} temperature {temp} °C
                    </li>
                );
            })}
        </ul>
    );
}

function CitiesListByTemp({ cityWeatherInfo }) {
    let sortCitiesWithWeatherTemp = [...cityWeatherInfo];

    sortCitiesWithWeatherTemp.sort(function (elemA, elemB) {
        //console.log("elem a i b", elemA, elemB)
        const cityElementTempA = elemA.temp;
        const cityElementTempB = elemB.temp;

        // from the lowest temperature to the highest

        if (cityElementTempA === undefined) {
            return 1;
        }

        if (cityElementTempB === undefined) {
            return -1;
        }

        if (cityElementTempA < cityElementTempB) {
            return -1;
        }

        if (cityElementTempA > cityElementTempB) {
            return 1;
        }

        return 0;

        //console.log("city elem :", cityElementTempA, cityElementTempB)
    });

    console.log("sortCitiesWithWeatherTemp", sortCitiesWithWeatherTemp);
    return (
        <ul>
            {sortCitiesWithWeatherTemp.map((item, index) => {
                const temp = Math.round(item?.temp);
                console.log("temp", { temp });
                const status = item?.status;
                const message = item?.message;
                return (
                    <>
                        {status && message ? (
                            <li key={`city-${index}`}>
                                {item?.city} Failed: {status} {message}
                            </li>
                        ) : (
                            <li key={`city-${index}`}>
                                {item?.city}{" "}
                                {temp === NaN ? (
                                    <span>Loading</span>
                                ) : (
                                    <span>temperature {temp} °C</span>
                                )}
                            </li>
                        )}
                    </>
                );
            })}
        </ul>
    );
}
