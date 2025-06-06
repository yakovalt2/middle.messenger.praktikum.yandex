import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Block, { BlockProps } from "../../framework/Block";
import MessagesList from "./components/MessageList/MessagesList";
import { authService, chatService, router } from "../../api/services";
import store, { AppState } from "../../framework/Store";
import { connect } from "../../utils/connect";
import template from "./chats.hbs?raw";
import ChatsList from "./chatsList/ChatsList";
import ModalAddUser from "./components/ModalAddUser/ModalAddUser";
import showToast from "../../utils/showToast";

interface ChatsPageProps extends BlockProps {
  messages?: {
    id: number;
    content: string;
    time: string;
    user_id: number;
  }[];
  showModal?: boolean;
  userId?: number;
}

class ChatsPage extends Block<ChatsPageProps> {
  constructor(props: ChatsPageProps) {
    super("div", {
      ...props,

      chatsList: new ChatsList({
        onChatClick: (id: number) => {
          this.handleChatClick(id);
        },
      }),

      messagesList: new MessagesList({
        messages: props.messages || [],
        userId: props.userId || 0,
      }),

      messageInput: new Input({
        id: "message",
        type: "text",
        name: "message",
        placeholder: "Введите сообщение",
        className: "message-input",
      }),

      sendButton: new Button({
        id: "sendButton",
        label: "Отправить",
        events: { click: () => this.handleSendMessage() },
      }),

      logoutButton: new Button({
        id: "logoutButton",
        label: "Выйти",
        events: { click: () => this.handleLogout() },
      }),

      createChatInput: new Input({
        id: "createChat",
        type: "text",
        name: "createChat",
        placeholder: "Название чата",
      }),

      createChatButton: new Button({
        id: "createChatButton",
        label: "Создать чат",
        events: { click: () => this.handleCreateChat() },
      }),

      openModalButton: new Button({
        id: "openModalButton",
        label: "+",
        events: { click: () => this.toggleModal() },
      }),

      showModal: false,

      modalAddUser: new ModalAddUser({
        onClose: () => this.toggleModal(),
      }),
    });
  }

  componentDidMount() {
    this.loadChats();
  }

  componentDidUpdate() {
    const modal = this.getContent()?.querySelector(".modal");
    if (modal) {
      if (this.props.showModal) {
        modal.classList.add("visible");
      } else {
        modal.classList.remove("visible");
      }
    }
    return true;
  }

  async loadChats() {
    try {
      const chats = await chatService.getChats();
      store.set("chats", chats);
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  }

  async handleCreateChat() {
    const input = this.getContent()?.querySelector(
      "#createChat"
    ) as HTMLInputElement;
    const chatTitle = input?.value;
    if (!chatTitle) {
      showToast("Введите название чата", "error");
      return console.error("Введите название чата!");
    }
    try {
      await chatService.createChat(chatTitle);
      showToast("Чат создан", "success");
      this.loadChats();
    } catch (error) {
      console.error("Ошибка создания чата:", error);
    }
  }

  async handleLogout() {
    try {
      await authService.logout();
      store.clear();
      router.go("/sign-up");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  }

  async handleChatClick(chatId: number) {
    store.set("selectedChatId", chatId);
    const userId = store.getState().user?.id;
    if (!userId) return;

    try {
      const token = await chatService.getChatToken(chatId);
      console.log(token);

      chatService.connectToChat(userId, chatId, token, (data) => {
        this.handleIncomingMessage(chatId, data);
      });
    } catch (error) {
      console.error("Ошибка при подключении к чату:", error);
    }
  }

  handleSendMessage() {
    const input = this.getContent()?.querySelector(
      "#message"
    ) as HTMLInputElement;
    const messageContent = input?.value.trim();
    if (!messageContent) return;
    const selectedChatId = store.getState().selectedChatId;
    if (!selectedChatId) {
      console.error("Чат не выбран");
      return;
    }
    chatService.sendMessage({ type: "message", content: messageContent });
    input.value = "";
  }

  handleIncomingMessage(chatId: number, data: any) {
    const currentState = store.getState();
    const chatEntry = currentState.chatsMessages.find((c) => c.id === chatId);

    const processMessage = (msg: any) => ({
      id: msg.id,
      content: msg.content,
      time: msg.time,
      user_id: msg.user_id,
    });

    if (Array.isArray(data)) {
      const messages = data
        .filter((msg) => msg.type === "message")
        .map(processMessage);
      if (chatEntry) {
        chatEntry.messages = [...messages.reverse(), ...chatEntry.messages];
      } else {
        currentState.chatsMessages.push({ id: chatId, messages });
      }
    } else if (data.type === "message") {
      const message = processMessage(data);
      if (chatEntry) {
        chatEntry.messages.push(message);
      } else {
        currentState.chatsMessages.push({ id: chatId, messages: [message] });
      }
    }
    store.set("chatsMessages", currentState.chatsMessages);
  }

  toggleModal() {
    this.setProps({ showModal: !this.props.showModal });
  }

  render(): string {
    return template;
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedChatId = state.selectedChatId;
  const chatMessages =
    state.chatsMessages.find((chat) => chat.id === selectedChatId)?.messages ||
    [];

  return {
    messages: chatMessages,
    userId: state.user?.id,
  };
};

export default connect<ChatsPageProps>(mapStateToProps)(ChatsPage);
