// goals.js
import { format } from "date-fns";

export async function fetchGoals() {
  const fileId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FILE_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const corsProxy = "https://corsproxy.io/?";
  const driveApiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  try {
    const response = await fetch(`${corsProxy}${encodeURIComponent(driveApiUrl)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const goals = data.goals;
    let totalProgress = 0;
    let totalGoals = goals.length;
    let totalTasks = 0;
    let completedTasks = 0;

    // We'll store type counts AND an array of goal titles in each day’s entry:
    // e.g. streakHistory[dateStr] = { major: 0, medium: 0, small: 0, activities: [] }
    let streakHistory = {};

    goals.forEach((goal) => {
      totalProgress += goal.progress;

      goal.tasks.forEach((task) => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });

      goal.history.forEach((range) => {
        const startDate = new Date(range.start);
        const endDate = new Date(range.end);

        while (startDate <= endDate) {
          const dateStr = format(startDate, "yyyy-MM-dd");

          if (!streakHistory[dateStr]) {
            streakHistory[dateStr] = {
              major: 0,
              medium: 0,
              small: 0,
              activities: []
            };
          }

          // Increment type counts
          if (goal.type === "Major") streakHistory[dateStr].major++;
          if (goal.type === "Medium") streakHistory[dateStr].medium++;
          if (goal.type === "Small") streakHistory[dateStr].small++;

          // Store the goal's title for that day
          streakHistory[dateStr].activities.push(goal.title);

          startDate.setDate(startDate.getDate() + 1);
        }
      });
    });

    // Sort goals as needed
    goals.sort((a, b) => {
      const isCompletedA = a.progress === 100;
      const isCompletedB = b.progress === 100;
      if (isCompletedA !== isCompletedB) {
        // completed (100%) go to bottom
        return isCompletedA - isCompletedB;
      }

      // then earliest deadline
      const dateA = a.deadline ? new Date(a.deadline) : Infinity;
      const dateB = b.deadline ? new Date(b.deadline) : Infinity;
      if (dateA !== dateB) return dateA - dateB;

      // then lowest progress
      return a.progress - b.progress;
    });

    const averageProgress =
      totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;

    return {
      goals,
      averageProgress,
      totalGoals,
      totalTasks,
      completedTasks,
      streakHistory
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      goals: [],
      averageProgress: 0,
      totalGoals: 0,
      totalTasks: 0,
      completedTasks: 0,
      streakHistory: {}
    };
  }
}
