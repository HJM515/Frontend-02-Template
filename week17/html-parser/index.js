const { parserHTML } = require('./parser')


const tree1 = parserHTML("<a href></a>");
// const tree2 = parserHTML('<a href="www.baidu.com"></a>');
console.log("tree", tree1);