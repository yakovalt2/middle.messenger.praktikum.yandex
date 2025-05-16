export async function load(url: string, context: any, defaultLoad: any) {
  if (url.endsWith('.hbs') || url.endsWith('.scss')) {
    return {
      format: 'module',
      source: 'export default {};',
    };
  }
  return defaultLoad(url, context, defaultLoad);
}