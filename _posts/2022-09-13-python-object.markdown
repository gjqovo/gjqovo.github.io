---
layout: post
title:  "Python中的对象"
date: 2022-09-14 01:31:55 +0800
categories: [Language, Python]
tags: [python, 编程]
---

## 引言

对象是Python 中对数据的抽象。Python程序中的所有数据都是由对象或对象间关系来表示的。

Python中，一切皆对象。

本文基于Python 3.10。

## 对象的组成

在Python中，任何对象都有各自的标识号、类型和值。

### 标识号（identity）

一个对象被创建后，其标识号就**绝不会**改变。通过id()函数可以返回代表对象标识号的整数，is运算符可以用于判断两个对象标识号是否相同。

我们可以将对象的标识号理解为该对象在内存中的地址，实际上，在CPython中，id(x)就是存放x的内存的地址。

### 类型（type）

对象的类型决定该对象所支持的操作并且定义了该类型的对象可能的取值。type()函数能返回一个对象的类型 (类型本身也是对象)。

与标识号一样，一个对象的类型**通常是不可改变**的。

文档脚注中提到：

> 在某些情况下*有可能*基于可控的条件改变一个对象的类型。 但这通常不是个好主意，因为如果处理不当会导致一些非常怪异的行为。

#### Python是强类型的（strongly typed）

作为术语，强类型的和弱类型的的定义并不算精确，实际上编程语言中类型系统（type system）中的许多术语都有类似的问题，如类型安全（type safety），这些术语在不同场景其内涵可能有微妙的差别。也正因如此，在讨论语言的类型系统相关问题时，更应该注意其类型系统设计上的种种具体特性，而不能简单的以一句话结论带过。

Python被广泛认为是强类型的，其原因大概有如下几条：

1. Python的对象类型不会发生隐式转换。
2. Python会在运行中检测类型错误。

以上皆以Python的标准实现CPython为基准。实际上，很多编程语言特性是很难脱离了编译器/解释器对语言的具体实现来谈论的。

#### Python是动态类型的（dynamic typed）

Python也被广泛认为是动态类型的，其原因大概有如下几条：

1. Python的名称（详见下文）可以换绑不同类型的对象。
2. Python在运行时会进行动态类型检查。

同样以Python的标准实现CPython为基准。

关于类型系统的相关讨论还能有更多，但正如上面所说，我们应该更注意其具体的特性，有关类型系统的其他内容放在词法分析、执行模型等部分分别来介绍可能会理解起来更为顺畅。

### 值（value）

有些对象的值可以改变。值可以改变的对象被称为可变对象；值不可以改变的对象就被称为不可变对象。

有关可变对象和不可变对象，我们会在下文做详细介绍。

### 名称/标识符（name, aka. identifier）和对象

以如下代码为例：

```python
a = 1
```

“a”即是名称（又可称为标识符），名称不是对象的组成部分，但名称可以指代对象。

名称通过绑定（binding）操作引入，方式可以有多种：

- 函数的正式参数，
- 类定义，
- 函数定义，
- 赋值表达式,
- 如果在一个赋值中出现，则为标识符的目标:
    - for循环头,
    - 在as后面的with语句，except子句或结构模式匹配中的as模式。
    - 在结构模式匹配中的捕获模式
- import语句。

对于从没有相应机制语言转过来的程序员，此概念可能较为难以理解。如在C语言中，类似`a = 1`的语句中，a作为变量其内存地址是确定的，再执行`a = 2`语句，则会对a对应的内存地址的值做更改，而在Python中，这只是将该名称绑定到另一个对象上，其对象所在的内存地址已经发生了改变。

## 可变性（immutable）

### 可变性的定义

Python中，对象可以依照可变性分为两类：可变对象和不可变对象。

在[官方文档](https://docs.python.org/3/glossary.html)中，可变性的定义如下：

> immutable
>
> An object with a fixed value. Immutable objects include numbers, strings and tuples. Such an object cannot be altered. A new object has to be created if a different value has to be stored. They play an important role in places where a constant hash value is needed, for example as a key in a dictionary.


固定值是可变对象的最根本的属性，因此在Python的赋值语句中，如果左侧为不可变对象，则通常需要创建新的对象，再将名称和新对象绑定。

实际上，考虑到容器的情况，不可变和值不可改变间仍然有着微妙的区别，我们并不能严格意义上说两者是等价的。

最后，对象的可变性是由其类型决定的。

### 常见类型的可变性

既然对象的可变性是由其类型决定的，那我们就能够谈论不同对象类型的可变性。

常见类型中，数字、字符串和元组是不可变的，而字典和列表是可变的。

### 不可变容器中的可变对象

之前提到，不可变和值不可改变间是有微妙区别的，其原因就在于在不可变容器对象如元组中，如果含有可变对象的引用，但该可变对象改变时，该不可变容器的值也会改变，但我们仍然认为其属于不可变对象，因为该容器所包含的对象集不变。

可以这么说，在容器对象中，可变性和不可变性是有其包含的对象是否可变来决定的。

### 自定义类的可变性

用户自定义类**通常**是可变的。但可以通过定义__slots的属性，替换__dict__属性，阻止属性的新增，再覆盖类中的__setattr__方法以阻止修改现有属性。

```python
class ImmutableClass(object):
    # __slots__可被赋值为任何非字符串的可迭代对象
    __slots__ = ['attr1', 'attr2']
    def __init__(self, attr1， attr2):
        super(ImmutableClass, self).__setattr__('attr1', attr1)
        super(ImmutableClass, self).__setattr__('attr2', attr2)
    def __setattr__(self, name, value):
        raise AttributeError("'%s' has no attribute %s" % (self.__class__, name))
```

### 可变对象作为函数参数默认值时的陷阱

下面是官方文档中给出的经典的错误示范，在foo函数执行到第二回时，如果其key不同，将会导致mydict中含有两个数据项，而不是字面上所被理解的只有一个。

其根本原因在于，mydict的默认值{}并不会在每次调用时创建新对象，而是仅仅在函数定义时创建一次，这样第二次调用该函数时，mydict绑定的对象和第一次调用时是同样的对象。

```python
def foo(mydict={}):  # Danger: shared reference to one dict for all calls
    ... compute something ...
    mydict[key] = value
    return mydict
```
为了避免此问题，建议采用不可变对象None作为默认值并用于新建列表、字典等其他对象。

官网中给出来的示例写法如下：

```python
def foo(mydict=None):
    if mydict is None:
        mydict = {}  # create a new dict for local namespace
```

## 可哈希性（hashable）

### 可变性与可哈希性的关系

## 生命周期
