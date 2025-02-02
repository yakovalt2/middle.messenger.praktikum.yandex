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

export default class ChatService {
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
}
