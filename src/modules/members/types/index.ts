export interface Member {
  id: string;
  name: string;
  year: string;
  team: string;
  department: string;
}

export interface MembersDirectoryContent {
  members: Member[];
}
