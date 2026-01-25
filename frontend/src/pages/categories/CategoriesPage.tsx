import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
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
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface BackendCategory {
  id: number;
  nama: string;
  deskripsi: string | null;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export const CategoriesPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Ambil data kategori dari backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!token) return;

        const res = await apiGet<BackendResponse<BackendCategory[]>>(
          "/categories",
          token
        );

        if (!res.success) {
          throw new Error(res.message || "Gagal memuat kategori");
        }

        setCategories(
          res.data.map((cat) => ({
            id: cat.id,
            name: cat.nama,
            description: cat.deskripsi,
          }))
        );
      } catch (error) {
        toast({
          title: "Gagal memuat kategori",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadCategories();
  }, [token, toast]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiDelete<BackendResponse<null>>(
        `/categories/${category.id}`,
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal menghapus kategori");
      }

      setCategories((prev) => prev.filter((c) => c.id !== category.id));

      toast({
        title: "Kategori dihapus",
        description: "Kategori berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus kategori",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleSubmitCategory = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      let res: BackendResponse<BackendCategory>;

      if (editingCategory) {
        // Update kategori
        res = await apiPut<BackendResponse<BackendCategory>>(
          `/categories/${editingCategory.id}`,
          {
            nama: data.name,
            deskripsi: data.description,
          },
          token
        );
      } else {
        // Tambah kategori baru
        res = await apiPost<BackendResponse<BackendCategory>>(
          "/categories",
          {
            nama: data.name,
            deskripsi: data.description,
          },
          token
        );
      }

      if (!res.success) {
        throw new Error(res.message || "Gagal menambahkan kategori");
      }

      const cat = res.data;
      const newCategory: Category = {
        id: cat.id,
        name: cat.nama,
        description: cat.deskripsi,
      };

      setCategories((prev) =>
        editingCategory
          ? prev.map((c) => (c.id === newCategory.id ? newCategory : c))
          : [...prev, newCategory]
      );

      toast({
        title: editingCategory ? "Kategori diperbarui" : "Kategori ditambahkan",
        description: editingCategory
          ? "Kategori berhasil diperbarui."
          : "Kategori baru berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan kategori",
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
          <h1 className="text-3xl font-bold text-foreground">Data Kategori</h1>
          <p className="text-muted-foreground">Kelola kategori barang</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Kategori ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Data kategori kosong.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCategory(category)}
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
                                  Hapus data kategori?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah anda yakin ingin menghapus data "
                                  {category.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category)}
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

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={
          editingCategory && {
            id: String(editingCategory.id),
            name: editingCategory.name,
            description: editingCategory.description ?? "",
          }
        }
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};
