// Tracks which analysis is the latest, so a slow earlier run cannot overwrite a newer one.
export function createLatestRun() {
  let latest = 0;
  return {
    begin() {
      latest += 1;
      return latest;
    },
    isCurrent(id) {
      return id === latest;
    },
  };
}
