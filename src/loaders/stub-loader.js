export async function load(url, context, defaultLoad) {
  if (url.endsWith(".hbs") || url.endsWith(".scss")) {
    return {
      format: "module",
      source: "export default {};",
    };
  }
  return defaultLoad(url, context, defaultLoad);
}
