declare module "*.hbs" {
  const template: Handlebars.TemplateDelegate;
  export default template;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
