/**
 * Return a promise that will resolve after the given number of milliseconds
 *
 * @param time The time in milliseconds to wait before resolving the promise
 */
export function sleep(time: number): Promise<void> {
  return new Promise(done => {
    setTimeout(done, time);
  });
}
