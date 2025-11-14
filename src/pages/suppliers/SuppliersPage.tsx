import { useState } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupplierFormModal } from '@/components/suppliers/SupplierFormModal';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockSuppliers = [
  { 
    id: '1', 
    name: 'PT. Tech Solutions', 
    phone: '+62 21 1234 5678', 
    email: 'contact@techsolutions.com',
    address: 'Jl. Sudirman No. 123, Jakarta'
  },
  { 
    id: '2', 
    name: 'CV. Furniture Indo', 
    phone: '+62 21 8765 4321', 
    email: 'info@furnitureindo.com',
    address: 'Jl. Thamrin No. 45, Jakarta'
  },
  { 
    id: '3', 
    name: 'Toko Alat Kantor', 
    phone: '+62 21 5555 6666', 
    email: 'sales@alatkantor.com',
    address: 'Jl. Gatot Subroto No. 78, Jakarta'
  },
  { 
    id: '4', 
    name: 'PT. Safety First', 
    phone: '+62 21 7777 8888', 
    email: 'order@safetyfirst.com',
    address: 'Jl. Rasuna Said No. 90, Jakarta'
  },
];

export const SuppliersPage = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<typeof mockSuppliers[0] | null>(null);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleEditSupplier = (supplier: typeof mockSuppliers[0]) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  const handleSubmitSupplier = (data: any) => {
    if (editingSupplier) {
      toast({
        title: 'Supplier Updated',
        description: 'Supplier has been updated successfully.',
      });
    } else {
      toast({
        title: 'Supplier Added',
        description: 'New supplier has been added successfully.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers</p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Supplier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers ({mockSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
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
                        <Button variant="ghost" size="icon" onClick={() => handleEditSupplier(supplier)}>
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

      <SupplierFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        supplier={editingSupplier}
        onSubmit={handleSubmitSupplier}
      />
    </div>
  );
};
