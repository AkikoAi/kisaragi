import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import ksr_status from '@/utils/ksr_status';
import { addLogsFE } from '@/utils/ksr_logs';
import minio from '@/utils/minio';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ status: false, msg: ksr_status.upload_file_not_found });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Hash SHA256 dari isi file
        const hash = createHash('sha256').update(buffer).digest('hex');

        const originalName = file.name;
        const ext = path.extname(originalName); // Contoh: .jpg, .png
        const filename = `${hash}${ext}`;

        // Cek apakah file sudah ada di MinIO
        try {
            await minio.statObject('uploads', filename);
            // File sudah ada di MinIO
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.code === 'NotFound') {
                // File belum ada, maka upload ke MinIO
                await minio.putObject('uploads', filename, buffer, buffer.length, {
                    'Content-Type': file.type || 'application/octet-stream',
                });
            } else {
                throw error; // error MinIO selain NotFound
            }
        }

        return NextResponse.json({ status: true, data: `http://kisaragi.fbk:9000/uploads/${filename}` });
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}
