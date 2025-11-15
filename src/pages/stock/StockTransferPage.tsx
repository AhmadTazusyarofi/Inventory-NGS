import { useState } from 'react';
import { Plus, ArrowRight, Calendar, Package } from 'lucide-react';
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
import { toast } from 'sonner';

const mockTransfers = [
  {
    id: '1',
    itemName: 'Laptop Dell XPS 15',
    itemCode: 'LAP-001',
    quantity: 10,
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Secondary Warehouse',
    date: '2025-01-12',
    status: 'completed',
    notes: 'Regular distribution',
    createdBy: 'Admin User',
  },
  {
    id: '2',
    itemName: 'Office Chair Ergonomic',
    itemCode: 'FUR-001',
    quantity: 15,
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Regional Warehouse',
    date: '2025-01-11',
    status: 'in-transit',
    notes: 'New office setup',
    createdBy: 'Admin User',
  },
  {
    id: '3',
    itemName: 'Wireless Mouse Logitech',
    itemCode: 'ELC-002',
    quantity: 25,
    fromWarehouse: 'Secondary Warehouse',
    toWarehouse: 'Regional Warehouse',
    date: '2025-01-10',
    status: 'completed',
    notes: 'Stock balancing',
    createdBy: 'Staff User',
  },
];

export const StockTransferPage = () => {
  const [transfers] = useState(mockTransfers);

  const handleAdd = () => {
    toast.success('Add transfer modal will open');
    // TODO: Open modal
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-transit':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-destructive';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Transfer</h1>
          <p className="text-muted-foreground">Move stock between warehouses</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
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
                  <TableHead>From Warehouse</TableHead>
                  <TableHead>To Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(transfer.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transfer.itemCode}</TableCell>
                    <TableCell className="font-medium">{transfer.itemName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transfer.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{transfer.fromWarehouse}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        {transfer.toWarehouse}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className={getStatusColor(transfer.status)}>
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
    </div>
  );
};
