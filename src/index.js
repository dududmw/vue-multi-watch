const SPLIT=',',
    PREFIX='multi-watch:';
class Handler{
    constructor(option){
        const {attrs,handler,context}=option;
        this.attrs=attrs;
        this.handler=handler;
        this.change={};
        this.context=context;
    }
    check(key,value){
        this.change[key]=value;
        let result=true;
        this.attrs.forEach(attr=>{
            if(!this.change.hasOwnProperty(attr)){
            result=false;
        }
    });
        if(result){
            let changingState=this.change;
            this.change={};
            this.handle(changingState);
        }
    }
    handle(changingState){
        (typeof this.handler=='function')&&(this.handler.call(this.context,changingState));
    }
}
class Emitter{
    constructor(option){
        const {key,events,context}=option;
        this.key=key;
        this.events=events;
        this.context=context;

    }
    emit(...args){
    this.events.forEach(event=>{
    this.context.$emit(PREFIX+event,this.key,...args);
});
}
}
function setListeners(context,option){
    let events={};
    Object.keys(option).forEach(key=>{
        key+='';
    let attrs=key.split(SPLIT);
    attrs.forEach(attr=>{
        if(!Array.isArray(events[attr])){
        events[attr]=[];
    }
    events[attr].push(key);
});
    let handler=new Handler({
        attrs,
        context,
        handler:option[key],
    });
    context.$on(PREFIX+key,handler.check.bind(handler));
});
    Object.keys(events).forEach(key=>{
        let emitter=new Emitter({
            key,
            context,
            events:events[key]
        });
    context.$watch(key,emitter.emit.bind(emitter));
});
}
export default {
    install:function(Vue){
        Vue.mixin({
            created:function(){
                const option=this.$options.multiWatch;
                if(!option){
                    return;
                }
                setListeners(this,option);
            }
        });
    }
}