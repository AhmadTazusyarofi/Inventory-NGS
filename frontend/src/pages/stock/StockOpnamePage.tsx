import {
  StartOpnameFormData,
  StartOpnameFormModal,
} from "@/components/stock/StartOpnameFormModal";
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
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Plus,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BackendDetailOpname {
  id: number;
  id_opname: number;
  stok_sistem: number;
  stok_fisik: number;
  selisih: number;
  status: string;
  barang: {
    id: number;
    kode: string;
    nama: string;
  };
}

interface BackendOpname {
  id: number;
  nomor_opname: string;
  id_gudang: number;
  tanggal: string;
  status: string;
  total_item: number;
  total_selisih: number;
  gudang: {
    id: number;
    nama: string;
  };
  user: {
    id: number;
    nama: string;
  };
  detail: BackendDetailOpname[];
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

interface OpnameRow {
  id: number;
  opnameNumber: string;
  warehouse: string;
  date: string;
  status: string;
  totalItems: number;
  matchedItems: number;
  discrepancy: number;
  createdBy: string;
}

interface OpnameDetailRow {
  id: number;
  itemCode: string;
  itemName: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  status: string;
}

export const StockOpnamePage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [opnames, setOpnames] = useState<OpnameRow[]>([]);
  const [details, setDetails] = useState<OpnameDetailRow[]>([]);
  const [warehouses, setWarehouses] = useState<BackendWarehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return;

        const [opnRes, whRes] = await Promise.all([
          apiGet<BackendResponse<BackendOpname[]>>("/stock/opnames", token),
          apiGet<BackendResponse<BackendWarehouse[]>>("/warehouses", token),
        ]);

        if (!opnRes.success) {
          throw new Error(opnRes.message || "Gagal memuat data opname");
        }
        if (!whRes.success) {
          throw new Error(whRes.message || "Gagal memuat gudang");
        }

        const rows: OpnameRow[] = opnRes.data.map((o) => {
          const matchedItems = o.detail.filter((d) => d.selisih === 0).length;
          const discrepancy = o.detail.filter((d) => d.selisih !== 0).length;

          return {
            id: o.id,
            opnameNumber: o.nomor_opname,
            warehouse: o.gudang.nama,
            date: o.tanggal,
            status: o.status,
            totalItems: o.total_item,
            matchedItems,
            discrepancy,
            createdBy: o.user?.nama || "-",
          };
        });

        setOpnames(rows);

        const latest = opnRes.data[0];
        if (latest) {
          const detRows: OpnameDetailRow[] = latest.detail.map((d) => ({
            id: d.id,
            itemCode: d.barang.kode,
            itemName: d.barang.nama,
            systemStock: d.stok_sistem,
            physicalStock: d.stok_fisik,
            difference: d.selisih,
            status: d.status,
          }));
          setDetails(detRows);
        } else {
          setDetails([]);
        }

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
      case "selesai":
        return "bg-success";
      case "proses":
        return "bg-warning";
      case "draft":
        return "bg-destructive";
      default:
        return "bg-secondary";
    }
  };

  const getDetailStatusIcon = (status: string) => {
    switch (status) {
      case "sesuai":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "kurang":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "lebih":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const stats = useMemo(() => {
    const total = opnames.length;
    const completed = opnames.filter((o) => o.status === "selesai").length;
    const inProgress = opnames.filter((o) => o.status === "proses").length;
    return { total, completed, inProgress };
  }, [opnames]);

  const handleSubmit = async (data: StartOpnameFormData) => {
    if (!token) {
      toast({ title: "Tidak terotentikasi", variant: "destructive" });
      return;
    }

    try {
      const res = await apiPost<BackendResponse<BackendOpname>>(
        "/stock/opname",
        {
          id_gudang: Number(data.warehouseId),
          tanggal: data.date,
        },
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal memulai opname");
      }

      const o = res.data;
      const matchedItems = o.detail.filter((d) => d.selisih === 0).length;
      const discrepancy = o.detail.filter((d) => d.selisih !== 0).length;

      const newRow: OpnameRow = {
        id: o.id,
        opnameNumber: o.nomor_opname,
        warehouse: o.gudang.nama,
        date: o.tanggal,
        status: o.status,
        totalItems: o.total_item,
        matchedItems,
        discrepancy,
        createdBy: o.user?.nama || "-",
      };

      setOpnames((prev) => [newRow, ...prev]);

      const detRows: OpnameDetailRow[] = o.detail.map((d) => ({
        id: d.id,
        itemCode: d.barang.kode,
        itemName: d.barang.nama,
        systemStock: d.stok_sistem,
        physicalStock: d.stok_fisik,
        difference: d.selisih,
        status: d.status,
      }));
      setDetails(detRows);

      toast({
        title: "Stock opname dimulai",
        description: "Data awal opname sudah dibuat berdasarkan stok sistem.",
      });
    } catch (error) {
      toast({
        title: "Gagal memulai opname",
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
          <h1 className="text-3xl font-bold text-foreground">Stock Opname</h1>
          <p className="text-muted-foreground">
            Pencocokan stok fisik dengan sistem
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Mulai Opname
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Opname</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="text-2xl font-bold text-success">
                {stats.completed}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Sedang Proses</p>
              <p className="text-2xl font-bold text-warning">
                {stats.inProgress}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opname History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Stock Opname</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Opname</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Gudang</TableHead>
                  <TableHead>Total Item</TableHead>
                  <TableHead>Item Sesuai</TableHead>
                  <TableHead>Item Selisih</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opnames.map((opname) => (
                  <TableRow key={opname.id}>
                    <TableCell className="font-medium text-sm">
                      {opname.opnameNumber}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(opname.date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>{opname.warehouse}</TableCell>
                    <TableCell>{opname.totalItems}</TableCell>
                    <TableCell className="text-success font-semibold">
                      {opname.matchedItems}
                    </TableCell>
                    <TableCell>
                      {opname.discrepancy > 0 ? (
                        <span className="text-destructive font-semibold">
                          {opname.discrepancy}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={getStatusColor(opname.status)}
                      >
                        {opname.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {opname.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Latest Opname Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            Detail Opname Terbaru
            {opnames[0] ? ` (${opnames[0].opnameNumber})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Stok Sistem</TableHead>
                  <TableHead>Stok Fisik</TableHead>
                  <TableHead>Selisih</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium text-sm">
                      {detail.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {detail.itemName}
                    </TableCell>
                    <TableCell>{detail.systemStock}</TableCell>
                    <TableCell className="font-semibold">
                      {detail.physicalStock}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          detail.difference === 0
                            ? "text-muted-foreground"
                            : detail.difference > 0
                            ? "text-warning"
                            : "text-destructive"
                        }`}
                      >
                        {detail.difference > 0 ? "+" : ""}
                        {detail.difference}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDetailStatusIcon(detail.status)}
                        <span className="capitalize">{detail.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <StartOpnameFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        warehouses={warehouses.map((wh) => ({
          id: String(wh.id),
          name: wh.nama,
        }))}
      />
    </div>
  );
};
