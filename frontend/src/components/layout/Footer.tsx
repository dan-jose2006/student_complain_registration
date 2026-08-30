import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md py-8 mt-auto text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-foreground text-background flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-foreground">CampusCare</span>
          <span>– Smart Campus Issue & Service Management</span>
        </div>

        <div className="flex items-center gap-4 text-center sm:text-right font-medium">
          <span>Classical <strong>Waterfall SDLC Model</strong></span>
          <span>•</span>
          <span>Software Engineering & Project Management</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
