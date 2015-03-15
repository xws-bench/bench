function Unit(o) {
    this.a = 0;
    this.b={aa:1,bb:2}; 
    $.extend(this,o);
}
Unit.prototype= {
    f: function(n) {
	console.log(this.name+" : "+(this.a+n));
    },
    g: function() {
	this.f(1);
    },
}
o = new Unit({ g: function() { console.log('coucou'); Unit.prototype.g.call(this); },name: "o"});
n= new Unit({name:"n" });
o.g();
var c="function() { console.log('hello'); }";
var d=eval("("+c+")")();
n.g();
