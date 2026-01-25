import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { WarehouseFormModal } from "@/components/warehouses/WarehouseFormModal";
import { useToast } from "@/hooks/use-toast";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Edit, MapPin, Package, Plus, Trash2, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";

interface BackendWarehouse {
  id: number;
  kode: string;
  nama: string;
  lokasi: string;
  alamat: string;
  kapasitas: number | null;
  status: string;
  currentStock?: number;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface WarehouseItem {
  id: number;
  code: string;
  name: string;
  location: string;
  address: string;
  capacity: number | null;
  currentStock: number;
  status: string;
}

export const WarehousesPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<WarehouseItem | null>(null);

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        if (!token) return;

        const res = await apiGet<BackendResponse<BackendWarehouse[]>>(
          "/warehouses",
          token
        );

        if (!res.success) {
          throw new Error(res.message || "Gagal memuat gudang");
        }

        setWarehouses(
          res.data.map((w) => ({
            id: w.id,
            code: w.kode,
            name: w.nama,
            location: w.lokasi,
            address: w.alamat,
            capacity: w.kapasitas,
            currentStock: w.currentStock ?? 0,
            status: w.status,
          }))
        );
      } catch (error) {
        toast({
          title: "Gagal memuat gudang",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadWarehouses();
  }, [token, toast]);

  const handleAdd = () => {
    setEditingWarehouse(null);
    setModalOpen(true);
  };

  const handleEdit = (warehouse: WarehouseItem) => {
    setEditingWarehouse(warehouse);
    setModalOpen(true);
  };

  const handleSubmitWarehouse = async (data: {
    code: string;
    name: string;
    location: string;
    address: string;
    capacity?: number | null;
    status: string;
  }) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      let res: BackendResponse<BackendWarehouse>;

      if (editingWarehouse) {
        res = await apiPut<BackendResponse<BackendWarehouse>>(
          `/warehouses/${editingWarehouse.id}`,
          {
            kode: data.code,
            nama: data.name,
            lokasi: data.location,
            alamat: data.address,
            kapasitas: data.capacity ?? null,
            status: data.status,
          },
          token
        );
      } else {
        res = await apiPost<BackendResponse<BackendWarehouse>>(
          "/warehouses",
          {
            kode: data.code,
            nama: data.name,
            lokasi: data.location,
            alamat: data.address,
            kapasitas: data.capacity ?? null,
            status: data.status,
          },
          token
        );
      }

      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan gudang");
      }

      const w = res.data;
      const mapped: WarehouseItem = {
        id: w.id,
        code: w.kode,
        name: w.nama,
        location: w.lokasi,
        address: w.alamat,
        capacity: w.kapasitas,
        currentStock: w.currentStock ?? 0,
        status: w.status,
      };

      setWarehouses((prev) =>
        editingWarehouse
          ? prev.map((wh) => (wh.id === mapped.id ? mapped : wh))
          : [...prev, mapped]
      );

      toast({
        title: editingWarehouse
          ? "Data gudang diperbarui"
          : "Data gudang ditambahkan",
        description: editingWarehouse
          ? "Data gudang berhasil diperbarui."
          : "Data gudang baru berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan data gudang",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (warehouse: WarehouseItem) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiDelete<BackendResponse<null>>(
        `/warehouses/${warehouse.id}`,
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal menghapus gudang");
      }

      setWarehouses((prev) => prev.filter((w) => w.id !== warehouse.id));

      toast({
        title: "Data gudang dihapus",
        description: "Data gudang berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus data gudang",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const getUtilizationPercentage = (current: number, capacity: number) => {
    if (!capacity || capacity <= 0) return 0;
    return Math.round((current / capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 70) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Gudang</h1>
          <p className="text-muted-foreground">Kelola lokasi gudang</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah data gudang
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gudang</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kapasitas</p>
                <p className="text-2xl font-bold">
                  {warehouses
                    .reduce((sum, w) => sum + w.capacity, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold">
                  {warehouses
                    .reduce((sum, w) => sum + w.currentStock, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Gudang ({warehouses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Stock Saat Ini</TableHead>
                  <TableHead>Utilisasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => {
                  const utilization = getUtilizationPercentage(
                    warehouse.currentStock,
                    warehouse.capacity
                  );
                  return (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium text-sm">
                        {warehouse.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {warehouse.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {warehouse.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {warehouse.address}
                      </TableCell>
                      <TableCell>
                        {warehouse.capacity.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {warehouse.currentStock.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${getUtilizationColor(
                            utilization
                          )}`}
                        >
                          {utilization}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={
                            warehouse.status === "aktif"
                              ? "bg-success"
                              : "bg-destructive"
                          }
                        >
                          {warehouse.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(warehouse)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus data gudang?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah anda yakin ingin menghapus data "
                                  {warehouse.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(warehouse)}
                                >
                                  Ya, hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <WarehouseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        warehouse={
          editingWarehouse && {
            id: editingWarehouse.id,
            code: editingWarehouse.code,
            name: editingWarehouse.name,
            location: editingWarehouse.location,
            address: editingWarehouse.address,
            capacity: editingWarehouse.capacity,
            status: editingWarehouse.status,
          }
        }
        onSubmit={handleSubmitWarehouse}
      />
    </div>
  );
};
