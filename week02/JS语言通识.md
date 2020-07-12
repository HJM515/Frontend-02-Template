## JS语言通识

### 泛语言分类方法

- 非形式语言：语法没有严格定义，如中文、英文。
- 形式语言：有一套严谨的形式化定义，大部分计算机编程语言都属于这一类。

形式化语言分类（按乔姆斯基谱系）：

- 0型 无限制文法
- 1型 上线文相关文法
- 2型 上下文无关文法
- 3型 正则文化

四种类型，具有上下包含关系。

### 工具 —— 产生式

产生式有多种描述方法，最经典、常用的一种是 巴科斯-诺尔范式，简称BNF。

BNF是一种用于表示上下文无关文法的语法规则（语法范式/元语言）。 主要用于描述计算机语言语法 。

```
常用符号及定义
<终结符/非终结符>	尖括号括起来的名称，表示语法结构名
""				双引号中间的字，代表字符本身
终结符			  基础结构（如Number）、引号中间的字符（如 + 、-）
非终结符		 需要由其他语法结构定义的复合结构
::=				定义为
|				或 （并列选项）
()				分组
*				重复多次（0-n）【EBNF？】
+				至少一次（1-n）【EBNF？】
[]				可选项（0-1）【EBNF】
{}				重复项（0-n）【EBNF】
语言中包含很多终结符，终结符组合产生非终结符。语言的文体由一个最上层的非终结符来代表。
```

```
练习题：编写带括号的四则运算产生式
终结符：Number + - * / ( )
非终结符：MulExp AddExp ParExp
<ParExp>::=<AddExp>|
           "("<ParExp>")"|
           <ParExp>"+"<AddExp>|
           <ParExp>"-"<AddExp>|
           <ParExp>"*"<AddExp>|
           <ParExp>"/"<AddExp>
<AddExp>::=<MulExp>|
           <AddExp>"+"<MulExp>|
           <AddExp>"-"<MulExp>
<MulExp>::=<Number>|
           <MulExp>"*"<Number>|
           <MulExp>"/"<Number>
把 <Number> 视为一种特殊的乘法结构， 简化加减运算的定义。
MulExp 是 AddExp 的子结构，AddExp 是 ParExp 的子结构。
```

产生式的左边，不一定只有一个终结符，可以在左边产生多个非终结符。

### 借产生式理解乔姆斯基谱系

- 0型 无限制文法          
  - ?::=?  左右可以有多个非终结符
- 1型 上线文相关文法    
  - ?<A>?::=?<B>?  第一个?是上文，第二个?是下文，左右上下文相同且不变         
- 2型 上下文无关文法    
  - <A>::=?  左边只能有一个非终结符
- 3型 正则文化 
  - <A>::=<A>?  A必须出现在开头

JS 总体属于上下文无关，表达式部分多属于正则文法。JS 也不是严格意义的上下文无关文法。示例如下：

```
非正则表达式特例： 
** 乘方是右结合的运算符，不属于正则文法。 如 2**1**2 结果是 2。
上下文相关文法：
{
	get a {return 1},
	get: 1
}
```

### 现代语言分类

现代语言按乔姆斯基谱系 或者 泛语言分类

形式语言按用途分类：

- 数据描述语言：JSON, HTML, CSS, XML, SQL
- 编程语言：C, C++, Java, Python, Ruby, Lisp, JavaScript...

形式语言按表达方式分类：

- 声明式：结果。JSON, HTML, CSS, XML, SQL, Lisp
- 命令式：达成结果的每个步骤。C, C++, Java, Python, Ruby, JavaScript...

```
练习题：尽可能寻找你知道的计算机语言，尝试把它们分类。
C, C++, C#, Java, Python, Go, Ruby, Lisp, VB, PHP, JavaScript, TypeScript, Dart, Objective-C, Swift, Kotlin, Perl, PowerShell
Rust, R, NPL, Simula, Smalltalk, VB.NET
SQL
1.面向过程 vs 面向对象：
面向过程：Fortran, C
面向对象：Simula, Smalltalk, C++, Common Lisp, Objective-C, Perl, Python, Ruby, Java, JavaScript, Swift, Kotlin, PHP
2.解释型语言 vs 编译型语言
解释型：JavaScript, PHP, Python, Ruby, Perl, C Shell, VBScript
编译型：C, C++, Go, Objective-C, Swift
3.动态 vs 静态
动态：JavaScript, PHP, Python, Ruby, Perl, Groovy, Common Lisp, Scheme, Smalltalk, VBScript
静态：C, C++, Java, Go, VB
静态类型语言的类型检查发生在编译阶段。
4.弱类型 vs 强类型
弱类型：C, C++, JavaScript, PHP
强类型：Java, C#, Python, Go, Ruby
强类型禁止类型转换，保证类型安全。
```

### 编程语言的性质

（1）图灵完备性

所有可计算的问题，都可以用这门语言描述，就可称这门语言具有图灵完备性。

图灵完备性实现方式：

- 命令式语言从图灵机发展而来，使用goto、if、while语言实现
- 声明式语言，使用lambda表达式，通过递归实现

（2）动态与静态

- 动态：Runtine，运行在用户的设备或在线服务器上
- 静态：Compiletime，运行在程序员的设备上

（3）类型系统

- 动态和静态类型系统：动态类型系统，在用户的机器、内存中能找到的类型。静态类型系统，只在程序编程时能够保留的类型信息，编译后类型信息就没有了。Java在运行时，可以通过反射获取类型，属于半动态半静态类型系统。
- 强类型与弱类型：强类型语言的类型转换不会默认发生。
- 复合类型：结构体，如定义对象的a属性属于类型T1，b属性属于类型T2。函数签名，参数类型和返回值类型。
- 子类型：如C++。可以用父类型的地方，可以用子类型。
- 泛型：把类型当做参数传递，对应着泛型类和泛型函数。
- 泛型、子类型结合，会产生逆变、协边等。

### 命令式编程语言

- Atom：identifier, literal （标识符、字面量/字节量）
- Expression：Atom, Operator, Punctuator（标点符号）
- Statement：Expression, Keyword, Punctuator
- Structure：Function, Class, Process（PARCAL）, Namespace（C++）
- Program：Program, Module, Package, Library

Statement 语句基本具备图灵完备性。再上层会有Structure、Program，更好的实现逻辑、模块的复用。

编程：以一定的语法表达一定的语义，改变运行时的状态。