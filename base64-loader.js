function loader(content) {
  /* since `loader.raw` is true, `content` is a Buffer */
  return `export default '${content.toString("base64")}'`;
}
/* ensure the function receives a Buffer */
loader.raw = true;
module.exports = loader;