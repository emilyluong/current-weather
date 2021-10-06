import './App.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


function App() {
  const [city, setCity] = useState("");
  const [unit, setWeatherUnit] = useState("metric");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [citySelect, setCitySelect] = useState("");
  const [hasError, setError] = useState(false);

  useEffect(() => {
    if (!city && localStorage.getItem("city")) {
      setCity(localStorage.getItem("city"))
      if (["Toronto", "New York", "Los Angeles", "Chicago", "Phoenix"].includes(localStorage.getItem("city"))) {
        setCitySelect(localStorage.getItem("city"));
      } else {
        setCitySearch(localStorage.getItem("city"))
      }
    }

    if (city !== null && city !== "") getWeatherInfo();
  }, [city, unit]);

  const setCityInfo = () => {
    let cityName = "";
    if (citySearch !== "") {
      cityName = citySearch;
    } else {
      cityName = citySelect;
    }

    setCity(cityName);
    localStorage.setItem("city", cityName);
  }

  const citySearchSelect = (e) => {
    if (e.target.name === "select") {
      setCitySelect(e.target.value);
      setCitySearch("");
    } else {
      setCitySelect("");
      setCitySearch(e.target.value);
    }
  }

  const getWeatherUnit = (e) => {
    setWeatherUnit(e.target.value);
  }

  const getWeatherInfo = async () => {
    var options = {
      method: 'GET',
      url: 'https://community-open-weather-map.p.rapidapi.com/weather',
      params: {
        q: city,
        units: unit
      },
      headers: {
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        'x-rapidapi-key': '2cd899aa63msh1475c13edf5d7d1p1ccfc5jsnec1fc7cf4ea9'
      }
    };
    try {
      setError(false);
      const response = await axios.request(options);
      setWeatherInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  return (
    <div className="App">
      <Form>
        <Container>
          <h1>Current Weather</h1>
          <Row className="justify-content-md-center mt-3">
            <Col md={5}>
              <Form.Select name="select" value={citySelect} onChange={(e) => citySearchSelect(e)}>
                <option>Select a city</option>
                <option value="Toronto">Toronto</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Phoenix">Phoenix</option>
              </Form.Select>
            </Col>
            <Col md={2}><p>or search</p></Col>
            <Col md={5}>
              <Form.Control name="search" value={citySearch} onChange={(e) => citySearchSelect(e)}></Form.Control>
            </Col>
        </Row>

        <div className="mt-3" onChange={getWeatherUnit}>
          <Form.Check
            inline
            label="F"
            value="imperial"
            type="radio"
            name="unit"
          />
          <Form.Check
            inline
            label="C"
            value="metric"
            type="radio"
            name="unit"
            defaultChecked
          />
        </div>

        <Button onClick={setCityInfo}>Get Forcast!</Button>
        </Container>
      </Form>
      {hasError && 
        <div className="box">
          <h3 className="text-secondary">Oops! Something went wrong. Did you type in the city correctly?</h3>
        </div>
      }

      {!hasError && weatherInfo && city && 
        <div>
            <h2 className="mt-4">{city}</h2>
            <label>{Math.ceil(weatherInfo.main.temp)}°</label>
            <p>{weatherInfo.weather[0].description}</p>
            <img alt="" src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`}/>

            <Container className="detail-fonts text-white">
              <Row>
                <Col>Low: {weatherInfo.main.temp_min}°</Col>
                <Col>High: {weatherInfo.main.temp_max}°</Col>
              </Row>
            </Container>

          <div className="box">
            <Container className="detail-fonts">
              <Row>
                <Col md={3}>Feels Like</Col>
                <Col md={3}>Humidity</Col>
                <Col md={3}>Pressure</Col>
                <Col md={3}>Wind</Col>
              </Row>
              <Row>
                <Col md={3}>{weatherInfo.main.feels_like}°</Col>
                <Col md={3}>{weatherInfo.main.humidity}%</Col>
                <Col md={3}>{weatherInfo.main.pressure}hPa</Col>
                <Col md={3}>{weatherInfo.wind.speed}</Col>
              </Row>
            </Container>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
