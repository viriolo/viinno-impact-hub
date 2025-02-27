
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define the project type
interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "ongoing" | "completed" | "planned";
  description: string;
}

interface InteractiveTimelineProps {
  projects: Project[];
}

export function InteractiveTimeline({ projects }: InteractiveTimelineProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No projects have been added to this profile yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort projects by start date
  const sortedProjects = [...projects].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  // Calculate timeline properties
  const earliestDate = sortedProjects[0].startDate;
  const latestDate = sortedProjects.reduce(
    (latest, project) => (project.endDate > latest ? project.endDate : latest),
    sortedProjects[0].endDate
  );

  const timelineLength = latestDate.getTime() - earliestDate.getTime();
  
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline visualization */}
          <div className="relative h-[300px] border-l border-muted-foreground/20 ml-3">
            {sortedProjects.map((project) => {
              // Calculate position and width based on dates
              const startOffset = (project.startDate.getTime() - earliestDate.getTime()) / timelineLength;
              const duration = (project.endDate.getTime() - project.startDate.getTime()) / timelineLength;
              
              return (
                <div 
                  key={project.id}
                  className="absolute flex items-center" 
                  style={{ 
                    top: `${startOffset * 100}%`,
                    left: 0,
                    right: 0
                  }}
                >
                  <div className="absolute -left-3 w-6 h-6 bg-primary rounded-full" />
                  <div 
                    className={`
                      ml-6 py-2 px-3 rounded-md cursor-pointer transition-colors
                      ${project.status === 'completed' ? 'bg-green-100 border-green-300' : 
                        project.status === 'ongoing' ? 'bg-blue-100 border-blue-300' : 
                        'bg-gray-100 border-gray-300'}
                      ${selectedProject?.id === project.id ? 'ring-2 ring-primary ring-offset-1' : ''}
                    `}
                    style={{ width: `${Math.max(duration * 100, 20)}%` }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(project.startDate, 'MMM yyyy')} - {format(project.endDate, 'MMM yyyy')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Selected project details */}
          {selectedProject && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{selectedProject.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">
                {format(selectedProject.startDate, 'MMMM d, yyyy')} - {format(selectedProject.endDate, 'MMMM d, yyyy')}
              </div>
              <div className="mb-2">
                <Badge 
                  variant={
                    selectedProject.status === 'completed' ? 'default' : 
                    selectedProject.status === 'ongoing' ? 'secondary' : 'outline'
                  }
                >
                  {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm">{selectedProject.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
