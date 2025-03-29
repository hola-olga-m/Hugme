import React, { useMemo } from 'react';
import styled from 'styled-components';

const TrendContainer = styled.div`
  margin: 2rem 0;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const TrendTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartContainer = styled.div`
  height: 200px;
  position: relative;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const XAxis = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--gray-300);
`;

const YAxis = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background-color: var(--gray-300);
`;

const DataPoint = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color || 'var(--primary-color)'};
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: var(--transition-base);
  z-index: 2;

  &:hover {
    transform: translate(-50%, 50%) scale(1.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.color || 'var(--primary-color)'};
    opacity: 0.2;
    z-index: -1;
  }
`;

const DataLine = styled.div`
  position: absolute;
  height: 2px;
  background-color: ${props => props.color || 'var(--primary-color)'};
  opacity: 0.5;
  z-index: 1;
  transform-origin: left center;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--gray-700);
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 8px;
  }
`;

const DateLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 5px;
  
  .date-label {
    font-size: 0.75rem;
    color: var(--gray-500);
    transform: translateX(-50%);
    text-align: center;
    width: 60px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: var(--gray-500);
  font-style: italic;
`;

const ScoreLabels = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -30px;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
  
  .intensity-label {
    font-size: 0.75rem;
    color: var(--gray-500);
    text-align: right;
  }
`;

const getColorForIntensity = (intensity) => {
  if (intensity >= 8) return 'var(--success-color)';
  if (intensity >= 6) return 'var(--tertiary-color)';
  if (intensity >= 4) return 'var(--warning-color)';
  return 'var(--danger-color)';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MoodTrend = ({ moods, days = 7, onPointClick }) => {
  // Sort moods by date
  const sortedMoods = useMemo(() => {
    if (!moods || !moods.length) return [];
    return [...moods]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-days); // Get last 'days' entries
  }, [moods, days]);
  
  // Calculate positions for each data point
  const dataPoints = useMemo(() => {
    if (!sortedMoods.length) return [];
    
    const totalWidth = 100; // percentage
    const segmentWidth = totalWidth / (Math.max(sortedMoods.length - 1, 1));
    
    return sortedMoods.map((mood, index) => {
      const xPos = index * segmentWidth;
      const yPos = ((10 - mood.intensity) / 9) * 100; // Intensity 1-10 to percentage 100-0
      const color = getColorForIntensity(mood.intensity);
      
      return {
        mood,
        x: xPos,
        y: yPos,
        color
      };
    });
  }, [sortedMoods]);
  
  // Calculate lines between points
  const dataLines = useMemo(() => {
    if (dataPoints.length < 2) return [];
    
    return dataPoints.slice(0, -1).map((point, index) => {
      const nextPoint = dataPoints[index + 1];
      const length = Math.sqrt(
        Math.pow(nextPoint.x - point.x, 2) + 
        Math.pow(nextPoint.y - point.y, 2)
      );
      
      const angle = Math.atan2(
        nextPoint.y - point.y,
        nextPoint.x - point.x
      ) * 180 / Math.PI;
      
      return {
        x: point.x,
        y: point.y,
        length,
        angle,
        color: point.color
      };
    });
  }, [dataPoints]);
  
  const dateLabels = useMemo(() => {
    if (!sortedMoods.length) return [];
    
    // For fewer points, show all dates
    if (sortedMoods.length <= 4) {
      return sortedMoods.map((mood, index) => ({
        date: formatDate(mood.createdAt),
        position: dataPoints[index].x
      }));
    }
    
    // For more points, show first, middle and last
    return [
      {
        date: formatDate(sortedMoods[0].createdAt),
        position: dataPoints[0].x
      },
      {
        date: formatDate(sortedMoods[Math.floor(sortedMoods.length / 2)].createdAt),
        position: dataPoints[Math.floor(dataPoints.length / 2)].x
      },
      {
        date: formatDate(sortedMoods[sortedMoods.length - 1].createdAt),
        position: dataPoints[dataPoints.length - 1].x
      }
    ];
  }, [sortedMoods, dataPoints]);
  
  const handlePointClick = (mood) => {
    if (onPointClick) {
      onPointClick(mood);
    }
  };
  
  return (
    <TrendContainer>
      <TrendTitle>Your Mood Trend</TrendTitle>
      
      {sortedMoods.length === 0 ? (
        <EmptyMessage>
          No mood data available for the selected period
        </EmptyMessage>
      ) : (
        <>
          <ChartContainer>
            <ScoreLabels>
              <div className="intensity-label">10</div>
              <div className="intensity-label">8</div>
              <div className="intensity-label">6</div>
              <div className="intensity-label">4</div>
              <div className="intensity-label">2</div>
            </ScoreLabels>
            
            <XAxis />
            <YAxis />
            
            {dataLines.map((line, index) => (
              <DataLine
                key={`line-${index}`}
                style={{
                  left: `${line.x}%`,
                  bottom: `${100 - line.y}%`,
                  width: `${line.length}%`,
                  transform: `rotate(${line.angle}deg)`
                }}
                color={line.color}
              />
            ))}
            
            {dataPoints.map((point, index) => (
              <DataPoint
                key={`point-${index}`}
                style={{
                  left: `${point.x}%`,
                  bottom: `${100 - point.y}%`
                }}
                color={point.color}
                onClick={() => handlePointClick(point.mood)}
                title={`Mood: ${point.mood.intensity}/10 on ${formatDate(point.mood.createdAt)}`}
              />
            ))}
          </ChartContainer>
          
          <DateLabels>
            {dateLabels.map((label, index) => (
              <div 
                key={`date-${index}`}
                className="date-label"
                style={{ marginLeft: `${label.position}%` }}
              >
                {label.date}
              </div>
            ))}
          </DateLabels>
          
          <Legend>
            <LegendItem color="var(--success-color)">
              <div className="legend-color"></div>
              <span>Good (8-10)</span>
            </LegendItem>
            <LegendItem color="var(--tertiary-color)">
              <div className="legend-color"></div>
              <span>Okay (6-7)</span>
            </LegendItem>
            <LegendItem color="var(--warning-color)">
              <div className="legend-color"></div>
              <span>Low (4-5)</span>
            </LegendItem>
            <LegendItem color="var(--danger-color)">
              <div className="legend-color"></div>
              <span>Bad (1-3)</span>
            </LegendItem>
          </Legend>
        </>
      )}
    </TrendContainer>
  );
};

export default MoodTrend;