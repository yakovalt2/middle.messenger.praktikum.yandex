import { utils } from "../utils/utils.ts";
import EventBus from "./EventBus.ts";

export interface Chat {
  id: number;
  title: string;
}

export interface Message {
  id: number;
  user_id: number;
  time: string;
  content: string;
  avatar?: string | null;
}

export interface AppState {
  user: { id: number; name: string } | null;
  chats: Chat[];
  chatsMessages: { id: number; messages: Message[] }[];
  selectedChatId: number | null;
  users?: { id: number; avatar: string, first_name: string, second_name: string }[];
  chatUsers?: Array<{
    id: number;
    first_name: string;
    second_name: string;
    avatar: string | null;
  }>;
}

export enum StoreEvents {
  Updated = "updated",
}

class Store extends EventBus {
  private state: AppState = {
    selectedChatId: null,
    chatsMessages: [],
    user: null,
    chats: [],
  };

  public getState(): AppState {
    return this.state;
  }

  public set(path: string, value: unknown): void {
    utils.set(this.state, path, value);
    this.emit(StoreEvents.Updated);
  }

  public setMessagesForChat(chatId: number, messages: Message[]): void {
    const chatMessagesIndex = this.state.chatsMessages.findIndex(
      (chat) => chat.id === chatId,
    );

    if (chatMessagesIndex !== -1) {
      this.state.chatsMessages[chatMessagesIndex].messages = messages;
    } else {
      this.state.chatsMessages.push({ id: chatId, messages });
    }

    this.emit(StoreEvents.Updated);
  }

  public getMessagesForChat(chatId: number): Message[] {
    const chatMessages = this.state.chatsMessages.find(
      (chat) => chat.id === chatId,
    );

    return chatMessages ? chatMessages.messages : [];
  }

  public clear(): void {
    this.state = {
      selectedChatId: null,
      chatsMessages: [],
      user: null,
      chats: [],
    };
    this.emit(StoreEvents.Updated);
  }
}

export function mapStateToProps(state: AppState, userId: number) {
  const users = state.users || [];
  const messages = state.chatsMessages
    .flatMap((chat) => chat.messages)
    .map((msg) => {
      const user = users.find((u) => u.id === msg.user_id);
      const isMyMessage = msg.user_id === userId;
      return {
        ...msg,
        time: new Date(msg.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMyMessage,
        avatar: user?.avatar || null,
      };
    });

  return {
    ...state,
    messages,
  };
}

export default new Store();
