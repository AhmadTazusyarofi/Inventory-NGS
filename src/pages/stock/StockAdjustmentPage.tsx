import { useState } from 'react';
import { Plus, Calendar, AlertTriangle } from 'lucide-react';
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

const mockAdjustments = [
  {
    id: '1',
    itemName: 'Laptop Dell XPS 15',
    itemCode: 'LAP-001',
    warehouse: 'Main Warehouse',
    adjustmentType: 'damaged',
    quantity: -3,
    date: '2025-01-12',
    reason: 'Water damage during transport',
    createdBy: 'Admin User',
  },
  {
    id: '2',
    itemName: 'Office Chair Ergonomic',
    itemCode: 'FUR-001',
    warehouse: 'Secondary Warehouse',
    adjustmentType: 'lost',
    quantity: -2,
    date: '2025-01-11',
    reason: 'Missing after inventory check',
    createdBy: 'Staff User',
  },
  {
    id: '3',
    itemName: 'Wireless Mouse Logitech',
    itemCode: 'ELC-002',
    warehouse: 'Regional Warehouse',
    adjustmentType: 'found',
    quantity: 5,
    date: '2025-01-10',
    reason: 'Found in old storage room',
    createdBy: 'Staff User',
  },
  {
    id: '4',
    itemName: 'Printer HP LaserJet',
    itemCode: 'ELC-001',
    warehouse: 'Main Warehouse',
    adjustmentType: 'correction',
    quantity: -1,
    date: '2025-01-09',
    reason: 'System error correction',
    createdBy: 'Admin User',
  },
];

export const StockAdjustmentPage = () => {
  const [adjustments] = useState(mockAdjustments);

  const handleAdd = () => {
    toast.success('Add adjustment modal will open');
    // TODO: Open modal
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'damaged':
        return 'bg-destructive';
      case 'lost':
        return 'bg-warning';
      case 'found':
        return 'bg-success';
      case 'correction':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      damaged: 'Damaged',
      lost: 'Lost',
      found: 'Found',
      correction: 'Correction',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Adjustment</h1>
          <p className="text-muted-foreground">Adjust stock for damaged, lost, or correction</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          New Adjustment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Damaged</p>
              <p className="text-2xl font-bold text-destructive">12</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lost</p>
              <p className="text-2xl font-bold text-warning">8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Found</p>
              <p className="text-2xl font-bold text-success">15</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Corrections</p>
              <p className="text-2xl font-bold text-primary">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Adjustment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(adjustment.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{adjustment.itemCode}</TableCell>
                    <TableCell className="font-medium">{adjustment.itemName}</TableCell>
                    <TableCell className="text-sm">{adjustment.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant="default" className={getTypeColor(adjustment.adjustmentType)}>
                        {getTypeLabel(adjustment.adjustmentType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          adjustment.quantity > 0 ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {adjustment.quantity > 0 ? '+' : ''}
                        {adjustment.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px]">
                      {adjustment.reason}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {adjustment.createdBy}
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
