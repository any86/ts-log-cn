# ts-log-cn(翻译中...)

从typescript的更新日志中筛选一些**类型相关**的知识点, **类型推断的变化(放宽)和配置项会以及ecma的新增语法选录**.

## v3.9
### // @ts-expect-error
用来屏蔽错误, 不同于"// @ts-ignore"的使用动机, "// @ts-expect-error"主要的使用场景是你故意产生错的, 比如测试用例.

```typescript
function doStuff(abc: string, xyz: string) {
  assert(typeof abc === "string");
  assert(typeof xyz === "string");
}

// 你想测试传入数字参数, 但是ts会自动推断错误, 这不是你想要的, 所以加"// @ts-expect-error"
expect(() => {
  // @ts-expect-error
  doStuff(123, 456);
}).toThrow();

```

## v3.8
### import type / export type
为仅类型导入和导出添加了新语法。
```typescript
import type { SomeThing } from "./some-module.js";
export type { SomeThing };
```

### 类的私有属性"#"
同步ecma的私有属性语法, 不同于private修饰符, #后的私有属性即便在编译成js后依然不能在类的外部访问.

```typescript
class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
```

### export * as ns
导出语法, 同步于ecma2020的语法
```typescript
export * as utilities from "./utilities.js";
```

### 顶级作用域的await关键字
同步于ecma的语法, 要求必须是模块内使用, 所以起码要有一个"空导出(export {})"
```typescript
const response = await fetch("...");
const greeting = await response.text();
console.log(greeting);
// Make sure we're a module
export {};
```
还有一个限制就是配置项: "target"为es2017以上且"module"为"esnext"


## v3.4
### readonlyArray
只读数组
```typescript
function foo(arr: ReadonlyArray<string>) {
  arr.slice(); // okay
  arr.push("hello!"); // error!
}
```
### readonly T[]
和readonlyArray同效果.
```typescript
function foo(arr: readonly string[]) {
  arr.slice(); // okay
  arr.push("hello!"); // error!
}
```

### readonly 元祖
```typescript
function foo(pair: readonly [string, string]) {
  console.log(pair[0]); // okay
  pair[1] = "hello!"; // error
}
```

### const 断言
使用const断言后, 推断出的类型都是"不可修改"的.
```typescript
// Type '"hello"',不能修改x的值了
let x = "hello" as const;
// Type 'readonly [10, 20]'
let y = [10, 20] as const;
// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;
```
还可以写使用尖角号断言:
```typescript
// Type '"hello"'
let x = <const>"hello";
// Type 'readonly [10, 20]'
let y = <const>[10, 20];
// Type '{ readonly text: "hello" }'
let z = <const>{ text: "hello" };
```
**注意**const断言只能立即应用于简单的文字表达式。
```typescript
// Error! A 'const' assertion can only be applied to a
// to a string, number, boolean, array, or object literal.
let a = (Math.random() < 0.5 ? 0 : 1) as const;
let b = (60 * 60 * 1000) as const;
// Works!
let c = Math.random() < 0.5 ? (0 as const) : (1 as const);
let d = 3_600_000 as const;
```

## v3.2

### bigint类型
bigint是ECMAScript即将推出的提案的一部分.
```typescript
let foo: bigint = BigInt(100); // the BigInt function
let bar: bigint = 100n; // a BigInt literal
```


## v3.1
### typesVersions
一个项目支持多个声明文件, 比如下面版本大于3.1就去项目下的"ts3.1"文件夹下查找声明文件.
```javascript
// tsconfig.js
{
    "typesVersions": {
        ">=3.1": { "*": ["ts3.1/*"] }
        ">=3.2": { "*": ["ts3.2/*"] }
    }
}
```

## v2.9

### import 类型

### 新的--declarationMap

随着--declaration 一起启用--declarationMap，编译器在生成.d.ts 的同时还会生成.d.ts.map。 语言服务现在也能够理解这些 map 文件，将声明文件映射到源码。

换句话说，在启用了--declarationMap 后生成的.d.ts 文件里点击 go-to-definition，将会导航到源文件里的位置（.ts），而不是导航到.d.ts 文件里。

## v2.8

### -/+

对 readonly/?修饰符进行增删控制.

```typescript
type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] }; // 移除readonly和?
type ReadonlyPartial<T> = { +readonly [P in keyof T]+?: T[P] }; // 添加readonly和?
```

## v2.7

### let x!: number[];

初始化变量直接断言已赋值.

```typescript
// 没有这!, 会提示"在赋值前不能进行操作"
let x!: number[];
// 这个函数的赋值ts是检测不到的, 所以上一行用了"!"
initialize();
x.push(4);

function initialize() {
  x = [0, 1, 2, 3];
}
```

## v2.6

### 中文 tsc

```shell
tsc --locale zh-cn
```

后面的命令行提示都会以中文形式显示.

### @ts-ignore

@ts-ignore 注释隐藏下一行错误

```typescript
if (false) {
  // @ts-ignore：无法被执行的代码的错误
  console.log("hello");
}
```

## v2.5

### try/catch 中 catch 可以省略参数

```typescript
let input = "...";
try {
  JSON.parse(input);
} catch {
  // ^ 注意我们的 `catch` 语句并没有声明一个变量
  console.log("传入的 JSON 不合法\n\n" + input);
}
```

## v2.4
### 动态的import, 很多打包工具都已经支持import异步加载模块.
注意: 需要把tsconfig中的目标模块设置为"esnext".
```typescript
async function getZipFile(name: string, files: File[]): Promise<File> {
    const zipUtil = await import('./utils/create-zip-file');
    const zipContents = await zipUtil.getContentAsBlob(files);
    return new File(zipContents, name);
}
```
## v2.3

### @ts-nocheck
通过"// @ts-nocheck"注释来声明文件不检测类型.
```typescript
// @ts-nocheck
let a; 
// 本应该提示a未赋值.
a.push(123)
```

## v2.0
### 快捷外部模块声明
当你使用一个新模块时，如果不想要花费时间书写一个声明时，现在你可以使用快捷声明以便以快速开始。
```typescript
// xxx.d.ts
declare module "hot-new-module";
```
所有导入都是**any**类型
```typescript
// x,y 都是any
import x, {y} from "hot-new-module";
x(y);
```

### 模块名称中的通配符

这个vue初始化的项目中就有, 用来声明.vue文件是个组件.
```typescript
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
还有:
```typescript
declare module "*!text" {
    const content: string;
    export default content;
}
// Some do it the other way around.
declare module "json!*" {
    const value: any;
    export default value;
}
```