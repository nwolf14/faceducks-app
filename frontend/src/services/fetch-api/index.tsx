import { Observable, Observer } from 'rxjs';

export default function fetchApi <T> (url: string): Observable<Function> {
  return Observable.create((observer: Observer<T | number>) => {
    const controller: AbortController = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
    .then(response => response.status === 200 ? response.json() : Promise.resolve(response.status))
    .then(data => {
      observer.next(data)
      observer.complete();
    })
    .catch(error => {
      observer.error(error)
    });

    return () => controller.abort();
  });
}
