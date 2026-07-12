const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function run() {
    console.log("Checking courses and their image file sizes...");
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true
        }
    });

    for (const c of courses) {
        if (!c.imageUrl) {
            console.log(`Course: ${c.title} -> No image`);
            continue;
        }

        // If it starts with /uploads, check file size in public/uploads or public/
        let filePath = "";
        if (c.imageUrl.startsWith("/")) {
            filePath = path.join(process.cwd(), "public", c.imageUrl);
        } else {
            console.log(`Course: ${c.title} -> External image: ${c.imageUrl}`);
            continue;
        }

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`Course: ${c.title} -> Image: ${c.imageUrl} -> Size: ${sizeInMB} MB`);
        } else {
            console.log(`Course: ${c.title} -> Image: ${c.imageUrl} -> FILE DOES NOT EXIST!`);
        }
    }
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
