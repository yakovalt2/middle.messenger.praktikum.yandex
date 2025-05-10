import ChatService from "./ChatService";
import AuthService from "./AuthService";
import Router from "../../framework/Router";

export const chatService = new ChatService();
export const authService = new AuthService();
export const router = new Router("#app");
