export type TimelinePhase = {
  id: string;
  duration: number; // Relative duration of this phase (e.g., 1, 2, 0.5)
};

export function createTimeline(phases: TimelinePhase[]) {
  const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
  
  let currentStart = 0;
  const mappedPhases = phases.map(phase => {
    const start = currentStart / totalDuration;
    const end = (currentStart + phase.duration) / totalDuration;
    currentStart += phase.duration;
    return { id: phase.id, start, end };
  });

  return {
    totalDuration,
    getPhase: (id: string): [number, number] => {
      const phase = mappedPhases.find(p => p.id === id);
      if (!phase) {
        console.warn(`Timeline phase '${id}' not found.`);
        return [0, 0];
      }
      return [phase.start, phase.end];
    }
  };
}
