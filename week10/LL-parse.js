const reg = /([0-9\.]+)|([ \t]+)|([\n\r]+)|(\*)|(\/)|(\+)|(\-)/g;
const dic = ['Number', 'WhiteSpace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
    let result = null;
    let lastIndex = 0;
    while(true) {
        lastIndex = reg.lastIndex;
        result = reg.exec(source);
        if(!result) break;
        if(reg.lastIndex - lastIndex > result[0].length) break; // 没有想到什么时候会出现这种情况
        let token = {
            value: null,
            type: null
        }
        for(let i = 1; i < dic.length; i++) {
            if(result[i]) {
                token.type = dic[i - 1];
            }
        }
        token.value = result[0]
        yield token;
    }
    yield { type: 'EOF' }
}


let source = [];
for(let token of tokenize('100 + 100.2 * 10 / 20 + 10')) {
    if(token.type !== 'WhiteSpace' && token.type !== 'LineTerminator') {
        source.push(token);
    }
}

function MultiplicativeExpression(source) {
    if(source[0].type === 'Number') {
        let node = {
            type: 'MultiplicativeExpression',
            children: [source[0]]
        }
        source[0] = node;
        return MultiplicativeExpression(source)
    }
    if(source[0].type === 'MultiplicativeExpression' && source[1] && ['*', '/'].includes(source[1].type) ) {
        let node = {
            type: 'MultiplicativeExpression',
            operator: source[1].type,
            children: []
        }
        // source 的前三项构成一组结构
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    // EOF 会执行到这个分支，并退出递归
    if(source[0].type === 'MultiplicativeExpression') {
        return source[0];
    }
}

// console.log(MultiplicativeExpression(source));

function AdditiveExpression(source) {
    if(source[0].type === 'MultiplicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source[0]]
        }
        source[0] = node
        return AdditiveExpression(source);
    }
    if(source[0].type === 'AdditiveExpression' && source[1] && ['+', '-'].includes(source[1].type)) {
        let node = {
            type: 'AdditiveExpression',
            operator: source[1].type,
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if(source[0].type === 'AdditiveExpression') {
        return source[0];
    }
    // 第一个非终结符是 Number时，会执行到这里
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}

console.log(AdditiveExpression(source));