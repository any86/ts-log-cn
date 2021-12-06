# ts-log-cn
用最简短的问题翻译typescript的更新日志





## v1.3
### protect
类的protect修饰符, 防止在类的外部访问.
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