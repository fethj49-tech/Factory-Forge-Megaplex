class LocalAgent {
  constructor(name, port, role) {
    this.name = name;
    this.port = port;
    this.role = role;
  }

  executeTask(task, toolFunction) {
    console.log(`[AGENT: ${this.name}] (Port ${this.port}) -> Executing: "${task}"`);
    try {
      const result = toolFunction(task);
      console.log(`[AGENT: ${this.name}] -> Success. Output:`, result);
      return { agent: this.name, status: "SUCCESS", result };
    } catch (error) {
      console.error(`[AGENT: ${this.name}] -> Error:`, error.message);
      return { agent: this.name, status: "FAILED", error: error.message };
    }
  }

  handoff(nextAgent, payload) {
    console.log(`[AGENT: ${this.name}] ===> Handoff to [${nextAgent.name}] on Port ${nextAgent.port}`);
    return nextAgent.executeTask(payload, t => `Processed handoff: ${t}`);
  }
}

const janus = new LocalAgent("Janus", 8080, "Pipeline & Bus Controller");
const forge = new LocalAgent("Forge", 8084, "Build & Code Execution");

const res = janus.executeTask("Initialize Factory Forge Megaplex local runtime", t => `State active for: ${t}`);
if (res.status === "SUCCESS") {
  janus.handoff(forge, "Compile local asset pipeline manifest");
}
