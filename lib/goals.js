export async function fetchGoals() {
  const fileId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FILE_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    const goals = [];
    let currentGoal = null;
    let totalProgress = 0;
    let totalGoals = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    const today = new Date();

    text.split("\n").forEach(line => {
      let goalMatch = line.match(/\[Goal\] (.+) \((\d+)%\)(?: {Deadline: (\d{4}-\d{2}-\d{2})})?(?: {Streak: (\d+) days})?/);
      let taskMatch = line.match(/- \[(✔| )\] (.+) \((\d+)%\)/);

      if (goalMatch) {
        const deadline = goalMatch[3] ? new Date(goalMatch[3]) : null;
        const daysLeft = deadline ? Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))) : null;
        const streak = goalMatch[4] ? parseInt(goalMatch[4]) : 0;

        currentGoal = {
          title: goalMatch[1],
          progress: parseInt(goalMatch[2]),
          deadline: goalMatch[3] || "No deadline",
          daysLeft,
          streak,
          tasks: []
        };

        goals.push(currentGoal);
        totalProgress += currentGoal.progress;
        totalGoals++;
      } else if (taskMatch && currentGoal) {
        const task = {
          title: taskMatch[2],
          progress: parseInt(taskMatch[3]),
          completed: taskMatch[1] === "✔"
        };
        currentGoal.tasks.push(task);
        totalTasks++;
        if (task.completed) completedTasks++;
      }
    });

    // Sort by unfinished goals first, then by progress (ascending)
    goals.sort((a, b) => (a.progress === 100) - (b.progress === 100) || a.progress - b.progress);

    // Calculate overall percentage (average of all goal progress)
    const averageProgress = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;

    return { goals, averageProgress, totalGoals, totalTasks, completedTasks };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { goals: [], averageProgress: 0, totalGoals: 0, totalTasks: 0, completedTasks: 0 };
  }
}