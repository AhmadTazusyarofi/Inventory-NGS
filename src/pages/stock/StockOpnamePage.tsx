import { useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockOpnameFormModal } from '@/components/stock/StockOpnameFormModal';
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

const mockOpnames = [
  {
    id: '1',
    opnameNumber: 'OP-2025-001',
    warehouse: 'Main Warehouse',
    date: '2025-01-12',
    status: 'completed',
    totalItems: 150,
    matchedItems: 142,
    discrepancy: 8,
    createdBy: 'Admin User',
  },
  {
    id: '2',
    opnameNumber: 'OP-2025-002',
    warehouse: 'Secondary Warehouse',
    date: '2025-01-10',
    status: 'in-progress',
    totalItems: 85,
    matchedItems: 65,
    discrepancy: 0,
    createdBy: 'Staff User',
  },
  {
    id: '3',
    opnameNumber: 'OP-2025-003',
    warehouse: 'Regional Warehouse',
    date: '2025-01-08',
    status: 'completed',
    totalItems: 120,
    matchedItems: 118,
    discrepancy: 2,
    createdBy: 'Admin User',
  },
];

const mockOpnameDetails = [
  {
    id: '1',
    itemCode: 'LAP-001',
    itemName: 'Laptop Dell XPS 15',
    systemStock: 45,
    physicalStock: 45,
    difference: 0,
    status: 'match',
  },
  {
    id: '2',
    itemCode: 'FUR-001',
    itemName: 'Office Chair Ergonomic',
    systemStock: 120,
    physicalStock: 118,
    difference: -2,
    status: 'shortage',
  },
  {
    id: '3',
    itemCode: 'ELC-002',
    itemName: 'Wireless Mouse Logitech',
    systemStock: 85,
    physicalStock: 90,
    difference: 5,
    status: 'excess',
  },
];

export const StockOpnamePage = () => {
  const [opnames] = useState(mockOpnames);
  const [details] = useState(mockOpnameDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('Opname data:', data);
    toast.success('Stok opname berhasil dimulai');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-destructive';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Selesai',
      'in-progress': 'Sedang Berjalan',
      cancelled: 'Dibatalkan',
    };
    return labels[status] || status;
  };

  const getDetailStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'shortage':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'excess':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getDetailStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      match: 'Sesuai',
      shortage: 'Kurang',
      excess: 'Lebih',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stok Opname</h1>
          <p className="text-muted-foreground">Verifikasi fisik stok barang</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Mulai Opname
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Opnames</p>
              <p className="text-2xl font-bold">{opnames.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">
                {opnames.filter((o) => o.status === 'completed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-warning">
                {opnames.filter((o) => o.status === 'in-progress').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opname History */}
      <Card>
        <CardHeader>
          <CardTitle>Opname History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opname Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Total Items</TableHead>
                  <TableHead>Matched</TableHead>
                  <TableHead>Discrepancy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opnames.map((opname) => (
                  <TableRow key={opname.id}>
                    <TableCell className="font-mono text-sm">{opname.opnameNumber}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(opname.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{opname.warehouse}</TableCell>
                    <TableCell>{opname.totalItems}</TableCell>
                    <TableCell className="text-success font-semibold">
                      {opname.matchedItems}
                    </TableCell>
                    <TableCell>
                      {opname.discrepancy > 0 ? (
                        <span className="text-destructive font-semibold">
                          {opname.discrepancy}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className={getStatusColor(opname.status)}>
                        {getStatusLabel(opname.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {opname.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Latest Opname Details */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Opname Details (OP-2025-001)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>System Stock</TableHead>
                  <TableHead>Physical Stock</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-mono text-sm">{detail.itemCode}</TableCell>
                    <TableCell className="font-medium">{detail.itemName}</TableCell>
                    <TableCell>{detail.systemStock}</TableCell>
                    <TableCell className="font-semibold">{detail.physicalStock}</TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          detail.difference === 0
                            ? 'text-muted-foreground'
                            : detail.difference > 0
                            ? 'text-warning'
                            : 'text-destructive'
                        }`}
                      >
                        {detail.difference > 0 ? '+' : ''}
                        {detail.difference}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDetailStatusIcon(detail.status)}
                        <span className="capitalize">{getDetailStatusLabel(detail.status)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StockOpnameFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
