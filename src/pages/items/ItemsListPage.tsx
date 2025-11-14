import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemFormModal } from '@/components/items/ItemFormModal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Item {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  categoryId?: string;
  supplierId?: string;
  stock: number;
  minStock: number;
  unit: string;
  image: any;
}

const mockItems: Item[] = [
  { id: '1', name: 'Laptop Dell XPS 15', code: 'LAP-001', category: 'Electronics', supplier: 'PT. Tech Solutions', stock: 25, minStock: 10, unit: 'pcs', image: null },
  { id: '2', name: 'Office Chair Ergonomic', code: 'FUR-001', category: 'Furniture', supplier: 'CV. Furniture Indo', stock: 50, minStock: 20, unit: 'pcs', image: null },
  { id: '3', name: 'Printer HP LaserJet', code: 'ELC-001', category: 'Electronics', supplier: 'PT. Tech Solutions', stock: 8, minStock: 10, unit: 'pcs', image: null },
  { id: '4', name: 'Whiteboard 120x180', code: 'OFF-001', category: 'Office Supplies', supplier: 'Toko Alat Kantor', stock: 15, minStock: 5, unit: 'pcs', image: null },
  { id: '5', name: 'Wireless Mouse Logitech', code: 'ELC-002', category: 'Electronics', supplier: 'PT. Tech Solutions', stock: 45, minStock: 20, unit: 'pcs', image: null },
];

const mockCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Furniture' },
  { id: '3', name: 'Office Supplies' },
  { id: '4', name: 'Tools' },
];

const mockSuppliers = [
  { id: '1', name: 'PT. Tech Solutions' },
  { id: '2', name: 'CV. Furniture Indo' },
  { id: '3', name: 'Toko Alat Kantor' },
];

const categories = ['All Categories', 'Electronics', 'Furniture', 'Office Supplies', 'Tools'];
const suppliers = ['All Suppliers', 'PT. Tech Solutions', 'CV. Furniture Indo', 'Toko Alat Kantor'];

export const ItemsListPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof mockItems[0] | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: typeof mockItems[0]) => {
    setEditingItem({
      ...item,
      categoryId: mockCategories.find(c => c.name === item.category)?.id || '1',
      supplierId: mockSuppliers.find(s => s.name === item.supplier)?.id || '1',
    });
    setModalOpen(true);
  };

  const handleSubmitItem = (data: any) => {
    if (editingItem) {
      toast({
        title: 'Item Updated',
        description: 'Item has been updated successfully.',
      });
    } else {
      toast({
        title: 'Item Added',
        description: 'New item has been added successfully.',
      });
    }
  };

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesSupplier = selectedSupplier === 'All Suppliers' || item.supplier === selectedSupplier;
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Items</h1>
          <p className="text-muted-foreground">Manage your inventory items</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((sup) => (
                  <SelectItem key={sup} value={sup}>
                    {sup}
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
          <CardTitle>All Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={item.stock < item.minStock ? 'destructive' : 'default'}>
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                    <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
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

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        onSubmit={handleSubmitItem}
        categories={mockCategories}
        suppliers={mockSuppliers}
      />
    </div>
  );
};
