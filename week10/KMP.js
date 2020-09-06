// 1. 根据模式串，算出回退表格
// a b c d a b c e
// 0 0 0 0 0 1 2 3
// a b a b a b c
// 0 0 0 1 2 3 4
// a a b a a a c
// 0 0 1 0 1 2 2
// 2. 用跳转表格，拿原串和模式串对比


function kmp(source, pattern) {
    // 计算table
    let table = new Array(pattern.length).fill(0);

    {
        let i = 1, j = 0; // i自重复串开始的位置， j已重复的字数

        while(i < pattern.length) {
            if(pattern[i] === pattern[j]) {
                ++j, ++i;
                table[i] = j;
            }else{
                if(j > 0) {
                    j = table[j];
                }else{
                    ++i;
                }
            }
        }
    
        console.log(table)
    }

    {
        let i = 0, j = 0; // i是source串的位置，j是pattern串的位置
        while(i < source.length) {
            if(pattern[j] === source[i]) {
                ++i, ++j;
            }else{
                if(j > 0) {
                    j = table[j]
                }else{
                    ++i;
                }
            }
            if(j === pattern.length) return true;
        }
        return false;
    }
}

console.log(kmp('abcdabcdabcex', 'abcdabce'))