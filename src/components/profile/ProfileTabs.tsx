import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorProfile } from "./sections/MentorProfile";
import { ScholarProfile } from "./sections/ScholarProfile";
import { CSRFunderProfile } from "./sections/CSRFunderProfile";
import { NGOProfile } from "./sections/NGOProfile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Globe, Building2 } from "lucide-react";
import { SkillsEndorsementsGrid } from "./sections/SkillsEndorsementsGrid";
import { InteractiveTimeline } from "./sections/InteractiveTimeline";
import { NetworkActivityFeed } from "./sections/NetworkActivityFeed";
import { AchievementBadgesCarousel } from "./sections/AchievementBadgesCarousel";
import { ImpactMetricsDashboard } from "./visualizations/ImpactMetricsDashboard";
import { ConnectionMap } from "./visualizations/ConnectionMap";
import { EngagementHeatmap } from "./visualizations/EngagementHeatmap";

// Sample data for demonstration (replace with actual data from API)
const sampleEndorsedSkills = [
  { name: "Project Management", endorsements: 24 },
  { name: "Research", endorsements: 18 },
  { name: "Data Analysis", endorsements: 15 },
  { name: "Sustainable Development", endorsements: 12 },
  { name: "Leadership", endorsements: 9 },
  { name: "Grant Writing", endorsements: 7 },
];

const sampleProjects = [
  {
    id: "1",
    name: "Community Water Initiative",
    startDate: new Date(2022, 0, 15),
    endDate: new Date(2022, 5, 30),
    status: "completed" as const,
    description: "Led a team to implement sustainable water solutions in rural communities, benefiting over 5,000 people.",
  },
  {
    id: "2",
    name: "Education Access Program",
    startDate: new Date(2022, 7, 1),
    endDate: new Date(2023, 2, 15),
    status: "completed" as const,
    description: "Developed a scholarship program for underprivileged students, providing educational opportunities to 200+ students.",
  },
  {
    id: "3",
    name: "Renewable Energy Research",
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2023, 11, 20),
    status: "ongoing" as const,
    description: "Conducting research on affordable renewable energy solutions for developing regions.",
  },
  {
    id: "4",
    name: "Global Health Initiative",
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 11, 31),
    status: "planned" as const,
    description: "Planning a comprehensive healthcare improvement project targeting underserved communities.",
  },
];

const sampleActivities = [
  {
    id: "1",
    type: "connection" as const,
    title: "New Connection",
    description: "Sarah Johnson accepted your connection request",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    type: "post" as const,
    title: "New Post",
    description: "Michael Chen shared 'Sustainable Development Goals: Progress Report 2024'",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user: {
      id: "user2",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    type: "award" as const,
    title: "Achievement Unlocked",
    description: "You earned the 'Community Builder' badge for connecting with 50 scholars",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    user: {
      id: "user3",
      name: "Achievement System",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: "4",
    type: "message" as const,
    title: "New Message",
    description: "Dr. Amara Okafor sent you a message about collaboration opportunities",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    user: {
      id: "user4",
      name: "Dr. Amara Okafor",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  },
];

const sampleBadges = [
  {
    id: "1",
    name: "Impact Pioneer",
    imageUrl: "https://via.placeholder.com/150?text=Impact",
    description: "Created 5 impact cards in different categories",
    dateAwarded: new Date(2023, 5, 15),
  },
  {
    id: "2",
    name: "Collaboration Champion",
    imageUrl: "https://via.placeholder.com/150?text=Collab",
    description: "Participated in 3 collaborative projects",
    dateAwarded: new Date(2023, 8, 22),
  },
  {
    id: "3",
    name: "Global Networker",
    imageUrl: "https://via.placeholder.com/150?text=Network",
    description: "Connected with peers from 10 different countries",
    dateAwarded: new Date(2023, 11, 10),
  },
  {
    id: "4",
    name: "SDG Advocate",
    imageUrl: "https://via.placeholder.com/150?text=SDG",
    description: "Contributed to projects supporting all 17 SDGs",
    dateAwarded: new Date(2024, 2, 5),
  },
];

const sampleProjectMetrics = [
  { label: "Education", value: 12, color: "#4f46e5" },
  { label: "Healthcare", value: 8, color: "#06b6d4" },
  { label: "Environment", value: 15, color: "#10b981" },
  { label: "Agriculture", value: 5, color: "#f59e0b" },
  { label: "Infrastructure", value: 7, color: "#ef4444" },
];

const sampleFundingMetrics = [
  { label: "Grants", value: 45000, color: "#4f46e5" },
  { label: "Donations", value: 28000, color: "#06b6d4" },
  { label: "Sponsorships", value: 15000, color: "#10b981" },
  { label: "Partnerships", value: 32000, color: "#f59e0b" },
];

const sampleSdgMetrics = [
  { label: "SDG 1: No Poverty", value: 8, color: "#ef4444" },
  { label: "SDG 2: Zero Hunger", value: 6, color: "#f59e0b" },
  { label: "SDG 3: Good Health", value: 12, color: "#10b981" },
  { label: "SDG 4: Quality Education", value: 15, color: "#06b6d4" },
  { label: "SDG 5: Gender Equality", value: 9, color: "#8b5cf6" },
  { label: "SDG 6: Clean Water", value: 7, color: "#3b82f6" },
];

const sampleConnections = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Professor of Sustainable Development",
    location: "London, UK",
    latitude: 51.5074,
    longitude: -0.1278,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Environmental Researcher",
    location: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Dr. Amara Okafor",
    title: "Public Health Specialist",
    location: "Nairobi, Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "4",
    name: "Carlos Rodriguez",
    title: "Education Policy Advisor",
    location: "Mexico City, Mexico",
    latitude: 19.4326,
    longitude: -99.1332,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "5",
    name: "Aisha Rahman",
    title: "Clean Energy Advocate",
    location: "Dhaka, Bangladesh",
    latitude: 23.8103,
    longitude: 90.4125,
    avatar: "https://i.pravatar.cc/150?img=6",
  },
];

const generateEngagementData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(today.getDate() - daysAgo);
    
    const count = Math.floor(Math.random() * 8) + 1;
    let level: 0 | 1 | 2 | 3 | 4;
    
    if (count <= 2) level = 1;
    else if (count <= 4) level = 2;
    else if (count <= 6) level = 3;
    else level = 4;
    
    data.push({
      date,
      count,
      level,
      activities: Array.from({ length: count }, (_, i) => `Activity ${i + 1}`),
    });
  }
  
  return data;
};

