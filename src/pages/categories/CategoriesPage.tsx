import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockCategories = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', itemCount: 48 },
  { id: '2', name: 'Furniture', description: 'Office and home furniture', itemCount: 32 },
  { id: '3', name: 'Office Supplies', description: 'Stationery and office equipment', itemCount: 156 },
  { id: '4', name: 'Tools', description: 'Hand tools and power tools', itemCount: 89 },
  { id: '5', name: 'Safety Equipment', description: 'Personal protective equipment', itemCount: 64 },
];

export const CategoriesPage = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category: typeof mockCategories[0]) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSubmitCategory = (data: any) => {
    if (editingCategory) {
      toast({
        title: 'Kategori Diperbarui',
        description: 'Kategori telah diperbarui dengan sukses.',
      });
    } else {
      toast({
        title: 'Kategori Ditambahkan',
        description: 'Kategori baru telah ditambahkan dengan sukses.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kategori</h1>
          <p className="text-muted-foreground">Kelola kategori produk</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Kategori ({mockCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah Barang</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description}</TableCell>
                    <TableCell>
                      <Badge>{category.itemCount} items</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};
