import {
  AdjustmentFormData,
  AdjustmentFormModal,
} from "@/components/stock/AdjustmentFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Calendar, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BackendMutation {
  id: number;
  id_barang: number;
  id_gudang: number;
  jenis_mutasi: string;
  jumlah: number;
  jenis_penyesuaian: string | null;
  catatan: string | null;
  created_at: string;
  barang: {
    id: number;
    kode: string;
    nama: string;
  };
  gudang: {
    id: number;
    nama: string;
  };
  user: {
    id: number;
    nama: string;
  };
}

interface BackendItem {
  id: number;
  kode: string;
  nama: string;
}

interface BackendWarehouse {
  id: number;
  kode: string;
  nama: string;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface AdjustmentRow {
  id: number;
  date: string;
  itemCode: string;
  itemName: string;
  warehouse: string;
  adjustmentType: string;
  quantity: number;
  reason: string;
  createdBy: string;
}

export const StockAdjustmentPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [rows, setRows] = useState<AdjustmentRow[]>([]);
  const [items, setItems] = useState<BackendItem[]>([]);
  const [warehouses, setWarehouses] = useState<BackendWarehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return;

        const [mutRes, itemsRes, whRes] = await Promise.all([
          apiGet<BackendResponse<BackendMutation[]>>("/stock/mutations", token),
          apiGet<BackendResponse<BackendItem[]>>("/items", token),
          apiGet<BackendResponse<BackendWarehouse[]>>("/warehouses", token),
        ]);

        if (!mutRes.success) {
          throw new Error(mutRes.message || "Gagal memuat mutasi stok");
        }
        if (!itemsRes.success) {
          throw new Error(itemsRes.message || "Gagal memuat barang");
        }
        if (!whRes.success) {
          throw new Error(whRes.message || "Gagal memuat gudang");
        }

        const adjustmentRows: AdjustmentRow[] = mutRes.data
          .filter((m) => m.jenis_mutasi === "penyesuaian")
          .map((m) => ({
            id: m.id,
            date: m.created_at,
            itemCode: m.barang.kode,
            itemName: m.barang.nama,
            warehouse: m.gudang.nama,
            adjustmentType: m.jenis_penyesuaian || "penyesuaian",
            quantity: m.jumlah,
            reason: m.catatan || "",
            createdBy: m.user?.nama || "-",
          }));

        setRows(adjustmentRows);
        setItems(itemsRes.data);
        setWarehouses(whRes.data);
      } catch (error) {
        toast({
          title: "Gagal memuat data",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [token, toast]);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rusak":
        return "bg-destructive";
      case "hilang":
        return "bg-warning";
      case "retur":
        return "bg-success";
      case "correction":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      rusak: "Damaged",
      hilang: "Lost",
      retur: "Return",
    };
    return labels[type] || type;
  };

  const stats = useMemo(() => {
    const damaged = rows
      .filter((r) => r.adjustmentType === "rusak")
      .reduce((sum, r) => sum + r.quantity, 0);
    const lost = rows
      .filter((r) => r.adjustmentType === "hilang")
      .reduce((sum, r) => sum + r.quantity, 0);
    const retur = rows
      .filter((r) => r.adjustmentType === "retur")
      .reduce((sum, r) => sum + r.quantity, 0);
    const corrections = rows.length;

    return { damaged, lost, found: retur, corrections };
  }, [rows]);

  const handleSubmit = async (data: AdjustmentFormData) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiPost<BackendResponse<BackendMutation>>(
        "/stock/adjustment",
        {
          id_barang: Number(data.itemId),
          id_gudang: Number(data.warehouseId),
          jumlah: Number(data.quantity),
          jenis_penyesuaian: data.adjustmentType,
          catatan: data.reason,
          tanggal: data.date,
        },
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan adjustment");
      }

      const m = res.data;
      const newRow: AdjustmentRow = {
        id: m.id,
        date: m.created_at,
        itemCode: m.barang.kode,
        itemName: m.barang.nama,
        warehouse: m.gudang.nama,
        adjustmentType: m.jenis_penyesuaian || "penyesuaian",
        quantity: m.jumlah,
        reason: m.catatan || "",
        createdBy: m.user?.nama || "-",
      };

      setRows((prev) => [newRow, ...prev]);

      toast({
        title: "Adjustment berhasil disimpan",
        description: "Penyesuaian stok berhasil dicatat.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan adjustment",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Penyesuaian Stok
          </h1>
          <p className="text-muted-foreground">
            Catat penyesuaian stok untuk barang rusak, hilang, atau ditemukan
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Penyesuaian Baru
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rusak</p>
              <p className="text-2xl font-bold text-destructive">
                {stats.damaged}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Hilang</p>
              <p className="text-2xl font-bold text-warning">{stats.lost}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Retur</p>
              <p className="text-2xl font-bold text-success">{stats.found}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Penyesuaian</p>
              <p className="text-2xl font-bold text-primary">
                {stats.corrections}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Penyesuaian Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Gudang</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(adjustment.date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {adjustment.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {adjustment.itemName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {adjustment.warehouse}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={getTypeColor(adjustment.adjustmentType)}
                      >
                        {getTypeLabel(adjustment.adjustmentType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          adjustment.quantity > 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {adjustment.quantity > 0 ? "+" : ""}
                        {adjustment.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px]">
                      {adjustment.reason}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {adjustment.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AdjustmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        items={items.map((it) => ({
          id: String(it.id),
          code: it.kode,
          name: it.nama,
        }))}
        warehouses={warehouses.map((wh) => ({
          id: String(wh.id),
          name: wh.nama,
        }))}
      />
    </div>
  );
};
