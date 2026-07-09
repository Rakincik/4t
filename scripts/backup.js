const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 1. Manually load environment variables from .env to run stand-alone
function loadEnv() {
    const envPath = path.join(__dirname, "..", ".env");
    if (!fs.existsSync(envPath)) {
        console.error("Error: .env file not found at " + envPath);
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const match = trimmed.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || "";
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

async function run() {
    loadEnv();

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("Error: DATABASE_URL is not defined in .env file.");
        process.exit(1);
    }

    console.log("Parsing database connection URL...");
    // Format: postgresql://user:password@host:port/dbname
    // Or: postgres://user:password@host:port/dbname
    const regex = /^postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
    const match = dbUrl.match(regex);
    if (!match) {
        console.error("Error: DATABASE_URL does not match expected PostgreSQL URI format.");
        process.exit(1);
    }

    const [_, user, password, host, port, dbname] = match;

    const backupDir = path.join(__dirname, "..", "backups");
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log("Created backups directory: " + backupDir);
    }

    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `backup-4takademi-${dateStr}.tar`;
    const filePath = path.join(backupDir, fileName);

    console.log(`Starting backup of database '${dbname}' to: ${fileName}...`);

    try {
        // Set PGPASSWORD environment variable so pg_dump runs non-interactively
        process.env.PGPASSWORD = password;
        
        // Execute pg_dump command
        const command = `pg_dump -h ${host} -p ${port} -U ${user} -F t -f "${filePath}" ${dbname}`;
        execSync(command, { stdio: "inherit" });

        console.log("Backup successfully completed!");

        // 2. Prune old backups (Keep only the 4 most recent files)
        console.log("Cleaning up old backups (rolling history of 4 weeks)...");
        const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith("backup-4takademi-") && f.endsWith(".tar"))
            .map(f => {
                const fullPath = path.join(backupDir, f);
                return {
                    name: f,
                    path: fullPath,
                    time: fs.statSync(fullPath).mtime.getTime()
                };
            });

        // Sort: newest first
        files.sort((a, b) => b.time - a.time);

        if (files.length > 4) {
            const extraFiles = files.slice(4);
            extraFiles.forEach(f => {
                fs.unlinkSync(f.path);
                console.log(`Deleted expired backup file: ${f.name}`);
            });
        }
        
        console.log("Backup rotation finished.");
    } catch (err) {
        console.error("Error: Database backup process failed:", err.message);
        process.exit(1);
    }
}

run();
