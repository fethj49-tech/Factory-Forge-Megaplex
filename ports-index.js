const activeBuses = Array.from({ length: 16 }, (_, i) => ({
  busId: i + 1,
  port: 8080 + i,
  status: "ONLINE",
  role: i < 4 ? "Core Telemetry & State" : i < 8 ? "Distributed Agents" : i < 12 ? "Real-Time Code Sync" : "APK & Build Pipelines"
}));

console.table(activeBuses);
