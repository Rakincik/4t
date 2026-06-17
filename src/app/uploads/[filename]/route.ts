import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { existsSync, createReadStream } from "fs";
import { stat } from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;
    const filePath = join(process.cwd(), "public", "uploads", filename);
    
    if (!existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    try {
        const fileStat = await stat(filePath);
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        
        let contentType = 'application/octet-stream';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) contentType = 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
        if (['mp4', 'webm', 'ogg'].includes(ext)) contentType = 'video/' + ext;
        if (ext === 'pdf') contentType = 'application/pdf';
        if (['ppt', 'pptx'].includes(ext)) contentType = 'application/vnd.ms-powerpoint';

        const rstream = createReadStream(filePath);
        const readable = new ReadableStream({
            start(controller) {
                rstream.on('data', (chunk) => controller.enqueue(chunk));
                rstream.on('end', () => controller.close());
                rstream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(readable, {
            headers: {
                "Content-Type": contentType,
                "Content-Length": fileStat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });
    } catch (error) {
        return new NextResponse("Error reading file", { status: 500 });
    }
}
