## JS类型

Atom原子

- Grammar 语法：Literal, Variable, Keywords, Whitespace, Line Terminator
- Runtime 运行时：Types, Execution Context（执行上下文）

Literal 字面值，重点考虑 Types 类型。Variable 变量，对应着Execution Context 执行上下文存储的变化。

Symbol最大的作用，作为对象的索引。

### Number

IEEE 754 Double Float 双精度浮点数：

- 1个符号位 sign：0表示正，1表示负
- 11个指数位 exponent：1~2046。指数值可正可负，通过1023对它置偏。置偏后范围 -1024 ~ 1023。
- 52个精度位 Fraction：在精度位和指数位之间，有一个隐藏位1，因为精度一定以1开始。【❓疑惑，这个隐藏位在演示程序中相当于多了一位，没地方存呀？】

转化为十进制公式 (-1)^s x 2^(e-1023) x (1 + M1 x 2^(-1) + ... + M52 x 2^(-52))。

[双精度浮点数在线转换工具](http://bartaz.github.io/ieee754-visualization/) 

 语法

- 十进制：0. 与 .2都是合法的。0.toString()报错， 0 .toString()正确。
- 二进制：0b开头
- 八进制：0o开头
- 十六进制：Ox开头 

### String

字符集

- ASCII 占一个字节，不存在编码问题
- Unicode  编码方式包括UTF8 / UTF16，UTF8一般用1个字节表示，UTF16一般用2个字节表示一个字符，但有时两种都需要更多的字节插入控制符表示一个字符。如 汉字 ‘一’，UTF8 需3个字节，UTF16需2个字节。
- UCS：0000-FFFF
- GB：GB2312, GBK, GB18030  同时规定字符集和编码方式
- ISO-8895  东欧国家
- BIG5  台湾

```
\n 换行符
\R 回到行首
\u2028 分段
\u2029 分页
\xhh 匹配一个两位十六进制数表示的字符
\uhhhh 匹配一个四位十六进制数表示的UTF-16 代码单元
\bfnrtv ❓这是什么
练习：写一个正则匹配单双引号字符串
"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"
```

Unicode 符号范围

| 十六进制              | 二进制                              | 十进制          |
| --------------------- | ----------------------------------- | --------------- |
| 0000 0000 - 0000 007F | 0xxxxxxx                            | 0 - 127         |
| 0000 0080 - 0000 07FF | 110xxxxx 10xxxxxx                   | 128 - 2047      |
| 0000 0800 - 0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx          | 2048 - 65535    |
| 0001 0000 - 0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx | 65536 - 1114111 |

```
练习：JS函数，用UTF8对string进行编码
function UTF8_Encoding(string) {
    let bytes = []
    for(let i = 0; i < string.length; i++) {
        let code = string.charCodeAt(i);
        if(code <= 127) {
            bytes.push(code)
        }else if(code > 127 && code <= 2047) {
            bytes.push((code >> 6) | 0xc0)
            bytes.push((code & 0x3f) | 0x80)
        }else if(code > 2047 && code <= 65535) {
            bytes.push((code >> 12) | 0xe0)
            bytes.push((code >> 6) & 0x3f | 0x80)
            bytes.push((code & 0x3f) | 0x80)
        }else if(code > 65535 && code <= 1114111) {
            bytes.push((code >> 18) | 0xf0)
            bytes.push(((code >> 12) & 0x3f) | 0x80)
            bytes.push(((code >> 6) & 0x3f) | 0x80)
            bytes.push((code & 0x3f) | 0x80) 
        }
    }
    return Buffer.from(bytes)
}
相关知识回顾：
>> 有符号右移，>>> 无符号右移。对正数两个操作结果相同，对负数 >>> 后变成正数。
```

#### 模板字符串

一种语法结构，而非词法结构。

```
如 `ab${x}abc${y}abc`
JS引擎会拆分成：
`ab${   x  }abc${   y   }abc` 3个token，2个表达式
```

模板字符串的另一个功能，标签模板，一种函数调用的特殊形式。

```
在第一个反引号前，可加函数名。示例如下：
alert`hello`
saferHTML`<p>${sender} has sent you a message.<p>`
function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    s += templateData[i];
  }
  return s;
}
```

### 对象

三要素：state, behavior, identifier

双方括号，定义私有方法。在JS语言中无法访问这些属性，但JS引擎的C、C++代码可以访问。

设计对象的状态行为，遵循“行为改变状态”的原则。

```
练习1：用JavaScript设计狗咬人的代码
class Human {
	is_hurt = false;
	constructor(name) {
		this.name = name;
	}
	say(words) {
		console.log(words)
	}
	hurt(damage) {
		this.is_hurt = true;
		this.say(`I am hurt because ${damage}`)
	}
}
const Jim = new Human('Jim');
Jim.is_hurt; // false
Jim.hurt('a dog bit me');
Jim.is_hurt; // true

练习2：找出JS标准里面所有具有特殊行为的对象，即没有办法用普通对象，属性+原型表示的对象。
1.本课程及重学前端课程提到的特殊行为对象，如下
Function: 特殊行为[[call]], 在函数调用时访问该行为。
Array：Array 的 length 属性根据最大的下标自动发生变化。
Object.prototype：作为所有正常对象的默认原型，无setPrototypeOf方法。
String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 。
类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
bind 后的 function：跟原来的函数相关联。

2.具有特殊行为的对象，即没有办法用普通对象，属性+原型表示的对象。 按此定义，我认为还包括：
（1）宿主对象, 包括DOM、BOM(window/location/navigator/screen/history)、构造器如 Image等。
（2）JS语言本身的构造器，如Boolean, String, Number, Symbol, RegExp, Date, Math, Error, ArrayBuffer等。
这些构造器以及构造器创建的对象， 都具有特殊行为，都无法用JS代码实现。

```

