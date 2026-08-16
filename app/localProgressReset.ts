export type ProgressStorage = Pick<Storage, "removeItem">;

/** Removes both persisted learner state and an in-progress local quiz. */
export function clearLocalProgress(
  storage: ProgressStorage,
  progressStorageKey: string,
  activeSessionStorageKey: string,
): void {
  storage.removeItem(progressStorageKey);
  storage.removeItem(activeSessionStorageKey);
}
