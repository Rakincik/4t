import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import { existsSync, createWriteStream } from "fs";
import { getToken } from "next-auth/jwt";
import { pipeline } from "stream/promises";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token || token.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim. Dosya yüklemek için Admin girişi gereklidir." }, { status: 401 });
        }
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
            "video/mp4", "video/webm", "video/ogg", "video/quicktime",
            "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Geçersiz dosya formatı. Resim, Video veya PDF/PPT yükleyin." }, { status: 400 });
        }

        // Validate file size (max 2000MB)
        if (file.size > 2000 * 1024 * 1024) {
            return NextResponse.json({ error: "Dosya boyutu sistem sınırını aştı." }, { status: 400 });
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const isImage = file.type.startsWith("image/");
        const isSvg = file.type === "image/svg+xml";

        // Convert images to webp for extreme size reduction (except SVG)
        const outputExt = (isImage && !isSvg) ? "webp" : ext;
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${outputExt}`;
        const filePath = path.join(uploadDir, uniqueName);

        if (isImage && !isSvg) {
            // Read arrayBuffer and convert to Buffer for Sharp
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Process image with Sharp
            let sharpInstance = sharp(buffer);
            const metadata = await sharpInstance.metadata();

            // Resize if it exceeds 1600px width (typical banner/card size maximum)
            if (metadata.width && metadata.width > 1600) {
                sharpInstance = sharpInstance.resize({ width: 1600, withoutEnlargement: true });
            }

            // Convert to webp with 80% quality
            await sharpInstance
                .webp({ quality: 80 })
                .toFile(filePath);
        } else {
            // Write other files (videos, SVGs, etc.) using Streams to save memory
            const writeStream = createWriteStream(filePath);
            // @ts-ignore
            const reader = file.stream().getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                writeStream.write(value);
            }
            writeStream.end();
        }

        // Return public URL (Served by our uploads router or nginx)
        const url = `/uploads/${uniqueName}`;
        return NextResponse.json({ url, success: true });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Dosya yüklenirken hata oluştu." }, { status: 500 });
    }
}
