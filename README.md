# ts-log-cn

用最简短的文字翻译 typescript 的更新日志. 这些特性你可能不知道.

## 注意
常用的语法只会出现标题, 不会被翻译,尤其 3.0 之前的版本, 请见谅.

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

## v1.5

## v1.3

### protect

类的 protect 修饰符, 防止在类的外部访问.

```typescript
class Thing {
  protected doSomething() {
    /* ... */
  }
}
class MyThing extends Thing {
  public myMethod() {
    // 子类可以访问父类中protected的方法
    this.doSomething();
  }
}
var t = new Thing();
t.doSomething(); // 错误, 实例不能访问

var mt = new MyThing();
mt.doSomething(); // 错误, 子类实例也不能访问
```

### Tuple(元祖)
