export function calculateElapsedTime(date: Date): number {
  const now = new Date();
  const elapsedTime = (now.getTime() - date.getTime()) / 1000;
  return Math.floor(elapsedTime);
}
