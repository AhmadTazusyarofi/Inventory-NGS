import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
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

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ngs.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-01-12 14:30',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@ngs.com',
    role: 'warehouse_staff',
    status: 'active',
    lastLogin: '2025-01-12 10:15',
    createdAt: '2024-03-15',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@ngs.com',
    role: 'warehouse_staff',
    status: 'active',
    lastLogin: '2025-01-11 16:45',
    createdAt: '2024-05-20',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@ngs.com',
    role: 'warehouse_staff',
    status: 'inactive',
    lastLogin: '2024-12-20 09:00',
    createdAt: '2024-02-10',
  },
];

export const UsersManagementPage = () => {
  const [users] = useState(mockUsers);

  const handleAdd = () => {
    toast.success('Add user modal will open');
    // TODO: Open modal
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit user ${id}`);
    // TODO: Open edit modal
  };

  const handleDelete = (id: string) => {
    toast.error(`Delete user ${id}`);
    // TODO: Show confirmation dialog
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary';
      case 'warehouse_staff':
        return 'bg-accent';
      default:
        return 'bg-secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      warehouse_staff: 'Warehouse Staff',
    };
    return labels[role] || role;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-success' : 'bg-destructive';
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const staffCount = users.filter((u) => u.role === 'warehouse_staff').length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold">{staffCount}</p>
              </div>
              <UserIcon className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{activeCount}</p>
              </div>
              <UserIcon className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="default" className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === 'admin'}
                        >
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

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all features including user management, reports, stock management, and
                system settings.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Warehouse Staff</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Can manage items, stock movements, stock opname, and view reports. Cannot access user
                management or system settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
