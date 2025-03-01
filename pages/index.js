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

  // For displaying a modal when a day is clicked
  const [selectedDay, setSelectedDay] = useState(null); // or store { dateStr, dateObj, activities[] }

  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadGoals() {
      const data = await fetchGoals();
      setGoalsData(data);
    }
    loadGoals();
  }, []);

  const {
    goals,
    averageProgress,
    totalGoals,
    totalTasks,
    completedTasks,
    streakHistory
  } = goalsData;

  const monthName = format(currentDate, "MMMM yyyy");
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const today = new Date();

  // Generate the list of days for current month
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(firstDayOfMonth);
    date.setDate(i + 1);
    return date;
  });

  // Example logic: Green if major>=1 && medium>=2 && small>=1, Blue if other activity, Gray if none
  const getColorForDate = (dateStr) => {
    const info = streakHistory[dateStr] || {};
    const major = info.major || 0;
    const medium = info.medium || 0;
    const small = info.small || 0;

    if (major >= 1 && medium >= 2 && small >= 1) {
      return "bg-green-500";
    } else if (major > 0 || medium > 0 || small > 0) {
      return "bg-blue-500";
    } else {
      // Switch background color based on dark mode:
      return isDarkMode ? "bg-gray-600" : "bg-gray-300";
    }
  };

  // Open the modal with this day’s info
  const handleDayClick = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const activities = streakHistory[dateStr]?.activities || [];
    setSelectedDay({
      dateObj: day,
      dateStr,
      activities
    });
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  return (
    <div
      // Parent container classes switch based on isDarkMode
      className={
        isDarkMode
          ? "p-4 min-h-screen bg-gray-900 text-gray-100 transition-colors"
          : "p-4 min-h-screen bg-gray-100 text-gray-900 transition-colors"
      }
    >
      {/* DARK MODE TOGGLE BUTTON */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={
            isDarkMode
              ? "bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
              : "bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
          }
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <h2 className="text-2xl font-[700] text-center mt-2 font-proxima-condensed">
        📌 MY GOALS
      </h2>

      {/* Overall Progress */}
      <div
        className={
          isDarkMode
            ? "bg-gray-800 p-4 rounded-lg shadow-md mt-4 text-center"
            : "bg-white p-4 rounded-lg shadow-md mt-4 text-center"
        }
      >
        <h3 className="text-lg font-[600]">
          Overall Progress ({averageProgress}%)
        </h3>
        <div
          className={
            isDarkMode
              ? "w-full bg-gray-700 rounded-full h-3 mt-2"
              : "w-full bg-gray-200 rounded-full h-3 mt-2"
          }
        >
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p className="text-sm mt-2">
          {completedTasks} / {totalTasks} tasks completed across {totalGoals}{" "}
          goals.
        </p>
      </div>

      {/* Streak Calendar */}
      <div
        className={
          isDarkMode
            ? "bg-gray-800 p-4 rounded-lg shadow-md mt-6"
            : "bg-white p-4 rounded-lg shadow-md mt-6"
        }
      >
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
            className={`px-3 py-1 rounded ${
              isSameMonth(currentDate, today)
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
          {calendarDays.map((dateObj, index) => {
            const dateStr = format(dateObj, "yyyy-MM-dd");
            const colorClass = getColorForDate(dateStr);

            return (
              <div
                key={index}
                // 1) Add text color based on dark mode so the day number toggles properly:
                className={`w-10 h-10 flex items-center justify-center font-bold rounded-md cursor-pointer ${colorClass} ${
                  isDarkMode ? "text-gray-100" : "text-white"
                }`}
                onClick={() => handleDayClick(dateObj)} // open the modal
              >
                {dateObj.getDate()}
              </div>
            );
          })}
        </div>

        <p
          className={
            isDarkMode
              ? "text-sm text-gray-400 mt-4 text-center flex flex-col sm:flex-row sm:justify-center sm:space-x-4"
              : "text-sm text-gray-500 mt-4 text-center flex flex-col sm:flex-row sm:justify-center sm:space-x-4"
          }
        >
          <span>🟢 1 Major, 2 Medium, 1 Small</span>
          <span>🔵 Other Activity</span>
          <span>⚪ No Activity</span>
        </p>
      </div>

      {/* MODAL Overlay */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          {/* Modal itself */}
          <div
            className={
              isDarkMode
                ? "bg-gray-800 rounded-lg shadow-lg p-4 w-80 max-w-full mx-2 relative text-gray-100 border"
                : "border border-black bg-white rounded-lg shadow-lg p-4 w-80 max-w-full mx-2 relative text-gray-900"
            }
          >
            {/* Close button */}
            <button
              className={
                isDarkMode
                  ? "absolute top-2 right-2 text-gray-300 hover:text-gray-100"
                  : "absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              }
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-center mb-2">
              {format(selectedDay.dateObj, "MMMM d, yyyy")}
            </h3>

            {selectedDay.activities.length === 0 ? (
              <p className="text-center text-gray-400">
                No activity on this day.
              </p>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold">Activities:</p>
                {selectedDay.activities.map((act, idx) => (
                  <p key={idx}>• {act}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Goals */}
      <div className="mt-6 space-y-4">
        {goals.map((goal, index) => (
          // 2) Put "text-gray-100" on the container if dark:
          <div
            key={index}
            className={
              isDarkMode
                ? "bg-gray-800 p-4 rounded-lg shadow-md text-gray-100"
                : "bg-white p-4 rounded-lg shadow-md text-gray-900"
            }
          >
            <h3 className="text-base font-[600]">
              {goal.title} ({goal.progress}%)
              {goal.deadline && (
                <div className="text-red-500 text-sm my-2">
                  (Deadline: {goal.deadline})
                </div>
              )}
            </h3>
            <p
              className={
                isDarkMode
                  ? "text-sm text-gray-400"
                  : "text-sm text-gray-500"
              }
            >
              🔥 Current Streak: {goal.current_streak} days | Max Streak:{" "}
              {goal.max_streak} days
            </p>

            <div
              className={
                isDarkMode
                  ? "w-full bg-gray-700 rounded-full h-2 mt-2"
                  : "w-full bg-gray-200 rounded-full h-2 mt-2"
              }
            >
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <ul className="mt-3 space-y-2">
              {goal.tasks.map((task, idx) => {
                // If the task is complete, we do line-through text-gray-400.
                // Otherwise, we pick text color based on isDarkMode vs. normal:
                const taskTextClass = task.completed
                  ? "line-through text-gray-400"
                  : isDarkMode
                  ? "text-gray-100"
                  : "text-gray-800";

                return (
                  <li key={idx} className="flex items-center space-x-2">
                    <span
                      className={
                        task.completed
                          ? "text-green-500"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }
                    >
                      {task.completed ? "✔" : "○"}
                    </span>
                    <span className={taskTextClass}>
                      {task.title} ({task.progress}%)
                    </span>
                    <span className="text-xs text-gray-400 italic">
                      [{goal.type}]
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
