const fs = require('fs');
const path = require('path');

const BRIEFCASE_DIR = path.join(__dirname, 'briefcases');

if (!fs.existsSync(BRIEFCASE_DIR)) {
  fs.mkdirSync(BRIEFCASE_DIR, { recursive: true });
  console.log("[BRIEFCASE] Initialized local file room directory at:", BRIEFCASE_DIR);
}

function saveBriefcase(name, data) {
  const filePath = path.join(BRIEFCASE_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`[BRIEFCASE] Saved runtime package: ${name}.json`);
}

function loadBriefcase(name) {
  const filePath = path.join(BRIEFCASE_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }
  return null;
}

module.exports = { saveBriefcase, loadBriefcase };
