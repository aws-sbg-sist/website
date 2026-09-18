export interface Member {
  id: string;
  name: string;
  year: string;
  department: string;
  teamName: string;
  photoUrl?: string;
}

export interface MembersDirectoryContent {
  members: Member[];
}
