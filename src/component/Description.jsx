import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDegrees } from 'react-icons/wi';
import Hotbg from '../Asset/sun.png';
import Warmbg from '../Asset/warm.png';
import Coolbg from '../Asset/rainny.png';
import DN from '../Asset/down.png';
import UP from '../Asset/max.png';
import HU from '../Asset/humidity.png';
import WD from '../Asset/wind.png';
import PR from '../Asset/pressure.png';
import RL from '../Asset/real.png';
import { RiSearch2Line } from 'react-icons/ri';

const Description = () => {
  const dataBuilder = (d) => {
    // Function to format the date
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [bg, setBg] = useState('');
  const [error, setError] = useState({});

  // Define temperature thresholds
  const hot = 79;
  const warm = 76;
  const cool = 30;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=249d2b45b68604e242df127efa28caa5`;

  useEffect(() => {
    // Fetch weather data when the location changes
    axios.get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        setError('');

        // Update background image based on temperature
        const temperature = response.data.main.temp;
        if (temperature >= hot) {
          setBg(Hotbg);
        } else if (temperature >= warm) {
          setBg(Warmbg);
        } else if (temperature >= cool) {
          setBg(Coolbg);
        }
      })
      .catch((error) => {
        console.error('API request error:', error);
        setLoading(false);
        setError(error);
      });

  }, [location]);

  const handleKeyPress = (e) => {
    setLocation(e.target.value)
  }

  return (
    <div className='app'>
      <main className='w-full grid justify-center gap-8 overflow-hidden'>
        <div>
        <div className='mt-[2rem] grid justify-center'>
          <input
            type='text'
            placeholder='Search Location'
            name='city'
            value={location}
             onClick={handleKeyPress}
            onChange={e => setLocation(e.target.value)}
            className='md:w-[30rem] sm:w-[20rem] placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-full py-2 pl-14 pr-3 shadow-lg focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
          />
        </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className='flex justify-center gap-4 text-white pt-10 text-3xl'>{data.name}</p>
            <div className='grid md:grid-cols-2 items-center justify-center'>
              <div className='text-white grid gap-8'>
                <div>
                  <p className='text-xl'>{dataBuilder(new Date())}</p>
                  {data.weather ? <p className='text-2xl font-semibold'>{data.weather[0].main}</p> : null}
                </div>
                {data.main ? <p className='text-7xl flex'>{data.main.temp.toFixed()}<WiDegrees />C</p> : null}
              </div>
              <div>
                {data.main ? <img src={bg} alt="Hot" className="mr-[5rem] w-[18rem]" /> : null}
              </div>
            </div>
            <div className='grid md:grid-cols-2 items-center justify-center gap-4'>
              <div className='text-white grid gap-3'>
                <div className='flex items-center'>
                  <img src={DN} alt='' className='w-[30px]' />
                  <p className='flex gap-2'>Min {data.main ? <span className='flex'>{data.main.temp_min.toFixed()}<WiDegrees /></span> : null}</p>
                </div>
                <div className='flex items-center'>
                  <img src={UP} alt='' className='w-[30px]' />
                  <p className='flex gap-2'>Max {data.main ? <span className='flex'>{data.main.temp_max.toFixed()}<WiDegrees /></span> : null}</p>
                </div>
                <div className='flex items-center'>
                  <img src={RL} alt='' className='w-[30px]' />
                  <p className='flex gap-2'>Real felt {data.main ? <span className='flex'>{data.main.feels_like.toFixed()}<WiDegrees /></span> : null}</p>
                </div>
              </div>
              <div className='grid md:grid-cols-3 gap-2 items-center justify-center'>
                <div className='bg-white w-[10rem] grid justify-center items-center px-2 py-6 gap-3 rounded-lg text-center'>
                  <div>
                    <img src={PR} alt='' className='w-[30px] ml-4' />
                    <p>Pressure</p>
                  </div>
                  {data.main ? <h1 className='font-bold'>{data.main.pressure.toFixed()}hPa</h1> : null}
                </div>
                <div className='bg-white w-[10rem] grid justify-center text-center items-center px-2 py-6 gap-3 rounded-lg'>
                  <div>
                    <img src={HU} alt='' className='w-[30px] ml-4' />
                    <p>Humidity</p>
                  </div>
                  {data.main ? <h1 className='font-bold'>{data.main.humidity.toFixed()}%</h1> : null}
                </div>
                <div className='bg-white w-[10rem] grid justify-center items-center px-2 py-6 gap-3 rounded-lg text-center'>
                  <div>
                    <img src={WD} alt='' className='w-[30px] ml-4' />
                    <p>Wind Speed</p>
                  </div>
                  {data.wind ? <h1 className='font-bold'>{data.wind.speed.toFixed()}MPH</h1> : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Description;
