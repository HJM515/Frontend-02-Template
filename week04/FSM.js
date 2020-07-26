// 练习：JS（非正则）实现在一个字符串找到ABC
// 1. 非状态机
function findABC(string) {
    let foundA = false;
    let foundB = false;
	for(let w of string) {
        if(w === 'A') 
			foundA = true;
		else if(foundA && w === 'B') {
            foundB = true
            foundA = false
        }else if(foundB && w === 'C')
            return true
        else {
            foundA = false
            foundB = false
        }
	}
	return false;
}

console.log('findABC', findABC('ABBCD'))
console.log('findABC', findABC('ABCD'))
console.log('findABC', findABC('AABCD'))

// 2. 状态机
{

    function FSMFindABC(string) {
        let state = start;
        for(let w of string) {
            // let start = start(w);
            state = state(w)
        }
        return state === end
    }

    function start(w) {
        if(w === 'A') 
            return findA;
        else
            return start;
    }
    function findA(w) {
        if(w === 'B') 
            return findB;
        else
            return start(w);
    }

    function findB(w) {
        if(w === 'C') 
            return end;
        else
            return start(w);
    }

    function end(w) {
        return end;
    }

    console.log('FSMFindABC', FSMFindABC('ABCDE'))
}


// 练习：使用状态机解析ABCABX
{
    function FSMFindABCABX(string) {
        let state = start;
        for(let w of string) {
            state = state(w)
        }
        return state === end
    }

    function start(w) {
        if(w === 'A') 
            return findA;
        else
            return start;
    }
    function findA(w) {
        if(w === 'B') 
            return findB;
        else
            return start(w);
    }

    function findB(w) {
        if(w === 'C') 
            return findC;
        else
            return start(w);
    }

    function findC(w) {
        if(w === 'A') 
            return findA2;
        else
            return start(w);
    }

    function findA2(w) {
        if(w === 'B') 
            return findB2;
        else
            return start(w);
    }

    function findB2(w) {
        if(w === 'X') 
            return end;
        else
            return findB(w);
    }
    function end(w) {
        return end;
    }

    console.log('FSMFindABCABX', FSMFindABCABX('AABCABCABX'))
}

// 练习：使用状态机解析ABABABX
{
    function FSMFindABABABX(string) {
        let state = start;
        for(let w of string) {
            state = state(w)
        }
        return state === end
    }

    function start(w) {
        if(w === 'A') 
            return findA;
        else
            return start;
    }
    function findA(w) {
        if(w === 'B') 
            return findB;
        else
            return start(w);
    }

    function findB(w) {
        if(w === 'A') 
            return findA2;
        else
            return start(w);
    }

    function findA2(w) {
        if(w === 'B') 
            return findB2;
        else
            return start(w);
    }

    function findB2(w) {
        if(w === 'A') 
            return findA3;
        else
            return start(w);
    }

    function findA3(w) {
        if(w === 'B') 
            return findB3;
        else
            return start(w);
    }

    function findB3(w) {
        if(w === 'X') 
            return end;
        else
            return findB2(w);
    }

    function end(w) {
        return end;
    }

    console.log('FSMFindABABABX', FSMFindABABABX('ABAABABABX'))
}
