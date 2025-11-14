import { FileText, FileSpreadsheet, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const lowStockItems = [
  { id: '1', code: 'ELC-001', name: 'Printer HP LaserJet', stock: 8, minStock: 10, category: 'Electronics' },
  { id: '2', code: 'OFF-002', name: 'Paper A4 500 sheets', stock: 15, minStock: 50, category: 'Office Supplies' },
  { id: '3', code: 'TOL-001', name: 'Screwdriver Set', stock: 5, minStock: 10, category: 'Tools' },
];

const reportTypes = [
  {
    title: 'Current Stock Report',
    description: 'Export all items with current stock levels',
    icon: FileText,
    actions: [
      { label: 'Download PDF', format: 'PDF' },
      { label: 'Download CSV', format: 'CSV' },
    ],
  },
  {
    title: 'Stock Movement Report',
    description: 'Export stock IN and OUT history',
    icon: FileSpreadsheet,
    actions: [
      { label: 'Download PDF', format: 'PDF' },
      { label: 'Download CSV', format: 'CSV' },
    ],
  },
  {
    title: 'Low Stock Report',
    description: 'Items below minimum stock level',
    icon: AlertTriangle,
    actions: [
      { label: 'Download PDF', format: 'PDF' },
      { label: 'Download CSV', format: 'CSV' },
    ],
  },
];

export const ReportsPage = () => {
  const handleDownload = (reportType: string, format: string) => {
    toast.success(`Downloading ${reportType} as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Generate and export inventory reports</p>
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.actions.map((action) => (
                <Button
                  key={action.format}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownload(report.title, action.format)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Low Stock Alert</CardTitle>
          </div>
          <CardDescription>Items that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{item.stock}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Low Stock</Badge>
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
