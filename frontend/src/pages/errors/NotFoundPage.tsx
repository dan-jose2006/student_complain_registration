import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8 shadow-lg border-border/80">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground">404</h1>
            <h2 className="text-lg font-bold text-foreground">Page Not Found</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The requested page or ticket resource could not be found. It may have been moved or removed.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link to="/">
              <Button size="sm" className="w-full sm:w-auto gap-1.5">
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8 shadow-lg border-border/80">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold">403</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-foreground">Access Restricted</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You do not have the required administrative role to view this page. Role-based authorization is enforced.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link to="/student/dashboard">
              <Button size="sm" className="w-full sm:w-auto gap-1.5">
                <Home className="w-4 h-4" />
                Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
