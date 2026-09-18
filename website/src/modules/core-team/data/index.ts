import { coreMembers } from "./mockData";
import type { CoreMember } from "../types";

export function getCoreMembers(): CoreMember[] {
  return coreMembers;
}

export function getCoreMemberById(id: string): CoreMember | undefined {
  return coreMembers.find((member) => member.id === id);
}