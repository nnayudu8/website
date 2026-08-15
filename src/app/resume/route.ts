import { readFile } from 'node:fs/promises';
import path from 'node:path';

const RESUME_FILE_ID = '16K76Ot4EcPyo9f4wFIutYzOagsuN4ig3';
const RESUME_FILENAME = 'Nidhil_Nayudu_resume.pdf';

export const dynamic = 'force-dynamic';

const resumeHeaders = {
  'Content-Type': 'application/pdf',
  'Content-Disposition': `inline; filename="${RESUME_FILENAME}"`,
  'Cache-Control': 'no-store',
};

async function localResume() {
  const pdf = await readFile(path.join(process.cwd(), 'public', RESUME_FILENAME));

  return new Response(pdf, { headers: resumeHeaders });
}

export async function GET() {
  const driveUrl = new URL('https://drive.usercontent.google.com/download');
  driveUrl.searchParams.set('id', RESUME_FILE_ID);
  driveUrl.searchParams.set('export', 'download');

  try {
    const response = await fetch(driveUrl, { cache: 'no-store' });

    if (!response.ok || !response.body) {
      return localResume();
    }

    return new Response(response.body, { headers: resumeHeaders });
  } catch {
    return localResume();
  }
}
