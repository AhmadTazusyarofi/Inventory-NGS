import { SupplierFormModal } from "@/components/suppliers/SupplierFormModal";
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
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Edit, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface BackendSupplier {
  id: number;
  nama: string;
  telepon: string;
  email: string;
  alamat: string;
  kota: string | null;
  provinsi: string | null;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export const SuppliersPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Ambil data supplier dari backend
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        if (!token) return;

        const res = await apiGet<BackendResponse<BackendSupplier[]>>(
          "/suppliers",
          token
        );

        if (!res.success) {
          throw new Error(res.message || "Gagal memuat supplier");
        }

        setSuppliers(
          res.data.map((sup) => ({
            id: sup.id,
            name: sup.nama,
            phone: sup.telepon,
            email: sup.email,
            address: sup.alamat,
          }))
        );
      } catch (error) {
        toast({
          title: "Gagal memuat supplier",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadSuppliers();
  }, [token, toast]);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  const handleDeleteSupplier = async (supplier: Supplier) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiDelete<BackendResponse<null>>(
        `/suppliers/${supplier.id}`,
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal menghapus supplier");
      }

      setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id));

      toast({
        title: "Supplier dihapus",
        description: "Supplier berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus supplier",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleSubmitSupplier = async (data: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      let res: BackendResponse<BackendSupplier>;

      if (editingSupplier) {
        // Update supplier
        res = await apiPut<BackendResponse<BackendSupplier>>(
          `/suppliers/${editingSupplier.id}`,
          {
            nama: data.name,
            telepon: data.phone,
            email: data.email,
            alamat: data.address,
          },
          token
        );
      } else {
        // Tambah supplier baru
        res = await apiPost<BackendResponse<BackendSupplier>>(
          "/suppliers",
          {
            nama: data.name,
            telepon: data.phone,
            email: data.email,
            alamat: data.address,
            // kota & provinsi optional, bisa ditambah di form nanti
          },
          token
        );
      }

      if (!res.success) {
        throw new Error(res.message || "Gagal menambahkan supplier");
      }

      const sup = res.data;
      const newSupplier: Supplier = {
        id: sup.id,
        name: sup.nama,
        phone: sup.telepon,
        email: sup.email,
        address: sup.alamat,
      };

      setSuppliers((prev) =>
        editingSupplier
          ? prev.map((s) => (s.id === newSupplier.id ? newSupplier : s))
          : [...prev, newSupplier]
      );

      toast({
        title: editingSupplier ? "Supplier diperbarui" : "Supplier ditambahkan",
        description: editingSupplier
          ? "Supplier berhasil diperbarui."
          : "Supplier baru berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan supplier",
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
          <h1 className="text-3xl font-bold text-foreground">Data Supplier</h1>
          <p className="text-muted-foreground">Kelola data supplier</p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Supplier Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Supplier ({suppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Data supplier kosong.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        {supplier.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {supplier.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSupplier(supplier)}
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
                                  Hapus data supplier?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah anda yakin ingin menghapus data "
                                  {supplier.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSupplier(supplier)}
                                >
                                  Ya, hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <SupplierFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        supplier={
          editingSupplier && {
            id: String(editingSupplier.id),
            name: editingSupplier.name,
            phone: editingSupplier.phone,
            email: editingSupplier.email,
            address: editingSupplier.address,
          }
        }
        onSubmit={handleSubmitSupplier}
      />
    </div>
  );
};
