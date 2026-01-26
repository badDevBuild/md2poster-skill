const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

const PROJECT_ROOT = path.resolve(__dirname);
const VITE_PROJECT_ROOT = path.join(PROJECT_ROOT, 'vite-project');
const PUBLIC_DIR = path.join(VITE_PROJECT_ROOT, 'public');
const CONTENT_FILE = path.join(PUBLIC_DIR, 'content.json');

// Helper to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node render.js <input_markdown_file> [output_image_file] [theme] [size] [template]');
        process.exit(1);
    }

    const inputFile = path.resolve(args[0]);
    // Theme is 3rd arg defaults to git-hub
    const theme = args[2] || 'git-hub';
    // Size is 4th arg, defaults to 'pc'
    const size = args[3] || 'pc';
    // Template is 5th arg. Optional.
    const template = args[4];

    if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
    }

    // Determine Output Path
    const downloadsDir = path.join(os.homedir(), 'Downloads');
    const markoutDir = path.join(downloadsDir, 'markout');

    if (!fs.existsSync(markoutDir)) {
        fs.mkdirSync(markoutDir, { recursive: true });
    }

    let outputFile;
    if (args[1]) {
        if (path.isAbsolute(args[1])) {
            outputFile = args[1]; // Respect absolute paths if specific
        } else {
            // If argument is provided but not absolute, treat as filename in markout
            outputFile = path.join(markoutDir, args[1]);
        }
    } else {
        // Default to input filename .png in markout
        const basename = path.basename(inputFile, path.extname(inputFile));
        outputFile = path.join(markoutDir, `${basename}.png`);
    }

    // 1. Prepare Content
    console.log('Reading markdown...');
    const markdown = fs.readFileSync(inputFile, 'utf-8');

    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    fs.writeFileSync(CONTENT_FILE, JSON.stringify({ markdown, theme, size, template }));
    console.log('Content prepared.');

    // 2. Start Vite Server
    console.log('Starting Vite server...');
    const vite = spawn('npm', ['run', 'dev'], {
        cwd: PROJECT_ROOT,
        stdio: 'pipe', // capture output to detect start
        shell: true
    });

    let serverUrl = '';

    // Wait for server to start
    await new Promise((resolve, reject) => {
        vite.stdout.on('data', (data) => {
            const output = data.toString();
            // console.log('[Vite]', output); // Debug log
            const match = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
            if (match) {
                serverUrl = match[1];
                resolve();
            }
        });

        vite.stderr.on('data', (data) => {
            // console.error('[Vite Err]', data.toString());
        });

        // Timeout if fallback
        setTimeout(() => {
            if (!serverUrl) {
                // Assume default 3000 if parsing failed but it ran
                serverUrl = 'http://localhost:3000';
                resolve();
            }
        }, 5000);
    });

    console.log(`Server started at ${serverUrl}`);

    // 3. Launch Puppeteer
    // Check for system Chrome
    const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const executablePath = fs.existsSync(systemChrome) ? systemChrome : undefined;

    console.log('Launching browser...', executablePath ? `Using system chrome` : 'Using bundled chromium');
    const browser = await puppeteer.launch({
        headless: true, // Use old headless or 'shell' if needed, but 'true' is safer with system chrome sometimes or just 'new'
        executablePath,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            // '--no-first-run',
            // '--no-zygote',
            '--disable-extensions'
        ],
        dumpio: true
    });

    try {
        const page = await browser.newPage();

        // Calculate viewport width based on requested size
        // mobile: max-w-lg (32rem = 512px) -> Viewport ~600px
        // pc: max-w-4xl (56rem = 896px) -> Viewport ~1000px
        // Default padding in App.tsx is p-8 (2rem = 32px each side) -> 64px total
        // We add a bit more buffer.
        let width = 1200; // Default fallback
        if (theme === 'mobile' || size === 'mobile') {
            width = 480;
        } else if (theme === 'pc' || size === 'pc') {
            width = 1280;
        }

        // Set viewport 
        await page.setViewport({ width, height: 800, deviceScaleFactor: 2 });

        await page.goto(serverUrl, { waitUntil: 'domcontentloaded' });

        // Wait for the container
        await page.waitForSelector('#capture-container');

        // Wait a bit more for fonts/images to stabilize
        await sleep(1000);

        const element = await page.$('#capture-container');

        if (element) {
            // Screenshot the specific element (or full page if preferred)
            // Since the component is centered, element screenshot is safer if sizing is right.
            // But App.tsx has min-h-screen. 
            // Let's screenshot the first child of capture-container if possible, or just the container.
            // The container has padding handling.
            await element.screenshot({ path: outputFile });
            console.log(`Image saved to ${outputFile}`);
        } else {
            console.error('Could not find capture container');
        }

    } catch (e) {
        console.error('Error during capture:', e);
    } finally {
        await browser.close();
        vite.kill();
        // Force kill if needed
        process.exit(0);
    }
}

main();
