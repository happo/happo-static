let examples = [];
let currentIndex = 0;

const happoStatic = {
  init() {
    window.happo = window.happo || {};
    window.happo.init = ({ targetName, chunk, only }) => {
      currentIndex = 0;
      if (only) {
        examples = examples.filter(
          e => e.component === only.component && e.variant === only.variant,
        );
      } else if (chunk) {
        const examplesPerChunk = Math.ceil(examples.length / chunk.total);
        const startIndex = chunk.index * examplesPerChunk;
        const endIndex = startIndex + examplesPerChunk;
        examples = examples.slice(startIndex, endIndex);
      }
      examples = examples.filter(e => {
        if (!e.targets || !Array.isArray(e.targets)) {
          // This story hasn't been filtered for specific targets
          return true;
        }
        return e.targets.includes(targetName);
      });
    };

    window.happo.nextExample = async () => {
      const e = examples[currentIndex];
      if (!e) {
        // we're done
        return;
      }
      await e.render();
      currentIndex++;
      const clone = { ...e };
      delete clone.render;
      return clone;
    };
  },

  registerExample(props) {
    if (!props.component) {
      throw new Error('Missing `component` property');
    }
    if (!props.variant) {
      throw new Error('Missing `variant` property');
    }
    if (!props.render) {
      throw new Error('Missing `render` property');
    }

    const compType = typeof props.component;
    if (compType !== 'string') {
      throw new Error(
        `Property \`component\` must be a string. Got "${compType}".`,
      );
    }

    const varType = typeof props.variant;
    if (varType !== 'string') {
      throw new Error(
        `Property \`variant\` must be a string. Got "${varType}".`,
      );
    }

    const rendType = typeof props.render;
    if (rendType !== 'function') {
      throw new Error(
        `Property \`render\` must be a function. Got "${rendType}".`,
      );
    }
    examples.push(props);
  },

  reset() {
    examples = [];
    currentIndex = 0;
  }
};

module.exports = happoStatic;
