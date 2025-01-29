import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { Search, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the collaboration hours chart
const collaborationData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 4 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 6 },
  { day: 'Fri', hours: 4 },
  { day: 'Sat', hours: 2 },
  { day: 'Sun', hours: 1 },
];

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Community",
    type: "8 out of 12 sessions, Mentorship",
    time: "14:00-14:45",
    date: new Date(2024, 11, 2)
  },
  {
    id: 2,
    title: "Project brainstorming",
    type: "Engagement activity",
    time: "11:00-12:00",
    date: new Date(2024, 11, 5)
  },
  // ... keep existing events
];

// Sample data for projects
const projects = [
  {
    id: 1,
    type: "Mentor matching session",
    status: "Ongoing progress",
  },
  {
    id: 2,
    type: "Impact report",
    status: "Upcoming deadline",
  },
  {
    id: 3,
    type: "Community forum discussion",
    status: "Ongoing progress",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const date = new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for integration plans, projects, and mentors" 
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Welcome,</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning, Scholar</h2>
              <p className="text-muted-foreground mb-4">
                Explore your growth and impact journey through AI-analyzed plans and collaborations.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New plan
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My projects</h3>
                <span className="text-sm text-muted-foreground">2 active</span>
              </div>
              <Card className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <span>{project.type}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Create New Project
                </Button>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Total collaboration hours</h3>
              <Card className="p-6">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={collaborationData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">December 2022</h3>
              </div>
              <Calendar
                mode="single"
                selected={date}
                className="rounded-md border"
              />
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">Upcoming events calendar</h4>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{event.title}</h5>
                        <p className="text-sm text-muted-foreground">{event.type}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {event.time}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Full schedule
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
