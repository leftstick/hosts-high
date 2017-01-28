const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');
const postcssVars = require('postcss-simple-vars');

module.exports = {
    plugins: [
        autoprefixer({
            browsers: ['last 5 versions']
        }),
        postcssNested(),
        postcssVars()
    ]
};
