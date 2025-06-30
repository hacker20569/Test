
const colors = require("colors");
const readlineSync = require("readline-sync");

// Hiển thị banner khung trên
console.clear();
console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║             🚀 Script DDoS Bypass Cloudflare               ║
║                                                            ║
║       🆔 Telegram: @everything182   ☎️ Zalo: 0877667153     ║
║                                                            ║
║        Developed & Maintained by Phạm Xuân Tiến 🛠️         ║
╚════════════════════════════════════════════════════════════╝
`.rainbow);

// Nhập thông tin từ người dùng
const url = readlineSync.question("│   ├─── URL: ".rainbow);
const time = readlineSync.question("│   ├─── TIME (seconds): ".rainbow);
const rate = readlineSync.question("│   ├─── RATE (req/sec): ".rainbow);
const threads = readlineSync.question("│   ├─── THREADS: ".rainbow);
const proxyFile = readlineSync.question("│   ├─── PROXY FILE: ".rainbow);

// Hiển thị lại thông tin cấu hình
console.clear();
console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║             🚀 Script DDoS Bypass Cloudflare               ║
║                                                            ║
║  🎯 Target     : ${url.padEnd(44)}║
║  ⏱️  Duration   : ${time.padEnd(44)}║
║  🚀 Rate       : ${rate.padEnd(44)}║
║  🧵 Threads    : ${threads.padEnd(44)}║
║  🌐 Proxy List : ${proxyFile.padEnd(44)}║
║                                                            ║
║        Developed & Maintained by Phạm Xuân Tiến 🛠️         ║
║       🆔 Telegram: @everything182   ☎️ Zalo: 0877667153     ║
╚════════════════════════════════════════════════════════════╝
`.cyan);

// Giả lập tấn công (mock)
console.log("
[!] Bắt đầu gửi attack...
".red);
let dot = ".";
let i = 1;

const interval = setInterval(() => {
  process.stdout.write(colors.rainbow(`[⚔️] Attacking ${url} ${dot.repeat(i % 5)} `));
  i++;
}, 300);

setTimeout(() => {
  clearInterval(interval);
  console.log("\n[✔] Attack simulation hoàn tất!".green);
  process.exit(0);
}, parseInt(time) * 1000);
