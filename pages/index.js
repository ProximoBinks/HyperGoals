import { useEffect, useState } from "react";
import { fetchGoals } from "../lib/goals";
import {
  format,
  subMonths,
  addMonths,
  getDaysInMonth,
  startOfMonth,
  isSameMonth
} from "date-fns";

export default function Home() {
  const [goalsData, setGoalsData] = useState({
    goals: [],
    averageProgress: 0,
    totalGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
    streakHistory: {}
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadGoals() {
      const data = await fetchGoals();
      setGoalsData(data);
    }
    loadGoals();
  }, []);

  const { goals, averageProgress, totalGoals, totalTasks, completedTasks, streakHistory } = goalsData;

  // Same date-based logic as before
  const monthName = format(currentDate, "MMMM yyyy");
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const today = new Date();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(firstDayOfMonth);
    date.setDate(i + 1);
    return date;
  });

  const getColorForDate = (dateStr) => {
    const { major = 0, medium = 0, small = 0 } = streakHistory[dateStr] || {};

    // 1) Green => >=1 major, >=2 medium, >=2 small
    if (major >= 1 && medium >= 2 && small >= 1) {
      return "bg-green-500";
    }
    // 2) Blue => some activity but doesn’t meet green threshold
    else if (major > 0 || medium > 0 || small > 0) {
      return "bg-blue-500";
    }
    // 3) Gray => no activity
    else {
      return "bg-gray-300";
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-[700] text-center mt-6 font-proxima-condensed">📌 MY GOALS</h2>

      {/* Overall Progress */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-center">
        <h3 className="text-lg font-[600]">Overall Progress ({averageProgress}%)</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedTasks} / {totalTasks} tasks completed across {totalGoals} goals.
        </p>
      </div>

      {/* Streak Calendar */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            ←
          </button>
          <h3 className="text-[0.95rem] md:text-lg font-[600]">
            {`🔥 Streak Calendar ${monthName}`}
          </h3>
          <button
            className={`px-3 py-1 rounded ${isSameMonth(currentDate, today)
              ? "opacity-50 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            onClick={() => {
              if (!isSameMonth(currentDate, today)) {
                setCurrentDate(addMonths(currentDate, 1));
              }
            }}
            disabled={isSameMonth(currentDate, today)}
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const dateStr = format(date, "yyyy-MM-dd");
            return (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-md ${getColorForDate(dateStr)}`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
          <span>⚪ No Activity</span>
          <span>🔵 Any Activity</span>
          <span>🟩 1 Major + 2 Medium + 1 Small</span>
        </p>
      </div>

      {/* Individual Goals & Tasks */}
      <div className="mt-6 space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-base font-[600]">
              {goal.title} ({goal.progress}%)
              {goal.deadline && (
                <div className="text-red-500 text-sm my-2">
                  (Deadline: {goal.deadline})
                </div>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              🔥 Current Streak: {goal.current_streak} days | Max Streak: {goal.max_streak} days
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            {/* Display the goal type next to each task */}
            <ul className="mt-3 space-y-2">
              {goal.tasks.map((task, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className={task.completed ? "text-green-500" : "text-gray-500"}>
                    {task.completed ? "✔" : "○"}
                  </span>
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }
                  >
                    {task.title} ({task.progress}%)
                  </span>
                  {/* Add the goal's type here */}
                  <span className="text-xs text-gray-400 italic">
                    [{goal.type}]
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
