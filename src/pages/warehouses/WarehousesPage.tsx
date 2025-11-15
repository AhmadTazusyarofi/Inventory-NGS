import { useState } from 'react';
import { Plus, MapPin, Package, Edit, Trash2, Warehouse } from 'lucide-react';
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

const mockWarehouses = [
  {
    id: '1',
    code: 'WH-001',
    name: 'Main Warehouse',
    location: 'Jakarta Pusat',
    address: 'Jl. Sudirman No. 123',
    capacity: 10000,
    currentStock: 7500,
    status: 'active',
  },
  {
    id: '2',
    code: 'WH-002',
    name: 'Secondary Warehouse',
    location: 'Jakarta Timur',
    address: 'Jl. Taman Mini No. 45',
    capacity: 5000,
    currentStock: 3200,
    status: 'active',
  },
  {
    id: '3',
    code: 'WH-003',
    name: 'Regional Warehouse',
    location: 'Bandung',
    address: 'Jl. Dago No. 78',
    capacity: 8000,
    currentStock: 4100,
    status: 'active',
  },
];

export const WarehousesPage = () => {
  const [warehouses] = useState(mockWarehouses);

  const handleAdd = () => {
    toast.success('Add warehouse modal will open');
    // TODO: Open modal
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit warehouse ${id}`);
    // TODO: Open edit modal
  };

  const handleDelete = (id: string) => {
    toast.error(`Delete warehouse ${id}`);
    // TODO: Show confirmation dialog
  };

  const getUtilizationPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Warehouses</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">
                  {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-2xl font-bold">
                  {warehouses.reduce((sum, w) => sum + w.currentStock, 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => {
                  const utilization = getUtilizationPercentage(
                    warehouse.currentStock,
                    warehouse.capacity
                  );
                  return (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono text-sm">{warehouse.code}</TableCell>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {warehouse.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {warehouse.address}
                      </TableCell>
                      <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                      <TableCell>{warehouse.currentStock.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getUtilizationColor(utilization)}`}>
                          {utilization}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-success">
                          {warehouse.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(warehouse.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(warehouse.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
