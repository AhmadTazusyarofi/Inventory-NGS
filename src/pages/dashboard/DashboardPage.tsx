import { Package, FolderTree, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const stats = [
  { title: 'Total Items', value: '1,248', icon: Package, color: 'text-primary', bgColor: 'bg-primary/10' },
  { title: 'Categories', value: '24', icon: FolderTree, color: 'text-accent', bgColor: 'bg-accent/10' },
  { title: 'Suppliers', value: '18', icon: Building2, color: 'text-success', bgColor: 'bg-success/10' },
  { title: 'Low Stock Items', value: '12', icon: TrendingDown, color: 'text-destructive', bgColor: 'bg-destructive/10' },
];

const stockData = [
  { month: 'Jan', in: 400, out: 240 },
  { month: 'Feb', in: 300, out: 139 },
  { month: 'Mar', in: 500, out: 280 },
  { month: 'Apr', in: 450, out: 390 },
  { month: 'May', in: 600, out: 480 },
  { month: 'Jun', in: 550, out: 430 },
];

const categoryData = [
  { name: 'Electronics', value: 320 },
  { name: 'Furniture', value: 280 },
  { name: 'Office Supplies', value: 250 },
  { name: 'Tools', value: 198 },
  { name: 'Others', value: 200 },
];

const recentActivities = [
  { id: 1, user: 'Admin User', action: 'Added new item', item: 'Laptop Dell XPS 15', time: '5 minutes ago' },
  { id: 2, user: 'Admin User', action: 'Stock IN', item: 'Office Chair (+20)', time: '15 minutes ago' },
  { id: 3, user: 'Admin User', action: 'Stock OUT', item: 'Printer HP (-5)', time: '1 hour ago' },
  { id: 4, user: 'Admin User', action: 'Updated supplier', item: 'PT. Tech Solutions', time: '2 hours ago' },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="in" stroke="hsl(var(--chart-1))" name="Stock IN" strokeWidth={2} />
                <Line type="monotone" dataKey="out" stroke="hsl(var(--chart-4))" name="Stock OUT" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}: <span className="font-medium text-foreground">{activity.item}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
