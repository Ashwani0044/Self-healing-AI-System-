import React, { useEffect, useState } from "react"; 
import "./Dashboard.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer 
} from "recharts";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiData, setAiData] = useState(null);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/metrics");
      
      setMetrics(res.data);

      const newData = {
        time: new Date().toLocaleTimeString(),
        cpu: res.data.cpu,
        memory: res.data.memory_percent,
      };

      // Keeping only the last 10-15 entries for a clean chart
      setData((prev) => {
        const updatedData = [...prev, newData];
        return updatedData.slice(-15); 
      });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/logs");
      setLogs(res.data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  const analyzeLogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/analyze-log");
      console.log("Full AI Response:", res.data);
      setAiData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerError = async () => {
    try {
      await axios.get("http://127.0.0.1:5000/simulate-error");
      fetchLogs(); // refreshing logs
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
      fetchLogs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">System Real-time Monitor</h2>
      
      <div className="metrics-grid">
        {metrics ? (
          <>
            <div className="metric-card">
              <span className="metric-label">CPU Usage</span>
              <div className="metric-value">{metrics.cpu}%</div>
            </div>
            <div className="metric-card">
              <span className="metric-label">Memory Usage</span>
              <div className="metric-value">{metrics.memory_percent}%</div>
            </div>
          </>
        ) : (
          <p className="loading-text">Connecting to server...</p>
        )}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Line type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* LOGS */}
      <h2 className="dashboard-title" style={{marginTop: '2rem'}}>System Logs</h2>
      <div className="logs-section">
        {logs.length > 0 ? logs.map((log, index) => (
          <div key={index} className="log-entry">{log}</div>
        )) : <p className="loading-text">No logs available...</p>}
      </div>

      <div className="button-group">
        <button onClick={triggerError} style={{backgroundColor: '#ef4444', color: 'white'}}>
          Simulate Error
        </button>
        <button onClick={analyzeLogs}>
          Analyze Last Error
        </button>
      </div>

      {aiData && (
        <div className="ai-analysis-container">
          <h2 style={{color: '#10b981', marginTop: 0}}>AI Explanation</h2>
          <p><strong>Detected Log:</strong> <code style={{color: '#38bdf8'}}>{aiData.log}</code></p>
          <div className="ai-explanation">
            {aiData.ai_explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;