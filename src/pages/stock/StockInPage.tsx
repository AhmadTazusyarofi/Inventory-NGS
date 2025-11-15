import { useState } from 'react';
import { Plus, Calendar, Package } from 'lucide-react';
import { StockFormModal } from '@/components/stock/StockFormModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockStockIn = [
  { 
    id: '1', 
    itemName: 'Laptop Dell XPS 15',
    itemCode: 'LAP-001',
    quantity: 15,
    date: '2025-01-10',
    notes: 'Regular restock',
    createdBy: 'Admin User'
  },
  { 
    id: '2', 
    itemName: 'Office Chair Ergonomic',
    itemCode: 'FUR-001',
    quantity: 20,
    date: '2025-01-09',
    notes: 'New supplier order',
    createdBy: 'Admin User'
  },
  { 
    id: '3', 
    itemName: 'Wireless Mouse Logitech',
    itemCode: 'ELC-002',
    quantity: 50,
    date: '2025-01-08',
    notes: 'Bulk order discount',
    createdBy: 'Admin User'
  },
];

export const StockInPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('Stock IN data:', data);
    toast.success('Stock IN recorded successfully');
    // TODO: API call to save stock IN
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock IN</h1>
          <p className="text-muted-foreground">Record incoming stock</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock IN
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock IN History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStockIn.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(stock.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{stock.itemCode}</TableCell>
                    <TableCell className="font-medium">{stock.itemName}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        +{stock.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.notes}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.createdBy}</TableCell>
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
        type="IN"
      />
    </div>
  );
};
