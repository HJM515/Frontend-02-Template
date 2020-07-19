## JS表达式

### Expressions

优先级，从上到下减低。

| 分类           |                                                              |
| -------------- | ------------------------------------------------------------ |
| Member         | a.b  a[b]  foo\`string\`  super.b  super['b']  new.target  new Foo() |
| New            | new Foo                                                      |
| Call           | foo()  =  super()  >  foo.b  =  foo()['b']  =  foo()\`abc\`  |
| Update         | a++  a--  --a  ++a  从一级开始，基本都是Right Handside Expression |
| Unary          | delete a.b   void foo()   typeof a    +a    -a    ~a    !a    await a |
| Exponental     | **                                                           |
| Multiplicative | *   /   %                                                    |
| Additive       | +    -                                                       |
| Shift          | <<    >>     >>>                                             |
| Relationship   | <    >    <=    >=    instanceof    in                       |
| Equality       | ==    !=    ===    !==                                       |
| Bitwise        | &    ^    \|                                                 |
| Logical        | &&    \|\|                                                   |
| Conditional    | ? :                                                          |

### Reference

属于标准中的类型，不属于语言的类型。包括两个部分，Object和Key。 JS运行时，使用引用类型来处理删除或者赋值这样的写相关的操作。

运算符的优先级会影响语法树的结构。

### Left Handside & Right Handside Expression

只有Left Handside Expression可以放到等号左边。

```
a.b = c  ✔  a.b 是 Left Handside,
a + b = c ✖  a+b 是 Right Handside
```

### Type Convertion

#### 拆箱 toPremitive

- Symbol.toPrimitive  优先调用（忽略 toString 和 valueOf）
- valueOf   加法运算这种需要使用number的场景，优先调用
- toString  作为属性名这种使用字符串的场景，优先调用

装箱 boxing  包装类

- new Number(1)
- new String('1')
- new Boolean(true)
- new Object(Symbol('a'))

```
练习：完成StringToNumber和NumberToString两个函数 
需考虑number 的四种进制
StringToNumber 解析这四种类型的字符串转成Number，NumberToString 传一个进制指定转成几进制
function StringToNumber(str) {
	if(typeof str !== 'string') {
		throw Error('The first parameter should be a string type.')
	}
	return Number(str)
}
function NumberToString(num, radix=10) {
	if(typeof num !== 'number') {
		throw Error('The first parameter should be a number type.')
	}
	const prefix_map = {
		2: '0b',
		8: '0o',
		10: ''
		16: '0x'
	}
	if(radix && !Object.keys(prefix_map).includes(radix+'')) {
		throw Error('The second parameter should be an item in [2, 8, 10, 16].')
	}
	const prefix = num % 1 === 0 ? prefix_map[radix] : (radix + '进制')
	return prefix + num.toString(radix)
}
```

## JS语句

### Completion Record

完成状态记录，存在于运行时，无法访问或赋值。

- [[type]]：normal, break, continue, return, or throw
- [[value]]：基本类型
- [[target]]：label

### 简单语句

- ExpressionStatement（核心，计算）
- EmptyStatement（空）
- DebuggerStatement（调试）
- ThrowStatement （流程控制）
- ContinueStatement（流程控制）
- BreakStatement（流程控制）
- ReturnStatement（流程控制）

### 复合语句

- BlockStatement
- IfStatement
- SwitchStatement
- IterationStatement
- LabelledStatement
- TryStatement  
- WithStatement

try, catch, finally语句并不是用block语句来制造的这种多语句执行环境，所以try后面的花括号不能省略。

### 声明

- FunctionDeclaration
- GeneratorDeclaration
- AsyncFunctionDeclaration
- AsyncGeneratorDeclaration
- VariableStatement
- LexicalDeclaration
- ClassDeclaration （const, let）

class, const, let 在声明之前使用会报错。

所有的声明都有预处理机制，都会将变量变成局部变量，区别是一个会报错。

var的作用域是函数体，const的作用域是block语句。

## JS结构化

宏任务：传给JS引擎的任务

微任务：JS引擎内部的任务

事件循环： 获取代码 > 执行 > 等待 > 获取代码 > 执行 > 等待。。。

### 函数调用

JS中，每个函数调用都会生成一个闭包❓❓

### Realm

在一个JS引擎实例中，所有内置对象都放到一个Realm中，不同的Real （不同实例）之间完全相互独立。

JS可能根据外部的条件去创建不同的Realm，不同的Real实例之间可以互相传递对象。

可视化框架，蚂蚁前端的G6，G6适合做对象的可视化。把real可视化，看看JS的realm里究竟有多少对象。只是JS，不包括浏览器的。