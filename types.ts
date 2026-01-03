
export interface TaskMapping {
  householdTask: string;
  itTask: string;
  category: 'Security' | 'Maintenance' | 'Infrastructure' | 'Development' | 'Operations';
  rationale: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MappingResult {
  roomName: string;
  mappings: TaskMapping[];
  story: string; // New: A narrative mashing up the tasks
}

export type RoomType = 'Kitchen' | 'Bathroom' | 'Living Room' | 'Bedroom' | 'Garage' | 'Attic' | 'Garden' | 'Home Office';
