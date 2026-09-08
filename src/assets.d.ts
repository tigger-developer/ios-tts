// ABOUTME: Declares Markdown text imports bundled by esbuild.
// ABOUTME: Help is local build input and requires no runtime fetch.
declare module "*.md" {
  const text: string;
  export default text;
}
