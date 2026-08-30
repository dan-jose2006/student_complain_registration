import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="border-dashed border-2 py-12 text-center bg-card/50">
      <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-2xl bg-muted/80 text-muted-foreground">
          <Icon className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
