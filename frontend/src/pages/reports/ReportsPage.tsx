import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import {
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL as string;

const reportTypes = [
  {
    key: "current-stock",
    title: "Laporan Stok Saat Ini",
    description: "Data stok barang per gudang saat ini",
    icon: FileText,
  },
  {
    key: "stock-movements",
    title: "Laporan Mutasi Stok",
    description: "Riwayat barang masuk, keluar, dan penyesuaian",
    icon: FileSpreadsheet,
  },
  {
    key: "low-stock",
    title: "Laporan Stok Menipis",
    description: "Barang dengan stok di bawah stok minimum",
    icon: AlertTriangle,
  },
];

export const ReportsPage = () => {
  const { token } = useAuthStore();

  const [movementFrom, setMovementFrom] = useState("");
  const [movementTo, setMovementTo] = useState("");
  const [movementType, setMovementType] = useState<string>("");

  const handleDownload = async (reportKey: string, format: "PDF" | "CSV") => {
    if (!token) {
      toast.error("Tidak terotentikasi");
      return;
    }

    try {
      let path = "";

      if (reportKey === "current-stock") {
        path = `/reports/current-stock?format=${format.toLowerCase()}`;
      } else if (reportKey === "stock-movements") {
        const params = new URLSearchParams();
        params.set("format", format.toLowerCase());
        if (movementFrom) params.set("tanggalFrom", movementFrom);
        if (movementTo) params.set("tanggalTo", movementTo);
        if (movementType) params.set("jenis_mutasi", movementType);
        path = `/reports/stock-movements?${params.toString()}`;
      } else if (reportKey === "low-stock") {
        path = `/reports/current-stock?lowStockOnly=true&format=${format.toLowerCase()}`;
      }

      if (!path) return;

      const res = await fetch(`${API_URL}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengunduh laporan");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const ext = format.toLowerCase();
      let filename = "laporan." + ext;
      if (reportKey === "current-stock")
        filename = `laporan-stok-saat-ini.${ext}`;
      else if (reportKey === "stock-movements")
        filename = `laporan-mutasi-stok.${ext}`;
      else if (reportKey === "low-stock")
        filename = `laporan-stok-menipis.${ext}`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Laporan berhasil diunduh dalam format ${format}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengunduh laporan"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan</h1>
        <p className="text-muted-foreground">
          Generate dan unduh laporan persediaan
        </p>
      </div>

      {/* Filter global untuk laporan mutasi stok */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filter Laporan Mutasi Stok</CardTitle>
          <CardDescription className="text-xs">
            Atur periode dan jenis mutasi yang akan digunakan saat mengunduh
            laporan mutasi stok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">
                Dari Tanggal
              </span>
              <Input
                type="date"
                value={movementFrom}
                onChange={(e) => setMovementFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">
                Sampai Tanggal
              </span>
              <Input
                type="date"
                value={movementTo}
                onChange={(e) => setMovementTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1 md:col-span-1 lg:col-span-2">
              <span className="text-[11px] text-muted-foreground">
                Jenis Mutasi
              </span>
              <Select
                value={movementType}
                onValueChange={(v) => setMovementType(v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-8 text-xs max-w-xs">
                  <SelectValue placeholder="Semua jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua jenis</SelectItem>
                  <SelectItem value="masuk">Masuk</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                  <SelectItem value="penyesuaian">Penyesuaian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jenis Laporan */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.key}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDownload(report.key, "PDF")}
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDownload(report.key, "CSV")}
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contoh Tabel Stok Menipis (placeholder, opsional bisa dihubungkan ke backend) */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Peringatan Stok Menipis</CardTitle>
          </div>
          <CardDescription>Barang yang perlu segera direstok</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok Saat Ini</TableHead>
                  <TableHead>Stok Minimum</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Di masa depan bisa diisi dari API laporan stok menipis */}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
