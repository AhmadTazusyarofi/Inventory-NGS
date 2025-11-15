import { useState } from 'react';
import { Calendar, AlertTriangle, Package } from 'lucide-react';
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

const mockExpiredItems = [
  {
    id: '1',
    itemCode: 'MED-001',
    itemName: 'Medical Supplies Kit',
    warehouse: 'Main Warehouse',
    stock: 15,
    expiryDate: '2025-01-15',
    daysUntilExpiry: 3,
    status: 'critical',
  },
  {
    id: '2',
    itemCode: 'FOD-001',
    itemName: 'Snack Package A',
    warehouse: 'Secondary Warehouse',
    stock: 45,
    expiryDate: '2025-02-01',
    daysUntilExpiry: 20,
    status: 'warning',
  },
  {
    id: '3',
    itemCode: 'CHM-001',
    itemName: 'Cleaning Chemical X',
    warehouse: 'Main Warehouse',
    stock: 8,
    expiryDate: '2025-01-10',
    daysUntilExpiry: -2,
    status: 'expired',
  },
  {
    id: '4',
    itemCode: 'MED-002',
    itemName: 'First Aid Box',
    warehouse: 'Regional Warehouse',
    stock: 20,
    expiryDate: '2025-03-15',
    daysUntilExpiry: 63,
    status: 'normal',
  },
];

export const ExpiredItemsPage = () => {
  const [items] = useState(mockExpiredItems);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-destructive';
      case 'critical':
        return 'bg-destructive';
      case 'warning':
        return 'bg-warning';
      case 'normal':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      expired: 'Expired',
      critical: 'Critical (< 7 days)',
      warning: 'Warning (< 30 days)',
      normal: 'Normal',
    };
    return labels[status] || status;
  };

  const expiredCount = items.filter((i) => i.status === 'expired').length;
  const criticalCount = items.filter((i) => i.status === 'critical').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expired Items Tracking</h1>
          <p className="text-muted-foreground">Monitor items approaching expiry date</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-warning">{warningCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items by Expiry Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Until Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.itemCode}</TableCell>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell className="text-sm">{item.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.stock}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(item.expiryDate).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          item.daysUntilExpiry < 0
                            ? 'text-destructive'
                            : item.daysUntilExpiry < 7
                            ? 'text-destructive'
                            : item.daysUntilExpiry < 30
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {item.daysUntilExpiry < 0
                          ? `${Math.abs(item.daysUntilExpiry)} days ago`
                          : `${item.daysUntilExpiry} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
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
