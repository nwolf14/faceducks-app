import { Observable, Observer } from "rxjs";
import { IObjectOfAny, IObjectOfStrings } from "../../interfaces";
import { getConfig } from "../../lib/functions";

const API_URL = getConfig("API_URL");

export default class FetchApi {
  static get<T>(url: string, JWT?: string): Observable<Function> {
    return Observable.create((observer: Observer<T | number>) => {
      const controller: AbortController = new AbortController();
      const signal = controller.signal;
      const headers: IObjectOfStrings = {};

      if (JWT) {
        headers['Authorization'] = JWT;
      }

      fetch(`${API_URL}${url}`, { signal, headers })
        .then(response =>
          response.status === 200
            ? response.json()
            : Promise.resolve(response.status)
        )
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });

      return () => controller.abort();
    });
  }

  static post<T>(
    url: string,
    body: IObjectOfAny,
    JWT?: string | null,
    options?: IObjectOfAny
  ): Observable<Function> {
    return Observable.create((observer: Observer<T | number>) => {
      const controller: AbortController = new AbortController();
      const signal = controller.signal;
      const headers: IObjectOfStrings = {
        'Content-Type': 'application/json'
      };

      if (JWT) {
        headers['Authorization'] = JWT;
      }

      fetch(`${API_URL}${url}`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
        headers,
        signal
      })
        .then(response =>
          response.body
            ? response.json()
            : Promise.resolve(response.status)
        )
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });

      return () => controller.abort();
    });
  }
}
