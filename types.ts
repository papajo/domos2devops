
export interface TaskMapping {
  householdTask: string;
  itTask: string;
  category: 'Security' | 'Maintenance' | 'Infrastructure' | 'Development' | 'Operations';
  rationale: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface StarResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface MappingResult {
  roomName: string;
  mappings: TaskMapping[];
  story: string;
  starResponse: StarResponse;
  linkedInPost: string; // New: Blended LinkedIn-optimized post
}

export type RoomType = 'Kitchen' | 'Bathroom' | 'Living Room' | 'Bedroom' | 'Garage' | 'Attic' | 'Garden' | 'Home Office';
