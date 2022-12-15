const { replaceInFile } = require('replace-in-file');

const sudoFilePath = './node_modules/sudo-prompt/index.js';

// this is very hack way
// to provide proper process to sudo-prompt module
replaceInFile({
  files: sudoFilePath,
  from: /Node\.process/g,
  to: 'window._electronProcess',
}).then((res) => {
  if (res && res[0] && res[0].hasChanged) {
    console.log(`${sudoFilePath} has been changed`);
  } else {
    console.log(`${sudoFilePath} has not been changed due to unexpected issue`);
  }
});
