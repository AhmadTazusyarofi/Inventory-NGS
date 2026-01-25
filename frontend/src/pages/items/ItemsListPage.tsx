import { ItemFormModal } from "@/components/items/ItemFormModal";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiDelete, apiGet, apiPostForm, apiPutForm } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Edit, Image as ImageIcon, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
// ambil base host tanpa suffix `/api` supaya bisa dipakai untuk URL gambar
const API_BASE_URL = API_URL ? API_URL.replace(/\/api\/?$/, "") : "";

interface BackendItem {
  id: number;
  kode: string;
  nama: string;
  satuan: string;
  stok: number | null;
  stok_minimum: number;
  deskripsi: string | null;
  url_gambar: string | null;
  kategori: { id: number; nama: string };
  supplier: { id: number; nama: string };
}

interface BackendListResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface BackendCategoryRef {
  id: number;
  nama: string;
}

interface BackendSupplierRef {
  id: number;
  nama: string;
}

interface Item {
  id: number;
  name: string;
  code: string;
  category: string;
  supplier: string;
  categoryId: number;
  supplierId: number;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl: string | null;
  description?: string | null;
}

export const ItemsListPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return;

        const [itemsRes, categoriesRes, suppliersRes] = await Promise.all([
          apiGet<BackendListResponse<BackendItem[]>>("/items", token),
          apiGet<BackendListResponse<BackendCategoryRef[]>>(
            "/categories",
            token
          ),
          apiGet<BackendListResponse<BackendSupplierRef[]>>(
            "/suppliers",
            token
          ),
        ]);

        if (!itemsRes.success) {
          throw new Error(itemsRes.message || "Gagal memuat barang");
        }
        if (!categoriesRes.success) {
          throw new Error(categoriesRes.message || "Gagal memuat kategori");
        }
        if (!suppliersRes.success) {
          throw new Error(suppliersRes.message || "Gagal memuat supplier");
        }

        setItems(
          itemsRes.data.map((it) => ({
            id: it.id,
            name: it.nama,
            code: it.kode,
            category: it.kategori?.nama ?? "-",
            supplier: it.supplier?.nama ?? "-",
            categoryId: it.kategori?.id ?? 0,
            supplierId: it.supplier?.id ?? 0,
            stock: it.stok ?? 0,
            minStock: it.stok_minimum,
            unit: it.satuan,
            imageUrl: it.url_gambar ? `${API_BASE_URL}${it.url_gambar}` : null,
            description: it.deskripsi,
          }))
        );

        setCategories(
          categoriesRes.data.map((c) => ({ id: c.id, name: c.nama }))
        );
        setSuppliers(
          suppliersRes.data.map((s) => ({ id: s.id, name: s.nama }))
        );
      } catch (error) {
        toast({
          title: "Gagal memuat barang",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [token, toast]);

  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = async (item: Item) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiDelete<BackendListResponse<null>>(
        `/items/${item.id}`,
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Gagal menghapus barang");
      }

      setItems((prev) => prev.filter((it) => it.id !== item.id));

      toast({
        title: "Barang dihapus",
        description: "Data barang berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus barang",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleSubmitItem = async (data: any, file?: File | null) => {
    if (!token) {
      toast({
        title: "Tidak terotentikasi",
        variant: "destructive",
      });
      return;
    }

    if (!data.categoryId || !data.supplierId) {
      toast({
        title: "Kategori dan supplier wajib dipilih",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("kode", data.code);
      formData.append("nama", data.name);
      formData.append("id_kategori", data.categoryId);
      formData.append("id_supplier", data.supplierId);
      formData.append("satuan", data.unit);
      formData.append("stok", String(data.stock ?? 0));
      formData.append("stok_minimum", String(data.minStock));
      if (data.description) formData.append("deskripsi", data.description);
      if (file) formData.append("image", file);
      let res: BackendListResponse<BackendItem>;

      if (editingItem) {
        // update item
        res = await apiPutForm<BackendListResponse<BackendItem>>(
          `/items/${editingItem.id}`,
          formData,
          token
        );
      } else {
        // tambah item baru
        res = await apiPostForm<BackendListResponse<BackendItem>>(
          "/items",
          formData,
          token
        );
      }

      if (!res.success) {
        throw new Error(
          res.message ||
            (editingItem
              ? "Gagal memperbarui barang"
              : "Gagal menambahkan barang")
        );
      }

      const it = res.data;
      const mapped: Item = {
        id: it.id,
        name: it.nama,
        code: it.kode,
        category: it.kategori?.nama ?? "-",
        supplier: it.supplier?.nama ?? "-",
        categoryId: it.kategori?.id ?? 0,
        supplierId: it.supplier?.id ?? 0,
        stock: it.stok ?? 0,
        minStock: it.stok_minimum,
        unit: it.satuan,
        imageUrl: it.url_gambar ? `${API_BASE_URL}${it.url_gambar}` : null,
        description: it.deskripsi,
      };

      setItems((prev) =>
        editingItem
          ? prev.map((item) => (item.id === mapped.id ? mapped : item))
          : [...prev, mapped]
      );

      toast({
        title: editingItem ? "Barang diperbarui" : "Barang ditambahkan",
        description: editingItem
          ? "Data barang berhasil diperbarui."
          : "Barang baru berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan barang",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === "all" ||
      item.categoryId === Number(selectedCategory);
    const matchesSupplier =
      selectedSupplier === "all" ||
      item.supplierId === Number(selectedSupplier);

    return matchesSearch && matchesCategory && matchesSupplier;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barang</h1>
          <p className="text-muted-foreground">Kelola inventaris barang anda</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Barang Baru
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSupplier}
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Supplier</SelectItem>
                {suppliers.map((sup) => (
                  <SelectItem key={sup.id} value={String(sup.id)}>
                    {sup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Barang ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Data barang kosong.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Stok Minimum</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.supplier}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.stock < item.minStock
                              ? "destructive"
                              : "default"
                          }
                        >
                          {item.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.minStock}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(item)}
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
                                  Hapus data barang?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah anda yakin ingin menghapus data "{item.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteItem(item)}
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

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={
          editingItem && {
            id: String(editingItem.id),
            name: editingItem.name,
            code: editingItem.code,
            categoryId: String(editingItem.categoryId),
            supplierId: String(editingItem.supplierId),
            stock: editingItem.stock,
            minStock: editingItem.minStock,
            unit: editingItem.unit,
            description: editingItem.description ?? "",
            image: editingItem.imageUrl,
          }
        }
        onSubmit={handleSubmitItem}
        categories={categories.map((c) => ({ id: String(c.id), name: c.name }))}
        suppliers={suppliers.map((s) => ({ id: String(s.id), name: s.name }))}
      />
    </div>
  );
};
