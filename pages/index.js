import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [valueInput, setValueInput] = useState("");
  const [dataCountriesApi, setDataCountriesApi] = useState([]);
  const [error, setError] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const [capital, setCapital] = useState("");
  const [weatherInfo, setWeatherInfo] = useState([]);

  const handleChangeInput = (e) => {
    setValueInput(e.target.value);
  };

  // First API to get Country
  const getCapital = () => {
    fetch("https://countriesnow.space/api/v0.1/countries/capital")
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data");
        }
        return res.json();
      })
      .then((data) => {
        return setDataCountriesApi(data);
      })
      .catch((err) => {
        console.log(err.message);
        setFetchError(true);
      });
  };

  // Second API to get Weather info
  const getWeather = (providedCapital) => {
    //console.log('getWeather', { providedCapital });
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${providedCapital}&appid=${process.env.NEXT_PUBLIC_WEATHERAPI}`
    )
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("weatherDataApi details: ", {
          data,
          dataName: data.name,
          dataWeather: data.weather,
        });
        const weatherDetails = data.weather.map((detail) => {
          return detail.main;
        });
        console.log("weatherDetails: ", weatherDetails);
        setWeatherInfo(weatherDetails);
        //console.log(weatherDetails);
        setFetchError(false);
      })
      .catch((err) => {
        console.log("error", err);
        setFetchError(true);
      });
  };

  useEffect(() => {
    getCapital();
  }, []);

  //console.log("Data from first API", { dataDetailsList: dataCountriesApi.data })

  useEffect(() => {
    if (capital) {
      getWeather(capital);
    }
  }, [capital]);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!valueInput) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    const dataApi = dataCountriesApi?.data;
    //Find the value of the first element
    const foundCountry = dataApi?.find((item) => {
      const countryFromApi = item.name;
      //console.log(countryFromApi)
      if (valueInput.toLowerCase() === countryFromApi.toLowerCase()) {
        return true;
      }
      return false;
    });

    //console.log('find capital', foundCountry?.capital)
    setCapital(foundCountry?.capital);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.description}>
          <p>Task nr 1</p>
          <p>
            Create input where you will write the random name of the country
          </p>
          <p> After entering the name fo the country you should get:</p>
          <ul>
            <li>Capital of the country</li>
            <li>Weather information</li>
          </ul>
          <p>e.g, Enter: Poland result: Warsaw Clouds</p>
        </div>
        <div>
          <form>
            <p>Check the weather of {valueInput}</p>
            <div className="form-group">
              <label htmlFor="country"> Enter Country: </label>
              <input
                type="text"
                id="country"
                value={valueInput}
                onChange={handleChangeInput}
              />
            </div>
            <button onClick={handleSubmitForm}>
              Show Capital and Weather info
            </button>
            {capital && <p>{capital}</p>}
            {weatherInfo && <p>{weatherInfo}</p>}

            {error && <p>Please write the name of country </p>}
            {fetchError && <p>Something went wrong with API Call </p>}
          </form>
        </div>
      </main>
    </div>
  );
}
