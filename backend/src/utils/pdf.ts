import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export const createPdf = async (
  filename: string,
  build: (doc: unknown) => void
): Promise<string> => {
  const tempDir = path.resolve("./temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, filename);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    doc.pipe(stream);
    build(doc);
    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
