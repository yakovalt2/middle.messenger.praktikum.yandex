export class HttpRequest {
    static get<T>(url: string, params?: Record<string, string>): Promise<T> {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return this.sendRequest("GET", url + queryString);
    }
  
    static post<T, R>(url: string, body: T): Promise<R> {
      return this.sendRequest("POST", url, body);
    }
  
    static put<T, R>(url: string, body: T): Promise<R> {
      return this.sendRequest("PUT", url, body);
    }
  
    static delete<T, R>(url: string, body?: T): Promise<R> {
      return this.sendRequest("DELETE", url, body);
    }
  
    private static sendRequest<T, R>(
      method: string,
      url: string,
      body?: T
    ): Promise<R> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
  
        xhr.open(method, url, true);
  
        xhr.setRequestHeader("Content-Type", "application/json");
  
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              console.error("Ошибка обработки ответа", error);
              reject(new Error("Ошибка при обработке ответа"));
            }
          } else {
            reject(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`));
          }
        };
  
        xhr.onerror = function () {
          reject(new Error("Ошибка сети"));
        };
  
        xhr.send(body ? JSON.stringify(body) : null);
      });
    }
  }
