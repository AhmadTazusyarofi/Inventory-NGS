import { useState } from 'react';
import { Plus, Calendar, Package } from 'lucide-react';
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

const mockStockOut = [
  { 
    id: '1', 
    itemName: 'Printer HP LaserJet',
    itemCode: 'ELC-001',
    quantity: 5,
    date: '2025-01-10',
    notes: 'Sold to client',
    createdBy: 'Admin User'
  },
  { 
    id: '2', 
    itemName: 'Office Chair Ergonomic',
    itemCode: 'FUR-001',
    quantity: 8,
    date: '2025-01-09',
    notes: 'Internal use - new office',
    createdBy: 'Admin User'
  },
  { 
    id: '3', 
    itemName: 'Wireless Mouse Logitech',
    itemCode: 'ELC-002',
    quantity: 12,
    date: '2025-01-08',
    notes: 'Bulk order delivery',
    createdBy: 'Admin User'
  },
];

export const StockOutPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock OUT</h1>
          <p className="text-muted-foreground">Record outgoing stock</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock OUT
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">124</p>
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
                <p className="text-2xl font-bold">892</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock OUT History</CardTitle>
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
                {mockStockOut.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(stock.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{stock.itemCode}</TableCell>
                    <TableCell className="font-medium">{stock.itemName}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-warning text-warning-foreground">
                        -{stock.quantity}
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
    </div>
  );
};
