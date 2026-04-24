import React, { use, useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [data, setData] = useState([])

    const fetchMetrics = async () => {
    try {
        const res = await axios.get("http://127.0.0.1:5000/metrics");

        const newData = {
        time: new Date().toLocaleTimeString(),
        cpu: res.data.cpu,
        memory: res.data.memory_percent,
        };

        setData((prev) => [...prev.slice(-10), newData]);
    } catch (err) {
        console.error(err);
    }
    };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // refreshing every 3 sec to make it look live
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div>
      <h2>System Metrics</h2>
      {metrics ? (
        <div>
          <p>CPU: {metrics.cpu}%</p>
          <p>Memory: {metrics.memory_percent}%</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <LineChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="cpu" />
    <Line type="monotone" dataKey="memory" />
    </LineChart>
    </>
  );
}

export default Dashboard;