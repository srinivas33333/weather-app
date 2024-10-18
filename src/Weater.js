import React from 'react';

function Weater({ data }) {
  console.log('-data', data);

  return (
    <section className='weather-container'>
      {data.slice(0, 5).map((val, index) => (
        <table className="weather-table" key={index}>
          <thead>
            <tr className="date-row">
              <th colSpan="2">{new Date(val.dt_txt).toDateString()}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="temperature-row">
              <td colSpan="2">Temperature: {val.main.temp}°C</td>
            </tr>
            <tr>
              <th>Min</th>
              <th>Max</th>
            </tr>
            <tr className='temperature-row'>
              <td>{val.main.temp_min}°C</td>
              <td>{val.main.temp_max}°C</td>
            </tr>
            <tr>
              <th>Pressure</th>
              <td>{val.main.pressure} hPa</td>
            </tr>
            <tr>
              <th>Humidity</th>
              <td>{val.main.humidity}%</td>
            </tr>
          </tbody>
        </table>
      ))}
    </section>
  );
}

export default Weater;
