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
    let streakHistory = {};

    const today = new Date();

    goals.forEach(goal => {
      totalProgress += goal.progress;

      goal.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });

      // Parse streak ranges and update history
      // Ensure we track streaks correctly
      goal.history.forEach(range => {
        const startDate = new Date(range.start);
        const endDate = new Date(range.end);

        while (startDate <= endDate) {
          const dateStr = format(startDate, "yyyy-MM-dd");

          if (!streakHistory[dateStr]) {
            streakHistory[dateStr] = 0;
          }
          streakHistory[dateStr] += 1;

          startDate.setDate(startDate.getDate() + 1);
        }
      });
    });

    // ✅ Sort goals by:
    // 1️⃣ Nearest deadline first (earliest due date first).
    // 2️⃣ Goals with no deadline go to the bottom.
    // 3️⃣ Within the same deadline, sort by progress (least completed first).
    goals.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : Infinity;
      const dateB = b.deadline ? new Date(b.deadline) : Infinity;

      if (dateA !== dateB) return dateA - dateB; // Sort by nearest deadline
      return a.progress - b.progress; // If same deadline, sort by least progress first
    });

    const averageProgress = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;

    return { goals, averageProgress, totalGoals, totalTasks, completedTasks, streakHistory };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { goals: [], averageProgress: 0, totalGoals: 0, totalTasks: 0, completedTasks: 0, streakHistory: {} };
  }
}