const sampleEngagementData = generateEngagementData();

interface ProfileTabsProps {
  role?: string;
  profile: any; // Replace with proper type
}

export const ProfileTabs = ({ role, profile }: ProfileTabsProps) => {
  const loadMoreActivities = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [];
  };

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="dynamic">Dynamic Content</TabsTrigger>
        <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        {role === "mentor" && <TabsTrigger value="mentor">Mentor Profile</TabsTrigger>}
        {role === "scholar" && <TabsTrigger value="scholar">Scholar Profile</TabsTrigger>}
        {role === "csr_funder" && <TabsTrigger value="csr">CSR Profile</TabsTrigger>}
        {role === "ngo" && <TabsTrigger value="ngo">NGO Profile</TabsTrigger>}
      </TabsList>

      <TabsContent value="about" className="mt-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Bio</Label>
                <p className="mt-1">{profile?.bio || "No bio provided"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Location</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{profile?.location || "Location not set"}</span>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Contact</Label>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{profile?.email || "Email not provided"}</span>
                </div>
              </div>

              {profile?.website && (
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <div className="flex items-center mt-1">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}

              {profile?.organization_name && (
                <div>
                  <Label className="text-muted-foreground">Organization</Label>
                  <div className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{profile.organization_name}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.skills?.length > 0 ? (
                    profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.interests?.length > 0 ? (
                    profile.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No interests listed</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="dynamic" className="mt-6">
        <div className="space-y-6">
          <SkillsEndorsementsGrid skills={sampleEndorsedSkills} />
          <InteractiveTimeline projects={sampleProjects} />
          <NetworkActivityFeed 
            initialActivities={sampleActivities} 
            loadMore={loadMoreActivities} 
          />
          <AchievementBadgesCarousel badges={sampleBadges} />
        </div>
      </TabsContent>

      <TabsContent value="visualizations" className="mt-6">
        <div className="space-y-6">
          <ImpactMetricsDashboard 
            projectMetrics={sampleProjectMetrics}
            fundingMetrics={sampleFundingMetrics}
            sdgMetrics={sampleSdgMetrics}
          />
          <ConnectionMap connections={sampleConnections} />
          <EngagementHeatmap engagementData={sampleEngagementData} />
        </div>
      </TabsContent>

      {role === "mentor" && (
        <TabsContent value="mentor" className="mt-6">
          <MentorProfile profile={profile} />
        </TabsContent>
      )}

      {role === "scholar" && (
        <TabsContent value="scholar" className="mt-6">
          <ScholarProfile profile={profile} />
        </TabsContent>
      )}

      {role === "csr_funder" && (
        <TabsContent value="csr" className="mt-6">
          <CSRFunderProfile profile={profile} />
        </TabsContent>
      )}

      {role === "ngo" && (
        <TabsContent value="ngo" className="mt-6">
          <NGOProfile profile={profile} />
        </TabsContent>
      )}
    </Tabs>
  );
}
