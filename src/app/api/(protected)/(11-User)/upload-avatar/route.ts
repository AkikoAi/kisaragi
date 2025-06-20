import { NextRequest, NextResponse } from 'next/server';
import { writeFile, access } from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import ksr_status from '@/utils/ksr_status';
import { addLogsFE } from '@/utils/ksr_logs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ status: false, msg: ksr_status.upload_file_not_found })
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Buat hash SHA256 dari isi file
        const hash = createHash('sha256').update(buffer).digest('hex');

        // Ambil ekstensi file asli (misal .jpg, .png)
        const originalName = file.name;
        const ext = path.extname(originalName);

        const filename = `${hash}${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        try {
            // Cek apakah file dengan hash ini sudah ada
            await access(filePath);
        } catch {
            // File belum ada, simpan file
            await writeFile(filePath, buffer);
        }
        // Kirim path file
        return NextResponse.json({ status: true, data: `/uploads/${filename}` });
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}
