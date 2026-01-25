import {
  TransferFormData,
  TransferFormModal,
} from "@/components/stock/TransferFormModal";
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
import { ArrowRight, Calendar, Package, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BackendTransferDetail {
  id: number;
  id_barang: number;
  jumlah: number;
  barang: {
    id: number;
    kode: string;
    nama: string;
  };
}

interface BackendTransfer {
  id: number;
  nomor_transfer: string;
  id_gudang_asal: number;
  id_gudang_tujuan: number;
  tanggal: string;
  status: string;
  catatan: string | null;
  gudang_asal: {
    id: number;
    nama: string;
  };
  gudang_tujuan: {
    id: number;
    nama: string;
  };
  user: {
    id: number;
    nama: string;
  };
  detail: BackendTransferDetail[];
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

interface TransferRow {
  id: number;
  date: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  fromWarehouse: string;
  toWarehouse: string;
  status: string;
  notes: string;
  createdBy: string;
}

export const StockTransferPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [items, setItems] = useState<BackendItem[]>([]);
  const [warehouses, setWarehouses] = useState<BackendWarehouse[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return;

        const [trfRes, itemsRes, whRes] = await Promise.all([
          apiGet<BackendResponse<BackendTransfer[]>>("/stock/transfers", token),
          apiGet<BackendResponse<BackendItem[]>>("/items", token),
          apiGet<BackendResponse<BackendWarehouse[]>>("/warehouses", token),
        ]);

        if (!trfRes.success) {
          throw new Error(trfRes.message || "Gagal memuat transfer stok");
        }
        if (!itemsRes.success) {
          throw new Error(itemsRes.message || "Gagal memuat barang");
        }
        if (!whRes.success) {
          throw new Error(whRes.message || "Gagal memuat gudang");
        }

        const mappedRows: TransferRow[] = trfRes.data.flatMap((t) => {
          return t.detail.map((d) => ({
            id: d.id,
            date: t.tanggal,
            itemCode: d.barang.kode,
            itemName: d.barang.nama,
            quantity: d.jumlah,
            fromWarehouse: t.gudang_asal.nama,
            toWarehouse: t.gudang_tujuan.nama,
            status: t.status,
            notes: t.catatan || "",
            createdBy: t.user?.nama || "-",
          }));
        });

        setRows(mappedRows);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-transit":
        return "bg-warning";
      case "cancelled":
        return "bg-destructive";
      default:
        return "bg-secondary";
    }
  };

  const handleSubmit = async (data: TransferFormData) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiPost<BackendResponse<BackendTransfer>>(
        "/stock/transfer",
        {
          id_barang: Number(data.itemId),
          id_gudang_asal: Number(data.fromWarehouseId),
          id_gudang_tujuan: Number(data.toWarehouseId),
          jumlah: Number(data.quantity),
          catatan: data.notes,
          tanggal: data.date,
        },
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal mencatat transfer stok");
      }

      const t = res.data;
      const newRows: TransferRow[] = t.detail.map((d) => ({
        id: d.id,
        date: t.tanggal,
        itemCode: d.barang.kode,
        itemName: d.barang.nama,
        quantity: d.jumlah,
        fromWarehouse: t.gudang_asal.nama,
        toWarehouse: t.gudang_tujuan.nama,
        status: t.status,
        notes: t.catatan || "",
        createdBy: t.user?.nama || "-",
      }));

      setRows((prev) => [...newRows, ...prev]);

      toast({
        title: "Transfer stok berhasil dicatat",
        description: "Transfer stok antar gudang berhasil disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal mencatat transfer stok",
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
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const countForRange = (from: Date) =>
      rows.reduce((sum, r) => {
        const d = new Date(r.date);
        if (d >= from) return sum + 1;
        return sum;
      }, 0);

    // Saat ini backend set status transfer menjadi "selesai" langsung
    // sehingga belum ada konsep benar-benar "sedang dikirim".
    // Untuk sementara, kita pakai total baris transfer sebagai angka ringkasan kedua.
    const totalTransfers = rows.length;

    return {
      today: countForRange(startOfToday),
      inTransit: totalTransfers,
      month: countForRange(startOfMonth),
    };
  }, [rows]);

  const itemOptions = useMemo(
    () =>
      items.map((it) => ({
        id: String(it.id),
        code: it.kode,
        name: it.nama,
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
          <h1 className="text-3xl font-bold text-foreground">Transfer Stok</h1>
          <p className="text-muted-foreground">Pindahkan stok antar gudang</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Transfer Baru
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
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transfer</p>
                <p className="text-2xl font-bold">{stats.inTransit}</p>
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
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transfer</CardTitle>
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
                  <TableHead>Gudang Asal</TableHead>
                  <TableHead>Gudang Tujuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(transfer.date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {transfer.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transfer.itemName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transfer.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {transfer.fromWarehouse}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        {transfer.toWarehouse}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(transfer.status)}
                      >
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.notes}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TransferFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        items={itemOptions}
        warehouses={warehouseOptions}
      />
    </div>
  );
};
