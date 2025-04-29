import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchInterns } from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6F91"];

function TechStats() {
  const [data, setData] = useState([]);
  const [interns, setInterns] = useState([]); // 🆕 Store full intern data

  useEffect(() => {
    fetchInterns().then(res => {
      const fetchedInterns = res.data;
      setInterns(fetchedInterns);

      const counts = {};
      fetchedInterns.forEach(intern => {
        (intern.techStack || []).forEach(tech => {
          counts[tech] = (counts[tech] || 0) + 1;
        });
      });

      const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
      setData(chartData);
    });
  }, []);

  const getTechVotes = (internList) => {
    const techMap = {};
    internList.forEach(intern => {
      if (!intern.techStack) return;
      intern.techStack.forEach(tech => {
        if (!techMap[tech]) techMap[tech] = [];
        techMap[tech].push(intern.name);
      });
    });
    return techMap;
  };

  const exportToExcel = () => {
    const techMap = getTechVotes(interns);
    const sheetData = Object.entries(techMap).map(([tech, names]) => ({
      Technology: tech,
      VotedBy: names.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tech Preferences");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "TechPreferences.xlsx");
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Tech Stack Distribution</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Show votes */}
      <div className="results" style={{ marginTop: "30px" }}>
        <h3>Tech Preferences Submitted So Far:</h3>
        <ul>
          {Object.entries(getTechVotes(interns)).map(([tech, voters]) => (
            <li key={tech}>
              <strong>{tech}:</strong> {voters.join(", ")}
            </li>
          ))}
        </ul>

        <button onClick={exportToExcel} style={{ marginTop: "10px" }}>
          Export as Excel
        </button>
      </div>
    </div>
  );
}

export default TechStats;
