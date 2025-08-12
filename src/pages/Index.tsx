import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollmentForm } from '@/components/EnrollmentForm';
import { AuthPage } from '@/components/AuthPage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  CheckCircle, 
  LogOut,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication and get user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchApplications(user.id);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchApplications(session.user.id);
      } else {
        setApplications([]);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchApplications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out Successfully",
        description: "You have been signed out of your account.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-education-warning';
      case 'approved':
        return 'text-education-success';
      case 'rejected':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (showEnrollmentForm) {
    return <EnrollmentForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-button">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Online Enrollment Portal
              </h1>
              <p className="text-muted-foreground">Welcome back, {user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="transition-smooth"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-in">
          <Card className="bg-gradient-card border border-primary/20 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <p className="text-sm text-muted-foreground">Total submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border border-education-success/20 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-education-success" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-success">
                {applications.filter(app => app.application_status === 'approved').length}
              </div>
              <p className="text-sm text-muted-foreground">Approved applications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border border-accent/20 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-accent" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {applications.filter(app => app.application_status === 'approved').length}
              </div>
              <p className="text-sm text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* New Enrollment Section */}
          <div className="flex-1">
            <Card className="shadow-form bg-gradient-card border-0 animate-scale-in">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-button">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Start New Enrollment</CardTitle>
                <p className="text-muted-foreground">
                  Begin the enrollment process for a new student
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => setShowEnrollmentForm(true)}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-button transition-smooth text-lg py-6"
                >
                  <Users className="w-5 h-5 mr-2" />
                  New Student Enrollment
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Complete our secure multi-step enrollment form to register a new student.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="flex-1">
            <Card className="shadow-form bg-gradient-card border-0 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground">Start your first enrollment to see applications here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 ${getStatusColor(app.application_status)}`}>
                            {getStatusIcon(app.application_status)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {app.student_first_name} {app.student_last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {app.student_grade} • {formatDate(app.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.application_status)} bg-current bg-opacity-10`}>
                          <span className="text-white">
                            {app.application_status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {applications.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm">
                          View All Applications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Step Process</h3>
            <p className="text-sm text-muted-foreground">
              Guided enrollment with clear steps and progress tracking
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Smart Validation</h3>
            <p className="text-sm text-muted-foreground">
              Automatic validation and conditional logic for accurate data
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-education-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-education-success" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
