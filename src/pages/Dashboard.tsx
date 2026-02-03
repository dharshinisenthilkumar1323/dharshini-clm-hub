import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, Phone, CheckCircle, Plus, List, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading, signOut, isAdmin } = useAuth();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.status === 'New').length || 0,
    contacted: leads?.filter(l => l.status === 'Contacted').length || 0,
    converted: leads?.filter(l => l.status === 'Converted').length || 0,
  };

  const statCards = [
    { title: 'Total Leads', value: stats.total, icon: Users, gradient: 'gradient-primary' },
    { title: 'New Leads', value: stats.new, icon: UserPlus, gradient: 'gradient-secondary' },
    { title: 'Contacted', value: stats.contacted, icon: Phone, gradient: 'gradient-warning' },
    { title: 'Converted', value: stats.converted, icon: CheckCircle, gradient: 'gradient-success' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Lead Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your sales leads</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden border-0 shadow-lg">
              <div className={`${stat.gradient} p-4`}>
                <div className="flex items-center justify-between">
                  <stat.icon className="w-8 h-8 text-white/80" />
                  {leadsLoading ? (
                    <Skeleton className="h-10 w-16 bg-white/20" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{stat.value}</span>
                  )}
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full gradient-primary text-primary-foreground">
                <Link to="/leads/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Lead
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/leads">
                  <List className="w-4 h-4 mr-2" />
                  View All Leads
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : leads && leads.length > 0 ? (
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'New' ? 'bg-secondary/20 text-secondary' :
                        lead.status === 'Contacted' ? 'bg-warning/20 text-warning' :
                        'bg-success/20 text-success'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No leads yet. Add your first lead!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
