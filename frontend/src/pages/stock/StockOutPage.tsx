import { StockFormModal } from "@/components/stock/StockFormModal";
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
import { Calendar, Package, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BackendMutation {
  id: number;
  id_barang: number;
  id_gudang: number;
  jenis_mutasi: string;
  jumlah: number;
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
  stok: number | null;
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

interface StockOutRow {
  id: number;
  date: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  notes: string;
  createdBy: string;
}

export const StockOutPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<StockOutRow[]>([]);
  const [items, setItems] = useState<BackendItem[]>([]);
  const [warehouses, setWarehouses] = useState<BackendWarehouse[]>([]);

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

        const stockOutRows: StockOutRow[] = mutRes.data
          .filter((m) => m.jenis_mutasi === "keluar")
          .map((m) => ({
            id: m.id,
            date: m.created_at,
            itemCode: m.barang.kode,
            itemName: m.barang.nama,
            quantity: m.jumlah,
            notes: m.catatan || "",
            createdBy: m.user?.nama || "-",
          }));

        setRows(stockOutRows);
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

  const handleSubmit = async (data: {
    itemId: string;
    warehouseId: string;
    quantity: number;
    date: string;
    notes: string;
  }) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiPost<BackendResponse<BackendMutation>>(
        "/stock/out",
        {
          id_barang: Number(data.itemId),
          id_gudang: Number(data.warehouseId),
          jumlah: Number(data.quantity),
          catatan: data.notes,
          tanggal: data.date,
        },
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal mencatat stock OUT");
      }

      const m = res.data;
      const newRow: StockOutRow = {
        id: m.id,
        date: m.created_at,
        itemCode: m.barang.kode,
        itemName: m.barang.nama,
        quantity: m.jumlah,
        notes: m.catatan || "",
        createdBy: m.user?.nama || "-",
      };

      setRows((prev) => [newRow, ...prev]);

      toast({
        title: "Stock OUT berhasil dicatat",
        description: "Mutasi stok keluar berhasil disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal mencatat stock OUT",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const stats = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const sumForRange = (from: Date) =>
      rows.reduce((sum, r) => {
        const d = new Date(r.date);
        if (d >= from) return sum + r.quantity;
        return sum;
      }, 0);

    return {
      today: sumForRange(startOfToday),
      week: sumForRange(startOfWeek),
      month: sumForRange(startOfMonth),
    };
  }, [rows]);

  const itemOptions = useMemo(
    () =>
      items.map((it) => ({
        id: String(it.id),
        code: it.kode,
        name: it.nama,
        stock: it.stok ?? 0,
      })),
    [items]
  );

  const warehouseOptions = useMemo(
    () =>
      warehouses.map((wh) => ({
        id: String(wh.id),
        name: wh.nama,
      })),
    [warehouses]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barang Keluar</h1>
          <p className="text-muted-foreground">Catat mutasi stok keluar</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Barang Keluar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hari ini</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Minggu ini</p>
                <p className="text-2xl font-bold">{stats.week}</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bulan ini</p>
                <p className="text-2xl font-bold">{stats.month}</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Barang Keluar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(stock.date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {stock.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {stock.itemName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-warning text-warning-foreground"
                      >
                        -{stock.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stock.notes}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stock.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StockFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        type="OUT"
        items={itemOptions}
        warehouses={warehouseOptions}
      />
    </div>
  );
};
