import React from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  margin: 2rem 0;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const CalendarTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-600);
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    
    &:hover {
      background-color: var(--gray-100);
      color: var(--primary-color);
    }
  }
  
  .current-month {
    font-weight: 500;
    color: var(--gray-800);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const WeekdayLabel = styled.div`
  text-align: center;
  font-weight: 500;
  color: var(--gray-500);
  font-size: 0.8rem;
  padding: 0.5rem 0;
  text-transform: uppercase;
`;

const CalendarDay = styled.div`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  background-color: ${props => props.isToday ? 'var(--gray-100)' : 'transparent'};
  border: 1px solid ${props => props.isToday ? 'var(--primary-color)' : 'transparent'};
  cursor: ${props => props.isEmpty ? 'default' : 'pointer'};
  position: relative;
  transition: var(--transition-base);
  
  &:hover {
    background-color: ${props => props.isEmpty ? 'transparent' : 'var(--gray-100)'};
    transform: ${props => props.isEmpty ? 'none' : 'scale(1.05)'};
  }
  
  .day-number {
    font-weight: ${props => props.isToday ? '600' : '400'};
    color: ${props => {
      if (props.isEmpty) return 'var(--gray-300)';
      if (props.isToday) return 'var(--primary-color)';
      return 'var(--gray-700)';
    }};
    font-size: 0.9rem;
  }
`;

const MoodIndicator = styled.div`
  margin-top: 5px;
  font-size: 1.2rem;
  
  &::after {
    content: '';
    display: ${props => props.hasMood ? 'block' : 'none'};
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => {
      if (props.moodScore >= 4) return 'var(--success-color)';
      if (props.moodScore >= 3) return 'var(--info-color)';
      if (props.moodScore >= 2) return 'var(--warning-color)';
      return 'var(--danger-color)';
    }};
  }
`;

const MoodCalendar = ({ moods, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() 
    && today.getFullYear() === currentMonth.getFullYear();
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const getMoodForDate = (day) => {
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return moods.find(mood => {
      const moodDate = new Date(mood.createdAt).toISOString().split('T')[0];
      return moodDate === dateToCheck;
    });
  };
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handleDayClick = (day) => {
    const mood = getMoodForDate(day);
    if (mood && onDayClick) {
      onDayClick(mood);
    }
  };
  
  return (
    <CalendarContainer>
      <CalendarTitle>
        Mood Calendar
        <MonthNavigation>
          <button onClick={prevMonth} aria-label="Previous month">&lt;</button>
          <span className="current-month">{getMonthName()}</span>
          <button onClick={nextMonth} aria-label="Next month">&gt;</button>
        </MonthNavigation>
      </CalendarTitle>
      
      <CalendarGrid>
        {weekdays.map(day => (
          <WeekdayLabel key={day}>{day}</WeekdayLabel>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <CalendarDay key={`empty-${index}`} isEmpty />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const mood = getMoodForDate(day);
          const isToday = isCurrentMonth && today.getDate() === day;
          
          return (
            <CalendarDay 
              key={`day-${day}`}
              isToday={isToday}
              isEmpty={false}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{day}</span>
              <MoodIndicator 
                hasMood={!!mood} 
                moodScore={mood?.score}
              />
            </CalendarDay>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default MoodCalendar;