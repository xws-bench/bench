(function(u, A) {
    function v(a) {
        if ("function" == typeof require && "undefined" !== typeof module && module.exports) try {
            return require(a.toLowerCase())
        } catch (b) {} else return u[a]
    }

    function m(a, b) {
        return null === a ? "null" === b : void 0 === a ? "undefined" === b : a.is && a instanceof f ? "element" === b : 7 < Object.prototype.toString.call(a).toLowerCase().indexOf(b)
    }

    function r(a) {
        var b, c, e, d, k, f, g, l;
        if (a instanceof r) return a;
        m(a, "array") || (a = String(a).replace(/\s/g, "").toLowerCase().match(/(?:\+,|[^,])+/g));
        b = 0;
        for (c = a.length; b < c; ++b) {
            m(a[b],
                "array") || (a[b] = String(a[b]).match(/(?:\+\/|[^\/])+/g));
            f = [];
            for (e = a[b].length; e--;) {
                g = a[b][e];
                k = {
                    jwertyCombo: String(g),
                    shiftKey: !1,
                    ctrlKey: !1,
                    altKey: !1,
                    metaKey: !1
                };
                m(g, "array") || (g = String(g).toLowerCase().match(/(?:(?:[^\+])+|\+\+|^\+$)/g));
                for (d = g.length; d--;) "++" === g[d] && (g[d] = "+"), g[d] in h.mods ? k[B[h.mods[g[d]]]] = !0 : g[d] in h.keys ? k.keyCode = h.keys[g[d]] : l = g[d].match(/^\[([^-]+\-?[^-]*)-([^-]+\-?[^-]*)\]$/);
                if (m(k.keyCode, "undefined"))
                    if (l && l[1] in h.keys && l[2] in h.keys) {
                        l[2] = h.keys[l[2]];
                        l[1] = h.keys[l[1]];
                        for (d = l[1]; d < l[2]; ++d) f.push({
                            altKey: k.altKey,
                            shiftKey: k.shiftKey,
                            metaKey: k.metaKey,
                            ctrlKey: k.ctrlKey,
                            keyCode: d,
                            jwertyCombo: String(g)
                        });
                        k.keyCode = d
                    } else k.keyCode = 0;
                f.push(k)
            }
            this[b] = f
        }
        this.length = b;
        return this
    }
    var q = u.document,
        f = v("jquery") || v("zepto") || v("ender") || q,
        t, w, x, y;
    f === q ? (t = function(a, b) {
        return a ? f.querySelector(a, b || f) : f
    }, w = function(a, b) {
        a.addEventListener("keydown", b, !1)
    }, x = function(a, b) {
        a.removeEventListener("keydown", b, !1)
    }, y = function(a, b) {
        var c = q.createEvent("Event"),
            e;
        c.initEvent("keydown", !0, !0);
        for (e in b) c[e] = b[e];
        return (a || f).dispatchEvent(c)
    }) : (t = function(a, b) {
        return f(a || q, b)
    }, w = function(a, b) {
        f(a).bind("keydown.jwerty", b)
    }, x = function(a, b) {
        f(a).unbind("keydown.jwerty", b)
    }, y = function(a, b) {
        f(a || q).trigger(f.Event("keydown", b))
    });
    for (var B = {
            16: "shiftKey",
            17: "ctrlKey",
            18: "altKey",
            91: "metaKey"
        }, h = {
            mods: {
                "\u21e7": 16,
                shift: 16,
                "\u2303": 17,
                ctrl: 17,
                "\u2325": 18,
                alt: 18,
                option: 18,
                "\u2318": 91,
                meta: 91,
                cmd: 91,
                "super": 91,
                win: 91
            },
            keys: {
                "\u232b": 8,
                backspace: 8,
                "\u21e5": 9,
                "\u21c6": 9,
                tab: 9,
                "\u21a9": 13,
                "return": 13,
                enter: 13,
                "\u2305": 13,
                pause: 19,
                "pause-break": 19,
                "\u21ea": 20,
                caps: 20,
                "caps-lock": 20,
                "\u238b": 27,
                escape: 27,
                esc: 27,
                space: 32,
                "\u2196": 33,
                pgup: 33,
                "page-up": 33,
                "\u2198": 34,
                pgdown: 34,
                "page-down": 34,
                "\u21df": 35,
                end: 35,
                "\u21de": 36,
                home: 36,
                ins: 45,
                insert: 45,
                del: 46,
                "delete": 46,
                "\u2190": 37,
                left: 37,
                "arrow-left": 37,
                "\u2191": 38,
                up: 38,
                "arrow-up": 38,
                "\u2192": 39,
                right: 39,
                "arrow-right": 39,
                "\u2193": 40,
                down: 40,
                "arrow-down": 40,
                "*": 106,
                star: 106,
                asterisk: 106,
                multiply: 106,
                "+": 107,
                plus: 107,
                "-": 109,
                subtract: 109,
                "num-.": 110,
                "num-period": 110,
                "num-dot": 110,
                "num-full-stop": 110,
                "num-delete": 110,
                ";": 186,
                semicolon: 186,
                "=": 187,
                equals: 187,
                ",": 188,
                comma: 188,
                ".": 190,
                period: 190,
                "full-stop": 190,
                "/": 191,
                slash: 191,
                "forward-slash": 191,
                "`": 192,
                tick: 192,
                "back-quote": 192,
                "[": 219,
                "open-bracket": 219,
                "\\": 220,
                "back-slash": 220,
                "]": 221,
                "close-bracket": 221,
                "'": 222,
                quote: 222,
                apostraphe: 222
            }
        }, n = 47, p = 0; 106 > ++n;) h.keys[p] = n, h.keys["num-" + p] = n + 48, ++p;
    n = 111;
    for (p = 1; 136 > ++n;) h.keys["f" + p] = n, ++p;
    for (n = 64; 91 > ++n;) h.keys[String.fromCharCode(n).toLowerCase()] =
        n;
    var z = A.jwerty = {
        event: function(a, b, c) {
            if (m(b, "boolean")) {
                var e = b;
                b = function() {
                    return e
                }
            }
            a = new r(a);
            var d = 0,
                k = a.length - 1,
                f, g;
            return function(e) {
                (g = z.is(a, e, d)) ? d < k ? ++d : (f = b.call(c || this, e, g), !1 === f && e.preventDefault(), d = 0): d = z.is(a, e) ? 1 : 0
            }
        },
        is: function(a, b, c) {
            a = new r(a);
            a = a[c || 0];
            b = b.originalEvent || b;
            c = a.length;
            for (var e = !1; c--;) {
                var e = a[c].jwertyCombo,
                    d;
                for (d in a[c]) "jwertyCombo" !== d && b[d] != a[c][d] && (e = !1);
                if (!1 !== e) break
            }
            return e
        },
        key: function(a, b, c, e, d) {
            var f = m(c, "element") || m(c, "string") ? c :
                e,
                h = f === c ? u : c;
            c = f === c ? e : d;
            var g = m(f, "element") ? f : t(f, c),
                l = z.event(a, b, h);
            w(g, l);
            return {
                unbind: function() {
                    x(g, l)
                }
            }
        },
        fire: function(a, b, c, e) {
            a = new r(a);
            e = m(c, "number") ? c : e;
            y(m(b, "element") ? b : t(b, c), a[e || 0][0])
        },
        KEYS: h
    }
})("undefined" !== typeof global && global.window || this, "undefined" !== typeof module && module.exports ? module.exports : this);