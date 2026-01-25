import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { ReportsService } from "./reports.service";

const service = new ReportsService();

function buildCsv(headers: string[], rows: (string | number | Date)[][]) {
  const headerLine = headers.join(",");
  const lines = rows.map((r) =>
    r
      .map((v) => {
        if (v instanceof Date) {
          return v.toISOString();
        }
        const s = String(v ?? "");
        // simple escaping for comma / quote
        if (s.includes(",") || s.includes('"')) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      })
      .join(",")
  );

  return [headerLine, ...lines].join("\n");
}

export class ReportsController {
  async downloadCurrentStock(req: Request, res: Response) {
    try {
      const format = (req.query.format as string) || "csv";
      const lowStockOnly = req.query.lowStockOnly === "true";

      const rows = await service.getCurrentStockReport({ lowStockOnly });

      if (format === "pdf") {
        const doc = new PDFDocument({ margin: 40, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=laporan-stok-saat-ini.pdf"
        );

        doc.pipe(res);

        // Header perusahaan + logo (jika ada)
        const logoPath = process.env.COMPANY_LOGO_PATH;
        let headerBottomY = 40;

        if (logoPath) {
          try {
            doc.image(logoPath, 40, 30, { width: 40 });
          } catch {
            // jika logo gagal dimuat, lanjut tanpa error
          }
        }

        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .text("SOPIA BANGKIT", logoPath ? 90 : 40, 32, {
            continued: false,
          });
        doc
          .font("Helvetica")
          .fontSize(9)
          .text("Sistem Inventori Barang", logoPath ? 90 : 40, 50);

        headerBottomY = 70;
        doc.moveTo(40, headerBottomY).lineTo(550, headerBottomY).stroke();

        // Judul laporan & info meta
        doc.moveDown(3);
        doc.font("Helvetica-Bold").fontSize(13).text("LAPORAN STOK SAAT INI", {
          align: "center",
        });

        const generatedAt = new Date().toLocaleString("id-ID");
        doc.moveDown(0.3);
        doc
          .font("Helvetica")
          .fontSize(9)
          .text(`Dibuat pada: ${generatedAt}`, { align: "right" });
        if (lowStockOnly) {
          doc
            .fontSize(10)
            .text("Hanya menampilkan stok di bawah stok minimum", {
              align: "left",
            });
        }
        doc.moveDown(0.5);

        // Tabel
        const tableTop = doc.y + 12;
        const colWarehouse = 40; // Gudang
        const colItem = 210; // Barang
        const colStock = 380; // Stok
        const colMin = 450; // Min
        const rowHeight = 18;

        // Header tabel
        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("Gudang", colWarehouse, tableTop, {
          width: colItem - colWarehouse - 10,
        });
        doc.text("Barang", colItem, tableTop, {
          width: colStock - colItem - 10,
        });
        doc.text("Stok", colStock, tableTop, {
          width: colMin - colStock - 10,
          align: "right",
        });
        doc.text("Min", colMin, tableTop, { width: 80, align: "right" });

        // Garis bawah header
        const headerBottom = tableTop + rowHeight - 4;
        doc
          .moveTo(colWarehouse, headerBottom)
          .lineTo(520, headerBottom)
          .stroke();

        // Isi baris
        doc.font("Helvetica");
        let y = headerBottom + 4;

        rows.forEach((r) => {
          if (y > doc.page.height - 50) {
            doc.addPage();
            y = 60;
          }

          const warehouseText = `${r.warehouseCode} - ${r.warehouseName}`;
          const itemText = `${r.itemCode} - ${r.itemName}`;

          doc.text(warehouseText, colWarehouse, y, {
            width: colItem - colWarehouse - 10,
          });
          doc.text(itemText, colItem, y, {
            width: colStock - colItem - 10,
          });
          doc.text(String(r.currentStock), colStock, y, {
            width: colMin - colStock - 10,
            align: "right",
          });
          doc.text(String(r.minStock), colMin, y, {
            width: 80,
            align: "right",
          });

          y += rowHeight;
          doc
            .moveTo(colWarehouse, y - 4)
            .lineTo(520, y - 4)
            .strokeColor("#eeeeee")
            .stroke()
            .strokeColor("#000000");
        });

        doc.end();
        return;
      }

      const headers = [
        "Kode Gudang",
        "Nama Gudang",
        "Kode Barang",
        "Nama Barang",
        "Stok Saat Ini",
        "Stok Minimum",
      ];

      const dataRows = rows.map((r) => [
        r.warehouseCode,
        r.warehouseName,
        r.itemCode,
        r.itemName,
        r.currentStock,
        r.minStock,
      ]);

      const csv = buildCsv(headers, dataRows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-stok-saat-ini.csv"
      );
      return res.send(csv);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate current stock report",
      });
    }
  }

  async downloadStockMovements(req: Request, res: Response) {
    try {
      const format = (req.query.format as string) || "csv";

      const rows = await service.getStockMovementReport({
        tanggalFrom: req.query.tanggalFrom as string | undefined,
        tanggalTo: req.query.tanggalTo as string | undefined,
        jenis_mutasi: req.query.jenis_mutasi as string | undefined,
      });

      if (format === "pdf") {
        const doc = new PDFDocument({ margin: 40, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=laporan-mutasi-stok.pdf"
        );

        doc.pipe(res);

        // Header perusahaan + logo (jika ada)
        const logoPath = process.env.COMPANY_LOGO_PATH;
        if (logoPath) {
          try {
            doc.image(logoPath, 40, 30, { width: 40 });
          } catch {
            // abaikan error logo
          }
        }

        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .text("SOPIA BANGKIT", logoPath ? 90 : 40, 32, {
            continued: false,
          });
        doc
          .font("Helvetica")
          .fontSize(9)
          .text("Sistem Manajemen Persediaan", logoPath ? 90 : 40, 50);

        const headerBottomY = 70;
        doc.moveTo(40, headerBottomY).lineTo(550, headerBottomY).stroke();

        // Judul & informasi filter
        doc.moveDown(3);
        doc.font("Helvetica-Bold").fontSize(13).text("LAPORAN MUTASI STOK", {
          align: "center",
        });
        const generatedAt = new Date().toLocaleString("id-ID");
        doc.moveDown(0.3);
        doc
          .font("Helvetica")
          .fontSize(9)
          .text(`Dibuat pada: ${generatedAt}`, { align: "right" });

        const tanggalFrom = req.query.tanggalFrom as string | undefined;
        const tanggalTo = req.query.tanggalTo as string | undefined;
        const jenisMutasi = req.query.jenis_mutasi as string | undefined;

        const filterParts: string[] = [];
        if (tanggalFrom || tanggalTo) {
          const fromStr = tanggalFrom || "-";
          const toStr = tanggalTo || "-";
          filterParts.push(`Periode: ${fromStr} s.d. ${toStr}`);
        }
        if (jenisMutasi) {
          filterParts.push(`Jenis mutasi: ${jenisMutasi}`);
        }

        if (filterParts.length > 0) {
          doc.moveDown(0.2);
          doc.fontSize(9).text(filterParts.join(" | "));
        }

        // Tabel
        const tableTop = doc.y + 10;
        const colDate = 40; // Tanggal
        const colType = 120; // Jenis
        const colItem = 210; // Barang
        const colWarehouse = 340; // Gudang
        const colQty = 430; // Qty
        const colUser = 485; // User
        const rowHeight = 18;

        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Tanggal", colDate, tableTop, {
          width: colType - colDate - 4,
        });
        doc.text("Jenis", colType, tableTop, { width: colItem - colType - 4 });
        doc.text("Barang", colItem, tableTop, {
          width: colWarehouse - colItem - 4,
        });
        doc.text("Gudang", colWarehouse, tableTop, {
          width: colQty - colWarehouse - 4,
        });
        doc.text("Qty", colQty, tableTop, {
          width: colUser - colQty - 4,
          align: "right",
        });
        doc.text("User", colUser, tableTop, { width: 80 });

        const headerBottom = tableTop + rowHeight - 4;
        doc.moveTo(colDate, headerBottom).lineTo(540, headerBottom).stroke();

        doc.font("Helvetica");
        let y = headerBottom + 4;

        rows.forEach((r) => {
          if (y > doc.page.height - 60) {
            doc.addPage();
            y = 60;
          }

          const dateStr = new Date(r.date).toLocaleString("id-ID");
          const jenis = r.adjustmentType
            ? `${r.mutationType} (${r.adjustmentType})`
            : r.mutationType;

          doc.text(dateStr, colDate, y, { width: colType - colDate - 4 });
          doc.text(jenis, colType, y, { width: colItem - colType - 4 });
          doc.text(`${r.itemCode} - ${r.itemName}`, colItem, y, {
            width: colWarehouse - colItem - 4,
          });
          doc.text(r.warehouseName, colWarehouse, y, {
            width: colQty - colWarehouse - 4,
          });
          doc.text(String(r.quantity), colQty, y, {
            width: colUser - colQty - 4,
            align: "right",
          });
          doc.text(r.userName, colUser, y, { width: 80 });

          y += rowHeight;

          if (r.notes) {
            doc.fontSize(8).text(`Catatan: ${r.notes}`, colDate, y - 4, {
              width: 500,
            });
            y += rowHeight - 6;
            doc.fontSize(9);
          }

          doc
            .moveTo(colDate, y - 4)
            .lineTo(540, y - 4)
            .strokeColor("#eeeeee")
            .stroke()
            .strokeColor("#000000");
        });

        doc.end();
        return;
      }

      const headers = [
        "Tanggal",
        "Jenis Mutasi",
        "Jenis Penyesuaian",
        "Kode Barang",
        "Nama Barang",
        "Gudang",
        "Jumlah",
        "User",
        "Catatan",
      ];

      const dataRows = rows.map((r) => [
        r.date,
        r.mutationType,
        r.adjustmentType,
        r.itemCode,
        r.itemName,
        r.warehouseName,
        r.quantity,
        r.userName,
        r.notes,
      ]);

      const csv = buildCsv(headers, dataRows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-mutasi-stok.csv"
      );
      return res.send(csv);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate stock movement report",
      });
    }
  }
}
