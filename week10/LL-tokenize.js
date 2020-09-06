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


for(let token of tokenize('100.2 * 10 + 20')) {
    console.log(token);
}