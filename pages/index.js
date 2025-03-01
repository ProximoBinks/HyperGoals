import { useEffect, useState } from "react";
import { fetchGoals } from "../lib/goals";

export default function Home() {
  const [goalsData, setGoalsData] = useState({
    goals: [],
    averageProgress: 0,
    totalGoals: 0,
    totalTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    async function loadGoals() {
      const data = await fetchGoals();
      setGoalsData(data);
    }
    loadGoals();
  }, []);

  const { goals, averageProgress, totalGoals, totalTasks, completedTasks } = goalsData;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-[700] text-center mt-6">📌 My Goals</h2>

      {/* Overall Progress Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-center">
        <h3 className="text-lg font-[600]">Overall Progress ({averageProgress}%)</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: `${averageProgress}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedTasks} / {totalTasks} tasks completed across {totalGoals} goals.
        </p>
      </div>

      {/* Individual Goals */}
      <div className="mt-6 space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-base font-[600]">
              {goal.title} ({goal.progress}%) 
              {goal.daysLeft !== null && (
                <span className="text-red-500 text-sm"> ({goal.daysLeft} days left)</span>
              )}
            </h3>
            <p className="text-sm text-gray-500">🔥 Streak: {goal.streak} days</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
            </div>
            <ul className="mt-3 space-y-2">
              {goal.tasks.map((task, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className={task.completed ? "text-green-500" : "text-gray-500"}>
                    {task.completed ? "✔" : "○"}
                  </span>
                  <span className={task.completed ? "line-through text-gray-400" : "text-gray-800"}>
                    {task.title} ({task.progress}%)
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
