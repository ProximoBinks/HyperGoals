export async function fetchGoals() {
  const fileId = "1XcZ_A5ZpnX_YdaXqwA6p-GoxnM5p3pdz"; // Your Google Drive file ID
  const apiKey = "AIzaSyB5JVATW1RCSSnGQ1bxS8J2LN_SFkbYerE"; // Replace with regenerated key

  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text(); // Get file content

    const goals = [];
    let currentGoal = null;

    text.split("\n").forEach(line => {
      let goalMatch = line.match(/\[Goal\] (.+) \((\d+)%\)/);
      let taskMatch = line.match(/- \[(✔| )\] (.+) \((\d+)%\)/);

      if (goalMatch) {
        currentGoal = {
          title: goalMatch[1],
          progress: parseInt(goalMatch[2]),
          tasks: []
        };
        goals.push(currentGoal);
      } else if (taskMatch && currentGoal) {
        currentGoal.tasks.push({
          title: taskMatch[2],
          progress: parseInt(taskMatch[3]),
          completed: taskMatch[1] === "✔"
        });
      }
    });

    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}
