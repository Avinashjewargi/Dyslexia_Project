// frontend/lexiai/cards/TimeCalendar.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function TimeCalendar() {

  // 📅 Days of the Week
  const daysOfWeek = [
    { word: 'Monday', emoji: '📅', audioText: 'Monday - First day of week', description: 'Start of the week' },
    { word: 'Tuesday', emoji: '📅', audioText: 'Tuesday - Second day', description: 'After Monday' },
    { word: 'Wednesday', emoji: '📅', audioText: 'Wednesday - Middle of week', description: 'Midweek day' },
    { word: 'Thursday', emoji: '📅', audioText: 'Thursday - Fourth day', description: 'Before Friday' },
    { word: 'Friday', emoji: '🎉', audioText: 'Friday - Last work day', description: 'Weekend begins' },
    { word: 'Saturday', emoji: '🛌', audioText: 'Saturday - Weekend day', description: 'Day off' },
    { word: 'Sunday', emoji: '🙏', audioText: 'Sunday - Rest day', description: 'End of week' }
  ];

  // 🗓️ Months of the Year
  const months = [
    { word: 'January', emoji: '❄️', audioText: 'January - First month', description: 'New year month' },
    { word: 'February', emoji: '❤️', audioText: 'February - Second month', description: 'Valentine month' },
    { word: 'March', emoji: '🌸', audioText: 'March - Third month', description: 'Spring begins' },
    { word: 'April', emoji: '🌼', audioText: 'April - Fourth month', description: 'Flowers bloom' },
    { word: 'May', emoji: '🌺', audioText: 'May - Fifth month', description: 'Warm spring' },
    { word: 'June', emoji: '☀️', audioText: 'June - Sixth month', description: 'Summer starts' },
    { word: 'July', emoji: '🔥', audioText: 'July - Seventh month', description: 'Hot month' },
    { word: 'August', emoji: '🌞', audioText: 'August - Eighth month', description: 'Late summer' },
    { word: 'September', emoji: '🍂', audioText: 'September - Ninth month', description: 'Autumn begins' },
    { word: 'October', emoji: '🎃', audioText: 'October - Tenth month', description: 'Halloween month' },
    { word: 'November', emoji: '🦃', audioText: 'November - Eleventh month', description: 'Thanksgiving time' },
    { word: 'December', emoji: '🎄', audioText: 'December - Last month', description: 'Holiday season' }
  ];

  // 🌸 Seasons
  const seasons = [
    { word: 'spring', emoji: '🌸', audioText: 'Spring - Flowers bloom', description: 'Mild and colorful' },
    { word: 'summer', emoji: '☀️', audioText: 'Summer - Hot season', description: 'Vacation time' },
    { word: 'autumn', emoji: '🍁', audioText: 'Autumn - Leaves fall', description: 'Also called fall' },
    { word: 'winter', emoji: '❄️', audioText: 'Winter - Cold season', description: 'Snowy weather' }
  ];

  // 🌅 Parts of the Day
  const partsOfDay = [
    { word: 'morning', emoji: '🌅', audioText: 'Morning - Start of day', description: 'After sunrise' },
    { word: 'noon', emoji: '☀️', audioText: 'Noon - Middle of day', description: '12 PM' },
    { word: 'afternoon', emoji: '🌤️', audioText: 'Afternoon - After noon', description: 'Before evening' },
    { word: 'evening', emoji: '🌆', audioText: 'Evening - Before night', description: 'Sunset time' },
    { word: 'night', emoji: '🌙', audioText: 'Night - Time to sleep', description: 'Dark sky' },
    { word: 'midnight', emoji: '🌃', audioText: 'Midnight - Middle of night', description: '12 AM' },
    { word: 'dawn', emoji: '🌄', audioText: 'Dawn - First light', description: 'Early morning' },
    { word: 'dusk', emoji: '🌇', audioText: 'Dusk - Sun setting', description: 'Between day and night' }
  ];

  // ⏱️ Time Units
  const timeUnits = [
    { word: 'second', emoji: '⏱️', audioText: 'Second - Smallest unit', description: '60 in a minute' },
    { word: 'minute', emoji: '⏱️', audioText: 'Minute - 60 seconds', description: '60 in an hour' },
    { word: 'hour', emoji: '🕒', audioText: 'Hour - 60 minutes', description: '24 in a day' },
    { word: 'day', emoji: '📅', audioText: 'Day - 24 hours', description: 'One full day' },
    { word: 'week', emoji: '📆', audioText: 'Week - 7 days', description: 'Monday to Sunday' },
    { word: 'month', emoji: '🗓️', audioText: 'Month - About 30 days', description: 'Part of a year' },
    { word: 'year', emoji: '🎉', audioText: 'Year - 12 months', description: '365 days' }
  ];

  // ⏳ Time Concepts
  const timeConcepts = [
    { word: 'today', emoji: '📍', audioText: 'Today - This day', description: 'Right now' },
    { word: 'yesterday', emoji: '⏪', audioText: 'Yesterday - Day before', description: 'Past day' },
    { word: 'tomorrow', emoji: '⏩', audioText: 'Tomorrow - Day after', description: 'Next day' },
    { word: 'past', emoji: '🕰️', audioText: 'Past - Before now', description: 'Already happened' },
    { word: 'present', emoji: '⏸️', audioText: 'Present - Current time', description: 'Now' },
    { word: 'future', emoji: '🚀', audioText: 'Future - Time ahead', description: 'Will happen' }
  ];

  return (
    <>
      <LearningCard title="Days of the Week" subtitle="Seven days" category="📅 Time" categoryColor="#F38181" items={daysOfWeek} />
      <LearningCard title="Months of the Year" subtitle="Twelve months" category="🗓️ Time" categoryColor="#FCE38A" items={months} />
      <LearningCard title="Seasons" subtitle="Weather cycles" category="🌸 Time" categoryColor="#95E1D3" items={seasons} />
      <LearningCard title="Parts of the Day" subtitle="Morning to night" category="🌅 Time" categoryColor="#EAFFD0" items={partsOfDay} />
      <LearningCard title="Time Units" subtitle="Measuring time" category="⏱️ Time" categoryColor="#A29BFE" items={timeUnits} />
      <LearningCard title="Time Concepts" subtitle="Past, present & future" category="⏳ Time" categoryColor="#FF9A8B" items={timeConcepts} />
    </>
  );
}

export default TimeCalendar;
