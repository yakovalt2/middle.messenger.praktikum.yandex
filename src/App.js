import page from 'page';
import Handlebars from 'handlebars';
import * as Pages from './pages';

//Импорт компонентов
import Button from './components/Button.js';
import Input from './components/Input.js';
import Label from './components/Label.js'
import Link from './components/Link.js';
import Navigation from './components/Navigation.js'


//Регистрация partials
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Label', Label)
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Navigation', Navigation);

export default class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.initRoutes();
  }

  initRoutes() {
    page('/', () => this.showPage('login'));
    page('/login', () => this.showPage('login'));
    page('/register', () => this.showPage('register'));
    page('/chats', () => this.showPage('chats'));
    page('/settings', () => this.showPage('settings'));
    page('/500', () => this.showPage('page500'))

    page('*', () => this.showPage('page404'));

    page();
  }

  showPage(pageName) {
    let template;

    const chats = [
      { id: 1, name: 'Андрей', lastMessage: 'Изображение', timestamp: '19:30' },
      { id: 2, name: 'Футбол', lastMessage: 'Вы: Играем сегодня?', timestamp: '17:10' },
      { id: 3, name: 'Илья', lastMessage: 'Друзья, у меня для вас особенный выпуск новостей!...', timestamp: '16:00' },
      { id: 4, name: 'Александр', lastMessage: 'Вы: Хорошо', timestamp: '12:17' },
      { id: 5, name: 'Вадим', lastMessage: 'Привет', timestamp: 'вс' },
      { id: 6, name: 'Илья', lastMessage: 'Вы: Да', timestamp: 'вс' },
    ];

    switch (pageName) {
      case 'login':
        template = Handlebars.compile(Pages.LoginPage);
        break;
      case 'register':
        template = Handlebars.compile(Pages.RegisterPage);
        break;
      case 'settings':
        template = Handlebars.compile(Pages.SettingsPage);
        this.appElement.innerHTML = `${Navigation} ${template({
          avatar: "https://via.placeholder.com/100",
          first_name: "",
          second_name: "",
          display_name: "",
          login: "",
          email: "",
          phone: ""
        })}`;
        return;
      case 'chats':
        template = Handlebars.compile(Pages.ChatsPage);
        this.appElement.innerHTML = `${Navigation} ${template({ chats })}`;
        return;
      case 'page404':
        document.addEventListener('click', (event) => {
          const button = event.target.closest('#go-home');
          if (button) {
            page('/');
          }
        });
        template = Handlebars.compile(Pages.Page404);
        break;
      case 'page500':
        document.addEventListener('click', (event) => {
          const button = event.target.closest('#go-home');
          if (button) {
            page('/');
          }
        });
        template = Handlebars.compile(Pages.Page500);
        break;
      default:
        template = Handlebars.compile(Pages.Page404);
        break;
    }

    this.appElement.innerHTML = `${Navigation} ${template({})}`;
  }

}
