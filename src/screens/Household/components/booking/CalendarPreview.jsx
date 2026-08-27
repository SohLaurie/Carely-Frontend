import React from 'react';

// Map day IDs to JS Date day-of-week index (0 = Sunday)
const DAY_INDEX = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS  = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function buildCalendar(selectedDayIds) {
  const selectedIndexes = new Set(selectedDayIds.map(id => DAY_INDEX[id]).filter(v => v !== undefined));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build 4 weeks starting from today's Monday (or today if Monday)
  const startDay = new Date(today);
  const dow = today.getDay(); // 0=Sun
  const diffToMon = (dow === 0 ? -6 : 1 - dow);
  startDay.setDate(startDay.getDate() + diffToMon);

  const weeks = [];
  for (let w = 0; w < 4; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + w * 7 + d);
      week.push({
        date,
        label: date.getDate(),
        month: date.getMonth(),
        isHighlighted: selectedIndexes.has(date.getDay()),
        isPast: date < today,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

export default function CalendarPreview({ selectedDays = [] }) {
  const weeks = buildCalendar(selectedDays);
  const startDate = weeks[0][0].date;
  const endDate   = weeks[3][6].date;
  const rangeLabel = `${startDate.getDate()} ${MONTH_NAMES[startDate.getMonth()]} – ${endDate.getDate()} ${MONTH_NAMES[endDate.getMonth()]}`;

  return (
    <div className="cp-root">
      <div className="cp-header">
        <span className="cp-title">Next 4 weeks</span>
        <span className="cp-range">{rangeLabel}</span>
      </div>

      {/* Day-of-week headers */}
      <div className="cp-grid cp-grid--head">
        {DAY_LABELS.map(l => (
          <div key={l} className="cp-cell cp-cell--head">{l}</div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} className="cp-grid">
          {week.map((day, di) => (
            <div
              key={di}
              className={`cp-cell ${day.isHighlighted && !day.isPast ? 'cp-cell--hl' : ''} ${day.isPast ? 'cp-cell--past' : ''}`}
            >
              {day.month !== weeks[wi][di === 0 ? 0 : di - 1]?.month && di > 0
                ? <span className="cp-month-tick">{MONTH_NAMES[day.month].slice(0,3)}</span>
                : null
              }
              {day.label}
            </div>
          ))}
        </div>
      ))}

      {selectedDays.length > 0 && (
        <p className="cp-legend">
          <span className="cp-legend-dot" /> Booked sessions
        </p>
      )}

      <style>{`
        .cp-root {
          background: #fff; border-radius: 14px;
          border: 1.5px solid #E0DBD5; padding: 0.9rem;
          font-family: 'Inter', sans-serif;
        }
        .cp-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.6rem;
        }
        .cp-title { font-size: 0.8rem; font-weight: 700; color: #1C1A17; }
        .cp-range { font-size: 0.72rem; color: #8A7E74; }
        .cp-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px;
          margin-bottom: 3px;
        }
        .cp-grid--head { margin-bottom: 6px; }
        .cp-cell {
          aspect-ratio: 1; display: flex; align-items: center;
          justify-content: center; border-radius: 8px;
          font-size: 0.72rem; font-weight: 500; color: #5A5248;
          position: relative;
        }
        .cp-cell--head {
          font-size: 0.65rem; font-weight: 700; color: #8A7E74;
          aspect-ratio: unset; padding: 0;
        }
        .cp-cell--hl {
          background: #2D6A4F; color: #fff; font-weight: 700;
        }
        .cp-cell--past { color: #C5BEB7; }
        .cp-month-tick {
          position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
          font-size: 0.55rem; color: #8A7E74; white-space: nowrap;
        }
        .cp-legend {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.68rem; color: #8A7E74; margin: 0.55rem 0 0;
        }
        .cp-legend-dot {
          width: 10px; height: 10px; border-radius: 3px;
          background: #2D6A4F; flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
