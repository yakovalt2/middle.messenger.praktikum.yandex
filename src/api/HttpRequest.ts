export class HttpRequest {
  private static baseUrl: string = "https://ya-praktikum.tech/api/v2/";

  static async get<T>(
    url: string,
    params?: Record<string, string>
  ): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.sendRequest<undefined, T>(
      "GET",
      `${this.baseUrl}${url}${queryString}`
    );
  }

  static async post<T, R>(url: string, body: T): Promise<R> {
    return this.sendRequest<T, R>("POST", `${this.baseUrl}${url}`, body);
  }

  static async put<T, R>(url: string, body: T): Promise<R> {
    return this.sendRequest<T, R>("PUT", `${this.baseUrl}${url}`, body);
  }

  static async delete<T, R>(url: string, body?: T): Promise<R> {
    return this.sendRequest<T, R>("DELETE", `${this.baseUrl}${url}`, body);
  }

  static async putFormData(url: string, body: FormData): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: "PUT",
        credentials: "include",
        body,
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
      }
  
      return response.json();
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  }

  private static async sendRequest<T, R>(
    method: string,
    url: string,
    body?: T
  ): Promise<R> {
    try {
      console.log(`Запрос: ${method} ${url}`);

      const response = await fetch(url, {
        method,
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      console.log(`Ответ сервера: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        try {
          const errorResponse = await response.json();
          errorMessage += ` - ${errorResponse.reason || JSON.stringify(errorResponse)}`;
        } catch {
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as R;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  }
}
