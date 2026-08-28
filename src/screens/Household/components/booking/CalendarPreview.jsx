import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_INDEX = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarPreview({
  selectedDays = [],
  skippedDates = [],
  onToggleSkipDate,
  frequency = 'weekly',
  durationWeeks = '4',
  baseDate = ''
}) {
  const selectedIndexes = new Set(
    selectedDays.map(id => DAY_INDEX[id]).filter(v => v !== undefined)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startObj = baseDate ? new Date(baseDate) : new Date();
  startObj.setHours(0, 0, 0, 0);

  // Calculate End Date
  const numWeeks = durationWeeks === 'ongoing' ? 52 : (parseInt(durationWeeks, 10) || 4);
  const endObj = new Date(startObj);
  endObj.setDate(startObj.getDate() + (numWeeks * 7) - 1);
  endObj.setHours(23, 59, 59, 999);

  // Month navigation state: [currentYear, currentMonthIndex]
  const [viewYear, setViewYear]   = useState(startObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(startObj.getMonth());

  // Sync view when baseDate changes
  useEffect(() => {
    if (baseDate) {
      const d = new Date(baseDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [baseDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Build grid for the visible month (viewYear, viewMonth)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Helper to determine if date is a scheduled work day
  const isScheduledDate = (targetDate) => {
    if (targetDate < startObj || targetDate > endObj) return false;
    const dayOfWeek = targetDate.getDay();
    if (!selectedIndexes.has(dayOfWeek)) return false;

    // Check frequency (weekly vs biweekly)
    if (frequency === 'biweekly') {
      const diffDays = Math.floor((targetDate - startObj) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex % 2 !== 0) return false;
    }

    return true;
  };

  const calendarDays = [];

  // Padding cells before the 1st of the month
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
    calendarDays.push({
      date: prevDate,
      label: prevMonthDays - i,
      isOtherMonth: true,
      isScheduled: false,
      isPast: prevDate < today
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(viewYear, viewMonth, d);
    currDate.setHours(0, 0, 0, 0);

    const y = currDate.getFullYear();
    const m = String(currDate.getMonth() + 1).padStart(2, '0');
    const dayVal = String(currDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${dayVal}`;

    const isSched = isScheduledDate(currDate);

    calendarDays.push({
      date: currDate,
      dateKey,
      label: d,
      isOtherMonth: false,
      isScheduled: isSched,
      isPast: currDate < today
    });
  }

  // Padding cells after last day of month to complete grid (multiples of 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(viewYear, viewMonth + 1, i);
    calendarDays.push({
      date: nextDate,
      label: i,
      isOtherMonth: true,
      isScheduled: false,
      isPast: false
    });
  }

  // Range label
  const formattedStart = startObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedEnd = durationWeeks === 'ongoing'
    ? 'Ongoing Schedule'
    : endObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="cp-root">
      {/* Month Navigator Header with Arrows */}
      <div className="cp-header">
        <div className="cp-title-wrap">
          <span className="cp-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <span className="cp-range">{formattedStart} &rarr; {formattedEnd}</span>
        </div>
        <div className="cp-nav-btns">
          <button
            type="button"
            className="cp-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="cp-nav-btn"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="cp-grid cp-grid--head">
        {DAY_LABELS.map(l => (
          <div key={l} className="cp-cell cp-cell--head">{l}</div>
        ))}
      </div>

      {/* Calendar month grid */}
      <div className="cp-grid">
        {calendarDays.map((day, idx) => {
          if (day.isOtherMonth) {
            return (
              <div key={idx} className="cp-cell cp-cell--other">
                {day.label}
              </div>
            );
          }

          const isHighlightedActive = day.isScheduled && !day.isPast;
          const isSkipped = day.dateKey && skippedDates.includes(day.dateKey);

          return (
            <div
              key={idx}
              className={`cp-cell 
                ${isHighlightedActive ? (isSkipped ? 'cp-cell--skipped' : 'cp-cell--hl cp-cell--interactive') : ''} 
                ${day.isPast ? 'cp-cell--past' : ''}
              `}
              onClick={() => {
                if (isHighlightedActive && day.dateKey && onToggleSkipDate) {
                  onToggleSkipDate(day.dateKey);
                }
              }}
              title={day.isScheduled ? (isSkipped ? 'Session Skipped' : 'Booked Session') : ''}
            >
              {day.label}
            </div>
          );
        })}
      </div>

      {/* Legend & Summary Info */}
      <div className="cp-legend">
        <div className="cp-legend-item">
          <span className="cp-legend-dot" />
          <span>Active Scheduled Days</span>
        </div>
        <div className="cp-legend-item">
          <span className="cp-legend-dot cp-legend-dot--skipped" />
          <span>Skipped (Click to toggle)</span>
        </div>
      </div>

      <style>{`
        .cp-root {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #E2D9CF; padding: 1.1rem;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }
        .cp-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.85rem; padding-bottom: 0.5rem;
          border-bottom: 1px solid #F0EBE5;
        }
        .cp-title-wrap {
          display: flex; flex-direction: column; gap: 2px;
        }
        .cp-title {
          font-size: 0.95rem; font-weight: 700; color: #1E4030;
          font-family: 'Playfair Display', serif;
        }
        .cp-range {
          font-size: 0.72rem; color: #8A7E74; font-weight: 500;
        }
        .cp-nav-btns {
          display: flex; align-items: center; gap: 4px;
        }
        .cp-nav-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid #E2D9CF; background: #FAF8F5;
          color: #1E4030; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
          transition: all 0.15s;
        }
        .cp-nav-btn:hover {
          background: #1E4030; color: #fff; border-color: #1E4030;
        }
        .cp-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
        }
        .cp-grid--head {
          margin-bottom: 6px; padding-bottom: 4px;
          border-bottom: 1px solid #F5F1EC;
        }
        .cp-cell {
          aspect-ratio: 1; display: flex; align-items: center;
          justify-content: center; border-radius: 10px;
          font-size: 0.76rem; font-weight: 500; color: #5A5248;
          position: relative; transition: all 0.15s;
        }
        .cp-cell--head {
          font-size: 0.68rem; font-weight: 700; color: #8A7E74;
          aspect-ratio: unset; padding: 4px 0; text-transform: uppercase;
        }
        .cp-cell--other {
          color: #D4CDC5; opacity: 0.45;
        }
        .cp-cell--hl {
          background: #1E4030; color: #fff; font-weight: 700;
          box-shadow: 0 2px 8px rgba(30,64,48,0.25);
        }
        .cp-cell--skipped {
          background: rgba(176,168,158,0.15); color: #B0A89E; font-weight: 500;
          border: 1.5px dashed #B0A89E; box-sizing: border-box; text-decoration: line-through;
          cursor: pointer;
        }
        .cp-cell--interactive {
          cursor: pointer;
        }
        .cp-cell--interactive:hover {
          transform: scale(1.08);
          background: #152e22;
        }
        .cp-cell--past { color: #C5BEB7; opacity: 0.6; }
        .cp-legend {
          display: flex; align-items: center; gap: 1rem;
          font-size: 0.7rem; color: #8A7E74; margin-top: 0.85rem;
          padding-top: 0.6rem; border-top: 1px solid #F0EBE5;
          flex-wrap: wrap; justify-content: space-between;
        }
        .cp-legend-item {
          display: flex; align-items: center; gap: 6px;
        }
        .cp-legend-dot {
          width: 10px; height: 10px; border-radius: 3px;
          background: #1E4030; flex-shrink: 0;
        }
        .cp-legend-dot--skipped {
          background: rgba(176,168,158,0.15);
          border: 1.5px dashed #B0A89E; box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
