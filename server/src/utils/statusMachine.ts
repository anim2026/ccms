const validTransitions: Record<string, string[]> = {
  NEW: ['IN_PROGRESS', 'RESOLVED'],
  IN_PROGRESS: ['RESOLVED', 'NEW'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
};

export function canTransition(from: string, to: string): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}
