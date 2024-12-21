declare module "*.hbs" {
    const template: string;
    export default template;
  }

  declare module "*?raw" {
    const content: string;
    export default content;
  }