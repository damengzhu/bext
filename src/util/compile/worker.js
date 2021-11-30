importScripts(
  'https://cdn.jsdelivr.net/npm/rollup@2.60.1/dist/rollup.browser.js',
  'https://cdn.jsdelivr.net/npm/@babel/standalone@7.16.4/babel.min.js',
);

const BUILTIN_PREFIX = '@bext/';
const bext = ({ builtins, meta }) => {
  const context = ['id', 'name', 'version']
    .map(
      (prop) =>
        `export const ${prop} = decodeURIComponent('${encodeURIComponent(
          meta[prop],
        )}');`,
    )
    .join('');
  Object.assign(builtins, {
    context,
    entry: meta.source,
  });
  return {
    name: 'bext',
    resolveId(id) {
      if (
        id.startsWith(BUILTIN_PREFIX) &&
        id.replace(BUILTIN_PREFIX, '') in builtins
      ) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith(BUILTIN_PREFIX)) {
        const index = id.replace(BUILTIN_PREFIX, '');
        return builtins[index];
      }
      return null;
    },
    transform(code, id) {
      if (meta.options?.preact && id === '@bext/entry') {
        return Babel.transform(code, {
          plugins: [
            [
              'transform-react-jsx',
              {
                pragma: 'h',
                pragmaFrag: 'Fragment',
              },
            ],
          ],
        }).code;
      }
      return null;
    },
  };
};

export async function compile(payload) {
  const bundle = await rollup.rollup({
    input: '@bext/entry',
    plugins: [bext(payload)],
  });
  const { output } = await bundle.generate({ format: 'iife' });
  return output[0].code;
}