
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from '@/lib/types';

const ProjectsMapView = dynamic(() => import('@/components/projects-map-view').then(mod => mod.ProjectsMapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

interface DashboardMapProps {
  projects: Pick<Project, 'id' | 'location' | 'name'>[];
}

export function DashboardMap({ projects }: DashboardMapProps) {
  return <ProjectsMapView projects={projects} />;
}
