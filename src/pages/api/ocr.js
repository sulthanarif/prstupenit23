import { processPDF, generateDataFiles } from "../../server/ocr-process";
import fs from 'fs';
import path from "path";
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

const tempDir = path.join(process.cwd(), "src/temp");
const outputDir = path.join(process.cwd(), "src/output");
const targetDPI = 800;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Ensure output folders exist
        if (!fs.existsSync(tempDir)) {
            await fs.promises.mkdir(tempDir, { recursive: true });
        }
        if (!fs.existsSync(outputDir)) {
            await fs.promises.mkdir(outputDir, { recursive: true });
        }
        const form = formidable({ multiples: true, uploadDir: tempDir });

        form.parse(req, async (err, _, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return res.status(500).json({ message: 'Failed to parse form data.' });
            }
            if (!files.pdfFile || files.pdfFile.length === 0) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const pdfFiles = Array.isArray(files.pdfFile) ? files.pdfFile : [files.pdfFile];
            const allResults = [];

            for (const file of pdfFiles) {
                const pdfPath = file.filepath;
                const result = await processPDF(pdfPath, tempDir, outputDir, targetDPI);
                allResults.push(result);

                //clean up temporary file
                await fs.promises.unlink(pdfPath);
            }

            const csvFileName = 'allData.csv'; // Nama file CSV tetap
            await generateDataFiles(allResults, outputDir);
            
            res.status(200).json({
                message: 'PDFs processed successfully',
                data: allResults,
                csvFileName: csvFileName, // Send CSV filename
            });
        });
    } catch (error) {
        console.error('OCR processing error:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
}