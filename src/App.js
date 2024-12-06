import Handlebars from 'handlebars';
import * as Pages from './pages';

export default class App {
  constructor() {
    this.state = {
      currentPage: 'register'
    };
    this.appElement = document.getElementById('app')
  }

  render() {
    let template;


    switch (this.state.currentPage) {
      case 'login': {
        template = Handlebars.compile(Pages.LoginPage); break;
      }
      case 'register': {
        template = Handlebars.compile(Pages.RegisterPage); break;
      }
    }
    
    this.appElement.innerHTML = template({})
  }
    

   
}