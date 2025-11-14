import { Activity, Calendar, User } from 'lucide-react';
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

const mockActivities = [
  { 
    id: '1',
    user: 'Admin User',
    action: 'CREATE_ITEM',
    description: 'Created new item: Laptop Dell XPS 15',
    timestamp: '2025-01-10 14:30:00',
  },
  { 
    id: '2',
    user: 'Admin User',
    action: 'STOCK_IN',
    description: 'Stock IN: Office Chair Ergonomic (+20)',
    timestamp: '2025-01-10 14:15:00',
  },
  { 
    id: '3',
    user: 'Admin User',
    action: 'STOCK_OUT',
    description: 'Stock OUT: Printer HP LaserJet (-5)',
    timestamp: '2025-01-10 13:45:00',
  },
  { 
    id: '4',
    user: 'Admin User',
    action: 'UPDATE_SUPPLIER',
    description: 'Updated supplier: PT. Tech Solutions',
    timestamp: '2025-01-10 12:30:00',
  },
  { 
    id: '5',
    user: 'Admin User',
    action: 'CREATE_CATEGORY',
    description: 'Created new category: Safety Equipment',
    timestamp: '2025-01-10 11:20:00',
  },
  { 
    id: '6',
    user: 'Admin User',
    action: 'UPDATE_ITEM',
    description: 'Updated item: Wireless Mouse Logitech',
    timestamp: '2025-01-10 10:15:00',
  },
  { 
    id: '7',
    user: 'Admin User',
    action: 'DELETE_ITEM',
    description: 'Deleted item: Old Keyboard Model',
    timestamp: '2025-01-10 09:30:00',
  },
];

const getActionBadge = (action: string) => {
  const colors: Record<string, string> = {
    CREATE_ITEM: 'default',
    UPDATE_ITEM: 'secondary',
    DELETE_ITEM: 'destructive',
    STOCK_IN: 'default',
    STOCK_OUT: 'secondary',
    CREATE_CATEGORY: 'default',
    UPDATE_SUPPLIER: 'secondary',
  };

  return (
    <Badge variant={colors[action] as any || 'default'}>
      {action.replace('_', ' ')}
    </Badge>
  );
};

export const ActivityLogPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground">Track all system activities and changes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Activities</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">286</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <User className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {activity.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {activity.user.charAt(0)}
                        </div>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(activity.action)}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.description}</TableCell>
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
