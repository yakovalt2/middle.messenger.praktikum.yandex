import { utils } from "../utils/utils";
import EventBus from "./EventBus";

export interface Chat {
  id: number;
  title: string;
}

export interface User {
  id: number;
}

export interface AppState {
  user: { id: number; name: string } | null;
  chats: Chat[];
  chatsMessages: { id: number; messages: any[] }[];
  selectedChatId: number | null;
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

  public setMessagesForChat(chatId: number, messages: any[]): void {
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

  public getMessagesForChat(chatId: number): any[] {
    const chatMessages = this.state.chatsMessages.find(
      (chat) => chat.id === chatId,
    );

    return chatMessages ? chatMessages.messages : [];
  }
}

export default new Store();
