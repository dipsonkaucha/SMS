
const studentContainer = document.getElementById("studentList");
const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
function renderAttendanceInputs() {
  studentContainer.innerHTML = "";
  if (storedStudents.length === 0) {
    studentContainer.innerHTML = `<p class='text-center text-gray-500'>No students found. Please add students first.</p>`;
    return;
  }
  const sorted = [...storedStudents].sort((a, b) => a.localeCompare(b));
  sorted.forEach((student, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg shadow-sm";
    wrapper.innerHTML = `
      <span>#${index + 1} - ${student}</span>
      <label class="flex items-center gap-2">
        <input type="radio" name="${student}" value="Present" required>
        <span>Present</span>
        <input type="radio" name="${student}" value="Absent">
        <span>Absent</span>
      </label>
    `;
    studentContainer.appendChild(wrapper);
  });
}
renderAttendanceInputs();
document.getElementById("attendanceForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  const attendanceData = JSON.parse(localStorage.getItem("attendance") || "{}");
  const dailyRecord = {};
  for (let [key, value] of formData.entries()) {
    dailyRecord[key] = value;
  }
  attendanceData[todayKey] = dailyRecord;
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  alert("Attendance submitted successfully!");
  e.target.reset();
  showMonthlyReport();
});
function showMonthlyReport() {
  const container = document.getElementById("monthlyReport");
  const content = document.getElementById("reportContent");
  const attendanceData = JSON.parse(localStorage.getItem("attendance") || "{}");
  const sortedStudents = [...storedStudents].sort((a, b) => a.localeCompare(b));
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let table = `<table class="min-w-full border text-center text-sm">
    <thead><tr><th class="border px-2 py-1">Roll No.</th><th class="border px-2 py-1">Name</th>`;
  for (let d = 1; d <= daysInMonth; d++) {
    table += `<th class="border px-2 py-1">${d}</th>`;
  }
  table += `</tr></thead><tbody>`;
  sortedStudents.forEach((name, index) => {
    table += `<tr><td class="border px-2 py-1">${index + 1}</td><td class="border px-2 py-1">${name}</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const status = attendanceData[dateStr]?.[name] || "-";
      table += `<td class="border px-2 py-1">${status}</td>`;
    }
    table += `</tr>`;
  });
  table += `</tbody></table>`;
  content.innerHTML = table;
  container.classList.remove("hidden");
}
