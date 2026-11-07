const fs = require('fs');

const agentRegistry = {
  "Bus-1-Supervisor": { port: 8080, type: "Supervisor Core" },
  "Bus-2-Supervisor": { port: 8081, type: "Supervisor Core" },
  "Bus-3-Supervisor": { port: 8082, type: "Supervisor Core" },
  "Bus-4-Supervisor": { port: 8083, type: "Supervisor Core" },
  "Gobot-1.0": { port: 8084, type: "Sentinel Agent" },
  "Nexus-Prime": { port: 8098, type: "Directive Agent" },
  "Forge": { port: 8085, type: "Factory Agent" },
  "Janus": { port: 8086, type: "Factory Agent" },
  "Dean": { port: 8087, type: "Factory Agent" },
  "FLandangO": { port: 8088, type: "Factory Agent" },
  "Anita": { port: 8089, type: "Secretary Workstation" },
  "Kyle": { port: 8090, type: "Factory Agent" },
  "Alejandro": { port: 8091, type: "Factory Agent" },
  "Zixuan": { port: 8092, type: "Factory Agent" },
  "Ali": { port: 8093, type: "Factory Agent" },
  "Natalia": { port: 8094, type: "Factory Agent" },
  "Dion": { port: 8095, type: "Factory Agent" },
  "Emily": { port: 8096, type: "Factory Agent" }
};

console.log("=== FACTORY & SENTINEL AGENT PORT REGISTRY ===");
for (const [agent, config] of Object.entries(agentRegistry)) {
  console.log(`Agent: ${agent.padEnd(20)} | Port: ${config.port} | Role: ${config.type}`);
}

fs.writeFileSync('port-registry.json', JSON.stringify(agentRegistry, null, 2));
console.log("\n[Registry saved to port-registry.json]");
