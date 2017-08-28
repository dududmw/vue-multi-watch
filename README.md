# Vue Multi Watch


## Installation

```
npm install vue-multi-watch --save
```

## Useage

```
const Vue=require('vue');
const MultiWatch=require('vue-multi-watch');
Vue.use(MultiWatch);
new Vue({
    ...
    data:{
        a:1,
        b:2
    },
    multiWatch:{
        'a,b':function(){
            ...
        }
    }
    ...
});
```