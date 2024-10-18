import { useState, useEffect } from 'react';
import './App.css';
import Weater from './Weater';
import useDebounce from './hooks/useDebounce';

function App() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true);
      fetchCityCoordinates(debouncedSearch)
    } else {
      setCitySuggestions([]);
    }
  }, [debouncedSearch]);

  const handleApi = async () => {
    if (!selectedCity) return;

    const API_KEY = process.env.REACT_APP_API_KEY;
    const baseUrl = `https://api.openweathermap.org`;

    setLoading(true);
    setCityName('');
    setWeatherData([]);
    const weaterUrl = `${baseUrl}/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${API_KEY}`;

    try {
      const weaterResponse = await fetch(weaterUrl);
      if (!weaterResponse.ok) console.log('-weaterResponse', weaterResponse.status);
      const weaterData = await weaterResponse.json();

      const uniqueDays = {};
      const filteredData = [];

      for (let i = 0; i < weaterData.list.length; i++) {
        const item = weaterData.list[i];
        const date = item.dt_txt.split(' ')[0];

        if (!uniqueDays[date]) {
          uniqueDays[date] = true;
          filteredData.push(item);
        }

        if (filteredData.length >= 5) break;
      }

      setCityName(search);
      setWeatherData(filteredData);
    } catch (error) {
      console.error('weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCityCoordinates = async (city) => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const baseUrl = `https://api.openweathermap.org`;
    const cityUrl = `${baseUrl}/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

    try {
      const response = await fetch(cityUrl);
      if (!response.ok) console.log('-response.status', response.status)
      const data = await response.json();
      setCitySuggestions(data);
    } catch (error) {
      console.error('coordinates:', error);
    } finally { setLoading(false) };
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setSearch(city.name);
    setCitySuggestions([]);
    setIsDropdownVisible(false);
  };

  const handleInputClick = () => {
    if (citySuggestions.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };

  const handleInputChange = (val) => {
    setSearch(val);
    setSelectedCity(() => {
      const city = citySuggestions.find(v => v.name === val) 
      return city || null 
    });
  }
  return (
    <div className="App">
      <nav className="search">
        <h3 className="orange-text">Weather in your city</h3>
        <section>
          <form onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              value={search} 
              onChange={(e) => handleInputChange(e.target.value)} 
              onClick={handleInputClick}
              placeholder="Type city name"
            />
            <button className="orange-btn" onClick={handleApi} disabled={!selectedCity}>
              Search
            </button>
            {loading && <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className='loading' />}
          </form>
          {isDropdownVisible && citySuggestions.length > 0 && (
            <ul className="suggestions" onMouseLeave={handleMouseLeave}>
              {citySuggestions.map((city, index) => (
                <li key={index} onClick={() => handleCityClick(city)}>
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </section>
      </nav>
      <Weater data={ weatherData } cityName={ cityName } />
    </div>
  );
}

export default App;
