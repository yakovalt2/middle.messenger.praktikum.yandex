import { HttpRequest } from "../HttpRequest";

interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

export type WebSocketServerMessage =
  | ChatTextMessage
  | PingPongMessage
  | UserEventMessage;

interface ChatTextMessage {
  type: "message";
  id: number;
  chat_id: number;
  user_id: number;
  content: string;
  time: string;
}
interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface PingPongMessage {
  type: "pong";
}

interface UserEventMessage {
  type: "user connected" | "user disconnected";
  user_id: number;
}

interface OutgoingMessage {
  type: "message" | "get old" | "ping";
  content?: string;
}

export default class ChatService {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  getChats(): Promise<Chat[]> {
    return HttpRequest.get<Chat[]>("chats");
  }

  createChat(title: string): Promise<void> {
    return HttpRequest.post("chats", { title });
  }

  addUserToChat(userId: number, chatId: number): Promise<void> {
    return HttpRequest.put("chats/users", {
      users: [userId],
      chatId,
    });
  }

  removeUserFromChat(userId: number, chatId: number): Promise<void> {
    return HttpRequest.delete("chats/users", {
      users: [userId],
      chatId,
    });
  }

  getUsers(chatId: number): Promise<User[]> {
    console.log("Получаем пользщова");
    return HttpRequest.get<User[]>(`chats/${chatId}/users`);
  }

  async getChatToken(chatId: number): Promise<string> {
    const host = "https://ya-praktikum.tech";
    const response = await fetch(`${host}/api/v2/chats/token/${chatId}`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Ошибка получения токена: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  connectToChat(
    userId: number,
    chatId: number,
    token: string,
    onMessage: (
      message: WebSocketServerMessage | WebSocketServerMessage[],
    ) => void,
  ): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = new WebSocket(
      `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
    );

    this.socket.onopen = () => {
      this.getOldMessages(0);

      this.pingInterval = setInterval(() => {
        this.sendMessage({ type: "ping" });
      }, 10000);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: WebSocketServerMessage | WebSocketServerMessage[] =
          JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.warn("Ошибка парсинга сообщения WebSocket:", event.data, e);
      }
    };

    this.socket.onclose = () => {
      if (this.pingInterval) clearInterval(this.pingInterval);
      this.socket = null;
    };

    this.socket.onerror = (event) => {
      console.error("WebSocket ошибка", event);
    };
  }

  sendMessage(message: OutgoingMessage): void {
    if (
      message.type === "message" &&
      (!message.content || message.content.trim() === "")
    ) {
      console.error("Нельзя отправить пустое сообщение");
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      if (this.socket) {
        console.log("socket.readyState:", this.socket.readyState);
      }
    }
  }

  getOldMessages(offset: number): void {
    this.sendMessage({ type: "get old", content: offset.toString() });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}
