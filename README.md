# A javascript console simulator for vscode

## Table Of Contents

-   [Start](#start)
-   [Basic Features](#basic-features)
-   [Playground Example](#playground-example)
-   [Notice](#notice)
-   [Known Issues](#known-issues)
-   [Related StackOverflow Questions](#related-stackoverflow-questions)

### Start

1. Download the extension from [vscode marketplace](https://marketplace.visualstudio.com/items?itemName=MohammadMD.js-interactive).
2. Install it.
3. Press `F1` and then simply type `js interactive` to find the command as shown below.

![image](https://user-images.githubusercontent.com/69088224/115705139-6e34e100-a381-11eb-9bb9-b88d2b5cf488.png)

### Basic Features

-   type and execute almost any js that you can execute in a browser. _dev tools > console_

### Playground Example

```javascript
// console features
⫸	console.log("Hello World")
!	Hello World
⫷	undefined

⫸	console.table(
    	{index: 0, title: "js interactive", description: "JavaScript Console Simulator"},
    	{index: 1, title: "ts interactive", description: "TypeScript Playground!!!"},
    )

| index | title          | description                  |
| ----- | -------------- | ---------------------------- |
| 0     | js interactive | JavaScript Console Simulator |
| 1     | ts interactive | TypeScript Playground!!!     |

⫷	undefined

// math
⫸	2 + 4 * Math.PI
⫷	14.566370614359172

// create functions
⫸	function doSomeJob() { /* ... */ }
⫷	undefined

// and many more ...
```

### Notice

-   defining variables using `let` and `const` is not supported **in global scope**

### Known Issues

-   nothing yet!

### Related StackOverflow Questions

-   [JavaScript: do all evaluations in one vm](https://stackoverflow.com/questions/67173347/javascript-do-all-evaluations-in-one-vm)
-   [Context-preserving eval](https://stackoverflow.com/questions/67322922/context-preserving-eval)
