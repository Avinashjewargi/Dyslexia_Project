// frontend/lexiai/cards/WeatherWatch.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function WeatherWatch() {

  // ☀️ Basic Weather
  const basicWeather = [
    { word: 'sunny', emoji: '☀️', audioText: 'Sunny - Bright and warm day', description: 'Clear sky with sunshine' },
    { word: 'cloudy', emoji: '☁️', audioText: 'Cloudy - Sky full of clouds', description: 'Overcast sky' },
    { word: 'rainy', emoji: '🌧️', audioText: 'Rainy - Water falling from sky', description: 'Rainfall' },
    { word: 'snowy', emoji: '🌨️', audioText: 'Snowy - Snow falling', description: 'Cold weather' },
    { word: 'foggy', emoji: '🌫️', audioText: 'Foggy - Misty air', description: 'Low visibility' }
  ];

  // 🌡️ Temperature
  const temperature = [
    { word: 'hot', emoji: '🥵', audioText: 'Hot - Very warm temperature', description: 'High heat' },
    { word: 'warm', emoji: '😊', audioText: 'Warm - Pleasant heat', description: 'Comfortable temperature' },
    { word: 'cool', emoji: '😌', audioText: 'Cool - Slightly cold', description: 'Refreshing weather' },
    { word: 'cold', emoji: '🥶', audioText: 'Cold - Very low temperature', description: 'Chilly weather' },
    { word: 'freezing', emoji: '❄️', audioText: 'Freezing - Extremely cold', description: 'Below zero' }
  ];

  // 🌧️ Rain & Snow
  const rainSnow = [
    { word: 'rain', emoji: '🌧️', audioText: 'Rain - Water drops from clouds', description: 'Liquid precipitation' },
    { word: 'drizzle', emoji: '🌦️', audioText: 'Drizzle - Light rain', description: 'Gentle rain' },
    { word: 'shower', emoji: '🌦️', audioText: 'Shower - Short rain', description: 'Brief rainfall' },
    { word: 'downpour', emoji: '🌧️', audioText: 'Downpour - Heavy rain', description: 'Very strong rain' },
    { word: 'snow', emoji: '❄️', audioText: 'Snow - Frozen flakes', description: 'Frozen precipitation' },
    { word: 'hail', emoji: '🧊', audioText: 'Hail - Ice balls', description: 'Frozen rain pellets' },
    { word: 'rainbow', emoji: '🌈', audioText: 'Rainbow - Colors after rain', description: 'Light spectrum' }
  ];

  // 💨 Wind & Storms
  const windStorms = [
    { word: 'windy', emoji: '💨', audioText: 'Windy - Strong air movement', description: 'Breezy day' },
    { word: 'breeze', emoji: '🍃', audioText: 'Breeze - Gentle wind', description: 'Light air' },
    { word: 'gust', emoji: '💨', audioText: 'Gust - Sudden wind', description: 'Short strong wind' },
    { word: 'stormy', emoji: '⛈️', audioText: 'Stormy - Heavy rain and lightning', description: 'Severe weather' },
    { word: 'thunder', emoji: '🔊', audioText: 'Thunder - Loud storm sound', description: 'Sound of lightning' },
    { word: 'lightning', emoji: '⚡', audioText: 'Lightning - Bright electric flash', description: 'Electric discharge' },
    { word: 'tornado', emoji: '🌪️', audioText: 'Tornado - Spinning wind storm', description: 'Funnel cloud' },
    { word: 'hurricane', emoji: '🌀', audioText: 'Hurricane - Powerful storm', description: 'Tropical cyclone' }
  ];

  // ☁️ Sky Conditions
  const skyConditions = [
    { word: 'clear', emoji: '🌞', audioText: 'Clear - No clouds', description: 'Blue sky' },
    { word: 'overcast', emoji: '☁️', audioText: 'Overcast - Fully cloudy', description: 'Gray sky' },
    { word: 'partly cloudy', emoji: '⛅', audioText: 'Partly cloudy - Some clouds', description: 'Sun and clouds' },
    { word: 'humid', emoji: '💦', audioText: 'Humid - Moist air', description: 'Sticky weather' },
    { word: 'dry', emoji: '🏜️', audioText: 'Dry - No moisture', description: 'Arid air' }
  ];

  return (
    <>
      <LearningCard title="Basic Weather" subtitle="Daily weather types" category="☀️ Weather" categoryColor="#FDCB6E" items={basicWeather} />
      <LearningCard title="Temperature" subtitle="Hot or cold" category="🌡️ Weather" categoryColor="#FF7675" items={temperature} />
      <LearningCard title="Rain & Snow" subtitle="Water from sky" category="🌧️ Weather" categoryColor="#74B9FF" items={rainSnow} />
      <LearningCard title="Wind & Storms" subtitle="Strong weather events" category="💨 Weather" categoryColor="#A29BFE" items={windStorms} />
      <LearningCard title="Sky Conditions" subtitle="How the sky looks" category="☁️ Weather" categoryColor="#55EFC4" items={skyConditions} />
    </>
  );
}

export default WeatherWatch;
