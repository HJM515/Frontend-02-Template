const reg = /([0-9\.]+)|([ \t]+)|([\n\r]+)|(\*)|(\/)|(\+)|(\-)/g;
const dic = ['Number', 'WhiteSpace', 'LineTerminator', '*', '/', '+', '-'];

function token(source) {
    let result = null;
    while(true) {
        result = reg.exec(source);
        if(!result) break;
        for(let i = 1; i < dic.length; i++) {
            if(result[i]) {
                console.log(result[i], dic[i-1]);
            }
        }
        console.log("token -> result", result)
    }
}

token('2500+13*15')