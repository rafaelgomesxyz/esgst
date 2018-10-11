export default function loader(source) {
  source = source.replace(/8.0.0/g, `8.0.9`);

  return `export default ${ JSON.stringify(source) }`;
}