type ApiError = {
  status: number;
  reason?: string;
  message: string;
};

export class HttpRequest {
  private static baseUrl: string = "https://ya-praktikum.tech/api/v2/";

  static async get<T>(
    url: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.sendRequest<undefined, T>(
      "GET",
      `${this.baseUrl}${url}${queryString}`,
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
        const errorResponse = await response.json();
        throw {
          status: response.status,
          reason: errorResponse.reason,
          message: `Ошибка ${response.status}: ${errorResponse.reason}`,
        } as ApiError;
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
    body?: T,
    expectJson: boolean = true,
  ): Promise<R> {
    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let reason: string | undefined;
        try {
          const errorResponse = await response.json();
          reason = errorResponse.reason;
        } catch {
          reason = response.statusText;
        }

        throw {
          status: response.status,
          reason,
          message: `Ошибка ${response.status}: ${reason}`,
        } as ApiError;
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (expectJson && contentType.includes("application/json")) {
        return (await response.json()) as R;
      } else {
        return (await response.text()) as R;
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  }
}
