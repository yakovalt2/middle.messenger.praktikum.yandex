export interface ValidationRules {
  [key: string]: RegExp;
}

export const validationRules: ValidationRules = {
  // first_name и second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
  first_name: /^[a-zA-Zа-яА-Я]{2,30}$/,

  // second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
  second_name: /^[a-zA-Zа-яА-Я]{2,30}$/,

  // login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
  login: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,

  // email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,

  // password — от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
  password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,

  // phone — от 10 до 15 символов, состоит из цифр, может начинаться с плюса.
  phone: /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,9}$/,

  // message — не должно быть пустым.
  message: /^.+$/, 
};

export function validateField(input: HTMLInputElement): boolean {
  const rule = validationRules[input.name];
  const value = input.value.trim();

  if (!rule) {
    console.error(`Правило для поля ${input.name} не найдено`);
    return true;
  }

  if (!rule.test(value)) {
    const errorMessage = input.nextElementSibling as HTMLElement;
    if (errorMessage) {
      errorMessage.textContent = `Неверное значение для ${input.name}`;
    }
    input.classList.add("input--error");
    return false;
  }

  const errorMessage = input.nextElementSibling as HTMLElement;
  if (errorMessage) {
    errorMessage.textContent = "";
  }
  input.classList.remove("input--error");
  return true;
}
