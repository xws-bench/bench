var gapi = window.gapi = window.gapi || {};
gapi._bs = (new Date).getTime();
(function() {
    var e = window,
        c = document,
        k = e.location,
        m = function() {},
        a = /\[native code\]/,
        b = function(a, b, c) {
            return a[b] = a[b] || c
        },
        d = function(a) {
            for (var b = 0; b < this.length; b++)
                if (this[b] === a) return b;
            return -1
        },
        l = function(a) {
            a = a.sort();
            for (var b = [], c = void 0, f = 0; f < a.length; f++) {
                var d = a[f];
                d != c && b.push(d);
                c = d
            }
            return b
        },
        q = function() {
            var b;
            if ((b = Object.create) && a.test(b)) b = b(null);
            else {
                b = {};
                for (var c in b) b[c] = void 0
            }
            return b
        },
        u = b(e, "gapi", {}),
        x;
    x = b(e, "___jsl", q());
    b(x, "I", 0);
    b(x, "hel", 10);
    var f = function() {
            var a =
                k.href,
                b;
            if (x.dpo) b = x.h;
            else {
                b = x.h;
                var c = /([#].*&|[#])jsh=([^&#]*)/g,
                    f = /([?#].*&|[?#])jsh=([^&#]*)/g;
                if (a = a && (c.exec(a) || f.exec(a))) try {
                    b = decodeURIComponent(a[2])
                } catch (d) {}
            }
            return b
        },
        v = function(a) {
            var c = b(x, "PQ", []);
            x.PQ = [];
            var f = c.length;
            if (0 === f) a();
            else
                for (var d = 0, l = function() {
                        ++d === f && a()
                    }, v = 0; v < f; v++) c[v](l)
        },
        D = function(a) {
            return b(b(x, "H", q()), a, q())
        },
        z = b(x, "perf", q()),
        A = b(z, "g", q()),
        r = b(z, "i", q());
    b(z, "r", []);
    q();
    q();
    var B = function(a, b, c) {
            var f = z.r;
            "function" === typeof f ? f(a, b, c) : f.push([a,
                b, c
            ])
        },
        t = function(a, c, f) {
            c && 0 < c.length && (c = w(c), f && 0 < f.length && (c += "___" + w(f)), 28 < c.length && (c = c.substr(0, 28) + (c.length - 28)), f = c, c = b(r, "_p", q()), b(c, f, q())[a] = (new Date).getTime(), B(a, "_p", f))
        },
        w = function(a) {
            return a.join("__").replace(/\./g, "_").replace(/\-/g, "_").replace(/\,/g, "_")
        },
        E = q(),
        C = [],
        F = function(a) {
            throw Error("Bad hint" + (a ? ": " + a : ""));
        };
    C.push(["jsl", function(a) {
        for (var c in a)
            if (Object.prototype.hasOwnProperty.call(a, c)) {
                var f = a[c];
                "object" == typeof f ? x[c] = b(x, c, []).concat(f) : b(x, c, f)
            }
        if (c =
            a.u) a = b(x, "us", []), a.push(c), (c = /^https:(.*)$/.exec(c)) && a.push("http:" + c[1])
    }]);
    var J = /^(\/[a-zA-Z0-9_\-]+)+$/,
        P = /^[a-zA-Z0-9\-_\.,!]+$/,
        L = /^gapi\.loaded_[0-9]+$/,
        pa = /^[a-zA-Z0-9,._-]+$/,
        ka = function(a, b, c, f) {
            var d = a.split(";"),
                l = d.shift(),
                v = E[l],
                h = null;
            v ? h = v(d, b, c, f) : F("no hint processor for: " + l);
            h || F("failed to generate load url");
            b = h;
            c = b.match(O);
            (f = b.match(ba)) && 1 === f.length && V.test(b) && c && 1 === c.length || F("failed sanity: " + a);
            return h
        },
        qa = function(a, b, c, f) {
            a = sa(a);
            L.test(c) || F("invalid_callback");
            b = X(b);
            f = f && f.length ? X(f) : null;
            var d = function(a) {
                return encodeURIComponent(a).replace(/%2C/g, ",")
            };
            return [encodeURIComponent(a.g).replace(/%2C/g, ",").replace(/%2F/g, "/"), "/k=", d(a.version), "/m=", d(b), f ? "/exm=" + d(f) : "", "/rt=j/sv=1/d=1/ed=1", a.a ? "/am=" + d(a.a) : "", a.c ? "/rs=" + d(a.c) : "", a.f ? "/t=" + d(a.f) : "", "/cb=", d(c)].join("")
        },
        sa = function(a) {
            "/" !== a.charAt(0) && F("relative path");
            for (var b = a.substring(1).split("/"), c = []; b.length;) {
                a = b.shift();
                if (!a.length || 0 == a.indexOf(".")) F("empty/relative directory");
                else if (0 < a.indexOf("=")) {
                    b.unshift(a);
                    break
                }
                c.push(a)
            }
            a = {};
            for (var f = 0, d = b.length; f < d; ++f) {
                var l = b[f].split("="),
                    v = decodeURIComponent(l[0]),
                    h = decodeURIComponent(l[1]);
                2 == l.length && v && h && (a[v] = a[v] || h)
            }
            b = "/" + c.join("/");
            J.test(b) || F("invalid_prefix");
            c = R(a, "k", !0);
            f = R(a, "am");
            d = R(a, "rs");
            a = R(a, "t");
            return {
                g: b,
                version: c,
                a: f,
                c: d,
                f: a
            }
        },
        X = function(a) {
            for (var b = [], c = 0, f = a.length; c < f; ++c) {
                var d = a[c].replace(/\./g, "_").replace(/-/g, "_");
                pa.test(d) && b.push(d)
            }
            return b.join(",")
        },
        R = function(a, b, c) {
            a = a[b];
            !a && c && F("missing: " + b);
            if (a) {
                if (P.test(a)) return a;
                F("invalid: " + b)
            }
            return null
        },
        V = /^https?:\/\/[a-z0-9_.-]+\.google\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,
        ba = /\/cb=/g,
        O = /\/\//g,
        Z = function() {
            var a = f();
            if (!a) throw Error("Bad hint");
            return a
        };
    E.m = function(a, b, c, f) {
        (a = a[0]) || F("missing_hint");
        return "https://apis.google.com" + qa(a, b, c, f)
    };
    var ca = decodeURI("%73cript"),
        W = function(a, b) {
            for (var c = [], f = 0; f < a.length; ++f) {
                var l = a[f];
                l && 0 > d.call(b, l) && c.push(l)
            }
            return c
        },
        ta = function(a) {
            "loading" != c.readyState ?
                wa(a) : c.write("<" + ca + ' src="' + encodeURI(a) + '"></' + ca + ">")
        },
        wa = function(a) {
            var b = c.createElement(ca);
            b.setAttribute("src", a);
            b.async = "true";
            (a = c.getElementsByTagName(ca)[0]) ? a.parentNode.insertBefore(b, a): (c.head || c.body || c.documentElement).appendChild(b)
        },
        aa = function(a, b) {
            var c = b && b._c;
            if (c)
                for (var f = 0; f < C.length; f++) {
                    var d = C[f][0],
                        l = C[f][1];
                    l && Object.prototype.hasOwnProperty.call(c, d) && l(c[d], a, b)
                }
        },
        ga = function(a, c, d) {
            da(function() {
                var d;
                d = c === f() ? b(u, "_", q()) : q();
                d = b(D(c), "_", d);
                a(d)
            }, d)
        },
        oa = function(a,
            c) {
            var f = c || {};
            "function" == typeof c && (f = {}, f.callback = c);
            aa(a, f);
            var d = a ? a.split(":") : [],
                l = f.h || Z(),
                v = b(x, "ah", q());
            if (v["::"] && d.length) {
                for (var e = [], h = null; h = d.shift();) {
                    var k = h.split("."),
                        k = v[h] || v[k[1] && "ns:" + k[0] || ""] || l,
                        w = e.length && e[e.length - 1] || null,
                        u = w;
                    w && w.hint == k || (u = {
                        hint: k,
                        b: []
                    }, e.push(u));
                    u.b.push(h)
                }
                var t = e.length;
                if (1 < t) {
                    var r = f.callback;
                    r && (f.callback = function() {
                        0 == --t && r()
                    })
                }
                for (; d = e.shift();) ea(d.b, f, d.hint)
            } else ea(d || [], f, l)
        },
        ea = function(a, c, f) {
            a = l(a) || [];
            var d = c.callback,
                k = c.config,
                w = c.timeout,
                q = c.ontimeout,
                h = c.onerror,
                r = void 0;
            "function" == typeof h && (r = h);
            var B = null,
                P = !1;
            if (w && !q || !w && q) throw "Timeout requires both the timeout parameter and ontimeout parameter to be set";
            var h = b(D(f), "r", []).sort(),
                J = b(D(f), "L", []).sort(),
                z = [].concat(h),
                C = function(h, a) {
                    if (P) return 0;
                    e.clearTimeout(B);
                    J.push.apply(J, E);
                    var c = ((u || {}).config || {}).update;
                    c ? c(k) : k && b(x, "cu", []).push(k);
                    if (a) {
                        t("me0", h, z);
                        try {
                            ga(a, f, r)
                        } finally {
                            t("me1", h, z)
                        }
                    }
                    return 1
                };
            0 < w && (B = e.setTimeout(function() {
                P = !0;
                q()
            }, w));
            var E = W(a, J);
            if (E.length) {
                var E = W(a, h),
                    da = b(x, "CP", []),
                    L = da.length;
                da[L] = function(h) {
                    if (!h) return 0;
                    t("ml1", E, z);
                    var a = function(a) {
                            da[L] = null;
                            C(E, h) && v(function() {
                                d && d();
                                a()
                            })
                        },
                        b = function() {
                            var h = da[L + 1];
                            h && h()
                        };
                    0 < L && da[L - 1] ? da[L] = function() {
                        a(b)
                    } : a(b)
                };
                if (E.length) {
                    var A = "loaded_" + x.I++;
                    u[A] = function(h) {
                        da[L](h);
                        u[A] = null
                    };
                    a = ka(f, E, "gapi." + A, h);
                    h.push.apply(h, E);
                    t("ml0", E, z);
                    c.sync || e.___gapisync ? ta(a) : wa(a)
                } else da[L](m)
            } else C(E) && d && d()
        },
        da = function(a, b) {
            if (x.hee && 0 < x.hel) try {
                return a()
            } catch (c) {
                b &&
                    b(c), x.hel--, oa("debug_error", function() {
                        try {
                            window.___jsl.hefn(c)
                        } catch (a) {
                            throw c;
                        }
                    })
            } else try {
                return a()
            } catch (f) {
                throw b && b(f), f;
            }
        };
    u.load = function(a, b) {
        return da(function() {
            return oa(a, b)
        })
    };
    A.bs0 = window.gapi._bs || (new Date).getTime();
    B("bs0");
    A.bs1 = (new Date).getTime();
    B("bs1");
    delete window.gapi._bs
})();
gapi.load("", {
    callback: window.gapi_onload,
    _c: {
        jsl: {
            ci: {
                deviceType: "desktop",
                "oauth-flow": {
                    authUrl: "https://accounts.google.com/o/oauth2/auth",
                    proxyUrl: "https://accounts.google.com/o/oauth2/postmessageRelay",
                    disableOpt: !0,
                    idpIframeUrl: "https://accounts.google.com/o/oauth2/iframe",
                    usegapi: !1
                },
                debug: {
                    reportExceptionRate: .05,
                    forceIm: !1,
                    rethrowException: !1,
                    host: "https://apis.google.com"
                },
                lexps: [81, 97, 100, 122, 124, 30, 79, 127],
                enableMultilogin: !0,
                "googleapis.config": {
                    auth: {
                        useFirstPartyAuthV2: !1
                    }
                },
                isPlusUser: !1,
                inline: {
                    css: 1
                },
                disableRealtimeCallback: !1,
                drive_share: {
                    skipInitCommand: !0
                },
                csi: {
                    rate: .01
                },
                report: {
                    apiRate: {
                        "gapi\\.signin\\..*": .05,
                        "gapi\\.signin2\\..*": .05
                    },
                    apis: ["iframes\\..*", "gadgets\\..*", "gapi\\.appcirclepicker\\..*", "gapi\\.auth\\..*", "gapi\\.client\\..*"],
                    rate: .001,
                    host: "https://apis.google.com"
                },
                client: {
                    headers: {
                        request: "Accept Accept-Language Authorization Cache-Control Content-Disposition Content-Encoding Content-Language Content-Length Content-MD5 Content-Range Content-Type Date GData-Version Host If-Match If-Modified-Since If-None-Match If-Unmodified-Since Origin OriginToken Pragma Range Slug Transfer-Encoding Want-Digest X-ClientDetails X-GData-Client X-GData-Key X-Goog-AuthUser X-Goog-PageId X-Goog-Encode-Response-If-Executable X-Goog-Correlation-Id X-Goog-Request-Info X-Goog-Experiments x-goog-iam-authority-selector x-goog-iam-authorization-token X-Goog-Spatula X-Goog-Upload-Command X-Goog-Upload-Content-Disposition X-Goog-Upload-Content-Length X-Goog-Upload-Content-Type X-Goog-Upload-File-Name X-Goog-Upload-Offset X-Goog-Upload-Protocol X-Goog-Visitor-Id X-HTTP-Method-Override X-JavaScript-User-Agent X-Pan-Versionid X-Origin X-Referer X-Upload-Content-Length X-Upload-Content-Type X-Use-HTTP-Status-Code-Override X-Ios-Bundle-Identifier X-Android-Package X-YouTube-VVT X-YouTube-Page-CL X-YouTube-Page-Timestamp".split(" "),
                        response: "Digest Cache-Control Content-Disposition Content-Encoding Content-Language Content-Length Content-MD5 Content-Range Content-Type Date ETag Expires Last-Modified Location Pragma Range Server Transfer-Encoding WWW-Authenticate Vary Unzipped-Content-MD5 X-Goog-Generation X-Goog-Metageneration X-Goog-Safety-Content-Type X-Goog-Safety-Encoding X-Google-Trace X-Goog-Upload-Chunk-Granularity X-Goog-Upload-Control-URL X-Goog-Upload-Size-Received X-Goog-Upload-Status X-Goog-Upload-URL X-Goog-Diff-Download-Range X-Goog-Hash X-Goog-Updated-Authorization X-Server-Object-Version X-Guploader-Customer X-Guploader-Upload-Result X-Guploader-Uploadid X-Google-Gfe-Backend-Request-Cost".split(" ")
                    },
                    rms: "migrated",
                    cors: !1
                },
                isLoggedIn: !1,
                signInDeprecation: {
                    rate: 0
                },
                include_granted_scopes: !0,
                llang: "fr",
                iframes: {
                    youtube: {
                        params: {
                            location: ["search", "hash"]
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi=1",
                        methods: ["scroll", "openwindow"]
                    },
                    ytsubscribe: {
                        url: "https://www.youtube.com/subscribe_embed?usegapi=1"
                    },
                    plus_circle: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi=1"
                    },
                    plus_share: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare=true&usegapi=1"
                    },
                    rbr_s: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller"
                    },
                    udc_webconsentflow: {
                        params: {
                            url: ""
                        },
                        url: "https://www.google.com/settings/webconsent?usegapi=1"
                    },
                    ":source:": "3p",
                    playemm: {
                        url: "https://play.google.com/work?usegapi=1&usegapi=1"
                    },
                    blogger: {
                        params: {
                            location: ["search", "hash"]
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi=1",
                        methods: ["scroll", "openwindow"]
                    },
                    evwidget: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix:_/events/widget?usegapi=1"
                    },
                    partnersbadge: {
                        url: "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi=1"
                    },
                    ":socialhost:": "https://apis.google.com",
                    shortlists: {
                        url: ""
                    },
                    hangout: {
                        url: "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget"
                    },
                    plus_followers: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/_/im/_/widget/render/plus/followers?usegapi=1"
                    },
                    post: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi=1"
                    },
                    ":gplus_url:": "https://plus.google.com",
                    signin: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/signin?usegapi=1",
                        methods: ["onauth"]
                    },
                    rbr_i: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation"
                    },
                    donation: {
                        url: "https://onetoday.google.com/home/donationWidget?usegapi=1"
                    },
                    share: {
                        url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi=1"
                    },
                    plusone: {
                        params: {
                            count: "",
                            size: "",
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi=1"
                    },
                    comments: {
                        params: {
                            location: ["search", "hash"]
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/comments?usegapi=1",
                        methods: ["scroll", "openwindow"]
                    },
                    ":im_socialhost:": "https://plus.googleapis.com",
                    backdrop: {
                        url: "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi=1"
                    },
                    visibility: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi=1"
                    },
                    autocomplete: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/autocomplete"
                    },
                    additnow: {
                        url: "https://apis.google.com/additnow/additnow.html?usegapi=1",
                        methods: ["launchurl"]
                    },
                    ":signuphost:": "https://plus.google.com",
                    appcirclepicker: {
                        url: ":socialhost:/:session_prefix:_/widget/render/appcirclepicker"
                    },
                    follow: {
                        url: ":socialhost:/:session_prefix:_/widget/render/follow?usegapi=1"
                    },
                    community: {
                        url: ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi=1"
                    },
                    sharetoclassroom: {
                        url: "https://www.gstatic.com/classroom/sharewidget/widget_stable.html?usegapi=1"
                    },
                    ytshare: {
                        params: {
                            url: ""
                        },
                        url: ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi=1"
                    },
                    plus: {
                        url: ":socialhost:/:session_prefix:_/widget/render/badge?usegapi=1"
                    },
                    family_creation: {
                        params: {
                            url: ""
                        },
                        url: "https://families.google.com/webcreation?usegapi=1&usegapi=1"
                    },
                    commentcount: {
                        url: ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi=1"
                    },
                    configurator: {
                        url: ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi=1"
                    },
                    zoomableimage: {
                        url: "https://ssl.gstatic.com/microscope/embed/"
                    },
                    savetowallet: {
                        url: "https://clients5.google.com/s2w/o/savetowallet"
                    },
                    person: {
                        url: ":socialhost:/:session_prefix:_/widget/render/person?usegapi=1"
                    },
                    savetodrive: {
                        url: "https://drive.google.com/savetodrivebutton?usegapi=1",
                        methods: ["save"]
                    },
                    page: {
                        url: ":socialhost:/:session_prefix:_/widget/render/page?usegapi=1"
                    },
                    card: {
                        url: ":socialhost:/:session_prefix:_/hovercard/card"
                    }
                }
            },
            h: "m;/_/scs/apps-static/_/js/k=oz.gapi.fr.RtN3VtG2yac.O/m=__features__/am=EQ/rt=j/d=1/rs=AGLTcCNh3CUzUyRhab3nnFmD-mmgi7MvpA",
            u: "https://apis.google.com/js/api.js",
            hee: !0,
            fp: "8e93d657eacdccd49a48df518caca05fc0f47051",
            dpo: !1
        },
        fp: "8e93d657eacdccd49a48df518caca05fc0f47051",
        annotation: ["interactivepost", "recobar", "signin2", "autocomplete", "profile"],
        bimodal: ["signin",
            "share"
        ]
    }
});
! function(e) {
    var c, k, m = /[\.\/]/,
        a = /\s*,\s*/,
        b = function(a, b) {
            return a - b
        },
        d = {
            n: {}
        },
        l = function() {
            for (var a = 0, b = this.length; b > a; a++)
                if ("undefined" != typeof this[a]) return this[a]
        },
        q = function() {
            for (var a = this.length; --a;)
                if ("undefined" != typeof this[a]) return this[a]
        },
        u = function(a, f) {
            a = String(a);
            var d, e = k,
                m = Array.prototype.slice.call(arguments, 2),
                A = u.listeners(a),
                r = 0,
                B = [],
                t = {},
                w = [],
                E = c;
            w.firstDefined = l;
            w.lastDefined = q;
            c = a;
            for (var C = k = 0, F = A.length; F > C; C++) "zIndex" in A[C] && (B.push(A[C].zIndex), 0 > A[C].zIndex &&
                (t[A[C].zIndex] = A[C]));
            for (B.sort(b); 0 > B[r];)
                if (d = t[B[r++]], w.push(d.apply(f, m)), k) return k = e, w;
            for (C = 0; F > C; C++)
                if (d = A[C], "zIndex" in d)
                    if (d.zIndex == B[r]) {
                        if (w.push(d.apply(f, m)), k) break;
                        do
                            if (r++, d = t[B[r]], d && w.push(d.apply(f, m)), k) break; while (d)
                    } else t[d.zIndex] = d;
            else if (w.push(d.apply(f, m)), k) break;
            return k = e, c = E, w
        };
    u._events = d;
    u.listeners = function(a) {
        var b, c, l, e, k, u, q, t = a.split(m);
        b = d;
        var w = [b],
            E = [];
        a = 0;
        for (e = t.length; e > a; a++) {
            q = [];
            k = 0;
            for (u = w.length; u > k; k++)
                for (b = w[k].n, c = [b[t[a]], b["*"]], l =
                    2; l--;)(b = c[l]) && (q.push(b), E = E.concat(b.f || []));
            w = q
        }
        return E
    };
    u.on = function(b, c) {
        if (b = String(b), "function" != typeof c) return function() {};
        for (var l = b.split(a), e = 0, k = l.length; k > e; e++) ! function(a) {
            var b;
            a = a.split(m);
            for (var l = d, e = 0, v = a.length; v > e; e++) l = l.n, l = l.hasOwnProperty(a[e]) && l[a[e]] || (l[a[e]] = {
                n: {}
            });
            l.f = l.f || [];
            e = 0;
            for (v = l.f.length; v > e; e++)
                if (l.f[e] == c) {
                    b = !0;
                    break
                }!b && l.f.push(c)
        }(l[e]);
        return function(a) {
            +a == +a && (c.zIndex = +a)
        }
    };
    u.f = function(a) {
        var b = [].slice.call(arguments, 1);
        return function() {
            u.apply(null, [a, null].concat(b).concat([].slice.call(arguments, 0)))
        }
    };
    u.stop = function() {
        k = 1
    };
    u.nt = function(a) {
        return a ? (new RegExp("(?:\\.|\\/|^)" + a + "(?:\\.|\\/|$)")).test(c) : c
    };
    u.nts = function() {
        return c.split(m)
    };
    u.off = u.unbind = function(b, c) {
        if (!b) return void(u._events = d = {
            n: {}
        });
        var l = b.split(a);
        if (1 < l.length)
            for (var e = 0, k = l.length; k > e; e++) u.off(l[e], c);
        else {
            for (var l = b.split(m), q, r, B, t, w = [d], e = 0, k = l.length; k > e; e++)
                for (t = 0; t < w.length; t += B.length - 2) {
                    if (B = [t, 1], q = w[t].n, "*" != l[e]) q[l[e]] && B.push(q[l[e]]);
                    else
                        for (r in q) q.hasOwnProperty(r) &&
                            B.push(q[r]);
                    w.splice.apply(w, B)
                }
            e = 0;
            for (k = w.length; k > e; e++)
                for (q = w[e]; q.n;) {
                    if (c) {
                        if (q.f) {
                            t = 0;
                            for (l = q.f.length; l > t; t++)
                                if (q.f[t] == c) {
                                    q.f.splice(t, 1);
                                    break
                                }!q.f.length && delete q.f
                        }
                        for (r in q.n)
                            if (q.n.hasOwnProperty(r) && q.n[r].f) {
                                B = q.n[r].f;
                                t = 0;
                                for (l = B.length; l > t; t++)
                                    if (B[t] == c) {
                                        B.splice(t, 1);
                                        break
                                    }!B.length && delete q.n[r].f
                            }
                    } else
                        for (r in delete q.f, q.n) q.n.hasOwnProperty(r) && q.n[r].f && delete q.n[r].f;
                    q = q.n
                }
        }
    };
    u.once = function(a, b) {
        var c = function() {
            return u.unbind(a, c), b.apply(this, arguments)
        };
        return u.on(a,
            c)
    };
    u.version = "0.4.2";
    u.toString = function() {
        return "You are running Eve 0.4.2"
    };
    "undefined" != typeof module && module.exports ? module.exports = u : "function" == typeof define && define.amd ? define("eve", [], function() {
        return u
    }) : e.eve = u
}(this);
(function(e, c) {
    if ("function" == typeof define && define.amd) define(["eve"], function(k) {
        return c(e, k)
    });
    else if ("undefined" != typeof exports) {
        var k = require("eve");
        module.exports = c(e, k)
    } else c(e, e.eve)
})(window || this, function(e, c) {
    var k = function(a) {
            var b = {},
                c = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(a) {
                    setTimeout(a, 16)
                },
                l = Array.isArray || function(a) {
                    return a instanceof Array || "[object Array]" == Object.prototype.toString.call(a)
                },
                k = 0,
                u = "M" + (+new Date).toString(36),
                m = function(a) {
                    if (null == a) return this.s;
                    var b = this.s - a;
                    this.b += this.dur * b;
                    this.B += this.dur * b;
                    this.s = a
                },
                f = function(a) {
                    return null == a ? this.spd : void(this.spd = a)
                },
                v = function(a) {
                    return null == a ? this.dur : (this.s = this.s * a / this.dur, void(this.dur = a))
                },
                D = function() {
                    delete b[this.id];
                    this.update();
                    a("mina.stop." + this.id, this)
                },
                z = function() {
                    this.pdif || (delete b[this.id], this.update(), this.pdif = this.get() - this.b)
                },
                A = function() {
                    this.pdif && (this.b = this.get() - this.pdif, delete this.pdif,
                        b[this.id] = this)
                },
                r = function() {
                    var a;
                    if (l(this.start)) {
                        a = [];
                        for (var b = 0, c = this.start.length; c > b; b++) a[b] = +this.start[b] + (this.end[b] - this.start[b]) * this.easing(this.s)
                    } else a = +this.start + (this.end - this.start) * this.easing(this.s);
                    this.set(a)
                },
                B = function() {
                    var f = 0,
                        l;
                    for (l in b)
                        if (b.hasOwnProperty(l)) {
                            var e = b[l],
                                k = e.get();
                            f++;
                            e.s = (k - e.b) / (e.dur / e.spd);
                            1 <= e.s && (delete b[l], e.s = 1, f--, function(b) {
                                setTimeout(function() {
                                    a("mina.finish." + b.id, b)
                                })
                            }(e));
                            e.update()
                        }
                    f && c(B)
                },
                t = function(a, l, e, F, J, P, L) {
                    a = {
                        id: u +
                            (k++).toString(36),
                        start: a,
                        end: l,
                        b: e,
                        s: 0,
                        dur: F - e,
                        spd: 1,
                        get: J,
                        set: P,
                        easing: L || t.linear,
                        status: m,
                        speed: f,
                        duration: v,
                        stop: D,
                        pause: z,
                        resume: A,
                        update: r
                    };
                    b[a.id] = a;
                    var pa;
                    l = 0;
                    for (pa in b)
                        if (b.hasOwnProperty(pa) && (l++, 2 == l)) break;
                    return 1 == l && c(B), a
                };
            return t.time = Date.now || function() {
                return +new Date
            }, t.getById = function(a) {
                return b[a] || null
            }, t.linear = function(a) {
                return a
            }, t.easeout = function(a) {
                return Math.pow(a, 1.7)
            }, t.easein = function(a) {
                return Math.pow(a, .48)
            }, t.easeinout = function(a) {
                if (1 == a) return 1;
                if (0 ==
                    a) return 0;
                var b = .48 - a / 1.04,
                    c = Math.sqrt(.1734 + b * b);
                a = c - b;
                a = Math.pow(Math.abs(a), 1 / 3) * (0 > a ? -1 : 1);
                b = -c - b;
                b = Math.pow(Math.abs(b), 1 / 3) * (0 > b ? -1 : 1);
                a = a + b + .5;
                return 3 * (1 - a) * a * a + a * a * a
            }, t.backin = function(a) {
                return 1 == a ? 1 : a * a * (2.70158 * a - 1.70158)
            }, t.backout = function(a) {
                if (0 == a) return 0;
                --a;
                return a * a * (2.70158 * a + 1.70158) + 1
            }, t.elastic = function(a) {
                return a == !!a ? a : Math.pow(2, -10 * a) * Math.sin(2 * (a - .075) * Math.PI / .3) + 1
            }, t.bounce = function(a) {
                var b;
                return 1 / 2.75 > a ? b = 7.5625 * a * a : 2 / 2.75 > a ? (a -= 1.5 / 2.75, b = 7.5625 * a * a + .75) :
                    2.5 / 2.75 > a ? (a -= 2.25 / 2.75, b = 7.5625 * a * a + .9375) : (a -= 2.625 / 2.75, b = 7.5625 * a * a + .984375), b
            }, e.mina = t, t
        }("undefined" == typeof c ? function() {} : c),
        m = function(a) {
            function b(h, a) {
                if (h) {
                    if (h.nodeType) return t(h);
                    if (l(h, "array") && b.set) return b.set.apply(b, h);
                    if (h instanceof z) return h;
                    if (null == a) return h = E.doc.querySelector(String(h)), t(h)
                }
                return h = null == h ? "100%" : h, a = null == a ? "100%" : a, new B(h, a)
            }

            function d(h, a) {
                if (a) {
                    if ("#text" == h && (h = E.doc.createTextNode(a.text || a["#text"] || "")), "#comment" == h && (h = E.doc.createComment(a.text ||
                            a["#text"] || "")), "string" == typeof h && (h = d(h)), "string" == typeof a) return 1 == h.nodeType ? "xlink:" == a.substring(0, 6) ? h.getAttributeNS(ga, a.substring(6)) : "xml:" == a.substring(0, 4) ? h.getAttributeNS(oa, a.substring(4)) : h.getAttribute(a) : "text" == a ? h.nodeValue : null;
                    if (1 == h.nodeType)
                        for (var b in a) {
                            if (a[C](b)) {
                                var c = F(a[b]);
                                c ? "xlink:" == b.substring(0, 6) ? h.setAttributeNS(ga, b.substring(6), c) : "xml:" == b.substring(0, 4) ? h.setAttributeNS(oa, b.substring(4), c) : h.setAttribute(b, c) : h.removeAttribute(b)
                            }
                        } else "text" in a &&
                            (h.nodeValue = a.text)
                } else h = E.doc.createElementNS(oa, h);
                return h
            }

            function l(h, a) {
                return a = F.prototype.toLowerCase.call(a), "finite" == a ? isFinite(h) : "array" == a && (h instanceof Array || Array.isArray && Array.isArray(h)) ? !0 : "null" == a && null === h || a == typeof h && null !== h || "object" == a && h === Object(h) || R.call(h).slice(8, -1).toLowerCase() == a
            }

            function e(h) {
                if ("function" == typeof h || Object(h) !== h) return h;
                var a = new h.constructor,
                    b;
                for (b in h) h[C](b) && (a[b] = e(h[b]));
                return a
            }

            function k(h, a, b) {
                function c() {
                    var d = Array.prototype.slice.call(arguments,
                            0),
                        f = d.join("\u2400"),
                        l = c.cache = c.cache || {},
                        e = c.count = c.count || [];
                    if (l[C](f)) {
                        a: for (var d = e, e = f, k = 0, v = d.length; v > k; k++)
                            if (d[k] === e) {
                                d.push(d.splice(k, 1)[0]);
                                break a
                            }f = b ? b(l[f]) : l[f]
                    }
                    else f = (1E3 <= e.length && delete l[e.shift()], e.push(f), l[f] = h.apply(a, d), b ? b(l[f]) : l[f]);
                    return f
                }
                return c
            }

            function m(h, a, b, c, f, d) {
                return null == f ? (h -= b, a -= c, h || a ? (180 * L.atan2(-a, -h) / sa + 540) % 360 : 0) : m(h, a, f, d) - m(b, c, f, d)
            }

            function f(h) {
                return h % 360 * sa / 180
            }

            function v(h) {
                return h.node.ownerSVGElement && t(h.node.ownerSVGElement) ||
                    b.select("svg")
            }

            function D(h) {
                l(h, "array") || (h = Array.prototype.slice.call(arguments, 0));
                for (var a = 0, b = 0, c = this.node; this[a];) delete this[a++];
                for (a = 0; a < h.length; a++) "set" == h[a].type ? h[a].forEach(function(h) {
                    c.appendChild(h.node)
                }) : c.appendChild(h[a].node);
                for (var f = c.childNodes, a = 0; a < f.length; a++) this[b++] = t(f[a]);
                return this
            }

            function z(h) {
                if (h.snap in ea) return ea[h.snap];
                var a;
                try {
                    a = h.ownerSVGElement
                } catch (b) {}
                this.node = h;
                a && (this.paper = new B(a));
                this.type = h.tagName || h.nodeName;
                a = this.id = aa(this);
                if (this.anims = {}, this._ = {
                        transform: []
                    }, h.snap = a, ea[a] = this, "g" == this.type && (this.add = D), this.type in {
                        g: 1,
                        mask: 1,
                        pattern: 1,
                        symbol: 1
                    })
                    for (var c in B.prototype) B.prototype[C](c) && (this[c] = B.prototype[c])
            }

            function A(h) {
                this.node = h
            }

            function r(h, a) {
                var b = d(h);
                a.appendChild(b);
                return t(b)
            }

            function B(h, a) {
                var b, c, f, l = B.prototype;
                if (h && "svg" == h.tagName) {
                    if (h.snap in ea) return ea[h.snap];
                    var e = h.ownerDocument;
                    b = new z(h);
                    c = h.getElementsByTagName("desc")[0];
                    f = h.getElementsByTagName("defs")[0];
                    c || (c = d("desc"),
                        c.appendChild(e.createTextNode("Created with Snap")), b.node.appendChild(c));
                    f || (f = d("defs"), b.node.appendChild(f));
                    b.defs = f;
                    for (var k in l) l[C](k) && (b[k] = l[k]);
                    b.paper = b.root = b
                } else b = r("svg", E.doc.body), d(b.node, {
                    height: a,
                    version: 1.1,
                    width: h,
                    xmlns: oa
                });
                return b
            }

            function t(h) {
                return h ? h instanceof z || h instanceof A ? h : h.tagName && "svg" == h.tagName.toLowerCase() ? new B(h) : h.tagName && "object" == h.tagName.toLowerCase() && "image/svg+xml" == h.type ? new B(h.contentDocument.getElementsByTagName("svg")[0]) : new z(h) :
                    h
            }

            function w(h, a) {
                for (var b = 0, c = h.length; c > b; b++) {
                    var f = {
                            type: h[b].type,
                            attr: h[b].attr()
                        },
                        d = h[b].children();
                    a.push(f);
                    d.length && w(d, f.childNodes = [])
                }
            }
            b.version = "0.4.0";
            b.toString = function() {
                return "Snap v" + this.version
            };
            b._ = {};
            var E = {
                win: a.window,
                doc: a.window.document
            };
            b._.glob = E;
            var C = "hasOwnProperty",
                F = String,
                J = parseFloat,
                P = parseInt,
                L = Math,
                pa = L.max,
                ka = L.min,
                qa = L.abs,
                sa = (L.pow, L.PI),
                X = (L.round, ""),
                R = Object.prototype.toString,
                V = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
                ba = (b._.separator = /[,\s]+/, /[\s]*,[\s]*/),
                O = {
                    hs: 1,
                    rg: 1
                },
                Z = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
                ca = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
                W = /(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/gi,
                ta = 0,
                wa = "S" + (+new Date).toString(36),
                aa = function(h) {
                    return (h && h.type ? h.type : X) + wa + (ta++).toString(36)
                },
                ga = "http://www.w3.org/1999/xlink",
                oa = "http://www.w3.org/2000/svg",
                ea = {};
            b.url = function(h) {
                return "url('#" + h + "')"
            };
            b._.$ = d;
            b._.id = aa;
            b.format = function() {
                var h = /\{([^\}]+)\}/g,
                    a = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
                    b = function(h, b, c) {
                        var f = c;
                        return b.replace(a, function(h, a, b, c, d) {
                            a = a || c;
                            f && (a in f && (f = f[a]), "function" == typeof f && d && (f = f()))
                        }), f = (null == f || f == c ? h : f) + ""
                    };
                return function(a, c) {
                    return F(a).replace(h, function(h, a) {
                        return b(h, a, c)
                    })
                }
            }();
            b._.clone = e;
            b._.cacher = k;
            b.rad = f;
            b.deg = function(h) {
                return 180 * h / sa % 360
            };
            b.sin = function(h) {
                return L.sin(b.rad(h))
            };
            b.tan = function(h) {
                return L.tan(b.rad(h))
            };
            b.cos = function(h) {
                return L.cos(b.rad(h))
            };
            b.asin = function(h) {
                return b.deg(L.asin(h))
            };
            b.acos = function(h) {
                return b.deg(L.acos(h))
            };
            b.atan = function(h) {
                return b.deg(L.atan(h))
            };
            b.atan2 = function(h) {
                return b.deg(L.atan2(h))
            };
            b.angle = m;
            b.len = function(h, a, c, f) {
                return Math.sqrt(b.len2(h, a, c, f))
            };
            b.len2 = function(h, a, b, c) {
                return (h - b) * (h - b) + (a - c) * (a - c)
            };
            b.closestPoint = function(h, a, b) {
                function c(h) {
                    var f = h.x - a;
                    h = h.y - b;
                    return f * f + h * h
                }
                var f, d, l, e;
                h = h.node;
                for (var k = h.getTotalLength(), v = k / h.pathSegList.numberOfItems * .125, q = 1 / 0, u = 0; k >= u; u += v)(e = c(l = h.getPointAtLength(u))) < q && (f = l, d = u, q = e);
                for (v *=
                    .5; .5 < v;) {
                    var t, m, r, w, x, P;
                    0 <= (r = d - v) && (x = c(t = h.getPointAtLength(r))) < q ? (f = t, d = r, q = x) : (w = d + v) <= k && (P = c(m = h.getPointAtLength(w))) < q ? (f = m, d = w, q = P) : v *= .5
                }
                return f = {
                    x: f.x,
                    y: f.y,
                    length: d,
                    distance: Math.sqrt(q)
                }
            };
            b.is = l;
            b.snapTo = function(h, a, b) {
                if (b = l(b, "finite") ? b : 10, l(h, "array"))
                    for (var c = h.length; c--;) {
                        if (qa(h[c] - a) <= b) return h[c]
                    } else {
                        h = +h;
                        c = a % h;
                        if (b > c) return a - c;
                        if (c > h - b) return a - c + h
                    }
                return a
            };
            b.getRGB = k(function(h) {
                    if (!h || (h = F(h)).indexOf("-") + 1) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: Ba
                    };
                    if ("none" == h) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        toString: Ba
                    };
                    if (!(O[C](h.toLowerCase().substring(0, 2)) || "#" == h.charAt()) && (h = da(h)), !h) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: Ba
                    };
                    var a, c, f, d, e, k;
                    return (h = h.match(V)) ? (h[2] && (f = P(h[2].substring(5), 16), c = P(h[2].substring(3, 5), 16), a = P(h[2].substring(1, 3), 16)), h[3] && (f = P((e = h[3].charAt(3)) + e, 16), c = P((e = h[3].charAt(2)) + e, 16), a = P((e = h[3].charAt(1)) + e, 16)), h[4] && (k = h[4].split(ba), a = J(k[0]), "%" == k[0].slice(-1) && (a *= 2.55), c = J(k[1]), "%" == k[1].slice(-1) &&
                        (c *= 2.55), f = J(k[2]), "%" == k[2].slice(-1) && (f *= 2.55), "rgba" == h[1].toLowerCase().slice(0, 4) && (d = J(k[3])), k[3] && "%" == k[3].slice(-1) && (d /= 100)), h[5] ? (k = h[5].split(ba), a = J(k[0]), "%" == k[0].slice(-1) && (a /= 100), c = J(k[1]), "%" == k[1].slice(-1) && (c /= 100), f = J(k[2]), "%" == k[2].slice(-1) && (f /= 100), ("deg" == k[0].slice(-3) || "\u00b0" == k[0].slice(-1)) && (a /= 360), "hsba" == h[1].toLowerCase().slice(0, 4) && (d = J(k[3])), k[3] && "%" == k[3].slice(-1) && (d /= 100), b.hsb2rgb(a, c, f, d)) : h[6] ? (k = h[6].split(ba), a = J(k[0]), "%" == k[0].slice(-1) &&
                        (a /= 100), c = J(k[1]), "%" == k[1].slice(-1) && (c /= 100), f = J(k[2]), "%" == k[2].slice(-1) && (f /= 100), ("deg" == k[0].slice(-3) || "\u00b0" == k[0].slice(-1)) && (a /= 360), "hsla" == h[1].toLowerCase().slice(0, 4) && (d = J(k[3])), k[3] && "%" == k[3].slice(-1) && (d /= 100), b.hsl2rgb(a, c, f, d)) : (a = ka(L.round(a), 255), c = ka(L.round(c), 255), f = ka(L.round(f), 255), d = ka(pa(d, 0), 1), h = {
                        r: a,
                        g: c,
                        b: f,
                        toString: Ba
                    }, h.hex = "#" + (16777216 | f | c << 8 | a << 16).toString(16).slice(1), h.opacity = l(d, "finite") ? d : 1, h)) : {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: Ba
                    }
                },
                b);
            b.hsb = k(function(a, c, f) {
                return b.hsb2rgb(a, c, f).hex
            });
            b.hsl = k(function(a, c, f) {
                return b.hsl2rgb(a, c, f).hex
            });
            b.rgb = k(function(a, b, c, f) {
                if (l(f, "finite")) {
                    var d = L.round;
                    return "rgba(" + [d(a), d(b), d(c), +f.toFixed(2)] + ")"
                }
                return "#" + (16777216 | c | b << 8 | a << 16).toString(16).slice(1)
            });
            var da = function(a) {
                    var b = E.doc.getElementsByTagName("head")[0] || E.doc.getElementsByTagName("svg")[0];
                    return (da = k(function(a) {
                        if ("red" == a.toLowerCase()) return "rgb(255, 0, 0)";
                        b.style.color = "rgb(255, 0, 0)";
                        b.style.color = a;
                        a = E.doc.defaultView.getComputedStyle(b,
                            X).getPropertyValue("color");
                        return "rgb(255, 0, 0)" == a ? null : a
                    }))(a)
                },
                hb = function() {
                    return "hsb(" + [this.h, this.s, this.b] + ")"
                },
                Oa = function() {
                    return "hsl(" + [this.h, this.s, this.l] + ")"
                },
                Ba = function() {
                    return 1 == this.opacity || null == this.opacity ? this.hex : "rgba(" + [this.r, this.g, this.b, this.opacity] + ")"
                },
                Ma = function(a, c, f) {
                    if (null == c && l(a, "object") && "r" in a && "g" in a && "b" in a && (f = a.b, c = a.g, a = a.r), null == c && l(a, string)) f = b.getRGB(a), a = f.r, c = f.g, f = f.b;
                    return (1 < a || 1 < c || 1 < f) && (a /= 255, c /= 255, f /= 255), [a, c, f]
                },
                qb = function(a,
                    c, f, d) {
                    a = L.round(255 * a);
                    c = L.round(255 * c);
                    f = L.round(255 * f);
                    a = {
                        r: a,
                        g: c,
                        b: f,
                        opacity: l(d, "finite") ? d : 1,
                        hex: b.rgb(a, c, f),
                        toString: Ba
                    };
                    return l(d, "finite") && (a.opacity = d), a
                };
            b.color = function(a) {
                var c;
                return l(a, "object") && "h" in a && "s" in a && "b" in a ? (c = b.hsb2rgb(a), a.r = c.r, a.g = c.g, a.b = c.b, a.opacity = 1, a.hex = c.hex) : l(a, "object") && "h" in a && "s" in a && "l" in a ? (c = b.hsl2rgb(a), a.r = c.r, a.g = c.g, a.b = c.b, a.opacity = 1, a.hex = c.hex) : (l(a, "string") && (a = b.getRGB(a)), l(a, "object") && "r" in a && "g" in a && "b" in a && !("error" in a) ?
                    (c = b.rgb2hsl(a), a.h = c.h, a.s = c.s, a.l = c.l, c = b.rgb2hsb(a), a.v = c.b) : (a = {
                        hex: "none"
                    }, a.r = a.g = a.b = a.h = a.s = a.v = a.l = -1, a.error = 1)), a.toString = Ba, a
            };
            b.hsb2rgb = function(a, b, c, f) {
                l(a, "object") && "h" in a && "s" in a && "b" in a && (c = a.b, b = a.s, f = a.o, a = a.h);
                a *= 360;
                var d, e, k, v, q;
                return a = a % 360 / 60, q = c * b, v = q * (1 - qa(a % 2 - 1)), d = e = k = c - q, a = ~~a, d += [q, v, 0, 0, v, q][a], e += [v, q, q, v, 0, 0][a], k += [0, 0, v, q, q, v][a], qb(d, e, k, f)
            };
            b.hsl2rgb = function(a, b, c, f) {
                l(a, "object") && "h" in a && "s" in a && "l" in a && (c = a.l, b = a.s, a = a.h);
                (1 < a || 1 < b || 1 < c) && (a /= 360,
                    b /= 100, c /= 100);
                a *= 360;
                var d, e, k, v, q;
                return a = a % 360 / 60, q = 2 * b * (.5 > c ? c : 1 - c), v = q * (1 - qa(a % 2 - 1)), d = e = k = c - q / 2, a = ~~a, d += [q, v, 0, 0, v, q][a], e += [v, q, q, v, 0, 0][a], k += [0, 0, v, q, q, v][a], qb(d, e, k, f)
            };
            b.rgb2hsb = function(a, b, c) {
                c = Ma(a, b, c);
                a = c[0];
                b = c[1];
                c = c[2];
                var f, d, l, e;
                return l = pa(a, b, c), e = l - ka(a, b, c), f = 0 == e ? null : l == a ? (b - c) / e : l == b ? (c - a) / e + 2 : (a - b) / e + 4, f = (f + 360) % 6 * 60 / 360, d = 0 == e ? 0 : e / l, {
                    h: f,
                    s: d,
                    b: l,
                    toString: hb
                }
            };
            b.rgb2hsl = function(a, b, c) {
                c = Ma(a, b, c);
                a = c[0];
                b = c[1];
                c = c[2];
                var f, d, l, e, k, v;
                return e = pa(a, b, c), k = ka(a, b, c),
                    v = e - k, f = 0 == v ? null : e == a ? (b - c) / v : e == b ? (c - a) / v + 2 : (a - b) / v + 4, f = (f + 360) % 6 * 60 / 360, l = (e + k) / 2, d = 0 == v ? 0 : .5 > l ? v / (2 * l) : v / (2 - 2 * l), {
                        h: f,
                        s: d,
                        l: l,
                        toString: Oa
                    }
            };
            b.parsePathString = function(a) {
                if (!a) return null;
                var c = b.path(a);
                if (c.arr) return b.path.clone(c.arr);
                var f = {
                        a: 7,
                        c: 6,
                        o: 2,
                        h: 1,
                        l: 2,
                        m: 2,
                        r: 4,
                        q: 4,
                        s: 4,
                        t: 2,
                        v: 1,
                        u: 3,
                        z: 0
                    },
                    d = [];
                return l(a, "array") && l(a[0], "array") && (d = b.path.clone(a)), d.length || F(a).replace(Z, function(a, h, b) {
                    var c = [];
                    a = h.toLowerCase();
                    if (b.replace(W, function(a, h) {
                            h && c.push(+h)
                        }), "m" == a && 2 < c.length && (d.push([h].concat(c.splice(0,
                            2))), a = "l", h = "m" == h ? "l" : "L"), "o" == a && 1 == c.length && d.push([h, c[0]]), "r" == a) d.push([h].concat(c));
                    else
                        for (; c.length >= f[a] && (d.push([h].concat(c.splice(0, f[a]))), f[a]););
                }), d.toString = b.path.toString, c.arr = b.path.clone(d), d
            };
            var Wa = b.parseTransformString = function(a) {
                if (!a) return null;
                var c = [];
                return l(a, "array") && l(a[0], "array") && (c = b.path.clone(a)), c.length || F(a).replace(ca, function(a, h, b) {
                        var f = [];
                        h.toLowerCase();
                        b.replace(W, function(a, h) {
                            h && f.push(+h)
                        });
                        c.push([h].concat(f))
                    }), c.toString = b.path.toString,
                    c
            };
            b._.svgTransform2string = function(a) {
                var b = [];
                return a = a.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function(a, h, c) {
                    return c = c.split(/\s*,\s*|\s+/), "rotate" == h && 1 == c.length && c.push(0, 0), "scale" == h && (2 < c.length ? c = c.slice(0, 2) : 2 == c.length && c.push(0, 0), 1 == c.length && c.push(c[0], 0, 0)), b.push("skewX" == h ? ["m", 1, 0, L.tan(f(c[0])), 1, 0, 0] : "skewY" == h ? ["m", 1, L.tan(f(c[0])), 0, 1, 0, 0] : [h.charAt(0)].concat(c)), a
                }), b
            };
            b._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
            b._.transform2matrix = function(a, c) {
                var f = Wa(a),
                    d = new b.Matrix;
                if (f)
                    for (var l =
                            0, e = f.length; e > l; l++) {
                        var k, v, q, u, t, m = f[l],
                            r = m.length,
                            w = F(m[0]).toLowerCase(),
                            x = m[0] != w,
                            P = x ? d.invert() : 0;
                        "t" == w && 2 == r ? d.translate(m[1], 0) : "t" == w && 3 == r ? x ? (k = P.x(0, 0), v = P.y(0, 0), q = P.x(m[1], m[2]), u = P.y(m[1], m[2]), d.translate(q - k, u - v)) : d.translate(m[1], m[2]) : "r" == w ? 2 == r ? (t = t || c, d.rotate(m[1], t.x + t.width / 2, t.y + t.height / 2)) : 4 == r && (x ? (q = P.x(m[2], m[3]), u = P.y(m[2], m[3]), d.rotate(m[1], q, u)) : d.rotate(m[1], m[2], m[3])) : "s" == w ? 2 == r || 3 == r ? (t = t || c, d.scale(m[1], m[r - 1], t.x + t.width / 2, t.y + t.height / 2)) : 4 == r ? x ? (q = P.x(m[2],
                            m[3]), u = P.y(m[2], m[3]), d.scale(m[1], m[1], q, u)) : d.scale(m[1], m[1], m[2], m[3]) : 5 == r && (x ? (q = P.x(m[3], m[4]), u = P.y(m[3], m[4]), d.scale(m[1], m[2], q, u)) : d.scale(m[1], m[2], m[3], m[4])) : "m" == w && 7 == r && d.add(m[1], m[2], m[3], m[4], m[5], m[6])
                    }
                return d
            };
            b._unit2px = function(a, b, c) {
                function f(a) {
                    if (null == a) return X;
                    if (a == +a) return a;
                    d(m, {
                        width: a
                    });
                    try {
                        return m.getBBox().width
                    } catch (h) {
                        return 0
                    }
                }

                function l(a) {
                    if (null == a) return X;
                    if (a == +a) return a;
                    d(m, {
                        height: a
                    });
                    try {
                        return m.getBBox().height
                    } catch (h) {
                        return 0
                    }
                }

                function e(f,
                    d) {
                    null == b ? q[f] = d(a.attr(f) || 0) : f == b && (q = d(null == c ? a.attr(f) || 0 : c))
                }
                var k = v(a).node,
                    q = {},
                    m = k.querySelector(".svg---mgr");
                switch (m || (m = d("rect"), d(m, {
                    x: -9E9,
                    y: -9E9,
                    width: 10,
                    height: 10,
                    "class": "svg---mgr",
                    fill: "none"
                }), k.appendChild(m)), a.type) {
                    case "rect":
                        e("rx", f), e("ry", l);
                    case "image":
                        e("width", f), e("height", l);
                    case "text":
                        e("x", f);
                        e("y", l);
                        break;
                    case "circle":
                        e("cx", f);
                        e("cy", l);
                        e("r", f);
                        break;
                    case "ellipse":
                        e("cx", f);
                        e("cy", l);
                        e("rx", f);
                        e("ry", l);
                        break;
                    case "line":
                        e("x1", f);
                        e("x2", f);
                        e("y1", l);
                        e("y2", l);
                        break;
                    case "marker":
                        e("refX", f);
                        e("markerWidth", f);
                        e("refY", l);
                        e("markerHeight", l);
                        break;
                    case "radialGradient":
                        e("fx", f);
                        e("fy", l);
                        break;
                    case "tspan":
                        e("dx", f);
                        e("dy", l);
                        break;
                    default:
                        e(b, f)
                }
                return k.removeChild(m), q
            };
            E.doc.contains || E.doc.compareDocumentPosition ? function(a, b) {
                var c = 9 == a.nodeType ? a.documentElement : a,
                    f = b && b.parentNode;
                return a == f || !(!f || 1 != f.nodeType || !(c.contains ? c.contains(f) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(f)))
            } : function(a, b) {
                if (b)
                    for (; b;)
                        if (b =
                            b.parentNode, b == a) return !0;
                return !1
            };
            b._.getSomeDefs = function(a) {
                a = a.node.ownerSVGElement && t(a.node.ownerSVGElement) || a.node.parentNode && t(a.node.parentNode) || b.select("svg") || b(0, 0);
                var c = a.select("defs"),
                    c = null == c ? !1 : c.node;
                return c || (c = r("defs", a.node).node), c
            };
            b._.getSomeSVG = v;
            b.select = function(a) {
                return a = F(a).replace(/([^\\]):/g, "$1\\:"), t(E.doc.querySelector(a))
            };
            b.selectAll = function(a) {
                a = E.doc.querySelectorAll(a);
                for (var c = (b.set || Array)(), f = 0; f < a.length; f++) c.push(t(a[f]));
                return c
            };
            setInterval(function() {
                for (var a in ea)
                    if (ea[C](a)) {
                        var b =
                            ea[a],
                            c = b.node;
                        ("svg" != b.type && !c.ownerSVGElement || "svg" == b.type && (!c.parentNode || "ownerSVGElement" in c.parentNode && !c.ownerSVGElement)) && delete ea[a]
                    }
            }, 1E4);
            z.prototype.attr = function(a, b) {
                var f = this.node;
                if (!a) {
                    if (1 != f.nodeType) return {
                        text: f.nodeValue
                    };
                    for (var d = f.attributes, f = {}, e = 0, k = d.length; k > e; e++) f[d[e].nodeName] = d[e].nodeValue;
                    return f
                }
                if (l(a, "string")) {
                    if (!(1 < arguments.length)) return c("snap.util.getattr." + a, this).firstDefined();
                    f = {};
                    f[a] = b;
                    a = f
                }
                for (d in a) a[C](d) && c("snap.util.attr." + d, this,
                    a[d]);
                return this
            };
            b.parse = function(a) {
                var b = E.doc.createDocumentFragment(),
                    c = !0,
                    f = E.doc.createElement("div");
                if (a = F(a), a.match(/^\s*<\s*svg(?:\s|>)/) || (a = "<svg>" + a + "</svg>", c = !1), f.innerHTML = a, a = f.getElementsByTagName("svg")[0])
                    if (c) b = a;
                    else
                        for (; a.firstChild;) b.appendChild(a.firstChild);
                return new A(b)
            };
            b.fragment = function() {
                for (var a = Array.prototype.slice.call(arguments, 0), c = E.doc.createDocumentFragment(), f = 0, d = a.length; d > f; f++) {
                    var e = a[f];
                    e.node && e.node.nodeType && c.appendChild(e.node);
                    e.nodeType &&
                        c.appendChild(e);
                    "string" == typeof e && c.appendChild(b.parse(e).node)
                }
                return new A(c)
            };
            b._.make = r;
            b._.wrap = t;
            B.prototype.el = function(a, b) {
                var c = r(a, this.node);
                return b && c.attr(b), c
            };
            z.prototype.children = function() {
                for (var a = [], c = this.node.childNodes, f = 0, d = c.length; d > f; f++) a[f] = b(c[f]);
                return a
            };
            z.prototype.toJSON = function() {
                var a = [];
                return w([this], a), a[0]
            };
            c.on("snap.util.getattr", function() {
                var a = c.nt(),
                    a = a.substring(a.lastIndexOf(".") + 1),
                    b = a.replace(/[A-Z]/g, function(a) {
                        return "-" + a.toLowerCase()
                    });
                return H[C](b) ? this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(b) : d(this.node, a)
            });
            var H = {
                "alignment-baseline": 0,
                "baseline-shift": 0,
                clip: 0,
                "clip-path": 0,
                "clip-rule": 0,
                color: 0,
                "color-interpolation": 0,
                "color-interpolation-filters": 0,
                "color-profile": 0,
                "color-rendering": 0,
                cursor: 0,
                direction: 0,
                display: 0,
                "dominant-baseline": 0,
                "enable-background": 0,
                fill: 0,
                "fill-opacity": 0,
                "fill-rule": 0,
                filter: 0,
                "flood-color": 0,
                "flood-opacity": 0,
                font: 0,
                "font-family": 0,
                "font-size": 0,
                "font-size-adjust": 0,
                "font-stretch": 0,
                "font-style": 0,
                "font-variant": 0,
                "font-weight": 0,
                "glyph-orientation-horizontal": 0,
                "glyph-orientation-vertical": 0,
                "image-rendering": 0,
                kerning: 0,
                "letter-spacing": 0,
                "lighting-color": 0,
                marker: 0,
                "marker-end": 0,
                "marker-mid": 0,
                "marker-start": 0,
                mask: 0,
                opacity: 0,
                overflow: 0,
                "pointer-events": 0,
                "shape-rendering": 0,
                "stop-color": 0,
                "stop-opacity": 0,
                stroke: 0,
                "stroke-dasharray": 0,
                "stroke-dashoffset": 0,
                "stroke-linecap": 0,
                "stroke-linejoin": 0,
                "stroke-miterlimit": 0,
                "stroke-opacity": 0,
                "stroke-width": 0,
                "text-anchor": 0,
                "text-decoration": 0,
                "text-rendering": 0,
                "unicode-bidi": 0,
                visibility: 0,
                "word-spacing": 0,
                "writing-mode": 0
            };
            c.on("snap.util.attr", function(a) {
                var b = c.nt(),
                    f = {},
                    b = b.substring(b.lastIndexOf(".") + 1);
                f[b] = a;
                var e = b.replace(/-(\w)/gi, function(a, h) {
                        return h.toUpperCase()
                    }),
                    b = b.replace(/[A-Z]/g, function(a) {
                        return "-" + a.toLowerCase()
                    });
                H[C](b) ? this.node.style[e] = null == a ? X : a : d(this.node, f)
            });
            b.ajax = function(a, b, f, d) {
                var e = new XMLHttpRequest,
                    k = aa();
                if (e) {
                    if (l(b, "function")) d = f, f = b, b = null;
                    else if (l(b,
                            "object")) {
                        var v = [],
                            q;
                        for (q in b) b.hasOwnProperty(q) && v.push(encodeURIComponent(q) + "=" + encodeURIComponent(b[q]));
                        b = v.join("&")
                    }
                    return e.open(b ? "POST" : "GET", a, !0), b && (e.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.setRequestHeader("Content-type", "application/x-www-form-urlencoded")), f && (c.once("snap.ajax." + k + ".0", f), c.once("snap.ajax." + k + ".200", f), c.once("snap.ajax." + k + ".304", f)), e.onreadystatechange = function() {
                        4 == e.readyState && c("snap.ajax." + k + "." + e.status, d, e)
                    }, 4 == e.readyState ? e : (e.send(b),
                        e)
                }
            };
            b.load = function(a, c, f) {
                b.ajax(a, function(a) {
                    a = b.parse(a.responseText);
                    f ? c.call(f, a) : c(a)
                })
            };
            return b.getElementByPoint = function(a, b) {
                var c, f, d = (this.canvas, E.doc.elementFromPoint(a, b));
                if (E.win.opera && "svg" == d.tagName) {
                    c = d;
                    f = c.getBoundingClientRect();
                    c = c.ownerDocument;
                    var e = c.body,
                        l = c.documentElement;
                    c = f.top + (g.win.pageYOffset || l.scrollTop || e.scrollTop) - (l.clientTop || e.clientTop || 0);
                    f = f.left + (g.win.pageXOffset || l.scrollLeft || e.scrollLeft) - (l.clientLeft || e.clientLeft || 0);
                    e = d.createSVGRect();
                    e.x =
                        a - f;
                    e.y = b - c;
                    e.width = e.height = 1;
                    c = d.getIntersectionList(e, null);
                    c.length && (d = c[c.length - 1])
                }
                return d ? t(d) : null
            }, b.plugin = function(a) {
                a(b, z, B, E, A)
            }, E.win.Snap = b, b
        }(e || this);
    return m.plugin(function(a, b, d, l, q) {
        function m(b, c) {
            if (null == c) {
                var f = !0;
                if (c = b.node.getAttribute("linearGradient" == b.type || "radialGradient" == b.type ? "gradientTransform" : "pattern" == b.type ? "patternTransform" : "transform"), !c) return new a.Matrix;
                c = a._.svgTransform2string(c)
            } else c = a._.rgTransform.test(c) ? z(c).replace(/\.{3}|\u2026/g,
                b._.transform || "") : a._.svgTransform2string(c), D(c, "array") && (c = a.path ? a.path.toString.call(c) : z(c)), b._.transform = c;
            var d = a._.transform2matrix(c, b.getBBox(1));
            return f ? d : void(b.matrix = d)
        }

        function x(a) {
            function b(a, c) {
                var f = r(a.node, c);
                (f = (f = f && f.match(e)) && f[2]) && "#" == f.charAt() && (f = f.substring(1), f && (l[f] = (l[f] || []).concat(function(b) {
                    var f = {};
                    f[c] = URL(b);
                    r(a.node, f)
                })))
            }

            function c(a) {
                var b = r(a.node, "xlink:href");
                b && "#" == b.charAt() && (b = b.substring(1), b && (l[b] = (l[b] || []).concat(function(b) {
                    a.attr("xlink:href",
                        "#" + b)
                })))
            }
            var f, d = a.selectAll("*"),
                e = /^\s*url\(("|'|)(.*)\1\)\s*$/;
            a = [];
            for (var l = {}, k = 0, v = d.length; v > k; k++) {
                f = d[k];
                b(f, "fill");
                b(f, "stroke");
                b(f, "filter");
                b(f, "mask");
                b(f, "clip-path");
                c(f);
                var q = r(f.node, "id");
                q && (r(f.node, {
                    id: f.id
                }), a.push({
                    old: q,
                    id: f.id
                }))
            }
            k = 0;
            for (v = a.length; v > k; k++)
                if (f = l[a[k].old])
                    for (d = 0, q = f.length; q > d; d++) f[d](a[k].id)
        }

        function f(a, b, c) {
            return function(f) {
                f = f.slice(a, b);
                return 1 == f.length && (f = f[0]), c ? c(f) : f
            }
        }

        function v(a) {
            return function() {
                var b = a ? "<" + this.type : "",
                    c = this.node.attributes,
                    f = this.node.childNodes;
                if (a)
                    for (var d = 0, e = c.length; e > d; d++) b += " " + c[d].name + '="' + c[d].value.replace(/"/g, '\\"') + '"';
                if (f.length) {
                    a && (b += ">");
                    d = 0;
                    for (e = f.length; e > d; d++) 3 == f[d].nodeType ? b += f[d].nodeValue : 1 == f[d].nodeType && (b += w(f[d]).toString());
                    a && (b += "</" + this.type + ">")
                } else a && (b += "/>");
                return b
            }
        }
        b = b.prototype;
        var D = a.is,
            z = String,
            A = a._unit2px,
            r = a._.$,
            B = a._.make,
            t = a._.getSomeDefs,
            w = a._.wrap;
        b.getBBox = function(b) {
            if (!a.Matrix || !a.path) return this.node.getBBox();
            var c = this,
                f = new a.Matrix;
            if (c.removed) return a._.box();
            for (;
                "use" == c.type;)
                if (b || (f = f.add(c.transform().localMatrix.translate(c.attr("x") || 0, c.attr("y") || 0))), c.original) c = c.original;
                else var d = c.attr("xlink:href"),
                    c = c.original = c.node.ownerDocument.getElementById(d.substring(d.indexOf("#") + 1));
            var d = c._,
                e = a.path.get[c.type] || a.path.get.deflt;
            try {
                return b ? (d.bboxwt = e ? a.path.getBBox(c.realPath = e(c)) : a._.box(c.node.getBBox()), a._.box(d.bboxwt)) : (c.realPath = e(c), c.matrix = c.transform().localMatrix, d.bbox = a.path.getBBox(a.path.map(c.realPath, f.add(c.matrix))),
                    a._.box(d.bbox))
            } catch (l) {
                return a._.box()
            }
        };
        var E = function() {
            return this.string
        };
        b.transform = function(b) {
            var c = this._;
            if (null == b) {
                var f;
                f = this;
                b = new a.Matrix(this.node.getCTM());
                for (var d = m(this), e = [d], l = new a.Matrix, k = d.toTransformString(), c = z(d) == z(this.matrix) ? z(c.transform) : k;
                    "svg" != f.type && (f = f.parent());) e.push(m(f));
                for (f = e.length; f--;) l.add(e[f]);
                return {
                    string: c,
                    globalMatrix: b,
                    totalMatrix: l,
                    localMatrix: d,
                    diffMatrix: b.clone().add(d.invert()),
                    global: b.toTransformString(),
                    total: l.toTransformString(),
                    local: k,
                    toString: E
                }
            }
            return b instanceof a.Matrix ? (this.matrix = b, this._.transform = b.toTransformString()) : m(this, b), this.node && ("linearGradient" == this.type || "radialGradient" == this.type ? r(this.node, {
                gradientTransform: this.matrix
            }) : "pattern" == this.type ? r(this.node, {
                patternTransform: this.matrix
            }) : r(this.node, {
                transform: this.matrix
            })), this
        };
        b.parent = function() {
            return w(this.node.parentNode)
        };
        b.append = b.add = function(a) {
            if (a) {
                if ("set" == a.type) {
                    var b = this;
                    return a.forEach(function(a) {
                        b.add(a)
                    }), this
                }
                a = w(a);
                this.node.appendChild(a.node);
                a.paper = this.paper
            }
            return this
        };
        b.appendTo = function(a) {
            return a && (a = w(a), a.append(this)), this
        };
        b.prepend = function(a) {
            if (a) {
                if ("set" == a.type) {
                    var b, c = this;
                    return a.forEach(function(a) {
                        b ? b.after(a) : c.prepend(a);
                        b = a
                    }), this
                }
                a = w(a);
                var f = a.parent();
                this.node.insertBefore(a.node, this.node.firstChild);
                this.add && this.add();
                a.paper = this.paper;
                this.parent() && this.parent().add();
                f && f.add()
            }
            return this
        };
        b.prependTo = function(a) {
            return a = w(a), a.prepend(this), this
        };
        b.before = function(a) {
            if ("set" ==
                a.type) {
                var b = this;
                return a.forEach(function(a) {
                    var c = a.parent();
                    b.node.parentNode.insertBefore(a.node, b.node);
                    c && c.add()
                }), this.parent().add(), this
            }
            a = w(a);
            var c = a.parent();
            return this.node.parentNode.insertBefore(a.node, this.node), this.parent() && this.parent().add(), c && c.add(), a.paper = this.paper, this
        };
        b.after = function(a) {
            a = w(a);
            var b = a.parent();
            return this.node.nextSibling ? this.node.parentNode.insertBefore(a.node, this.node.nextSibling) : this.node.parentNode.appendChild(a.node), this.parent() && this.parent().add(),
                b && b.add(), a.paper = this.paper, this
        };
        b.insertBefore = function(a) {
            a = w(a);
            var b = this.parent();
            return a.node.parentNode.insertBefore(this.node, a.node), this.paper = a.paper, b && b.add(), a.parent() && a.parent().add(), this
        };
        b.insertAfter = function(a) {
            a = w(a);
            var b = this.parent();
            return a.node.parentNode.insertBefore(this.node, a.node.nextSibling), this.paper = a.paper, b && b.add(), a.parent() && a.parent().add(), this
        };
        b.remove = function() {
            var a = this.parent();
            return this.node.parentNode && this.node.parentNode.removeChild(this.node),
                delete this.paper, this.removed = !0, a && a.add(), this
        };
        b.select = function(a) {
            return w(this.node.querySelector(a))
        };
        b.selectAll = function(b) {
            b = this.node.querySelectorAll(b);
            for (var c = (a.set || Array)(), f = 0; f < b.length; f++) c.push(w(b[f]));
            return c
        };
        b.asPX = function(a, b) {
            return null == b && (b = this.attr(a)), +A(this, a, b)
        };
        b.use = function() {
            var a, b = this.node.id;
            return b || (b = this.id, r(this.node, {
                    id: b
                })), a = "linearGradient" == this.type || "radialGradient" == this.type || "pattern" == this.type ? B(this.type, this.node.parentNode) :
                B("use", this.node.parentNode), r(a.node, {
                    "xlink:href": "#" + b
                }), a.original = this, a
        };
        b.clone = function() {
            var a = w(this.node.cloneNode(!0));
            return r(a.node, "id") && r(a.node, {
                id: a.id
            }), x(a), a.insertAfter(this), a
        };
        b.toDefs = function() {
            return t(this).appendChild(this.node), this
        };
        b.pattern = b.toPattern = function(a, b, c, f) {
            var d = B("pattern", t(this));
            return null == a && (a = this.getBBox()), D(a, "object") && "x" in a && (b = a.y, c = a.width, f = a.height, a = a.x), r(d.node, {
                x: a,
                y: b,
                width: c,
                height: f,
                patternUnits: "userSpaceOnUse",
                id: d.id,
                viewBox: [a, b, c, f].join(" ")
            }), d.node.appendChild(this.node), d
        };
        b.marker = function(a, b, c, f, d, e) {
            var l = B("marker", t(this));
            return null == a && (a = this.getBBox()), D(a, "object") && "x" in a && (b = a.y, c = a.width, f = a.height, d = a.refX || a.cx, e = a.refY || a.cy, a = a.x), r(l.node, {
                viewBox: [a, b, c, f].join(" "),
                markerWidth: c,
                markerHeight: f,
                orient: "auto",
                refX: d || 0,
                refY: e || 0,
                id: l.id
            }), l.node.appendChild(this.node), l
        };
        var C = function(a, b, c, f) {
            "function" != typeof c || c.length || (f = c, c = k.linear);
            this.attr = a;
            this.dur = b;
            c && (this.easing = c);
            f && (this.callback = f)
        };
        a._.Animation = C;
        a.animation = function(a, b, c, f) {
            return new C(a, b, c, f)
        };
        b.inAnim = function() {
            var a = [],
                b;
            for (b in this.anims) this.anims.hasOwnProperty(b) && ! function(b) {
                a.push({
                    anim: new C(b._attrs, b.dur, b.easing, b._callback),
                    mina: b,
                    curStatus: b.status(),
                    status: function(a) {
                        return b.status(a)
                    },
                    stop: function() {
                        b.stop()
                    }
                })
            }(this.anims[b]);
            return a
        };
        a.animate = function(a, b, f, d, e, l) {
            "function" != typeof e || e.length || (l = e, e = k.linear);
            var v = k.time();
            a = k(a, b, v, v + d, k.time, f, e);
            return l && c.once("mina.finish." +
                a.id, l), a
        };
        b.stop = function() {
            for (var a = this.inAnim(), b = 0, c = a.length; c > b; b++) a[b].stop();
            return this
        };
        b.animate = function(a, b, d, e) {
            "function" != typeof d || d.length || (e = d, d = k.linear);
            a instanceof C && (e = a.callback, d = a.easing, b = a.dur, a = a.attr);
            var l, v, q, m, u = [],
                t = [],
                r = {},
                w = this,
                x;
            for (x in a)
                if (a.hasOwnProperty(x)) {
                    w.equal ? (m = w.equal(x, z(a[x])), l = m.from, v = m.to, q = m.f) : (l = +w.attr(x), v = +a[x]);
                    var B = D(l, "array") ? l.length : 1;
                    r[x] = f(u.length, u.length + B, q);
                    u = u.concat(l);
                    t = t.concat(v)
                }
            l = k.time();
            var E = k(u, t, l, l + b,
                k.time,
                function(a) {
                    var b = {},
                        c;
                    for (c in r) r.hasOwnProperty(c) && (b[c] = r[c](a));
                    w.attr(b)
                }, d);
            return w.anims[E.id] = E, E._attrs = a, E._callback = e, c("snap.animcreated." + w.id, E), c.once("mina.finish." + E.id, function() {
                delete w.anims[E.id];
                e && e.call(w)
            }), c.once("mina.stop." + E.id, function() {
                delete w.anims[E.id]
            }), w
        };
        var F = {};
        b.data = function(b, f) {
            var d = F[this.id] = F[this.id] || {};
            if (0 == arguments.length) return c("snap.data.get." + this.id, this, d, null), d;
            if (1 == arguments.length) {
                if (a.is(b, "object")) {
                    for (var e in b) b.hasOwnProperty(e) &&
                        this.data(e, b[e]);
                    return this
                }
                return c("snap.data.get." + this.id, this, d[b], b), d[b]
            }
            return d[b] = f, c("snap.data.set." + this.id, this, f, b), this
        };
        b.removeData = function(a) {
            return null == a ? F[this.id] = {} : F[this.id] && delete F[this.id][a], this
        };
        b.outerSVG = b.toString = v(1);
        b.innerSVG = v();
        b.toDataURL = function() {
            if (e && e.btoa) {
                var b = this.getBBox(),
                    b = a.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                        x: +b.x.toFixed(3),
                        y: +b.y.toFixed(3),
                        width: +b.width.toFixed(3),
                        height: +b.height.toFixed(3),
                        contents: this.outerSVG()
                    });
                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(b)))
            }
        };
        q.prototype.select = b.select;
        q.prototype.selectAll = b.selectAll
    }), m.plugin(function(a) {
        function b(a, b, f, e, l, k) {
            return null == b && "[object SVGMatrix]" == c.call(a) ? (this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, void(this.f = a.f)) : void(null != a ? (this.a = +a, this.b = +b, this.c = +f, this.d = +e, this.e = +l, this.f = +k) : (this.a =
                1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0))
        }
        var c = Object.prototype.toString,
            e = String,
            k = Math;
        ! function(c) {
            function d(a) {
                return a[0] * a[0] + a[1] * a[1]
            }

            function f(a) {
                var b = k.sqrt(d(a));
                a[0] && (a[0] /= b);
                a[1] && (a[1] /= b)
            }
            c.add = function(a, c, f, d, e, l) {
                var k = [
                        [],
                        [],
                        []
                    ],
                    q = [
                        [this.a, this.c, this.e],
                        [this.b, this.d, this.f],
                        [0, 0, 1]
                    ];
                c = [
                    [a, f, e],
                    [c, d, l],
                    [0, 0, 1]
                ];
                a && a instanceof b && (c = [
                    [a.a, a.c, a.e],
                    [a.b, a.d, a.f],
                    [0, 0, 1]
                ]);
                for (a = 0; 3 > a; a++)
                    for (f = 0; 3 > f; f++) {
                        for (d = e = 0; 3 > d; d++) e += q[a][d] * c[d][f];
                        k[a][f] = e
                    }
                return this.a =
                    k[0][0], this.b = k[1][0], this.c = k[0][1], this.d = k[1][1], this.e = k[0][2], this.f = k[1][2], this
            };
            c.invert = function() {
                var a = this.a * this.d - this.b * this.c;
                return new b(this.d / a, -this.b / a, -this.c / a, this.a / a, (this.c * this.f - this.d * this.e) / a, (this.b * this.e - this.a * this.f) / a)
            };
            c.clone = function() {
                return new b(this.a, this.b, this.c, this.d, this.e, this.f)
            };
            c.translate = function(a, b) {
                return this.add(1, 0, 0, 1, a, b)
            };
            c.scale = function(a, b, c, f) {
                return null == b && (b = a), (c || f) && this.add(1, 0, 0, 1, c, f), this.add(a, 0, 0, b, 0, 0), (c || f) && this.add(1,
                    0, 0, 1, -c, -f), this
            };
            c.rotate = function(b, c, f) {
                b = a.rad(b);
                c = c || 0;
                f = f || 0;
                var d = +k.cos(b).toFixed(9);
                b = +k.sin(b).toFixed(9);
                return this.add(d, b, -b, d, c, f), this.add(1, 0, 0, 1, -c, -f)
            };
            c.x = function(a, b) {
                return a * this.a + b * this.c + this.e
            };
            c.y = function(a, b) {
                return a * this.b + b * this.d + this.f
            };
            c.get = function(a) {
                return +this[e.fromCharCode(97 + a)].toFixed(4)
            };
            c.toString = function() {
                return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")"
            };
            c.offset = function() {
                return [this.e.toFixed(4),
                    this.f.toFixed(4)
                ]
            };
            c.determinant = function() {
                return this.a * this.d - this.b * this.c
            };
            c.split = function() {
                var b = {};
                b.dx = this.e;
                b.dy = this.f;
                var c = [
                    [this.a, this.c],
                    [this.b, this.d]
                ];
                b.scalex = k.sqrt(d(c[0]));
                f(c[0]);
                b.shear = c[0][0] * c[1][0] + c[0][1] * c[1][1];
                c[1] = [c[1][0] - c[0][0] * b.shear, c[1][1] - c[0][1] * b.shear];
                b.scaley = k.sqrt(d(c[1]));
                f(c[1]);
                b.shear /= b.scaley;
                0 > this.determinant() && (b.scalex = -b.scalex);
                var e = -c[0][1],
                    c = c[1][1];
                return 0 > c ? (b.rotate = a.deg(k.acos(c)), 0 > e && (b.rotate = 360 - b.rotate)) : b.rotate = a.deg(k.asin(e)),
                    b.isSimple = !(+b.shear.toFixed(9) || b.scalex.toFixed(9) != b.scaley.toFixed(9) && b.rotate), b.isSuperSimple = !+b.shear.toFixed(9) && b.scalex.toFixed(9) == b.scaley.toFixed(9) && !b.rotate, b.noRotation = !+b.shear.toFixed(9) && !b.rotate, b
            };
            c.toTransformString = function(a) {
                a = a || this.split();
                return +a.shear.toFixed(9) ? "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)] : (a.scalex = +a.scalex.toFixed(4), a.scaley = +a.scaley.toFixed(4), a.rotate = +a.rotate.toFixed(4), (a.dx || a.dy ? "t" + [+a.dx.toFixed(4), +a.dy.toFixed(4)] : "") + (1 != a.scalex || 1 != a.scaley ? "s" + [a.scalex, a.scaley, 0, 0] : "") + (a.rotate ? "r" + [+a.rotate.toFixed(4), 0, 0] : ""))
            }
        }(b.prototype);
        a.Matrix = b;
        a.matrix = function(a, c, f, d, e, l) {
            return new b(a, c, f, d, e, l)
        }
    }), m.plugin(function(a, b, d, e, k) {
        function m(f) {
            return function(d) {
                if (c.stop(), d instanceof k && 1 == d.node.childNodes.length && ("radialGradient" == d.node.firstChild.tagName || "linearGradient" == d.node.firstChild.tagName || "pattern" == d.node.firstChild.tagName) && (d = d.node.firstChild, r(this).appendChild(d),
                        d = z(d)), d instanceof b)
                    if ("radialGradient" == d.type || "linearGradient" == d.type || "pattern" == d.type) {
                        d.node.id || t(d.node, {
                            id: d.id
                        });
                        var e = w(d.node.id)
                    } else e = d.attr(f);
                else if (e = a.color(d), e.error) {
                    var l = a(r(this).ownerSVGElement).gradient(d);
                    l ? (l.node.id || t(l.node, {
                        id: l.id
                    }), e = w(l.node.id)) : e = d
                } else e = E(e);
                d = {};
                d[f] = e;
                t(this.node, d);
                this.node.style[f] = F
            }
        }

        function x(a) {
            c.stop();
            a == +a && (a += "px");
            this.node.style.fontSize = a
        }

        function f(a) {
            var b = [];
            a = a.childNodes;
            for (var c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                3 == e.nodeType && b.push(e.nodeValue);
                "tspan" == e.tagName && b.push(1 == e.childNodes.length && 3 == e.firstChild.nodeType ? e.firstChild.nodeValue : f(e))
            }
            return b
        }

        function v() {
            return c.stop(), this.node.style.fontSize
        }
        var D = a._.make,
            z = a._.wrap,
            A = a.is,
            r = a._.getSomeDefs,
            B = /^url\(#?([^)]+)\)$/,
            t = a._.$,
            w = a.url,
            E = String,
            C = a._.separator,
            F = "";
        c.on("snap.util.attr.mask", function(a) {
            if (a instanceof b || a instanceof k) {
                if (c.stop(), a instanceof k && 1 == a.node.childNodes.length && (a = a.node.firstChild, r(this).appendChild(a), a = z(a)),
                    "mask" == a.type) var f = a;
                else f = D("mask", r(this)), f.node.appendChild(a.node);
                !f.node.id && t(f.node, {
                    id: f.id
                });
                t(this.node, {
                    mask: w(f.id)
                })
            }
        });
        (function(a) {
            c.on("snap.util.attr.clip", a);
            c.on("snap.util.attr.clip-path", a);
            c.on("snap.util.attr.clipPath", a)
        })(function(a) {
            if (a instanceof b || a instanceof k) {
                if (c.stop(), "clipPath" == a.type) var f = a;
                else f = D("clipPath", r(this)), f.node.appendChild(a.node), !f.node.id && t(f.node, {
                    id: f.id
                });
                t(this.node, {
                    "clip-path": w(f.node.id || f.id)
                })
            }
        });
        c.on("snap.util.attr.fill",
            m("fill"));
        c.on("snap.util.attr.stroke", m("stroke"));
        var J = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
        c.on("snap.util.grad.parse", function(a) {
            a = E(a);
            var b = a.match(J);
            if (!b) return null;
            a = b[1];
            var c = b[2],
                b = b[3];
            return c = c.split(/\s*,\s*/).map(function(a) {
                return +a == a ? +a : a
            }), 1 == c.length && 0 == c[0] && (c = []), b = b.split("-"), b = b.map(function(a) {
                a = a.split(":");
                var b = {
                    color: a[0]
                };
                return a[1] && (b.offset = parseFloat(a[1])), b
            }), {
                type: a,
                params: c,
                stops: b
            }
        });
        c.on("snap.util.attr.d", function(b) {
            c.stop();
            A(b, "array") && A(b[0], "array") &&
                (b = a.path.toString.call(b));
            b = E(b);
            b.match(/[ruo]/i) && (b = a.path.toAbsolute(b));
            t(this.node, {
                d: b
            })
        })(-1);
        c.on("snap.util.attr.#text", function(a) {
            c.stop();
            a = E(a);
            for (a = e.doc.createTextNode(a); this.node.firstChild;) this.node.removeChild(this.node.firstChild);
            this.node.appendChild(a)
        })(-1);
        c.on("snap.util.attr.path", function(a) {
            c.stop();
            this.attr({
                d: a
            })
        })(-1);
        c.on("snap.util.attr.class", function(a) {
            c.stop();
            this.node.className.baseVal = a
        })(-1);
        c.on("snap.util.attr.viewBox", function(a) {
            a = A(a, "object") &&
                "x" in a ? [a.x, a.y, a.width, a.height].join(" ") : A(a, "array") ? a.join(" ") : a;
            t(this.node, {
                viewBox: a
            });
            c.stop()
        })(-1);
        c.on("snap.util.attr.transform", function(a) {
            this.transform(a);
            c.stop()
        })(-1);
        c.on("snap.util.attr.r", function(a) {
            "rect" == this.type && (c.stop(), t(this.node, {
                rx: a,
                ry: a
            }))
        })(-1);
        c.on("snap.util.attr.textpath", function(a) {
            if (c.stop(), "text" == this.type) {
                var f, d;
                if (!a && this.textPath) {
                    for (d = this.textPath; d.node.firstChild;) this.node.appendChild(d.node.firstChild);
                    return d.remove(), void delete this.textPath
                }
                A(a,
                    "string") ? (f = r(this), a = z(f.parentNode).path(a), f.appendChild(a.node), f = a.id, a.attr({
                    id: f
                })) : (a = z(a), a instanceof b && (f = a.attr("id"), f || (f = a.id, a.attr({
                    id: f
                }))));
                if (f)
                    if (d = this.textPath, a = this.node, d) d.attr({
                        "xlink:href": "#" + f
                    });
                    else {
                        for (d = t("textPath", {
                                "xlink:href": "#" + f
                            }); a.firstChild;) d.appendChild(a.firstChild);
                        a.appendChild(d);
                        this.textPath = z(d)
                    }
            }
        })(-1);
        c.on("snap.util.attr.text", function(a) {
            if ("text" == this.type) {
                for (var b = this.node, f = function(a) {
                        var b = t("tspan");
                        if (A(a, "array"))
                            for (var c = 0; c <
                                a.length; c++) b.appendChild(f(a[c]));
                        else b.appendChild(e.doc.createTextNode(a));
                        return b.normalize && b.normalize(), b
                    }; b.firstChild;) b.removeChild(b.firstChild);
                for (a = f(a); a.firstChild;) b.appendChild(a.firstChild)
            }
            c.stop()
        })(-1);
        c.on("snap.util.attr.fontSize", x)(-1);
        c.on("snap.util.attr.font-size", x)(-1);
        c.on("snap.util.getattr.transform", function() {
            return c.stop(), this.transform()
        })(-1);
        c.on("snap.util.getattr.textpath", function() {
            return c.stop(), this.textPath
        })(-1);
        (function() {
            function b(f) {
                return function() {
                    c.stop();
                    var b = e.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + f);
                    return "none" == b ? b : a(e.doc.getElementById(b.match(B)[1]))
                }
            }

            function f(a) {
                return function(b) {
                    c.stop();
                    var f = "marker" + a.charAt(0).toUpperCase() + a.substring(1);
                    if ("" == b || !b) return void(this.node.style[f] = "none");
                    if ("marker" == b.type) {
                        var d = b.node.id;
                        return d || t(b.node, {
                            id: b.id
                        }), void(this.node.style[f] = w(d))
                    }
                }
            }
            c.on("snap.util.getattr.marker-end", b("end"))(-1);
            c.on("snap.util.getattr.markerEnd", b("end"))(-1);
            c.on("snap.util.getattr.marker-start",
                b("start"))(-1);
            c.on("snap.util.getattr.markerStart", b("start"))(-1);
            c.on("snap.util.getattr.marker-mid", b("mid"))(-1);
            c.on("snap.util.getattr.markerMid", b("mid"))(-1);
            c.on("snap.util.attr.marker-end", f("end"))(-1);
            c.on("snap.util.attr.markerEnd", f("end"))(-1);
            c.on("snap.util.attr.marker-start", f("start"))(-1);
            c.on("snap.util.attr.markerStart", f("start"))(-1);
            c.on("snap.util.attr.marker-mid", f("mid"))(-1);
            c.on("snap.util.attr.markerMid", f("mid"))(-1)
        })();
        c.on("snap.util.getattr.r", function() {
            return "rect" ==
                this.type && t(this.node, "rx") == t(this.node, "ry") ? (c.stop(), t(this.node, "rx")) : void 0
        })(-1);
        c.on("snap.util.getattr.text", function() {
            if ("text" == this.type || "tspan" == this.type) {
                c.stop();
                var a = f(this.node);
                return 1 == a.length ? a[0] : a
            }
        })(-1);
        c.on("snap.util.getattr.#text", function() {
            return this.node.textContent
        })(-1);
        c.on("snap.util.getattr.viewBox", function() {
            c.stop();
            var b = t(this.node, "viewBox");
            return b ? (b = b.split(C), a._.box(+b[0], +b[1], +b[2], +b[3])) : void 0
        })(-1);
        c.on("snap.util.getattr.points", function() {
            var a =
                t(this.node, "points");
            return c.stop(), a ? a.split(C) : void 0
        })(-1);
        c.on("snap.util.getattr.path", function() {
            var a = t(this.node, "d");
            return c.stop(), a
        })(-1);
        c.on("snap.util.getattr.class", function() {
            return this.node.className.baseVal
        })(-1);
        c.on("snap.util.getattr.fontSize", v)(-1);
        c.on("snap.util.getattr.font-size", v)(-1)
    }), m.plugin(function(a, b) {
        var c = /\S+/g,
            e = String,
            k = b.prototype;
        k.addClass = function(a) {
            var b, f, k, m = e(a || "").match(c) || [];
            a = this.node;
            var q = a.className.baseVal,
                A = q.match(c) || [];
            if (m.length) {
                for (b =
                    0; k = m[b++];) f = A.indexOf(k), ~f || A.push(k);
                b = A.join(" ");
                q != b && (a.className.baseVal = b)
            }
            return this
        };
        k.removeClass = function(a) {
            var b, f, k = e(a || "").match(c) || [];
            a = this.node;
            var m = a.className.baseVal,
                q = m.match(c) || [];
            if (q.length) {
                for (b = 0; f = k[b++];) f = q.indexOf(f), ~f && q.splice(f, 1);
                b = q.join(" ");
                m != b && (a.className.baseVal = b)
            }
            return this
        };
        k.hasClass = function(a) {
            return !!~(this.node.className.baseVal.match(c) || []).indexOf(a)
        };
        k.toggleClass = function(a, b) {
            if (null != b) return b ? this.addClass(a) : this.removeClass(a);
            var f, e, l, k, q = (a || "").match(c) || [],
                m = this.node,
                B = m.className.baseVal,
                t = B.match(c) || [];
            for (f = 0; l = q[f++];) e = t.indexOf(l), ~e ? t.splice(e, 1) : t.push(l);
            return k = t.join(" "), B != k && (m.className.baseVal = k), this
        }
    }), m.plugin(function() {
        function a(a) {
            return a
        }

        function b(a) {
            return function(b) {
                return +b.toFixed(3) + a
            }
        }
        var d = {
                "+": function(a, b) {
                    return a + b
                },
                "-": function(a, b) {
                    return a - b
                },
                "/": function(a, b) {
                    return a / b
                },
                "*": function(a, b) {
                    return a * b
                }
            },
            e = String,
            k = /[a-z]+$/i,
            m = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
        c.on("snap.util.attr", function(a) {
            var b = e(a).match(m);
            if (b) {
                var v = c.nt(),
                    v = v.substring(v.lastIndexOf(".") + 1),
                    D = this.attr(v),
                    z = {};
                c.stop();
                var A = b[3] || "",
                    r = D.match(k),
                    B = d[b[1]];
                (r && r == A ? a = B(parseFloat(D), +b[2]) : (D = this.asPX(v), a = B(this.asPX(v), this.asPX(v, b[2] + A))), isNaN(D) || isNaN(a)) || (z[v] = a, this.attr(z))
            }
        })(-10);
        c.on("snap.util.equal", function(x, f) {
            var v = e(this.attr(x) || ""),
                D = e(f).match(m);
            if (D) {
                c.stop();
                var z = D[3] || "",
                    A = v.match(k),
                    r = d[D[1]];
                return A && A == z ? {
                    from: parseFloat(v),
                    to: r(parseFloat(v), +D[2]),
                    f: b(A)
                } : (v = this.asPX(x), {
                    from: v,
                    to: r(v, this.asPX(x, D[2] + z)),
                    f: a
                })
            }
        })(-10)
    }), m.plugin(function(a, b, d, l) {
        var k = d.prototype,
            m = a.is;
        k.rect = function(a, b, c, d, e, l) {
            var k;
            return null == l && (l = e), m(a, "object") && "[object Object]" == a ? k = a : null != a && (k = {
                x: a,
                y: b,
                width: c,
                height: d
            }, null != e && (k.rx = e, k.ry = l)), this.el("rect", k)
        };
        k.circle = function(a, b, c) {
            var d;
            return m(a, "object") && "[object Object]" == a ? d = a : null != a && (d = {
                cx: a,
                cy: b,
                r: c
            }), this.el("circle", d)
        };
        var x = function() {
            function a() {
                this.parentNode.removeChild(this)
            }
            return function(b, c) {
                var d = l.doc.createElement("img"),
                    e = l.doc.body;
                d.style.cssText = "position:absolute;left:-9999em;top:-9999em";
                d.onload = function() {
                    c.call(d);
                    d.onload = d.onerror = null;
                    e.removeChild(d)
                };
                d.onerror = a;
                e.appendChild(d);
                d.src = b
            }
        }();
        k.image = function(b, c, d, e, l) {
            var k = this.el("image");
            if (m(b, "object") && "src" in b) k.attr(b);
            else if (null != b) {
                var q = {
                    "xlink:href": b,
                    preserveAspectRatio: "none"
                };
                null != c && null != d && (q.x = c, q.y = d);
                null != e && null != l ? (q.width = e, q.height = l) : x(b, function() {
                    a._.$(k.node, {
                        width: this.offsetWidth,
                        height: this.offsetHeight
                    })
                });
                a._.$(k.node, q)
            }
            return k
        };
        k.ellipse = function(a, b, c, d) {
            var e;
            return m(a, "object") && "[object Object]" == a ? e = a : null != a && (e = {
                cx: a,
                cy: b,
                rx: c,
                ry: d
            }), this.el("ellipse", e)
        };
        k.path = function(a) {
            var b;
            return m(a, "object") && !m(a, "array") ? b = a : a && (b = {
                d: a
            }), this.el("path", b)
        };
        k.group = k.g = function(a) {
            var b = this.el("g");
            return 1 == arguments.length && a && !a.type ? b.attr(a) : arguments.length && b.add(Array.prototype.slice.call(arguments, 0)), b
        };
        k.svg = function(a, b, c, d, e, l, k, q) {
            var w = {};
            return m(a,
                "object") && null == b ? w = a : (null != a && (w.x = a), null != b && (w.y = b), null != c && (w.width = c), null != d && (w.height = d), null != e && null != l && null != k && null != q && (w.viewBox = [e, l, k, q])), this.el("svg", w)
        };
        k.mask = function(a) {
            var b = this.el("mask");
            return 1 == arguments.length && a && !a.type ? b.attr(a) : arguments.length && b.add(Array.prototype.slice.call(arguments, 0)), b
        };
        k.ptrn = function(a, b, c, d, e, l, k, q) {
            if (m(a, "object")) var w = a;
            else w = {
                    patternUnits: "userSpaceOnUse"
                }, a && (w.x = a), b && (w.y = b), null != c && (w.width = c), null != d && (w.height = d), w.viewBox =
                null != e && null != l && null != k && null != q ? [e, l, k, q] : [a || 0, b || 0, c || 0, d || 0];
            return this.el("pattern", w)
        };
        k.use = function(c) {
            return null != c ? (c instanceof b && (c.attr("id") || c.attr({
                id: a._.id(c)
            }), c = c.attr("id")), "#" == String(c).charAt() && (c = c.substring(1)), this.el("use", {
                "xlink:href": "#" + c
            })) : b.prototype.use.call(this)
        };
        k.symbol = function(a, b, c, d) {
            var e = {};
            return null != a && null != b && null != c && null != d && (e.viewBox = [a, b, c, d]), this.el("symbol", e)
        };
        k.text = function(a, b, c) {
            var d = {};
            return m(a, "object") ? d = a : null != a && (d = {
                x: a,
                y: b,
                text: c || ""
            }), this.el("text", d)
        };
        k.line = function(a, b, c, d) {
            var e = {};
            return m(a, "object") ? e = a : null != a && (e = {
                x1: a,
                x2: c,
                y1: b,
                y2: d
            }), this.el("line", e)
        };
        k.polyline = function(a) {
            1 < arguments.length && (a = Array.prototype.slice.call(arguments, 0));
            var b = {};
            return m(a, "object") && !m(a, "array") ? b = a : null != a && (b = {
                points: a
            }), this.el("polyline", b)
        };
        k.polygon = function(a) {
            1 < arguments.length && (a = Array.prototype.slice.call(arguments, 0));
            var b = {};
            return m(a, "object") && !m(a, "array") ? b = a : null != a && (b = {
                points: a
            }), this.el("polygon",
                b)
        };
        (function() {
            function b() {
                return this.selectAll("stop")
            }

            function d(b, c) {
                var f = x("stop"),
                    e = {
                        offset: +c + "%"
                    };
                return b = a.color(b), e["stop-color"] = b.hex, 1 > b.opacity && (e["stop-opacity"] = b.opacity), x(f, e), this.node.appendChild(f), this
            }

            function l() {
                if ("linearGradient" == this.type) {
                    var b = x(this.node, "x1") || 0,
                        c = x(this.node, "x2") || 1,
                        d = x(this.node, "y1") || 0,
                        f = x(this.node, "y2") || 0;
                    return a._.box(b, d, math.abs(c - b), math.abs(f - d))
                }
                b = this.node.r || 0;
                return a._.box((this.node.cx || .5) - b, (this.node.cy || .5) - b, 2 * b, 2 * b)
            }

            function m(a, b) {
                function d(a, b) {
                    for (var c = (b - k) / (a - q), f = q; a > f; f++) l[f].offset = +(+k + c * (f - q)).toFixed(2);
                    q = a;
                    k = b
                }
                var f, e = c("snap.util.grad.parse", null, b).firstDefined();
                if (!e) return null;
                e.params.unshift(a);
                f = "l" == e.type.toLowerCase() ? u.apply(0, e.params) : r.apply(0, e.params);
                e.type != e.type.toLowerCase() && x(f.node, {
                    gradientUnits: "userSpaceOnUse"
                });
                var l = e.stops,
                    e = l.length,
                    k = 0,
                    q = 0;
                e--;
                for (var v = 0; e > v; v++) "offset" in l[v] && d(v, l[v].offset);
                l[e].offset = l[e].offset || 100;
                d(e, l[e].offset);
                for (v = 0; e >= v; v++) {
                    var z =
                        l[v];
                    f.addStop(z.color, z.offset)
                }
                return f
            }

            function u(c, e, k, m, q) {
                c = a._.make("linearGradient", c);
                return c.stops = b, c.addStop = d, c.getBBox = l, null != e && x(c.node, {
                    x1: e,
                    y1: k,
                    x2: m,
                    y2: q
                }), c
            }

            function r(c, e, k, m, q, r) {
                c = a._.make("radialGradient", c);
                return c.stops = b, c.addStop = d, c.getBBox = l, null != e && x(c.node, {
                    cx: e,
                    cy: k,
                    r: m
                }), null != q && null != r && x(c.node, {
                    fx: q,
                    fy: r
                }), c
            }
            var x = a._.$;
            k.gradient = function(a) {
                return m(this.defs, a)
            };
            k.gradientLinear = function(a, b, c, d) {
                return u(this.defs, a, b, c, d)
            };
            k.gradientRadial = function(a,
                b, c, d, f) {
                return r(this.defs, a, b, c, d, f)
            };
            k.toString = function() {
                var b, c = this.node.ownerDocument,
                    d = c.createDocumentFragment(),
                    c = c.createElement("div"),
                    f = this.node.cloneNode(!0);
                return d.appendChild(c), c.appendChild(f), a._.$(f, {
                    xmlns: "http://www.w3.org/2000/svg"
                }), b = c.innerHTML, d.removeChild(d.firstChild), b
            };
            k.toDataURL = function() {
                return e && e.btoa ? "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this))) : void 0
            };
            k.clear = function() {
                for (var a, b = this.node.firstChild; b;) a = b.nextSibling, "defs" !=
                    b.tagName ? b.parentNode.removeChild(b) : k.clear.call({
                        node: b
                    }), b = a
            }
        })()
    }), m.plugin(function(a, b) {
        function c(a) {
            var b = c.ps = c.ps || {};
            return b[a] ? b[a].sleep = 100 : b[a] = {
                sleep: 100
            }, setTimeout(function() {
                for (var c in b) b[R](c) && c != a && (b[c].sleep--, !b[c].sleep && delete b[c])
            }), b[a]
        }

        function e(a, b, c, d) {
            return null == a && (a = b = c = d = 0), null == b && (b = a.y, c = a.width, d = a.height, a = a.x), {
                x: a,
                y: b,
                width: c,
                w: c,
                height: d,
                h: d,
                x2: a + c,
                y2: b + d,
                cx: a + c / 2,
                cy: b + d / 2,
                r1: O.min(c, d) / 2,
                r2: O.max(c, d) / 2,
                r0: O.sqrt(c * c + d * d) / 2,
                path: w(a, b, c, d),
                vb: [a,
                    b, c, d
                ].join(" ")
            }
        }

        function k() {
            return this.join(",").replace(V, "$1")
        }

        function m(a) {
            a = X(a);
            return a.toString = k, a
        }

        function x(a, b, c, d, f, e, l, k, h) {
            if (null == h) a = r(a, b, c, d, f, e, l, k);
            else {
                if (0 > h || r(a, b, c, d, f, e, l, k) < h) h = void 0;
                else {
                    var m, q = .5,
                        u = 1 - q;
                    for (m = r(a, b, c, d, f, e, l, k, u); .01 < wa(m - h);) q /= 2, u += (h > m ? 1 : -1) * q, m = r(a, b, c, d, f, e, l, k, u);
                    h = u
                }
                a = v(a, b, c, d, f, e, l, k, h)
            }
            return a
        }

        function f(c, d) {
            function f(a) {
                return +(+a).toFixed(3)
            }
            return a._.cacher(function(a, e, l) {
                a instanceof b && (a = a.attr("d"));
                a = pa(a);
                for (var k, m, h, q,
                        r, u = "", t = {}, w = 0, B = 0, C = a.length; C > B; B++) {
                    if (h = a[B], "M" == h[0]) k = +h[1], m = +h[2];
                    else {
                        if (q = x(k, m, h[1], h[2], h[3], h[4], h[5], h[6]), w + q > e) {
                            if (d && !t.start) {
                                if (r = x(k, m, h[1], h[2], h[3], h[4], h[5], h[6], e - w), u += ["C" + f(r.start.x), f(r.start.y), f(r.m.x), f(r.m.y), f(r.x), f(r.y)], l) return u;
                                t.start = u;
                                u = ["M" + f(r.x), f(r.y) + "C" + f(r.n.x), f(r.n.y), f(r.end.x), f(r.end.y), f(h[5]), f(h[6])].join();
                                w += q;
                                k = +h[5];
                                m = +h[6];
                                continue
                            }
                            if (!c && !d) return x(k, m, h[1], h[2], h[3], h[4], h[5], h[6], e - w)
                        }
                        w += q;
                        k = +h[5];
                        m = +h[6]
                    }
                    u += h.shift() + h
                }
                return t.end =
                    u, c ? w : d ? t : v(k, m, h[0], h[1], h[2], h[3], h[4], h[5], 1)
            }, null, a._.clone)
        }

        function v(a, b, c, d, f, e, k, l, h) {
            var m = 1 - h,
                q = ta(m, 3),
                r = ta(m, 2),
                u = h * h,
                t = u * h,
                v = q * a + 3 * r * h * c + 3 * m * h * h * f + t * k,
                q = q * b + 3 * r * h * d + 3 * m * h * h * e + t * l,
                r = a + 2 * h * (c - a) + u * (f - 2 * c + a),
                t = b + 2 * h * (d - b) + u * (e - 2 * d + b),
                w = c + 2 * h * (f - c) + u * (k - 2 * f + c),
                u = d + 2 * h * (e - d) + u * (l - 2 * e + d);
            a = m * a + h * c;
            b = m * b + h * d;
            f = m * f + h * k;
            e = m * e + h * l;
            l = 90 - 180 * O.atan2(r - w, t - u) / Z;
            return {
                x: v,
                y: q,
                m: {
                    x: r,
                    y: t
                },
                n: {
                    x: w,
                    y: u
                },
                start: {
                    x: a,
                    y: b
                },
                end: {
                    x: f,
                    y: e
                },
                alpha: l
            }
        }

        function D(b, c, d, f, k, m, q, r) {
            a.is(b, "array") || (b = [b, c, d, f,
                k, m, q, r
            ]);
            b = L.apply(null, b);
            return e(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y)
        }

        function z(a, b, c) {
            return b >= a.x && b <= a.x + a.width && c >= a.y && c <= a.y + a.height
        }

        function A(a, b) {
            return a = e(a), b = e(b), z(b, a.x, a.y) || z(b, a.x2, a.y) || z(b, a.x, a.y2) || z(b, a.x2, a.y2) || z(a, b.x, b.y) || z(a, b.x2, b.y) || z(a, b.x, b.y2) || z(a, b.x2, b.y2) || (a.x < b.x2 && a.x > b.x || b.x < a.x2 && b.x > a.x) && (a.y < b.y2 && a.y > b.y || b.y < a.y2 && b.y > a.y)
        }

        function r(a, b, c, d, f, e, k, l, h) {
            null == h && (h = 1);
            h = (1 < h ? 1 : 0 > h ? 0 : h) / 2;
            for (var m = [-.1252, .1252, -.3678, .3678, -.5873,
                    .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816
                ], q = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], r = 0, u = 0; 12 > u; u++) var t = h * m[u] + h,
                v = t * (t * (-3 * a + 9 * c - 9 * f + 3 * k) + 6 * a - 12 * c + 6 * f) - 3 * a + 3 * c,
                t = t * (t * (-3 * b + 9 * d - 9 * e + 3 * l) + 6 * b - 12 * d + 6 * e) - 3 * b + 3 * d,
                r = r + q[u] * O.sqrt(v * v + t * t);
            return h * r
        }

        function B(a, b, c) {
            a = pa(a);
            b = pa(b);
            for (var d, f, e, k, l, h, m, q, u, t, w = c ? 0 : [], x = 0, B = a.length; B > x; x++) {
                var C = a[x];
                if ("M" == C[0]) d = l = C[1], f = h = C[2];
                else {
                    "C" == C[0] ? (u = [d, f].concat(C.slice(1)), d = u[6], f = u[7]) : (u = [d, f, d, f, l, h, l, h],
                        d = l, f = h);
                    for (var C = 0, E = b.length; E > C; C++) {
                        var z = b[C];
                        if ("M" == z[0]) e = m = z[1], k = q = z[2];
                        else {
                            "C" == z[0] ? (t = [e, k].concat(z.slice(1)), e = t[6], k = t[7]) : (t = [e, k, e, k, m, q, m, q], e = m, k = q);
                            var F = u,
                                J = t,
                                z = c,
                                P = D(F),
                                L = D(J);
                            if (A(P, L)) {
                                for (var P = r.apply(0, F), L = r.apply(0, J), P = ~~(P / 8), L = ~~(L / 8), ka = [], qa = [], O = {}, sa = z ? 0 : [], R = 0; P + 1 > R; R++) {
                                    var X = v.apply(0, F.concat(R / P));
                                    ka.push({
                                        x: X.x,
                                        y: X.y,
                                        t: R / P
                                    })
                                }
                                for (R = 0; L + 1 > R; R++) X = v.apply(0, J.concat(R / L)), qa.push({
                                    x: X.x,
                                    y: X.y,
                                    t: R / L
                                });
                                for (R = 0; P > R; R++)
                                    for (F = 0; L > F; F++) {
                                        var V = ka[R],
                                            Z = ka[R + 1],
                                            J = qa[F],
                                            X = qa[F + 1],
                                            ea = .001 > wa(Z.x - V.x) ? "y" : "x",
                                            ha = .001 > wa(X.x - J.x) ? "y" : "x",
                                            ma;
                                        b: {
                                            ma = V.x;
                                            var ba = V.y,
                                                ta = Z.x,
                                                aa = Z.y,
                                                oa = J.x,
                                                ga = J.y,
                                                Qa = X.x,
                                                La = X.y;
                                            if (!(W(ma, ta) < ca(oa, Qa) || ca(ma, ta) > W(oa, Qa) || W(ba, aa) < ca(ga, La) || ca(ba, aa) > W(ga, La))) {
                                                var Za = (ma * aa - ba * ta) * (oa - Qa) - (ma - ta) * (oa * La - ga * Qa),
                                                    Sa = (ma * aa - ba * ta) * (ga - La) - (ba - aa) * (oa * La - ga * Qa),
                                                    za = (ma - ta) * (ga - La) - (ba - aa) * (oa - Qa);
                                                if (za) {
                                                    var Za = Za / za,
                                                        Sa = Sa / za,
                                                        za = +Za.toFixed(2),
                                                        Ca = +Sa.toFixed(2);
                                                    if (!(za < +ca(ma, ta).toFixed(2) || za > +W(ma, ta).toFixed(2) || za < +ca(oa, Qa).toFixed(2) ||
                                                            za > +W(oa, Qa).toFixed(2) || Ca < +ca(ba, aa).toFixed(2) || Ca > +W(ba, aa).toFixed(2) || Ca < +ca(ga, La).toFixed(2) || Ca > +W(ga, La).toFixed(2))) {
                                                        ma = {
                                                            x: Za,
                                                            y: Sa
                                                        };
                                                        break b
                                                    }
                                                }
                                            }
                                            ma = void 0
                                        }
                                        ma && O[ma.x.toFixed(4)] != ma.y.toFixed(4) && (O[ma.x.toFixed(4)] = ma.y.toFixed(4), V = V.t + wa((ma[ea] - V[ea]) / (Z[ea] - V[ea])) * (Z.t - V.t), J = J.t + wa((ma[ha] - J[ha]) / (X[ha] - J[ha])) * (X.t - J.t), 0 <= V && 1 >= V && 0 <= J && 1 >= J && (z ? sa++ : sa.push({
                                            x: ma.x,
                                            y: ma.y,
                                            t1: V,
                                            t2: J
                                        })))
                                    }
                                z = sa
                            } else z = z ? 0 : [];
                            if (c) w += z;
                            else {
                                P = 0;
                                for (L = z.length; L > P; P++) z[P].segment1 = x, z[P].segment2 = C, z[P].bez1 =
                                    u, z[P].bez2 = t;
                                w = w.concat(z)
                            }
                        }
                    }
                }
            }
            return w
        }

        function t(a) {
            var b = c(a);
            if (b.bbox) return X(b.bbox);
            if (!a) return e();
            a = pa(a);
            for (var f, k = 0, m = 0, q = [], r = [], u = 0, h = a.length; h > u; u++)(f = a[u], "M" == f[0]) ? (k = f[1], m = f[2], q.push(k), r.push(m)) : (k = L(k, m, f[1], f[2], f[3], f[4], f[5], f[6]), q = q.concat(k.min.x, k.max.x), r = r.concat(k.min.y, k.max.y), k = f[5], m = f[6]);
            a = ca.apply(0, q);
            f = ca.apply(0, r);
            q = W.apply(0, q);
            r = W.apply(0, r);
            r = e(a, f, q - a, r - f);
            return b.bbox = X(r), r
        }

        function w(a, b, c, d, f) {
            if (f) return [
                ["M", +a + +f, b],
                ["l", c - 2 * f, 0],
                ["a",
                    f, f, 0, 0, 1, f, f
                ],
                ["l", 0, d - 2 * f],
                ["a", f, f, 0, 0, 1, -f, f],
                ["l", 2 * f - c, 0],
                ["a", f, f, 0, 0, 1, -f, -f],
                ["l", 0, 2 * f - d],
                ["a", f, f, 0, 0, 1, f, -f],
                ["z"]
            ];
            a = [
                ["M", a, b],
                ["l", c, 0],
                ["l", 0, d],
                ["l", -c, 0],
                ["z"]
            ];
            return a.toString = k, a
        }

        function E(a, b, c, f, d) {
            if (null == d && null == f && (f = c), a = +a, b = +b, c = +c, f = +f, null != d) {
                var e = Math.PI / 180,
                    l = a + c * Math.cos(-f * e);
                a += c * Math.cos(-d * e);
                var m = b + c * Math.sin(-f * e);
                b += c * Math.sin(-d * e);
                c = [
                    ["M", l, m],
                    ["A", c, c, 0, +(180 < d - f), 0, a, b]
                ]
            } else c = [
                ["M", a, b],
                ["m", 0, -f],
                ["a", c, f, 0, 1, 1, 0, 2 * f],
                ["a", c, f, 0, 1, 1, 0, -2 * f],
                ["z"]
            ];
            return c.toString = k, c
        }

        function C(b) {
            var f = c(b);
            if (f.abs) return m(f.abs);
            if (sa(b, "array") && sa(b && b[0], "array") || (b = a.parsePathString(b)), !b || !b.length) return [
                ["M", 0, 0]
            ];
            var e, l = [],
                r = 0,
                t = 0,
                v = 0,
                w = 0,
                h = 0;
            "M" == b[0][0] && (r = +b[0][1], t = +b[0][2], v = r, w = t, h++, l[0] = ["M", r, t]);
            for (var x, B = 3 == b.length && "M" == b[0][0] && "R" == b[1][0].toUpperCase() && "Z" == b[2][0].toUpperCase(), C = h, z = b.length; z > C; C++) {
                if (l.push(h = []), x = b[C], e = x[0], e != e.toUpperCase()) switch (h[0] = e.toUpperCase(), h[0]) {
                        case "A":
                            h[1] = x[1];
                            h[2] = x[2];
                            h[3] = x[3];
                            h[4] = x[4];
                            h[5] = x[5];
                            h[6] = +x[6] + r;
                            h[7] = +x[7] + t;
                            break;
                        case "V":
                            h[1] = +x[1] + t;
                            break;
                        case "H":
                            h[1] = +x[1] + r;
                            break;
                        case "R":
                            for (var D = [r, t].concat(x.slice(1)), F = 2, J = D.length; J > F; F++) D[F] = +D[F] + r, D[++F] = +D[F] + t;
                            l.pop();
                            l = l.concat(ka(D, B));
                            break;
                        case "O":
                            l.pop();
                            D = E(r, t, x[1], x[2]);
                            D.push(D[0]);
                            l = l.concat(D);
                            break;
                        case "U":
                            l.pop();
                            l = l.concat(E(r, t, x[1], x[2], x[3]));
                            h = ["U"].concat(l[l.length - 1].slice(-2));
                            break;
                        case "M":
                            v = +x[1] + r, w = +x[2] + t;
                        default:
                            for (F = 1, J = x.length; J > F; F++) h[F] = +x[F] + (F % 2 ? r : t)
                    } else if ("R" ==
                        e) D = [r, t].concat(x.slice(1)), l.pop(), l = l.concat(ka(D, B)), h = ["R"].concat(x.slice(-2));
                    else if ("O" == e) l.pop(), D = E(r, t, x[1], x[2]), D.push(D[0]), l = l.concat(D);
                else if ("U" == e) l.pop(), l = l.concat(E(r, t, x[1], x[2], x[3])), h = ["U"].concat(l[l.length - 1].slice(-2));
                else
                    for (D = 0, F = x.length; F > D; D++) h[D] = x[D];
                if (e = e.toUpperCase(), "O" != e) switch (h[0]) {
                    case "Z":
                        r = +v;
                        t = +w;
                        break;
                    case "H":
                        r = h[1];
                        break;
                    case "V":
                        t = h[1];
                        break;
                    case "M":
                        v = h[h.length - 2], w = h[h.length - 1];
                    default:
                        r = h[h.length - 2], t = h[h.length - 1]
                }
            }
            return l.toString =
                k, f.abs = m(l), l
        }

        function F(a, b, c, f) {
            return [a, b, c, f, c, f]
        }

        function J(a, b, c, f, d, e) {
            var l = 1 / 3,
                k = 2 / 3;
            return [l * a + k * c, l * b + k * f, l * d + k * c, l * e + k * f, d, e]
        }

        function P(b, c, f, d, e, l, k, m, h, q) {
            var r, t = 120 * Z / 180,
                u = Z / 180 * (+e || 0),
                v = [],
                w = a._.cacher(function(a, b, c) {
                    var h = a * O.cos(c) - b * O.sin(c);
                    a = a * O.sin(c) + b * O.cos(c);
                    return {
                        x: h,
                        y: a
                    }
                });
            if (q) C = q[0], r = q[1], l = q[2], x = q[3];
            else {
                r = w(b, c, -u);
                b = r.x;
                c = r.y;
                r = w(m, h, -u);
                m = r.x;
                h = r.y;
                r = (O.cos(Z / 180 * e), O.sin(Z / 180 * e), (b - m) / 2);
                C = (c - h) / 2;
                x = r * r / (f * f) + C * C / (d * d);
                1 < x && (x = O.sqrt(x), f *= x, d *= x);
                var x =
                    f * f,
                    B = d * d,
                    x = (l == k ? -1 : 1) * O.sqrt(wa((x * B - x * C * C - B * r * r) / (x * C * C + B * r * r)));
                l = x * f * C / d + (b + m) / 2;
                var x = x * -d * r / f + (c + h) / 2,
                    C = O.asin(((c - x) / d).toFixed(9));
                r = O.asin(((h - x) / d).toFixed(9));
                C = l > b ? Z - C : C;
                r = l > m ? Z - r : r;
                0 > C && (C = 2 * Z + C);
                0 > r && (r = 2 * Z + r);
                k && C > r && (C -= 2 * Z);
                !k && r > C && (r -= 2 * Z)
            }
            if (wa(r - C) > t) {
                var v = r,
                    B = m,
                    z = h;
                r = C + t * (k && r > C ? 1 : -1);
                m = l + f * O.cos(r);
                h = x + d * O.sin(r);
                v = P(m, h, f, d, e, 0, k, B, z, [r, v, l, x])
            }
            l = r - C;
            e = O.cos(C);
            t = O.sin(C);
            k = O.cos(r);
            r = O.sin(r);
            l = O.tan(l / 4);
            f = 4 / 3 * f * l;
            l *= 4 / 3 * d;
            d = [b, c];
            b = [b + f * t, c - l * e];
            c = [m + f * r, h - l * k];
            m = [m, h];
            if (b[0] = 2 * d[0] - b[0], b[1] = 2 * d[1] - b[1], q) return [b, c, m].concat(v);
            v = [b, c, m].concat(v).join().split(",");
            q = [];
            m = 0;
            for (h = v.length; h > m; m++) q[m] = m % 2 ? w(v[m - 1], v[m], u).y : w(v[m], v[m + 1], u).x;
            return q
        }

        function L(a, b, c, f, d, e, l, k) {
            for (var h, m, q, r, t, u, v, x = [], w = [
                    [],
                    []
                ], B = 0; 2 > B; ++B)(0 == B ? (m = 6 * a - 12 * c + 6 * d, h = -3 * a + 9 * c - 9 * d + 3 * l, q = 3 * c - 3 * a) : (m = 6 * b - 12 * f + 6 * e, h = -3 * b + 9 * f - 9 * e + 3 * k, q = 3 * f - 3 * b), 1E-12 > wa(h)) ? 1E-12 > wa(m) || (r = -q / m, 0 < r && 1 > r && x.push(r)) : (r = m * m - 4 * q * h, v = O.sqrt(r), 0 > r || (t = (-m + v) / (2 * h), 0 < t && 1 > t && x.push(t), u = (-m - v) / (2 * h), 0 <
                u && 1 > u && x.push(u)));
            for (q = m = x.length; m--;) r = x[m], h = 1 - r, w[0][m] = h * h * h * a + 3 * h * h * r * c + 3 * h * r * r * d + r * r * r * l, w[1][m] = h * h * h * b + 3 * h * h * r * f + 3 * h * r * r * e + r * r * r * k;
            return w[0][q] = a, w[1][q] = b, w[0][q + 1] = l, w[1][q + 1] = k, w[0].length = w[1].length = q + 2, {
                min: {
                    x: ca.apply(0, w[0]),
                    y: ca.apply(0, w[1])
                },
                max: {
                    x: W.apply(0, w[0]),
                    y: W.apply(0, w[1])
                }
            }
        }

        function pa(a, b) {
            var f = !b && c(a);
            if (!b && f.curve) return m(f.curve);
            var e = C(a),
                l = b && C(b),
                k = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                q = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                r = function(a,
                    b, c) {
                    var h, f;
                    if (!a) return ["C", b.x, b.y, b.x, b.y, b.x, b.y];
                    switch (!(a[0] in {
                        T: 1,
                        Q: 1
                    }) && (b.qx = b.qy = null), a[0]) {
                        case "M":
                            b.X = a[1];
                            b.Y = a[2];
                            break;
                        case "A":
                            a = ["C"].concat(P.apply(0, [b.x, b.y].concat(a.slice(1))));
                            break;
                        case "S":
                            "C" == c || "S" == c ? (h = 2 * b.x - b.bx, f = 2 * b.y - b.by) : (h = b.x, f = b.y);
                            a = ["C", h, f].concat(a.slice(1));
                            break;
                        case "T":
                            "Q" == c || "T" == c ? (b.qx = 2 * b.x - b.qx, b.qy = 2 * b.y - b.qy) : (b.qx = b.x, b.qy = b.y);
                            a = ["C"].concat(J(b.x, b.y, b.qx, b.qy, a[1], a[2]));
                            break;
                        case "Q":
                            b.qx = a[1];
                            b.qy = a[2];
                            a = ["C"].concat(J(b.x, b.y, a[1],
                                a[2], a[3], a[4]));
                            break;
                        case "L":
                            a = ["C"].concat(F(b.x, b.y, a[1], a[2]));
                            break;
                        case "H":
                            a = ["C"].concat(F(b.x, b.y, a[1], b.y));
                            break;
                        case "V":
                            a = ["C"].concat(F(b.x, b.y, b.x, a[1]));
                            break;
                        case "Z":
                            a = ["C"].concat(F(b.x, b.y, b.X, b.Y))
                    }
                    return a
                },
                h = function(a, b) {
                    if (7 < a[b].length) {
                        a[b].shift();
                        for (var c = a[b]; c.length;) v[b] = "A", l && (x[b] = "A"), a.splice(b++, 0, ["C"].concat(c.splice(0, 6)));
                        a.splice(b, 1);
                        E = W(e.length, l && l.length || 0)
                    }
                },
                t = function(a, b, c, h, f) {
                    a && b && "M" == a[f][0] && "M" != b[f][0] && (b.splice(f, 0, ["M", h.x, h.y]), c.bx =
                        0, c.by = 0, c.x = a[f][1], c.y = a[f][2], E = W(e.length, l && l.length || 0))
                },
                v = [],
                x = [],
                w = "",
                B = "",
                z = 0,
                E = W(e.length, l && l.length || 0);
            for (; E > z; z++) {
                e[z] && (w = e[z][0]);
                "C" != w && (v[z] = w, z && (B = v[z - 1]));
                e[z] = r(e[z], k, B);
                "A" != v[z] && "C" == w && (v[z] = "C");
                h(e, z);
                l && (l[z] && (w = l[z][0]), "C" != w && (x[z] = w, z && (B = x[z - 1])), l[z] = r(l[z], q, B), "A" != x[z] && "C" == w && (x[z] = "C"), h(l, z));
                t(e, l, k, q, z);
                t(l, e, q, k, z);
                var D = e[z],
                    A = l && l[z],
                    L = D.length,
                    ka = l && A.length;
                k.x = D[L - 2];
                k.y = D[L - 1];
                k.bx = ba(D[L - 4]) || k.x;
                k.by = ba(D[L - 3]) || k.y;
                q.bx = l && (ba(A[ka - 4]) ||
                    q.x);
                q.by = l && (ba(A[ka - 3]) || q.y);
                q.x = l && A[ka - 2];
                q.y = l && A[ka - 1]
            }
            return l || (f.curve = m(e)), l ? [e, l] : e
        }

        function ka(a, b) {
            for (var c = [], f = 0, d = a.length; d - 2 * !b > f; f += 2) {
                var e = [{
                    x: +a[f - 2],
                    y: +a[f - 1]
                }, {
                    x: +a[f],
                    y: +a[f + 1]
                }, {
                    x: +a[f + 2],
                    y: +a[f + 3]
                }, {
                    x: +a[f + 4],
                    y: +a[f + 5]
                }];
                b ? f ? d - 4 == f ? e[3] = {
                    x: +a[0],
                    y: +a[1]
                } : d - 2 == f && (e[2] = {
                    x: +a[0],
                    y: +a[1]
                }, e[3] = {
                    x: +a[2],
                    y: +a[3]
                }) : e[0] = {
                    x: +a[d - 2],
                    y: +a[d - 1]
                } : d - 4 == f ? e[3] = e[2] : f || (e[0] = {
                    x: +a[f],
                    y: +a[f + 1]
                });
                c.push(["C", (-e[0].x + 6 * e[1].x + e[2].x) / 6, (-e[0].y + 6 * e[1].y + e[2].y) / 6, (e[1].x + 6 * e[2].x - e[3].x) /
                    6, (e[1].y + 6 * e[2].y - e[3].y) / 6, e[2].x, e[2].y
                ])
            }
            return c
        }
        var qa = b.prototype,
            sa = a.is,
            X = a._.clone,
            R = "hasOwnProperty",
            V = /,?([a-z]),?/gi,
            ba = parseFloat,
            O = Math,
            Z = O.PI,
            ca = O.min,
            W = O.max,
            ta = O.pow,
            wa = O.abs,
            aa = f(1),
            ga = f(),
            oa = f(0, 1),
            ea = a._unit2px;
        a.path = c;
        a.path.getTotalLength = aa;
        a.path.getPointAtLength = ga;
        a.path.getSubpath = function(a, b, c) {
            if (1E-6 > this.getTotalLength(a) - c) return oa(a, b).end;
            a = oa(a, c, 1);
            return b ? oa(a, b).end : a
        };
        qa.getTotalLength = function() {
            return this.node.getTotalLength ? this.node.getTotalLength() :
                void 0
        };
        qa.getPointAtLength = function(a) {
            return ga(this.attr("d"), a)
        };
        qa.getSubpath = function(b, c) {
            return a.path.getSubpath(this.attr("d"), b, c)
        };
        a._.box = e;
        a.path.findDotsAtSegment = v;
        a.path.bezierBBox = D;
        a.path.isPointInsideBBox = z;
        a.closest = function(b, c, f, d) {
            for (var k = 100, m = e(b - k / 2, c - k / 2, k, k), q = [], r = f[0].hasOwnProperty("x") ? function(a) {
                    return {
                        x: f[a].x,
                        y: f[a].y
                    }
                } : function(a) {
                    return {
                        x: f[a],
                        y: d[a]
                    }
                }, h = 0; 1E6 >= k && !h;) {
                for (var t = 0, u = f.length; u > t; t++) {
                    var v = r(t);
                    if (z(m, v.x, v.y)) {
                        h++;
                        q.push(v);
                        break
                    }
                }
                h || (k *=
                    2, m = e(b - k / 2, c - k / 2, k, k))
            }
            if (1E6 != k) {
                for (var w, k = 1 / 0, t = 0, u = q.length; u > t; t++) m = a.len(b, c, q[t].x, q[t].y), k > m && (k = m, q[t].len = m, w = q[t]);
                return w
            }
        };
        a.path.isBBoxIntersect = A;
        a.path.intersection = function(a, b) {
            return B(a, b)
        };
        a.path.intersectionNumber = function(a, b) {
            return B(a, b, 1)
        };
        a.path.isPointInside = function(a, b, c) {
            var f = t(a);
            return z(f, b, c) && 1 == B(a, [
                ["M", b, c],
                ["H", f.x2 + 10]
            ], 1) % 2
        };
        a.path.getBBox = t;
        a.path.get = {
            path: function(a) {
                return a.attr("path")
            },
            circle: function(a) {
                a = ea(a);
                return E(a.cx, a.cy, a.r)
            },
            ellipse: function(a) {
                a =
                    ea(a);
                return E(a.cx || 0, a.cy || 0, a.rx, a.ry)
            },
            rect: function(a) {
                a = ea(a);
                return w(a.x || 0, a.y || 0, a.width, a.height, a.rx, a.ry)
            },
            image: function(a) {
                a = ea(a);
                return w(a.x || 0, a.y || 0, a.width, a.height)
            },
            line: function(a) {
                return "M" + [a.attr("x1") || 0, a.attr("y1") || 0, a.attr("x2"), a.attr("y2")]
            },
            polyline: function(a) {
                return "M" + a.attr("points")
            },
            polygon: function(a) {
                return "M" + a.attr("points") + "z"
            },
            deflt: function(a) {
                a = a.node.getBBox();
                return w(a.x, a.y, a.width, a.height)
            }
        };
        a.path.toRelative = function(b) {
            var f = c(b),
                e = String.prototype.toLowerCase;
            if (f.rel) return m(f.rel);
            a.is(b, "array") && a.is(b && b[0], "array") || (b = a.parsePathString(b));
            var l = [],
                r = 0,
                t = 0,
                v = 0,
                w = 0,
                h = 0;
            "M" == b[0][0] && (r = b[0][1], t = b[0][2], v = r, w = t, h++, l.push(["M", r, t]));
            for (var x = b.length; x > h; h++) {
                var B = l[h] = [],
                    C = b[h];
                if (C[0] != e.call(C[0])) switch (B[0] = e.call(C[0]), B[0]) {
                    case "a":
                        B[1] = C[1];
                        B[2] = C[2];
                        B[3] = C[3];
                        B[4] = C[4];
                        B[5] = C[5];
                        B[6] = +(C[6] - r).toFixed(3);
                        B[7] = +(C[7] - t).toFixed(3);
                        break;
                    case "v":
                        B[1] = +(C[1] - t).toFixed(3);
                        break;
                    case "m":
                        v = C[1], w = C[2];
                    default:
                        for (var z = 1, E = C.length; E >
                            z; z++) B[z] = +(C[z] - (z % 2 ? r : t)).toFixed(3)
                } else
                    for (l[h] = [], "m" == C[0] && (v = C[1] + r, w = C[2] + t), B = 0, z = C.length; z > B; B++) l[h][B] = C[B];
                C = l[h].length;
                switch (l[h][0]) {
                    case "z":
                        r = v;
                        t = w;
                        break;
                    case "h":
                        r += +l[h][C - 1];
                        break;
                    case "v":
                        t += +l[h][C - 1];
                        break;
                    default:
                        r += +l[h][C - 2], t += +l[h][C - 1]
                }
            }
            return l.toString = k, f.rel = m(l), l
        };
        a.path.toAbsolute = C;
        a.path.toCubic = pa;
        a.path.map = function(a, b) {
            if (!b) return a;
            var c, f, d, e, l, k, h;
            a = pa(a);
            d = 0;
            for (l = a.length; l > d; d++)
                for (h = a[d], e = 1, k = h.length; k > e; e += 2) c = b.x(h[e], h[e + 1]), f = b.y(h[e],
                    h[e + 1]), h[e] = c, h[e + 1] = f;
            return a
        };
        a.path.toString = k;
        a.path.clone = m
    }), m.plugin(function(a) {
        var b = Math.max,
            d = Math.min,
            e = function(a) {
                if (this.items = [], this.bindings = {}, this.length = 0, this.type = "set", a)
                    for (var b = 0, c = a.length; c > b; b++) a[b] && (this[this.items.length] = this.items[this.items.length] = a[b], this.length++)
            },
            m = e.prototype;
        m.push = function() {
            for (var a, b, c = 0, d = arguments.length; d > c; c++)(a = arguments[c]) && (b = this.items.length, this[b] = this.items[b] = a, this.length++);
            return this
        };
        m.pop = function() {
            return this.length &&
                delete this[this.length--], this.items.pop()
        };
        m.forEach = function(a, b) {
            for (var c = 0, d = this.items.length; d > c && !1 !== a.call(b, this.items[c], c); c++);
            return this
        };
        m.animate = function(b, d, f, e) {
            "function" != typeof f || f.length || (e = f, f = k.linear);
            b instanceof a._.Animation && (e = b.callback, f = b.easing, d = f.dur, b = b.attr);
            var l = arguments;
            if (a.is(b, "array") && a.is(l[l.length - 1], "array")) var m = !0;
            var q, r = function() {
                    q ? this.b = q : q = this.b
                },
                B = 0,
                t = this,
                w = e && function() {
                    ++B == t.length && e.call(this)
                };
            return this.forEach(function(a,
                e) {
                c.once("snap.animcreated." + a.id, r);
                m ? l[e] && a.animate.apply(a, l[e]) : a.animate(b, d, f, w)
            })
        };
        m.remove = function() {
            for (; this.length;) this.pop().remove();
            return this
        };
        m.bind = function(a, b, c) {
            var d = {};
            if ("function" == typeof b) this.bindings[a] = b;
            else {
                var e = c || a;
                this.bindings[a] = function(a) {
                    d[e] = a;
                    b.attr(d)
                }
            }
            return this
        };
        m.attr = function(a) {
            var b = {},
                c;
            for (c in a) this.bindings[c] ? this.bindings[c](a[c]) : b[c] = a[c];
            a = 0;
            for (c = this.items.length; c > a; a++) this.items[a].attr(b);
            return this
        };
        m.clear = function() {
            for (; this.length;) this.pop()
        };
        m.splice = function(a, c) {
            a = 0 > a ? b(this.length + a, 0) : a;
            c = b(0, d(this.length - a, c));
            var f, k = [],
                m = [],
                q = [];
            for (f = 2; f < arguments.length; f++) q.push(arguments[f]);
            for (f = 0; c > f; f++) m.push(this[a + f]);
            for (; f < this.length - a; f++) k.push(this[a + f]);
            var A = q.length;
            for (f = 0; f < A + k.length; f++) this.items[a + f] = this[a + f] = A > f ? q[f] : k[f - A];
            for (f = this.items.length = this.length -= c - A; this[f];) delete this[f++];
            return new e(m)
        };
        m.exclude = function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (this[b] == a) return this.splice(b, 1), !0;
            return !1
        };
        m.insertAfter =
            function(a) {
                for (var b = this.items.length; b--;) this.items[b].insertAfter(a);
                return this
            };
        m.getBBox = function() {
            for (var a = [], c = [], f = [], e = [], l = this.items.length; l--;)
                if (!this.items[l].removed) {
                    var k = this.items[l].getBBox();
                    a.push(k.x);
                    c.push(k.y);
                    f.push(k.x + k.width);
                    e.push(k.y + k.height)
                }
            return a = d.apply(0, a), c = d.apply(0, c), f = b.apply(0, f), e = b.apply(0, e), {
                x: a,
                y: c,
                x2: f,
                y2: e,
                width: f - a,
                height: e - c,
                cx: a + (f - a) / 2,
                cy: c + (e - c) / 2
            }
        };
        m.clone = function(a) {
            a = new e;
            for (var b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].clone());
            return a
        };
        m.toString = function() {
            return "Snap\u2018s set"
        };
        m.type = "set";
        a.Set = e;
        a.set = function() {
            var a = new e;
            return arguments.length && a.push.apply(a, Array.prototype.slice.call(arguments, 0)), a
        }
    }), m.plugin(function(a, b) {
        function d(a) {
            var b = a[0];
            switch (b.toLowerCase()) {
                case "t":
                    return [b, 0, 0];
                case "m":
                    return [b, 1, 0, 0, 1, 0, 0];
                case "r":
                    return 4 == a.length ? [b, 0, a[2], a[3]] : [b, 0];
                case "s":
                    return 5 == a.length ? [b, 1, 1, a[3], a[4]] : 3 == a.length ? [b, 1, 1] : [b, 1]
            }
        }

        function e(b, c, f) {
            c = B(c).replace(/\.{3}|\u2026/g, b);
            b = a.parseTransformString(b) || [];
            c = a.parseTransformString(c) || [];
            for (var l, k, m, q, r = Math.max(b.length, c.length), u = [], x = [], z = 0; r > z; z++) {
                if (m = b[z] || d(c[z]), q = c[z] || d(m), m[0] != q[0] || "r" == m[0].toLowerCase() && (m[2] != q[2] || m[3] != q[3]) || "s" == m[0].toLowerCase() && (m[3] != q[3] || m[4] != q[4])) {
                    b = a._.transform2matrix(b, f());
                    c = a._.transform2matrix(c, f());
                    u = [
                        ["m", b.a, b.b, b.c, b.d, b.e, b.f]
                    ];
                    x = [
                        ["m", c.a, c.b, c.c, c.d, c.e, c.f]
                    ];
                    break
                }
                u[z] = [];
                x[z] = [];
                l = 0;
                for (k = Math.max(m.length, q.length); k > l; l++) l in m && (u[z][l] = m[l]), l in q && (x[z][l] = q[l])
            }
            return {
                from: D(u),
                to: D(x),
                f: v(u)
            }
        }

        function k(a) {
            return a
        }

        function m(a) {
            return function(b) {
                return +b.toFixed(3) + a
            }
        }

        function x(a) {
            return a.join(" ")
        }

        function f(b) {
            return a.rgb(b[0], b[1], b[2])
        }

        function v(a) {
            var b, c, f, d, e, l, k = 0,
                m = [];
            b = 0;
            for (c = a.length; c > b; b++) {
                e = "[";
                l = ['"' + a[b][0] + '"'];
                f = 1;
                for (d = a[b].length; d > f; f++) l[f] = "val[" + k++ + "]";
                e += l + "]";
                m[b] = e
            }
            return Function("val", "return Snap.path.toString.call([" + m + "])")
        }

        function D(a) {
            for (var b = [], c = 0, f = a.length; f > c; c++)
                for (var d = 1, e = a[c].length; e > d; d++) b.push(a[c][d]);
            return b
        }

        function z(b, c) {
            return a.is(b, "array") && a.is(c, "array") ? b.toString() == c.toString() : !1
        }
        var A = {},
            r = /[a-z]+$/i,
            B = String;
        A.stroke = A.fill = "colour";
        b.prototype.equal = function(a, b) {
            return c("snap.util.equal", this, a, b).firstDefined()
        };
        c.on("snap.util.equal", function(b, c) {
            var d, C, F = B(this.attr(b) || ""),
                J = this;
            if (isFinite(parseFloat(F)) && isFinite(parseFloat(c))) return {
                from: parseFloat(F),
                to: parseFloat(c),
                f: k
            };
            if ("colour" == A[b]) return d = a.color(F), C = a.color(c), {
                from: [d.r, d.g, d.b, d.opacity],
                to: [C.r, C.g, C.b, C.opacity],
                f: f
            };
            if ("viewBox" == b) return d = this.attr(b).vb.split(" ").map(Number), C = c.split(" ").map(Number), {
                from: d,
                to: C,
                f: x
            };
            if ("transform" == b || "gradientTransform" == b || "patternTransform" == b) return c instanceof a.Matrix && (c = c.toTransformString()), a._.rgTransform.test(c) || (c = a._.svgTransform2string(c)), e(F, c, function() {
                return J.getBBox(1)
            });
            if ("d" == b || "path" == b) return d = a.path.toCubic(F, c), {
                from: D(d[0]),
                to: D(d[1]),
                f: v(d[0])
            };
            if ("points" == b) return d = B(F).split(a._.separator), C = B(c).split(a._.separator), {
                from: d,
                to: C,
                f: function(a) {
                    return a
                }
            };
            d = F.match(r);
            C = B(c).match(r);
            return d && z(d, C) ? {
                from: parseFloat(F),
                to: parseFloat(c),
                f: m(d)
            } : {
                from: this.asPX(b),
                to: this.asPX(b, c),
                f: k
            }
        })
    }), m.plugin(function(a, b, d, e) {
        var k = b.prototype,
            m = "createTouch" in e.doc;
        b = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel".split(" ");
        var x = {
                mousedown: "touchstart",
                mousemove: "touchmove",
                mouseup: "touchend"
            },
            f = function(a, b) {
                var c = "y" == a ? "scrollTop" : "scrollLeft",
                    f = b && b.node ? b.node.ownerDocument :
                    e.doc;
                return f[c in f.documentElement ? "documentElement" : "body"][c]
            },
            v = function() {
                return this.originalEvent.preventDefault()
            },
            D = function() {
                return this.originalEvent.stopPropagation()
            },
            z = function(a, b, c, d) {
                var e = m && x[b] ? x[b] : b,
                    l = function(e) {
                        var l = f("y", d),
                            k = f("x", d);
                        if (m && x.hasOwnProperty(b))
                            for (var q = 0, r = e.targetTouches && e.targetTouches.length; r > q; q++)
                                if (e.targetTouches[q].target == a || a.contains(e.targetTouches[q].target)) {
                                    r = e;
                                    e = e.targetTouches[q];
                                    e.originalEvent = r;
                                    e.preventDefault = v;
                                    e.stopPropagation =
                                        D;
                                    break
                                }
                        return c.call(d, e, e.clientX + k, e.clientY + l)
                    };
                return b !== e && a.addEventListener(b, l, !1), a.addEventListener(e, l, !1),
                    function() {
                        return b !== e && a.removeEventListener(b, l, !1), a.removeEventListener(e, l, !1), !0
                    }
            },
            A = [],
            r = function(a) {
                for (var b, d = a.clientX, e = a.clientY, l = f("y"), k = f("x"), q = A.length; q--;) {
                    if (b = A[q], m)
                        for (var r, t = a.touches && a.touches.length; t--;) {
                            if (r = a.touches[t], r.identifier == b.el._drag.id || b.el.node.contains(r.target)) {
                                d = r.clientX;
                                e = r.clientY;
                                (a.originalEvent ? a.originalEvent : a).preventDefault();
                                break
                            }
                        } else a.preventDefault();
                    t = b.el.node;
                    t.nextSibling;
                    t.parentNode;
                    t.style.display;
                    d += k;
                    e += l;
                    c("snap.drag.move." + b.el.id, b.move_scope || b.el, d - b.el._drag.x, e - b.el._drag.y, d, e, a)
                }
            },
            B = function(b) {
                a.unmousemove(r).unmouseup(B);
                for (var f, d = A.length; d--;) f = A[d], f.el._drag = {}, c("snap.drag.end." + f.el.id, f.end_scope || f.start_scope || f.move_scope || f.el, b), c.off("snap.drag.*." + f.el.id);
                A = []
            };
        for (d = b.length; d--;) ! function(b) {
            a[b] = k[b] = function(c, f) {
                if (a.is(c, "function")) this.events = this.events || [], this.events.push({
                    name: b,
                    f: c,
                    unbind: z(this.node || document, b, c, f || this)
                });
                else
                    for (var d = 0, e = this.events.length; e > d; d++)
                        if (this.events[d].name == b) try {
                            this.events[d].f.call(this)
                        } catch (l) {}
                return this
            };
            a["un" + b] = k["un" + b] = function(a) {
                for (var c = this.events || [], f = c.length; f--;)
                    if (c[f].name == b && (c[f].f == a || !a)) return c[f].unbind(), c.splice(f, 1), !c.length && delete this.events, this;
                return this
            }
        }(b[d]);
        k.hover = function(a, b, c, f) {
            return this.mouseover(a, c).mouseout(b, f || c)
        };
        k.unhover = function(a, b) {
            return this.unmouseover(a).unmouseout(b)
        };
        var t = [];
        k.drag = function(b, f, d, e, l, k) {
            function m(q, t, u) {
                (q.originalEvent || q).preventDefault();
                v._drag.x = t;
                v._drag.y = u;
                v._drag.id = q.identifier;
                !A.length && a.mousemove(r).mouseup(B);
                A.push({
                    el: v,
                    move_scope: e,
                    start_scope: l,
                    end_scope: k
                });
                f && c.on("snap.drag.start." + v.id, f);
                b && c.on("snap.drag.move." + v.id, b);
                d && c.on("snap.drag.end." + v.id, d);
                c("snap.drag.start." + v.id, l || e || v, t, u, q)
            }

            function q(a, b, f) {
                c("snap.draginit." + v.id, v, a, b, f)
            }
            var v = this;
            if (!arguments.length) {
                var u;
                return v.drag(function(a, b) {
                    this.attr({
                        transform: u +
                            (u ? "T" : "t") + [a, b]
                    })
                }, function() {
                    u = this.transform().local
                })
            }
            return c.on("snap.draginit." + v.id, m), v._drag = {}, t.push({
                el: v,
                start: m,
                init: q
            }), v.mousedown(q), v
        };
        k.undrag = function() {
            for (var b = t.length; b--;) t[b].el == this && (this.unmousedown(t[b].init), t.splice(b, 1), c.unbind("snap.drag.*." + this.id), c.unbind("snap.draginit." + this.id));
            return !t.length && a.unmousemove(r).unmouseup(B), this
        }
    }), m.plugin(function(a, b, d) {
        d = (b.prototype, d.prototype);
        var e = /^\s*url\((.+)\)/,
            k = String,
            m = a._.$;
        a.filter = {};
        d.filter = function(c) {
            var f =
                this;
            "svg" != f.type && (f = f.paper);
            c = a.parse(k(c));
            var d = a._.id(),
                e = (f.node.offsetWidth, f.node.offsetHeight, m("filter"));
            return m(e, {
                id: d,
                filterUnits: "userSpaceOnUse"
            }), e.appendChild(c.node), f.defs.appendChild(e), new b(e)
        };
        c.on("snap.util.getattr.filter", function() {
            c.stop();
            var b = m(this.node, "filter");
            if (b) return (b = k(b).match(e)) && a.select(b[1])
        });
        c.on("snap.util.attr.filter", function(d) {
            if (d instanceof b && "filter" == d.type) {
                c.stop();
                var f = d.node.id;
                f || (m(d.node, {
                    id: d.id
                }), f = d.id);
                m(this.node, {
                    filter: a.url(f)
                })
            }
            d &&
                "none" != d || (c.stop(), this.node.removeAttribute("filter"))
        });
        a.filter.blur = function(b, c) {
            null == b && (b = 2);
            return a.format('<feGaussianBlur stdDeviation="{def}"/>', {
                def: null == c ? b : [b, c]
            })
        };
        a.filter.blur.toString = function() {
            return this()
        };
        a.filter.shadow = function(b, c, d, e, l) {
            return "string" == typeof d && (e = d, l = e, d = 4), "string" != typeof e && (l = e, e = "#000"), e = e || "#000", null == d && (d = 4), null == l && (l = 1), null == b && (b = 0, c = 2), null == c && (c = b), e = a.color(e), a.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
                color: e,
                dx: b,
                dy: c,
                blur: d,
                opacity: l
            })
        };
        a.filter.shadow.toString = function() {
            return this()
        };
        a.filter.grayscale = function(b) {
            return null == b && (b = 1), a.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
                a: .2126 + .7874 * (1 - b),
                b: .7152 - .7152 * (1 - b),
                c: .0722 - .0722 * (1 - b),
                d: .2126 - .2126 * (1 - b),
                e: .7152 + .2848 * (1 - b),
                f: .0722 - .0722 * (1 - b),
                g: .2126 - .2126 * (1 - b),
                h: .0722 + .9278 * (1 - b)
            })
        };
        a.filter.grayscale.toString = function() {
            return this()
        };
        a.filter.sepia = function(b) {
            return null ==
                b && (b = 1), a.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
                    a: .393 + .607 * (1 - b),
                    b: .769 - .769 * (1 - b),
                    c: .189 - .189 * (1 - b),
                    d: .349 - .349 * (1 - b),
                    e: .686 + .314 * (1 - b),
                    f: .168 - .168 * (1 - b),
                    g: .272 - .272 * (1 - b),
                    h: .534 - .534 * (1 - b),
                    i: .131 + .869 * (1 - b)
                })
        };
        a.filter.sepia.toString = function() {
            return this()
        };
        a.filter.saturate = function(b) {
            return null == b && (b = 1), a.format('<feColorMatrix type="saturate" values="{amount}"/>', {
                amount: 1 - b
            })
        };
        a.filter.saturate.toString = function() {
            return this()
        };
        a.filter.hueRotate = function(b) {
            return b = b || 0, a.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
                angle: b
            })
        };
        a.filter.hueRotate.toString = function() {
            return this()
        };
        a.filter.invert = function(b) {
            return null == b && (b = 1), a.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
                amount: b,
                amount2: 1 - b
            })
        };
        a.filter.invert.toString = function() {
            return this()
        };
        a.filter.brightness = function(b) {
            return null == b && (b = 1), a.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
                amount: b
            })
        };
        a.filter.brightness.toString = function() {
            return this()
        };
        a.filter.contrast = function(b) {
            return null == b && (b = 1), a.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
                amount: b,
                amount2: .5 - b / 2
            })
        };
        a.filter.contrast.toString = function() {
            return this()
        }
    }), m.plugin(function(a, b) {
        var c = a._.box,
            e = a.is,
            k = /^[^a-z]*([tbmlrc])/i,
            m = function() {
                return "T" + this.dx + "," + this.dy
            };
        b.prototype.getAlign = function(a, b) {
            null == b && e(a, "string") && (b = a, a = null);
            a = a || this.paper;
            var v = a.getBBox ? a.getBBox() : c(a),
                D = this.getBBox(),
                z = {};
            switch (b = b && b.match(k), b ? b[1].toLowerCase() : "c") {
                case "t":
                    z.dx = 0;
                    z.dy = v.y - D.y;
                    break;
                case "b":
                    z.dx = 0;
                    z.dy = v.y2 - D.y2;
                    break;
                case "m":
                    z.dx = 0;
                    z.dy = v.cy - D.cy;
                    break;
                case "l":
                    z.dx =
                        v.x - D.x;
                    z.dy = 0;
                    break;
                case "r":
                    z.dx = v.x2 - D.x2;
                    z.dy = 0;
                    break;
                default:
                    z.dx = v.cx - D.cx, z.dy = 0
            }
            return z.toString = m, z
        };
        b.prototype.align = function(a, b) {
            return this.transform("..." + this.getAlign(a, b))
        }
    }), m
});
(function(e, c) {
    function k(a) {
        if ("function" == typeof require && "undefined" !== typeof module && module.exports) try {
            return require(a.toLowerCase())
        } catch (b) {} else return e[a]
    }

    function m(a, b) {
        return null === a ? "null" === b : void 0 === a ? "undefined" === b : a.is && a instanceof d ? "element" === b : 7 < Object.prototype.toString.call(a).toLowerCase().indexOf(b)
    }

    function a(b) {
        var c, d, e, l, k, q, u, x;
        if (b instanceof a) return b;
        m(b, "array") || (b = String(b).replace(/\s/g, "").toLowerCase().match(/(?:\+,|[^,])+/g));
        c = 0;
        for (d = b.length; c < d; ++c) {
            m(b[c],
                "array") || (b[c] = String(b[c]).match(/(?:\+\/|[^\/])+/g));
            q = [];
            for (e = b[c].length; e--;) {
                u = b[c][e];
                k = {
                    jwertyCombo: String(u),
                    shiftKey: !1,
                    ctrlKey: !1,
                    altKey: !1,
                    metaKey: !1
                };
                m(u, "array") || (u = String(u).toLowerCase().match(/(?:(?:[^\+])+|\+\+|^\+$)/g));
                for (l = u.length; l--;) "++" === u[l] && (u[l] = "+"), u[l] in v.mods ? k[f[v.mods[u[l]]]] = !0 : u[l] in v.keys ? k.keyCode = v.keys[u[l]] : x = u[l].match(/^\[([^-]+\-?[^-]*)-([^-]+\-?[^-]*)\]$/);
                if (m(k.keyCode, "undefined"))
                    if (x && x[1] in v.keys && x[2] in v.keys) {
                        x[2] = v.keys[x[2]];
                        x[1] = v.keys[x[1]];
                        for (l = x[1]; l < x[2]; ++l) q.push({
                            altKey: k.altKey,
                            shiftKey: k.shiftKey,
                            metaKey: k.metaKey,
                            ctrlKey: k.ctrlKey,
                            keyCode: l,
                            jwertyCombo: String(u)
                        });
                        k.keyCode = l
                    } else k.keyCode = 0;
                q.push(k)
            }
            this[c] = q
        }
        this.length = c;
        return this
    }
    var b = e.document,
        d = k("jQuery") || k("Zepto") || k("ender") || b,
        l, q, u, x;
    d === b ? (l = function(a, b) {
        return a ? d.querySelector(a, b || d) : d
    }, q = function(a, b) {
        a.addEventListener("keydown", b, !1)
    }, u = function(a, b) {
        a.removeEventListener("keydown", b, !1)
    }, x = function(a, c) {
        var f = b.createEvent("Event"),
            e;
        f.initEvent("keydown", !0, !0);
        for (e in c) f[e] = c[e];
        return (a || d).dispatchEvent(f)
    }) : (l = function(a, c) {
        return d(a || b, c)
    }, q = function(a, b) {
        d(a).bind("keydown.jwerty", b)
    }, u = function(a, b) {
        d(a).unbind("keydown.jwerty", b)
    }, x = function(a, c) {
        d(a || b).trigger(d.Event("keydown", c))
    });
    for (var f = {
            16: "shiftKey",
            17: "ctrlKey",
            18: "altKey",
            91: "metaKey"
        }, v = {
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
        }, D = 47, z = 0; 106 > ++D;) v.keys[z] = D, v.keys["num-" + z] = D + 48, ++z;
    D = 111;
    for (z = 1; 136 > ++D;) v.keys["f" + z] = D, ++z;
    for (D = 64; 91 > ++D;) v.keys[String.fromCharCode(D).toLowerCase()] =
        D;
    var A = c.jwerty = {
        event: function(b, c, d) {
            if (m(c, "boolean")) {
                var f = c;
                c = function() {
                    return f
                }
            }
            b = new a(b);
            var e = 0,
                l = b.length - 1,
                k, q;
            return function(a) {
                (q = A.is(b, a, e)) ? e < l ? ++e : (k = c.call(d || this, a, q), !1 === k && a.preventDefault(), e = 0): e = A.is(b, a) ? 1 : 0
            }
        },
        is: function(b, c, d) {
            b = new a(b);
            b = b[d || 0];
            c = c.originalEvent || c;
            d = b.length;
            for (var f = !1; d--;) {
                var f = b[d].jwertyCombo,
                    e;
                for (e in b[d]) "jwertyCombo" !== e && c[e] != b[d][e] && (f = !1);
                if (!1 !== f) break
            }
            return f
        },
        key: function(a, b, c, d, f) {
            var k = m(c, "element") || m(c, "string") ? c :
                d,
                v = k === c ? e : c;
            c = k === c ? d : f;
            var x = m(k, "element") ? k : l(k, c),
                z = A.event(a, b, v);
            q(x, z);
            return {
                unbind: function() {
                    u(x, z)
                }
            }
        },
        fire: function(b, c, d, f) {
            b = new a(b);
            f = m(d, "number") ? d : f;
            x(m(c, "element") ? c : l(c, d), b[f || 0][0])
        },
        KEYS: v
    }
})("undefined" !== typeof global && global.window || this, "undefined" !== typeof module && module.exports ? module.exports : this);
! function(e, c) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? c(e, !0) : function(e) {
        if (!e.document) throw Error("jQuery requires a window with a document");
        return c(e)
    } : c(e)
}("undefined" != typeof window ? window : this, function(e, c) {
    function k(a) {
        var b = "length" in a && a.length,
            c = h.type(a);
        return "function" === c || h.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && 0 < b && b - 1 in a
    }

    function m(a, b, c) {
        if (h.isFunction(b)) return h.grep(a, function(a, M) {
            return !!b.call(a,
                M, a) !== c
        });
        if (b.nodeType) return h.grep(a, function(a) {
            return a === b !== c
        });
        if ("string" == typeof b) {
            if (yb.test(b)) return h.filter(b, a, c);
            b = h.filter(b, a)
        }
        return h.grep(a, function(a) {
            return 0 <= h.inArray(a, b) !== c
        })
    }

    function a(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a
    }

    function b(a) {
        var b = Fa[a] = {};
        return h.each(a.match(va) || [], function(a, c) {
            b[c] = !0
        }), b
    }

    function d() {
        N.addEventListener ? (N.removeEventListener("DOMContentLoaded", l, !1), e.removeEventListener("load", l, !1)) : (N.detachEvent("onreadystatechange",
            l), e.detachEvent("onload", l))
    }

    function l() {
        (N.addEventListener || "load" === event.type || "complete" === N.readyState) && (d(), h.ready())
    }

    function q(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var n = "data-" + b.replace(kb, "-$1").toLowerCase();
            if (c = a.getAttribute(n), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : Ja.test(c) ? h.parseJSON(c) : c
                } catch (d) {}
                h.data(a, b, c)
            } else c = void 0
        }
        return c
    }

    function u(a) {
        for (var b in a)
            if (("data" !== b || !h.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
        return !0
    }

    function x(a, b, c, n) {
        if (h.acceptData(a)) {
            var d, f, e = h.expando,
                l = a.nodeType,
                k = l ? h.cache : a,
                y = l ? a[e] : a[e] && e;
            if (y && k[y] && (n || k[y].data) || void 0 !== c || "string" != typeof b) return y || (y = l ? a[e] = ea.pop() || h.guid++ : e), k[y] || (k[y] = l ? {} : {
                toJSON: h.noop
            }), ("object" == typeof b || "function" == typeof b) && (n ? k[y] = h.extend(k[y], b) : k[y].data = h.extend(k[y].data, b)), f = k[y], n || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[h.camelCase(b)] = c), "string" == typeof b ? (d = f[b], null == d && (d = f[h.camelCase(b)])) : d = f, d
        }
    }

    function f(a, b, c) {
        if (h.acceptData(a)) {
            var n,
                d, f = a.nodeType,
                e = f ? h.cache : a,
                l = f ? a[h.expando] : h.expando;
            if (e[l]) {
                if (b && (n = c ? e[l] : e[l].data)) {
                    h.isArray(b) ? b = b.concat(h.map(b, h.camelCase)) : b in n ? b = [b] : (b = h.camelCase(b), b = b in n ? [b] : b.split(" "));
                    for (d = b.length; d--;) delete n[b[d]];
                    if (c ? !u(n) : !h.isEmptyObject(n)) return
                }(c || (delete e[l].data, u(e[l]))) && (f ? h.cleanData([a], !0) : H.deleteExpando || e != e.window ? delete e[l] : e[l] = null)
            }
        }
    }

    function v() {
        return !0
    }

    function D() {
        return !1
    }

    function z() {
        try {
            return N.activeElement
        } catch (a) {}
    }

    function A(a) {
        var b = tb.split("|");
        a = a.createDocumentFragment();
        if (a.createElement)
            for (; b.length;) a.createElement(b.pop());
        return a
    }

    function r(a, b) {
        var c, n, d = 0,
            f = "undefined" !== typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" !== typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [], c = a.childNodes || a; null != (n = c[d]); d++) !b || h.nodeName(n, b) ? f.push(n) : h.merge(f, r(n, b));
        return void 0 === b || b && h.nodeName(a, b) ? h.merge([a], f) : f
    }

    function B(a) {
        ha.test(a.type) && (a.defaultChecked = a.checked)
    }

    function t(a,
        b) {
        return h.nodeName(a, "table") && h.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function w(a) {
        return a.type = (null !== h.find.attr(a, "type")) + "/" + a.type, a
    }

    function E(a) {
        var b = mb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function C(a, b) {
        for (var c, n = 0; null != (c = a[n]); n++) h._data(c, "globalEval", !b || h._data(b[n], "globalEval"))
    }

    function F(a, b) {
        if (1 === b.nodeType && h.hasData(a)) {
            var c, n, d;
            n = h._data(a);
            var f = h._data(b, n),
                e = n.events;
            if (e)
                for (c in delete f.handle, f.events = {}, e)
                    for (n = 0, d = e[c].length; d > n; n++) h.event.add(b, c, e[c][n]);
            f.data && (f.data = h.extend({}, f.data))
        }
    }

    function J(a, b) {
        var c, n = h(b.createElement(a)).appendTo(b.body),
            d = e.getDefaultComputedStyle && (c = e.getDefaultComputedStyle(n[0])) ? c.display : h.css(n[0], "display");
        return n.detach(), d
    }

    function P(a) {
        var b = N,
            c = ia[a];
        return c || (c = J(a, b), "none" !== c && c || (S = (S || h("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b =
            (S[0].contentWindow || S[0].contentDocument).document, b.write(), b.close(), c = J(a, b), S.detach()), ia[a] = c), c
    }

    function L(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }

    function pa(a, b) {
        if (b in a) return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), n = b, h = cb.length; h--;)
            if (b = cb[h] + c, b in a) return b;
        return n
    }

    function ka(a, b) {
        for (var c, n, d, f = [], e = 0, l = a.length; l > e; e++) n = a[e], n.style && (f[e] = h._data(n, "olddisplay"), c = n.style.display, b ? (f[e] ||
            "none" !== c || (n.style.display = ""), "" === n.style.display && lb(n) && (f[e] = h._data(n, "olddisplay", P(n.nodeName)))) : (d = lb(n), (c && "none" !== c || !d) && h._data(n, "olddisplay", d ? c : h.css(n, "display"))));
        for (e = 0; l > e; e++) n = a[e], n.style && (b && "none" !== n.style.display && "" !== n.style.display || (n.style.display = b ? f[e] || "" : "none"));
        return a
    }

    function qa(a, b, c) {
        return (a = cc.exec(b)) ? Math.max(0, a[1] - (c || 0)) + (a[2] || "px") : b
    }

    function sa(a, b, c, n, d) {
        b = c === (n ? "border" : "content") ? 4 : "width" === b ? 1 : 0;
        for (var f = 0; 4 > b; b += 2) "margin" === c &&
            (f += h.css(a, c + Ka[b], !0, d)), n ? ("content" === c && (f -= h.css(a, "padding" + Ka[b], !0, d)), "margin" !== c && (f -= h.css(a, "border" + Ka[b] + "Width", !0, d))) : (f += h.css(a, "padding" + Ka[b], !0, d), "padding" !== c && (f += h.css(a, "border" + Ka[b] + "Width", !0, d)));
        return f
    }

    function X(a, b, c) {
        var n = !0,
            d = "width" === b ? a.offsetWidth : a.offsetHeight,
            f = Y(a),
            e = H.boxSizing && "border-box" === h.css(a, "boxSizing", !1, f);
        if (0 >= d || null == d) {
            if (d = Q(a, b, f), (0 > d || null == d) && (d = a.style[b]), ua.test(d)) return d;
            n = e && (H.boxSizingReliable() || d === a.style[b]);
            d =
                parseFloat(d) || 0
        }
        return d + sa(a, b, c || (e ? "border" : "content"), n, f) + "px"
    }

    function R(a, b, c, n, d) {
        return new R.prototype.init(a, b, c, n, d)
    }

    function V() {
        return setTimeout(function() {
            Ab = void 0
        }), Ab = h.now()
    }

    function ba(a, b) {
        var c, n = {
                height: a
            },
            d = 0;
        for (b = b ? 1 : 0; 4 > d; d += 2 - b) c = Ka[d], n["margin" + c] = n["padding" + c] = a;
        return b && (n.opacity = n.width = a), n
    }

    function O(a, b, c) {
        for (var n, d = (db[b] || []).concat(db["*"]), h = 0, f = d.length; f > h; h++)
            if (n = d[h].call(c, b, a)) return n
    }

    function Z(a, b) {
        var c, n, d, f, e;
        for (c in a)
            if (n = h.camelCase(c),
                d = b[n], f = a[c], h.isArray(f) && (d = f[1], f = a[c] = f[0]), c !== n && (a[n] = f, delete a[c]), e = h.cssHooks[n], e && "expand" in e)
                for (c in f = e.expand(f), delete a[n], f) c in a || (a[c] = f[c], b[c] = d);
            else b[n] = d
    }

    function ca(a, b, c) {
        var n, d = 0,
            f = ub.length,
            e = h.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (n) return !1;
                for (var b = Ab || V(), b = Math.max(0, y.startTime + y.duration - b), c = 1 - (b / y.duration || 0), d = 0, f = y.tweens.length; f > d; d++) y.tweens[d].run(c);
                return e.notifyWith(a, [y, c, b]), 1 > c && f ? b : (e.resolveWith(a, [y]), !1)
            },
            y = e.promise({
                elem: a,
                props: h.extend({}, b),
                opts: h.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: Ab || V(),
                duration: c.duration,
                tweens: [],
                createTween: function(b, c) {
                    var n = h.Tween(a, y.opts, b, c, y.opts.specialEasing[b] || y.opts.easing);
                    return y.tweens.push(n), n
                },
                stop: function(b) {
                    var c = 0,
                        d = b ? y.tweens.length : 0;
                    if (n) return this;
                    for (n = !0; d > c; c++) y.tweens[c].run(1);
                    return b ? e.resolveWith(a, [y, b]) : e.rejectWith(a, [y, b]), this
                }
            });
        c = y.props;
        for (Z(c, y.opts.specialEasing); f > d; d++)
            if (b = ub[d].call(y, a, c, y.opts)) return b;
        return h.map(c, O, y), h.isFunction(y.opts.start) && y.opts.start.call(a, y), h.fx.timer(h.extend(l, {
            elem: a,
            anim: y,
            queue: y.opts.queue
        })), y.progress(y.opts.progress).done(y.opts.done, y.opts.complete).fail(y.opts.fail).always(y.opts.always)
    }

    function W(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var n, d = 0,
                f = b.toLowerCase().match(va) || [];
            if (h.isFunction(c))
                for (; n = f[d++];) "+" === n.charAt(0) ? (n = n.slice(1) || "*", (a[n] = a[n] || []).unshift(c)) : (a[n] = a[n] || []).push(c)
        }
    }

    function ta(a, b, c, n) {
        function d(l) {
            var y;
            return f[l] = !0, h.each(a[l] || [], function(a, M) {
                var h = M(b, c, n);
                return "string" != typeof h || e || f[h] ? e ? !(y = h) : void 0 : (b.dataTypes.unshift(h), d(h), !1)
            }), y
        }
        var f = {},
            e = a === Bb;
        return d(b.dataTypes[0]) || !f["*"] && d("*")
    }

    function wa(a, b) {
        var c, n, d = h.ajaxSettings.flatOptions || {};
        for (n in b) void 0 !== b[n] && ((d[n] ? a : c || (c = {}))[n] = b[n]);
        return c && h.extend(!0, a, c), a
    }

    function aa(a, b, c, d) {
        var f;
        if (h.isArray(b)) h.each(b, function(b, f) {
            c || n.test(a) ? d(a, f) : aa(a + "[" + ("object" == typeof f ? b : "") + "]", f, c, d)
        });
        else if (c || "object" !==
            h.type(b)) d(a, b);
        else
            for (f in b) aa(a + "[" + f + "]", b[f], c, d)
    }

    function ga() {
        try {
            return new e.XMLHttpRequest
        } catch (a) {}
    }

    function oa(a) {
        return h.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    var ea = [],
        da = ea.slice,
        hb = ea.concat,
        Oa = ea.push,
        Ba = ea.indexOf,
        Ma = {},
        qb = Ma.toString,
        Wa = Ma.hasOwnProperty,
        H = {},
        h = function(a, b) {
            return new h.fn.init(a, b)
        },
        xb = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        ib = /^-ms-/,
        rb = /-([\da-z])/gi,
        Cb = function(a, b) {
            return b.toUpperCase()
        };
    h.fn = h.prototype = {
        jquery: "1.11.3",
        constructor: h,
        selector: "",
        length: 0,
        toArray: function() {
            return da.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : da.call(this)
        },
        pushStack: function(a) {
            a = h.merge(this.constructor(), a);
            return a.prevObject = this, a.context = this.context, a
        },
        each: function(a, b) {
            return h.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(h.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(da.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length;
            a = +a + (0 > a ? b : 0);
            return this.pushStack(0 <= a && b > a ? [this[a]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: Oa,
        sort: ea.sort,
        splice: ea.splice
    };
    h.extend = h.fn.extend = function() {
        var a, b, c, n, d, f, e = arguments[0] || {},
            l = 1,
            y = arguments.length,
            k = !1;
        "boolean" == typeof e && (k = e, e = arguments[l] || {}, l++);
        "object" == typeof e || h.isFunction(e) || (e = {});
        for (l === y && (e = this, l--); y > l; l++)
            if (null != (d = arguments[l]))
                for (n in d) a = e[n], c = d[n], e !== c && (k && c && (h.isPlainObject(c) ||
                    (b = h.isArray(c))) ? (b ? (b = !1, f = a && h.isArray(a) ? a : []) : f = a && h.isPlainObject(a) ? a : {}, e[n] = h.extend(k, f, c)) : void 0 !== c && (e[n] = c));
        return e
    };
    h.extend({
        expando: "jQuery" + ("1.11.3" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw Error(a);
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === h.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === h.type(a)
        },
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            return !h.isArray(a) && 0 <= a - parseFloat(a) + 1
        },
        isEmptyObject: function(a) {
            for (var b in a) return !1;
            return !0
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== h.type(a) || a.nodeType || h.isWindow(a)) return !1;
            try {
                if (a.constructor && !Wa.call(a, "constructor") && !Wa.call(a.constructor.prototype, "isPrototypeOf")) return !1
            } catch (c) {
                return !1
            }
            if (H.ownLast)
                for (b in a) return Wa.call(a, b);
            for (b in a);
            return void 0 === b || Wa.call(a, b)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? Ma[qb.call(a)] || "object" : typeof a
        },
        globalEval: function(a) {
            a && h.trim(a) && (e.execScript || function(a) {
                e.eval.call(e,
                    a)
            })(a)
        },
        camelCase: function(a) {
            return a.replace(ib, "ms-").replace(rb, Cb)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b, c) {
            var n, d = 0,
                f = a.length,
                h = k(a);
            if (c)
                if (h)
                    for (; f > d && (n = b.apply(a[d], c), !1 !== n); d++);
                else
                    for (d in a) {
                        if (n = b.apply(a[d], c), !1 === n) break
                    } else if (h)
                        for (; f > d && (n = b.call(a[d], d, a[d]), !1 !== n); d++);
                    else
                        for (d in a)
                            if (n = b.call(a[d], d, a[d]), !1 === n) break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(xb, "")
        },
        makeArray: function(a,
            b) {
            var c = b || [];
            return null != a && (k(Object(a)) ? h.merge(c, "string" == typeof a ? [a] : a) : Oa.call(c, a)), c
        },
        inArray: function(a, b, c) {
            var n;
            if (b) {
                if (Ba) return Ba.call(b, a, c);
                n = b.length;
                for (c = c ? 0 > c ? Math.max(0, n + c) : c : 0; n > c; c++)
                    if (c in b && b[c] === a) return c
            }
            return -1
        },
        merge: function(a, b) {
            for (var c = +b.length, n = 0, d = a.length; c > n;) a[d++] = b[n++];
            if (c !== c)
                for (; void 0 !== b[n];) a[d++] = b[n++];
            return a.length = d, a
        },
        grep: function(a, b, c) {
            for (var n = [], d = 0, f = a.length, h = !c; f > d; d++) c = !b(a[d], d), c !== h && n.push(a[d]);
            return n
        },
        map: function(a,
            b, c) {
            var n, d = 0,
                f = a.length,
                h = [];
            if (k(a))
                for (; f > d; d++) n = b(a[d], d, c), null != n && h.push(n);
            else
                for (d in a) n = b(a[d], d, c), null != n && h.push(n);
            return hb.apply([], h)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, n, d;
            return "string" == typeof b && (d = a[b], b = a, a = d), h.isFunction(a) ? (c = da.call(arguments, 2), n = function() {
                return a.apply(b || this, c.concat(da.call(arguments)))
            }, n.guid = a.guid = a.guid || h.guid++, n) : void 0
        },
        now: function() {
            return +new Date
        },
        support: H
    });
    h.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
        function(a, b) {
            Ma["[object " + b + "]"] = b.toLowerCase()
        });
    var jb = function(a) {
        function b(a, c, n, d) {
            var f, h, e, M, y;
            if ((c ? c.ownerDocument || c : J) !== S && D(c), c = c || S, n = n || [], M = c.nodeType, "string" != typeof a || !a || 1 !== M && 9 !== M && 11 !== M) return n;
            if (!d && ia) {
                if (11 !== M && (f = ma.exec(a)))
                    if (e = f[1])
                        if (9 === M) {
                            if (h = c.getElementById(e), !h || !h.parentNode) return n;
                            if (h.id === e) return n.push(h), n
                        } else {
                            if (c.ownerDocument && (h = c.ownerDocument.getElementById(e)) && A(c, h) && h.id === e) return n.push(h), n
                        }
                else {
                    if (f[2]) return N.apply(n, c.getElementsByTagName(a)),
                        n;
                    if ((e = f[3]) && t.getElementsByClassName) return N.apply(n, c.getElementsByClassName(e)), n
                }
                if (t.qsa && (!G || !G.test(a))) {
                    if (h = f = F, e = c, y = 1 !== M && a, 1 === M && "object" !== c.nodeName.toLowerCase()) {
                        M = w(a);
                        (f = c.getAttribute("id")) ? h = f.replace(oa, "\\$&"): c.setAttribute("id", h);
                        h = "[id='" + h + "'] ";
                        for (e = M.length; e--;) M[e] = h + m(M[e]);
                        e = la.test(a) && k(c.parentNode) || c;
                        y = M.join(",")
                    }
                    if (y) try {
                        return N.apply(n, e.querySelectorAll(y)), n
                    } catch (l) {} finally {
                        f || c.removeAttribute("id")
                    }
                }
            }
            return B(a.replace(ra, "$1"), c, n, d)
        }

        function c() {
            function a(c,
                n) {
                return b.push(c + " ") > U.cacheLength && delete a[b.shift()], a[c + " "] = n
            }
            var b = [];
            return a
        }

        function n(a) {
            return a[F] = !0, a
        }

        function d(a) {
            var b = S.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b)
            }
        }

        function f(a, b) {
            for (var c = a.split("|"), n = a.length; n--;) U.attrHandle[c[n]] = b
        }

        function h(a, b) {
            var c = b && a,
                n = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || -2147483648) - (~a.sourceIndex || -2147483648);
            if (n) return n;
            if (c)
                for (; c = c.nextSibling;)
                    if (c === b) return -1;
            return a ? 1 : -1
        }

        function e(a) {
            return function(b) {
                return "input" === b.nodeName.toLowerCase() && b.type === a
            }
        }

        function l(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function y(a) {
            return n(function(b) {
                return b = +b, n(function(c, n) {
                    for (var d, f = a([], c.length, b), h = f.length; h--;) c[d = f[h]] && (c[d] = !(n[d] = c[d]))
                })
            })
        }

        function k(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }

        function I() {}

        function m(a) {
            for (var b = 0, c = a.length, n = ""; c > b; b++) n += a[b].value;
            return n
        }

        function q(a, b, c) {
            var n = b.dir,
                d = c && "parentNode" === n,
                f = ic++;
            return b.first ? function(b, c, f) {
                for (; b = b[n];)
                    if (1 === b.nodeType || d) return a(b, c, f)
            } : function(b, c, h) {
                var e, M, y = [$a, f];
                if (h)
                    for (; b = b[n];) {
                        if ((1 === b.nodeType || d) && a(b, c, h)) return !0
                    } else
                        for (; b = b[n];)
                            if (1 === b.nodeType || d) {
                                if (M = b[F] || (b[F] = {}), (e = M[n]) && e[0] === $a && e[1] === f) return y[2] = e[2];
                                if (M[n] = y, y[2] = a(b, c, h)) return !0
                            }
            }
        }

        function K(a) {
            return 1 < a.length ? function(b, c, n) {
                for (var d = a.length; d--;)
                    if (!a[d](b, c, n)) return !1;
                return !0
            } : a[0]
        }

        function ja(a,
            b, c, n, d) {
            for (var f, h = [], e = 0, M = a.length, y = null != b; M > e; e++)(f = a[e]) && (!c || c(f, n, d)) && (h.push(f), y && b.push(e));
            return h
        }

        function r(a, c, d, f, h, e) {
            return f && !f[F] && (f = r(f)), h && !h[F] && (h = r(h, e)), n(function(n, e, M, y) {
                var l, k, I = [],
                    m = [],
                    Ra = e.length,
                    q;
                if (!(q = n)) {
                    q = c || "*";
                    for (var K = M.nodeType ? [M] : M, r = [], xa = 0, v = K.length; v > xa; xa++) b(q, K[xa], r);
                    q = r
                }
                q = !a || !n && c ? q : ja(q, I, a, M, y);
                K = d ? h || (n ? a : Ra || f) ? [] : e : q;
                if (d && d(q, K, M, y), f)
                    for (l = ja(K, m), f(l, [], M, y), M = l.length; M--;)(k = l[M]) && (K[m[M]] = !(q[m[M]] = k));
                if (n) {
                    if (h || a) {
                        if (h) {
                            l = [];
                            for (M = K.length; M--;)(k = K[M]) && l.push(q[M] = k);
                            h(null, K = [], l, y)
                        }
                        for (M = K.length; M--;)(k = K[M]) && -1 < (l = h ? qa(n, k) : I[M]) && (n[l] = !(e[l] = k))
                    }
                } else K = ja(K === e ? K.splice(Ra, K.length) : K), h ? h(null, e, K, y) : N.apply(e, K)
            })
        }

        function xa(a) {
            var b, c, n, d = a.length,
                f = U.relative[a[0].type];
            c = f || U.relative[" "];
            for (var h = f ? 1 : 0, e = q(function(a) {
                    return a === b
                }, c, !0), M = q(function(a) {
                    return -1 < qa(b, a)
                }, c, !0), y = [function(a, c, n) {
                    a = !f && (n || c !== z) || ((b = c).nodeType ? e(a, c, n) : M(a, c, n));
                    return b = null, a
                }]; d > h; h++)
                if (c = U.relative[a[h].type]) y = [q(K(y), c)];
                else {
                    if (c = U.filter[a[h].type].apply(null, a[h].matches), c[F]) {
                        for (n = ++h; d > n && !U.relative[a[n].type]; n++);
                        return r(1 < h && K(y), 1 < h && m(a.slice(0, h - 1).concat({
                            value: " " === a[h - 2].type ? "*" : ""
                        })).replace(ra, "$1"), c, n > h && xa(a.slice(h, n)), d > n && xa(a = a.slice(n)), d > n && m(a))
                    }
                    y.push(c)
                }
            return K(y)
        }

        function v(a, c) {
            var d = 0 < c.length,
                f = 0 < a.length,
                h = function(n, h, e, M, y) {
                    var l, k, I, m = 0,
                        Ra = "0",
                        q = n && [],
                        K = [],
                        r = z,
                        xa = n || f && U.find.TAG("*", y),
                        v = $a += null == r ? 1 : Math.random() || .1,
                        t = xa.length;
                    for (y && (z = h !== S && h); Ra !== t &&
                        null != (l = xa[Ra]); Ra++) {
                        if (f && l) {
                            for (k = 0; I = a[k++];)
                                if (I(l, h, e)) {
                                    M.push(l);
                                    break
                                }
                            y && ($a = v)
                        }
                        d && ((l = !I && l) && m--, n && q.push(l))
                    }
                    if (m += Ra, d && Ra !== m) {
                        for (k = 0; I = c[k++];) I(q, K, h, e);
                        if (n) {
                            if (0 < m)
                                for (; Ra--;) q[Ra] || K[Ra] || (K[Ra] = O.call(M));
                            K = ja(K)
                        }
                        N.apply(M, K);
                        y && !n && 0 < K.length && 1 < m + c.length && b.uniqueSort(M)
                    }
                    return y && ($a = v, z = r), q
                };
            return d ? n(h) : h
        }
        var u, t, U, x, gb, w, T, B, z, na, C, D, S, Aa, ia, G, wb, E, A, F = "sizzle" + 1 * new Date,
            J = a.document,
            $a = 0,
            ic = 0,
            P = c(),
            L = c(),
            ua = c(),
            Q = function(a, b) {
                return a === b && (C = !0), 0
            },
            Y = {}.hasOwnProperty,
            H = [],
            O = H.pop,
            ka = H.push,
            N = H.push,
            pa = H.slice,
            qa = function(a, b) {
                for (var c = 0, n = a.length; n > c; c++)
                    if (a[c] === b) return c;
                return -1
            },
            R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w#"),
            V = "\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + R + "))|)[\\x20\\t\\r\\n\\f]*\\]",
            X = ":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
            V + ")*)|.*)\\)|)",
            W = /[\x20\t\r\n\f]+/g,
            ra = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
            Z = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
            sa = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,
            ba = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
            ta = new RegExp(X),
            ca = new RegExp("^" + R + "$"),
            aa = {
                ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
                CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
                TAG: new RegExp("^(" + "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + V),
                PSEUDO: new RegExp("^" + X),
                CHILD: /^:(only|first|last|nth|nth-last)-(child|of-type)(?:\([\x20\t\r\n\f]*(even|odd|(([+-]|)(\d*)n|)[\x20\t\r\n\f]*(?:([+-]|)[\x20\t\r\n\f]*(\d+)|))[\x20\t\r\n\f]*\)|)/i,
                bool: /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i,
                needsContext: /^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i
            },
            ea = /^(?:input|select|textarea|button)$/i,
            ha = /^h\d$/i,
            fa = /^[^{]+\{\s*\[native \w/,
            ma = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            la = /[+~]/,
            oa = /'|\\/g,
            da = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/ig,
            ga = function(a, b, c) {
                a = "0x" + b - 65536;
                return a !== a || c ? b : 0 > a ? String.fromCharCode(a + 65536) : String.fromCharCode(a >> 10 | 55296, 1023 & a | 56320)
            },
            va = function() {
                D()
            };
        try {
            N.apply(H = pa.call(J.childNodes), J.childNodes), H[J.childNodes.length].nodeType
        } catch (wa) {
            N = {
                apply: H.length ? function(a, b) {
                    ka.apply(a, pa.call(b))
                } : function(a, b) {
                    for (var c = a.length, n = 0; a[c++] = b[n++];);
                    a.length = c - 1
                }
            }
        }
        t = b.support = {};
        gb = b.isXML = function(a) {
            return (a = a && (a.ownerDocument || a).documentElement) ? "HTML" !== a.nodeName : !1
        };
        D = b.setDocument = function(a) {
            var b, c, n = a ? a.ownerDocument ||
                a : J;
            return n !== S && 9 === n.nodeType && n.documentElement ? (S = n, Aa = n.documentElement, c = n.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", va, !1) : c.attachEvent && c.attachEvent("onunload", va)), ia = !gb(n), t.attributes = d(function(a) {
                    return a.className = "i", !a.getAttribute("className")
                }), t.getElementsByTagName = d(function(a) {
                    return a.appendChild(n.createComment("")), !a.getElementsByTagName("*").length
                }), t.getElementsByClassName = fa.test(n.getElementsByClassName), t.getById = d(function(a) {
                    return Aa.appendChild(a).id =
                        F, !n.getElementsByName || !n.getElementsByName(F).length
                }), t.getById ? (U.find.ID = function(a, b) {
                    if ("undefined" != typeof b.getElementById && ia) {
                        var c = b.getElementById(a);
                        return c && c.parentNode ? [c] : []
                    }
                }, U.filter.ID = function(a) {
                    var b = a.replace(da, ga);
                    return function(a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete U.find.ID, U.filter.ID = function(a) {
                    var b = a.replace(da, ga);
                    return function(a) {
                        return (a = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id")) && a.value === b
                    }
                }), U.find.TAG = t.getElementsByTagName ?
                function(a, b) {
                    return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : t.qsa ? b.querySelectorAll(a) : void 0
                } : function(a, b) {
                    var c, n = [],
                        d = 0,
                        h = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (; c = h[d++];) 1 === c.nodeType && n.push(c);
                        return n
                    }
                    return h
                }, U.find.CLASS = t.getElementsByClassName && function(a, b) {
                    return ia ? b.getElementsByClassName(a) : void 0
                }, wb = [], G = [], (t.qsa = fa.test(n.querySelectorAll)) && (d(function(a) {
                    Aa.appendChild(a).innerHTML = "<a id='" + F + "'></a><select id='" + F + "-\f]' msallowcapture=''><option selected=''></option></select>";
                    a.querySelectorAll("[msallowcapture^='']").length && G.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")");
                    a.querySelectorAll("[selected]").length || G.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
                    a.querySelectorAll("[id~=" + F + "-]").length || G.push("~=");
                    a.querySelectorAll(":checked").length || G.push(":checked");
                    a.querySelectorAll("a#" + F + "+*").length || G.push(".#.+[+~]")
                }), d(function(a) {
                    var b =
                        n.createElement("input");
                    b.setAttribute("type", "hidden");
                    a.appendChild(b).setAttribute("name", "D");
                    a.querySelectorAll("[name=d]").length && G.push("name[\\x20\\t\\r\\n\\f]*[*^$|!~]?=");
                    a.querySelectorAll(":enabled").length || G.push(":enabled", ":disabled");
                    a.querySelectorAll("*,:x");
                    G.push(",.*:")
                })), (t.matchesSelector = fa.test(E = Aa.matches || Aa.webkitMatchesSelector || Aa.mozMatchesSelector || Aa.oMatchesSelector || Aa.msMatchesSelector)) && d(function(a) {
                    t.disconnectedMatch = E.call(a, "div");
                    E.call(a, "[s!='']:x");
                    wb.push("!=", X)
                }), G = G.length && new RegExp(G.join("|")), wb = wb.length && new RegExp(wb.join("|")), b = fa.test(Aa.compareDocumentPosition), A = b || fa.test(Aa.contains) ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                        n = b && b.parentNode;
                    return a === n || !(!n || 1 !== n.nodeType || !(c.contains ? c.contains(n) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(n)))
                } : function(a, b) {
                    if (b)
                        for (; b = b.parentNode;)
                            if (b === a) return !0;
                    return !1
                }, Q = b ? function(a, b) {
                    if (a === b) return C = !0, 0;
                    var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !t.sortDetached && b.compareDocumentPosition(a) === c ? a === n || a.ownerDocument === J && A(J, a) ? -1 : b === n || b.ownerDocument === J && A(J, b) ? 1 : na ? qa(na, a) - qa(na, b) : 0 : 4 & c ? -1 : 1)
                } : function(a, b) {
                    if (a === b) return C = !0, 0;
                    var c, d = 0;
                    c = a.parentNode;
                    var f = b.parentNode,
                        e = [a],
                        M = [b];
                    if (!c || !f) return a === n ? -1 : b === n ? 1 : c ? -1 : f ? 1 : na ? qa(na, a) - qa(na, b) : 0;
                    if (c === f) return h(a, b);
                    for (c = a; c = c.parentNode;) e.unshift(c);
                    for (c = b; c = c.parentNode;) M.unshift(c);
                    for (; e[d] === M[d];) d++;
                    return d ? h(e[d], M[d]) : e[d] === J ? -1 : M[d] === J ? 1 : 0
                }, n) : S
        };
        b.matches = function(a, c) {
            return b(a, null, null, c)
        };
        b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== S && D(a), c = c.replace(ba, "='$1']"), !(!t.matchesSelector || !ia || wb && wb.test(c) || G && G.test(c))) try {
                var n = E.call(a, c);
                if (n || t.disconnectedMatch || a.document && 11 !== a.document.nodeType) return n
            } catch (d) {}
            return 0 < b(c, S, null, [a]).length
        };
        b.contains = function(a, b) {
            return (a.ownerDocument || a) !== S && D(a), A(a, b)
        };
        b.attr = function(a, b) {
            (a.ownerDocument ||
                a) !== S && D(a);
            var c = U.attrHandle[b.toLowerCase()],
                c = c && Y.call(U.attrHandle, b.toLowerCase()) ? c(a, b, !ia) : void 0;
            return void 0 !== c ? c : t.attributes || !ia ? a.getAttribute(b) : (c = a.getAttributeNode(b)) && c.specified ? c.value : null
        };
        b.error = function(a) {
            throw Error("Syntax error, unrecognized expression: " + a);
        };
        b.uniqueSort = function(a) {
            var b, c = [],
                n = 0,
                d = 0;
            if (C = !t.detectDuplicates, na = !t.sortStable && a.slice(0), a.sort(Q), C) {
                for (; b = a[d++];) b === a[d] && (n = c.push(d));
                for (; n--;) a.splice(c[n], 1)
            }
            return na = null, a
        };
        x = b.getText =
            function(a) {
                var b, c = "",
                    n = 0;
                if (b = a.nodeType)
                    if (1 === b || 9 === b || 11 === b) {
                        if ("string" == typeof a.textContent) return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
                    } else {
                        if (3 === b || 4 === b) return a.nodeValue
                    }
                else
                    for (; b = a[n++];) c += x(b);
                return c
            };
        U = b.selectors = {
            cacheLength: 50,
            createPseudo: n,
            match: aa,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(da,
                        ga), a[3] = (a[3] || a[4] || a[5] || "").replace(da, ga), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return aa.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ta.test(c) && (b = w(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0,
                        b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(da, ga).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    } : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = P[a + " "];
                    return b || (b = new RegExp("(^|[\\x20\\t\\r\\n\\f])" + a + "([\\x20\\t\\r\\n\\f]|$)")) && P(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, c, n) {
                    return function(d) {
                        d = b.attr(d, a);
                        return null == d ?
                            "!=" === c : c ? (d += "", "=" === c ? d === n : "!=" === c ? d !== n : "^=" === c ? n && 0 === d.indexOf(n) : "*=" === c ? n && -1 < d.indexOf(n) : "$=" === c ? n && d.slice(-n.length) === n : "~=" === c ? -1 < (" " + d.replace(W, " ") + " ").indexOf(n) : "|=" === c ? d === n || d.slice(0, n.length + 1) === n + "-" : !1) : !0
                    }
                },
                CHILD: function(a, b, c, n, d) {
                    var h = "nth" !== a.slice(0, 3),
                        f = "last" !== a.slice(-4),
                        e = "of-type" === b;
                    return 1 === n && 0 === d ? function(a) {
                        return !!a.parentNode
                    } : function(b, c, M) {
                        var y, l, k, Da, I;
                        c = h !== f ? "nextSibling" : "previousSibling";
                        var m = b.parentNode,
                            Ra = e && b.nodeName.toLowerCase();
                        M = !M && !e;
                        if (m) {
                            if (h) {
                                for (; c;) {
                                    for (l = b; l = l[c];)
                                        if (e ? l.nodeName.toLowerCase() === Ra : 1 === l.nodeType) return !1;
                                    I = c = "only" === a && !I && "nextSibling"
                                }
                                return !0
                            }
                            if (I = [f ? m.firstChild : m.lastChild], f && M)
                                for (M = m[F] || (m[F] = {}), y = M[a] || [], Da = y[0] === $a && y[1], k = y[0] === $a && y[2], l = Da && m.childNodes[Da]; l = ++Da && l && l[c] || (k = Da = 0) || I.pop();) {
                                    if (1 === l.nodeType && ++k && l === b) {
                                        M[a] = [$a, Da, k];
                                        break
                                    }
                                } else if (M && (y = (b[F] || (b[F] = {}))[a]) && y[0] === $a) k = y[1];
                                else
                                    for (;
                                        (l = ++Da && l && l[c] || (k = Da = 0) || I.pop()) && ((e ? l.nodeName.toLowerCase() !==
                                            Ra : 1 !== l.nodeType) || !++k || (M && ((l[F] || (l[F] = {}))[a] = [$a, k]), l !== b)););
                            return k -= d, k === n || 0 === k % n && 0 <= k / n
                        }
                    }
                },
                PSEUDO: function(a, c) {
                    var d, h = U.pseudos[a] || U.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return h[F] ? h(c) : 1 < h.length ? (d = [a, a, "", c], U.setFilters.hasOwnProperty(a.toLowerCase()) ? n(function(a, b) {
                        for (var n, d = h(a, c), f = d.length; f--;) n = qa(a, d[f]), a[n] = !(b[n] = d[f])
                    }) : function(a) {
                        return h(a, 0, d)
                    }) : h
                }
            },
            pseudos: {
                not: n(function(a) {
                    var b = [],
                        c = [],
                        d = T(a.replace(ra, "$1"));
                    return d[F] ? n(function(a,
                        b, c, n) {
                        var h;
                        c = d(a, null, n, []);
                        for (n = a.length; n--;)(h = c[n]) && (a[n] = !(b[n] = h))
                    }) : function(a, n, h) {
                        return b[0] = a, d(b, null, h, c), b[0] = null, !c.pop()
                    }
                }),
                has: n(function(a) {
                    return function(c) {
                        return 0 < b(a, c).length
                    }
                }),
                contains: n(function(a) {
                    return a = a.replace(da, ga),
                        function(b) {
                            return -1 < (b.textContent || b.innerText || x(b)).indexOf(a)
                        }
                }),
                lang: n(function(a) {
                    return ca.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(da, ga).toLowerCase(),
                        function(b) {
                            var c;
                            do
                                if (c = ia ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c =
                                    c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                            return !1
                        }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === Aa
                },
                focus: function(a) {
                    return a === S.activeElement && (!S.hasFocus || S.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return !1 === a.disabled
                },
                disabled: function(a) {
                    return !0 === a.disabled
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b &&
                        !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, !0 === a.selected
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (6 > a.nodeType) return !1;
                    return !0
                },
                parent: function(a) {
                    return !U.pseudos.empty(a)
                },
                header: function(a) {
                    return ha.test(a.nodeName)
                },
                input: function(a) {
                    return ea.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" ===
                        a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: y(function() {
                    return [0]
                }),
                last: y(function(a, b) {
                    return [b - 1]
                }),
                eq: y(function(a, b, c) {
                    return [0 > c ? c + b : c]
                }),
                even: y(function(a, b) {
                    for (var c = 0; b > c; c += 2) a.push(c);
                    return a
                }),
                odd: y(function(a, b) {
                    for (var c = 1; b > c; c += 2) a.push(c);
                    return a
                }),
                lt: y(function(a, b, c) {
                    for (b = 0 > c ? c + b : c; 0 <= --b;) a.push(b);
                    return a
                }),
                gt: y(function(a, b, c) {
                    for (c = 0 > c ? c + b : c; ++c < b;) a.push(c);
                    return a
                })
            }
        };
        U.pseudos.nth = U.pseudos.eq;
        for (u in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) U.pseudos[u] = e(u);
        for (u in {
                submit: !0,
                reset: !0
            }) U.pseudos[u] = l(u);
        I.prototype = U.filters = U.pseudos;
        U.setFilters = new I;
        w = b.tokenize = function(a, c) {
            var n, d, h, f, e, M, l;
            if (e = L[a + " "]) return c ? 0 : e.slice(0);
            e = a;
            M = [];
            for (l = U.preFilter; e;) {
                n && !(d = Z.exec(e)) || (d && (e = e.slice(d[0].length) || e), M.push(h = []));
                n = !1;
                (d = sa.exec(e)) && (n = d.shift(), h.push({
                    value: n,
                    type: d[0].replace(ra, " ")
                }), e = e.slice(n.length));
                for (f in U.filter) !(d = aa[f].exec(e)) || l[f] && !(d = l[f](d)) || (n = d.shift(), h.push({
                        value: n,
                        type: f,
                        matches: d
                    }),
                    e = e.slice(n.length));
                if (!n) break
            }
            return c ? e.length : e ? b.error(a) : L(a, M).slice(0)
        };
        return T = b.compile = function(a, b) {
                var c, n = [],
                    d = [],
                    h = ua[a + " "];
                if (!h) {
                    b || (b = w(a));
                    for (c = b.length; c--;) h = xa(b[c]), h[F] ? n.push(h) : d.push(h);
                    h = ua(a, v(d, n));
                    h.selector = a
                }
                return h
            }, B = b.select = function(a, b, c, n) {
                var d, h, f, e, M, l = "function" == typeof a && a,
                    y = !n && w(a = l.selector || a);
                if (c = c || [], 1 === y.length) {
                    if (h = y[0] = y[0].slice(0), 2 < h.length && "ID" === (f = h[0]).type && t.getById && 9 === b.nodeType && ia && U.relative[h[1].type]) {
                        if (b = (U.find.ID(f.matches[0].replace(da,
                                ga), b) || [])[0], !b) return c;
                        l && (b = b.parentNode);
                        a = a.slice(h.shift().value.length)
                    }
                    for (d = aa.needsContext.test(a) ? 0 : h.length; d-- && (f = h[d], !U.relative[e = f.type]);)
                        if ((M = U.find[e]) && (n = M(f.matches[0].replace(da, ga), la.test(h[0].type) && k(b.parentNode) || b))) {
                            if (h.splice(d, 1), a = n.length && m(h), !a) return N.apply(c, n), c;
                            break
                        }
                }
                return (l || T(a, y))(n, b, !ia, c, la.test(a) && k(b.parentNode) || b), c
            }, t.sortStable = F.split("").sort(Q).join("") === F, t.detectDuplicates = !!C, D(), t.sortDetached = d(function(a) {
                return 1 & a.compareDocumentPosition(S.createElement("div"))
            }),
            d(function(a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || f("type|href|height|width", function(a, b, c) {
                return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
            }), t.attributes && d(function(a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || f("value", function(a, b, c) {
                return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
            }), d(function(a) {
                return null == a.getAttribute("disabled")
            }) || f("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                function(a, b, c) {
                    var n;
                    return c ? void 0 : !0 === a[b] ? b.toLowerCase() : (n = a.getAttributeNode(b)) && n.specified ? n.value : null
                }), b
    }(e);
    h.find = jb;
    h.expr = jb.selectors;
    h.expr[":"] = h.expr.pseudos;
    h.unique = jb.uniqueSort;
    h.text = jb.getText;
    h.isXMLDoc = jb.isXML;
    h.contains = jb.contains;
    var sb = h.expr.match.needsContext,
        Db = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        yb = /^.[^:#\[\.,]*$/;
    h.filter = function(a, b, c) {
        var n = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === n.nodeType ? h.find.matchesSelector(n, a) ? [n] : [] : h.find.matches(a, h.grep(b,
            function(a) {
                return 1 === a.nodeType
            }))
    };
    h.fn.extend({
        find: function(a) {
            var b, c = [],
                n = this,
                d = n.length;
            if ("string" != typeof a) return this.pushStack(h(a).filter(function() {
                for (b = 0; d > b; b++)
                    if (h.contains(n[b], this)) return !0
            }));
            for (b = 0; d > b; b++) h.find(a, n[b], c);
            return c = this.pushStack(1 < d ? h.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },
        filter: function(a) {
            return this.pushStack(m(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(m(this, a || [], !0))
        },
        is: function(a) {
            return !!m(this, "string" == typeof a &&
                sb.test(a) ? h(a) : a || [], !1).length
        }
    });
    var bb, N = e.document,
        Ia = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (h.fn.init = function(a, b) {
        var c, n;
        if (!a) return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && 3 <= a.length ? [null, a, null] : Ia.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || bb).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof h ? b[0] : b, h.merge(this, h.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : N, !0)), Db.test(c[1]) && h.isPlainObject(b))
                    for (c in b) h.isFunction(this[c]) ?
                        this[c](b[c]) : this.attr(c, b[c]);
                return this
            }
            if (n = N.getElementById(c[2]), n && n.parentNode) {
                if (n.id !== c[2]) return bb.find(a);
                this.length = 1;
                this[0] = n
            }
            return this.context = N, this.selector = a, this
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : h.isFunction(a) ? "undefined" != typeof bb.ready ? bb.ready(a) : a(h) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), h.makeArray(a, this))
    }).prototype = h.fn;
    bb = h(N);
    var ab = /^(?:parents|prev(?:Until|All))/,
        ya = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    h.extend({
        dir: function(a, b, c) {
            var n = [];
            for (a = a[b]; a && 9 !== a.nodeType && (void 0 === c || 1 !== a.nodeType || !h(a).is(c));) 1 === a.nodeType && n.push(a), a = a[b];
            return n
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    });
    h.fn.extend({
        has: function(a) {
            var b, c = h(a, this),
                n = c.length;
            return this.filter(function() {
                for (b = 0; n > b; b++)
                    if (h.contains(this, c[b])) return !0
            })
        },
        closest: function(a, b) {
            for (var c, n = 0, d = this.length, f = [], e = sb.test(a) || "string" != typeof a ? h(a, b || this.context) :
                    0; d > n; n++)
                for (c = this[n]; c && c !== b; c = c.parentNode)
                    if (11 > c.nodeType && (e ? -1 < e.index(c) : 1 === c.nodeType && h.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(1 < f.length ? h.unique(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? h.inArray(this[0], h(a)) : h.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(h.unique(h.merge(this.get(), h(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });
    h.each({
        parent: function(a) {
            return (a = a.parentNode) && 11 !== a.nodeType ? a : null
        },
        parents: function(a) {
            return h.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return h.dir(a, "parentNode", c)
        },
        next: function(b) {
            return a(b, "nextSibling")
        },
        prev: function(b) {
            return a(b, "previousSibling")
        },
        nextAll: function(a) {
            return h.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return h.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return h.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return h.dir(a, "previousSibling",
                c)
        },
        siblings: function(a) {
            return h.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return h.sibling(a.firstChild)
        },
        contents: function(a) {
            return h.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : h.merge([], a.childNodes)
        }
    }, function(a, b) {
        h.fn[a] = function(c, n) {
            var d = h.map(this, b, c);
            return "Until" !== a.slice(-5) && (n = c), n && "string" == typeof n && (d = h.filter(n, d)), 1 < this.length && (ya[a] || (d = h.unique(d)), ab.test(a) && (d = d.reverse())), this.pushStack(d)
        }
    });
    var va = /\S+/g,
        Fa = {};
    h.Callbacks =
        function(a) {
            a = "string" == typeof a ? Fa[a] || b(a) : h.extend({}, a);
            var c, n, d, f, e, l, y = [],
                k = !a.once && [],
                I = function(b) {
                    n = a.memory && b;
                    d = !0;
                    e = l || 0;
                    l = 0;
                    f = y.length;
                    for (c = !0; y && f > e; e++)
                        if (!1 === y[e].apply(b[0], b[1]) && a.stopOnFalse) {
                            n = !1;
                            break
                        }
                    c = !1;
                    y && (k ? k.length && I(k.shift()) : n ? y = [] : m.disable())
                },
                m = {
                    add: function() {
                        if (y) {
                            var b = y.length;
                            ! function kc(b) {
                                h.each(b, function(b, c) {
                                    var n = h.type(c);
                                    "function" === n ? a.unique && m.has(c) || y.push(c) : c && c.length && "string" !== n && kc(c)
                                })
                            }(arguments);
                            c ? f = y.length : n && (l = b, I(n))
                        }
                        return this
                    },
                    remove: function() {
                        return y && h.each(arguments, function(a, b) {
                            for (var n; - 1 < (n = h.inArray(b, y, n));) y.splice(n, 1), c && (f >= n && f--, e >= n && e--)
                        }), this
                    },
                    has: function(a) {
                        return a ? -1 < h.inArray(a, y) : !(!y || !y.length)
                    },
                    empty: function() {
                        return y = [], f = 0, this
                    },
                    disable: function() {
                        return y = k = n = void 0, this
                    },
                    disabled: function() {
                        return !y
                    },
                    lock: function() {
                        return k = void 0, n || m.disable(), this
                    },
                    locked: function() {
                        return !k
                    },
                    fireWith: function(a, b) {
                        return !y || d && !k || (b = b || [], b = [a, b.slice ? b.slice() : b], c ? k.push(b) : I(b)), this
                    },
                    fire: function() {
                        return m.fireWith(this,
                            arguments), this
                    },
                    fired: function() {
                        return !!d
                    }
                };
            return m
        };
    h.extend({
        Deferred: function(a) {
            var b = [
                    ["resolve", "done", h.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", h.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", h.Callbacks("memory")]
                ],
                c = "pending",
                n = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return d.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var a = arguments;
                        return h.Deferred(function(c) {
                            h.each(b, function(b, f) {
                                var e = h.isFunction(a[b]) && a[b];
                                d[f[1]](function() {
                                    var a = e &&
                                        e.apply(this, arguments);
                                    a && h.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === n ? c.promise() : this, e ? [a] : arguments)
                                })
                            });
                            a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? h.extend(a, n) : n
                    }
                },
                d = {};
            return n.pipe = n.then, h.each(b, function(a, h) {
                    var f = h[2],
                        e = h[3];
                    n[h[1]] = f.add;
                    e && f.add(function() {
                        c = e
                    }, b[1 ^ a][2].disable, b[2][2].lock);
                    d[h[0]] = function() {
                        return d[h[0] + "With"](this === d ? n : this, arguments), this
                    };
                    d[h[0] + "With"] = f.fireWith
                }), n.promise(d),
                a && a.call(d, d), d
        },
        when: function(a) {
            var b = 0,
                c = da.call(arguments),
                n = c.length,
                d = 1 !== n || a && h.isFunction(a.promise) ? n : 0,
                f = 1 === d ? a : h.Deferred(),
                e = function(a, b, c) {
                    return function(n) {
                        b[a] = this;
                        c[a] = 1 < arguments.length ? da.call(arguments) : n;
                        c === y ? f.notifyWith(b, c) : --d || f.resolveWith(b, c)
                    }
                },
                y, l, k;
            if (1 < n)
                for (y = Array(n), l = Array(n), k = Array(n); n > b; b++) c[b] && h.isFunction(c[b].promise) ? c[b].promise().done(e(b, k, c)).fail(f.reject).progress(e(b, l, y)) : --d;
            return d || f.resolveWith(k, c), f.promise()
        }
    });
    var Xa;
    h.fn.ready =
        function(a) {
            return h.ready.promise().done(a), this
        };
    h.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? h.readyWait++ : h.ready(!0)
        },
        ready: function(a) {
            if (!0 === a ? !--h.readyWait : !h.isReady) {
                if (!N.body) return setTimeout(h.ready);
                h.isReady = !0;
                !0 !== a && 0 < --h.readyWait || (Xa.resolveWith(N, [h]), h.fn.triggerHandler && (h(N).triggerHandler("ready"), h(N).off("ready")))
            }
        }
    });
    h.ready.promise = function(a) {
        if (!Xa)
            if (Xa = h.Deferred(), "complete" === N.readyState) setTimeout(h.ready);
            else if (N.addEventListener) N.addEventListener("DOMContentLoaded",
            l, !1), e.addEventListener("load", l, !1);
        else {
            N.attachEvent("onreadystatechange", l);
            e.attachEvent("onload", l);
            var b = !1;
            try {
                b = null == e.frameElement && N.documentElement
            } catch (c) {}
            b && b.doScroll && ! function jc() {
                if (!h.isReady) {
                    try {
                        b.doScroll("left")
                    } catch (a) {
                        return setTimeout(jc, 50)
                    }
                    d();
                    h.ready()
                }
            }()
        }
        return Xa.promise(a)
    };
    for (var Ya in h(H)) break;
    H.ownLast = "0" !== Ya;
    H.inlineBlockNeedsLayout = !1;
    h(function() {
        var a, b, c, n;
        (c = N.getElementsByTagName("body")[0]) && c.style && (b = N.createElement("div"), n = N.createElement("div"),
            n.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(n).appendChild(b), "undefined" !== typeof b.style.zoom && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", H.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(n))
    });
    (function() {
        var a = N.createElement("div");
        if (null == H.deleteExpando) {
            H.deleteExpando = !0;
            try {
                delete a.test
            } catch (b) {
                H.deleteExpando = !1
            }
        }
    })();
    h.acceptData = function(a) {
        var b = h.noData[(a.nodeName +
                " ").toLowerCase()],
            c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || !0 !== b && a.getAttribute("classid") === b
    };
    var Ja = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        kb = /([A-Z])/g;
    h.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? h.cache[a[h.expando]] : a[h.expando], !!a && !u(a)
        },
        data: function(a, b, c) {
            return x(a, b, c)
        },
        removeData: function(a, b) {
            return f(a, b)
        },
        _data: function(a, b, c) {
            return x(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return f(a,
                b, !0)
        }
    });
    h.fn.extend({
        data: function(a, b) {
            var c, n, d, f = this[0],
                e = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (d = h.data(f), 1 === f.nodeType && !h._data(f, "parsedAttrs"))) {
                    for (c = e.length; c--;) e[c] && (n = e[c].name, 0 === n.indexOf("data-") && (n = h.camelCase(n.slice(5)), q(f, n, d[n])));
                    h._data(f, "parsedAttrs", !0)
                }
                return d
            }
            return "object" == typeof a ? this.each(function() {
                h.data(this, a)
            }) : 1 < arguments.length ? this.each(function() {
                h.data(this, a, b)
            }) : f ? q(f, a, h.data(f, a)) : void 0
        },
        removeData: function(a) {
            return this.each(function() {
                h.removeData(this,
                    a)
            })
        }
    });
    h.extend({
        queue: function(a, b, c) {
            var n;
            return a ? (b = (b || "fx") + "queue", n = h._data(a, b), c && (!n || h.isArray(c) ? n = h._data(a, b, h.makeArray(c)) : n.push(c)), n || []) : void 0
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = h.queue(a, b),
                n = c.length,
                d = c.shift(),
                f = h._queueHooks(a, b),
                e = function() {
                    h.dequeue(a, b)
                };
            "inprogress" === d && (d = c.shift(), n--);
            d && ("fx" === b && c.unshift("inprogress"), delete f.stop, d.call(a, e, f));
            !n && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return h._data(a, c) || h._data(a, c, {
                empty: h.Callbacks("once memory").add(function() {
                    h._removeData(a,
                        b + "queue");
                    h._removeData(a, c)
                })
            })
        }
    });
    h.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? h.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = h.queue(this, a, b);
                h._queueHooks(this, a);
                "fx" === a && "inprogress" !== c[0] && h.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                h.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, n = 1,
                d = h.Deferred(),
                f = this,
                e = this.length,
                y = function() {
                    --n ||
                        d.resolveWith(f, [f])
                };
            "string" != typeof a && (b = a, a = void 0);
            for (a = a || "fx"; e--;)(c = h._data(f[e], a + "queueHooks")) && c.empty && (n++, c.empty.add(y));
            return y(), d.promise(b)
        }
    });
    var Ha = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ka = ["Top", "Right", "Bottom", "Left"],
        lb = function(a, b) {
            return a = b || a, "none" === h.css(a, "display") || !h.contains(a.ownerDocument, a)
        },
        Pa = h.access = function(a, b, c, n, d, f, e) {
            var y = 0,
                l = a.length,
                k = null == c;
            if ("object" === h.type(c))
                for (y in d = !0, c) h.access(a, b, y, c[y], !0, f, e);
            else if (void 0 !== n && (d = !0, h.isFunction(n) || (e = !0), k && (e ? (b.call(a, n), b = null) : (k = b, b = function(a, b, c) {
                    return k.call(h(a), c)
                })), b))
                for (; l > y; y++) b(a[y], c, e ? n : n.call(a[y], y, b(a[y], c)));
            return d ? a : k ? b.call(a) : l ? b(a[0], c) : f
        },
        ha = /^(?:checkbox|radio)$/i;
    ! function() {
        var a = N.createElement("input"),
            b = N.createElement("div"),
            c = N.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", H.leadingWhitespace = 3 === b.firstChild.nodeType, H.tbody = !b.getElementsByTagName("tbody").length, H.htmlSerialize = !!b.getElementsByTagName("link").length, H.html5Clone = "<:nav></:nav>" !== N.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), H.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", H.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", H.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, H.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
                H.noCloneEvent = !1
            }), b.cloneNode(!0).click()), null == H.deleteExpando) {
            H.deleteExpando = !0;
            try {
                delete b.test
            } catch (n) {
                H.deleteExpando = !1
            }
        }
    }();
    (function() {
        var a, b, c = N.createElement("div");
        for (a in {
                submit: !0,
                change: !0,
                focusin: !0
            }) b = "on" + a, (H[a + "Bubbles"] = b in e) || (c.setAttribute(b, "t"), H[a + "Bubbles"] = !1 === c.attributes[b].expando)
    })();
    var ma = /^(?:input|select|textarea)$/i,
        Kb = /^key/,
        Lb = /^(?:mouse|pointer|contextmenu)|click/,
        Eb = /^(?:focusinfocus|focusoutblur)$/,
        zb = /^([^.]*)(?:\.(.+)|)$/;
    h.event = {
        global: {},
        add: function(a,
            b, c, n, d) {
            var f, e, y, l, k, I, m, q, K, ja;
            if (y = h._data(a)) {
                c.handler && (l = c, c = l.handler, d = l.selector);
                c.guid || (c.guid = h.guid++);
                (e = y.events) || (e = y.events = {});
                (I = y.handle) || (I = y.handle = function(a) {
                    return "undefined" === typeof h || a && h.event.triggered === a.type ? void 0 : h.event.dispatch.apply(I.elem, arguments)
                }, I.elem = a);
                b = (b || "").match(va) || [""];
                for (y = b.length; y--;) f = zb.exec(b[y]) || [], K = ja = f[1], f = (f[2] || "").split(".").sort(), K && (k = h.event.special[K] || {}, K = (d ? k.delegateType : k.bindType) || K, k = h.event.special[K] || {},
                    m = h.extend({
                        type: K,
                        origType: ja,
                        data: n,
                        handler: c,
                        guid: c.guid,
                        selector: d,
                        needsContext: d && h.expr.match.needsContext.test(d),
                        namespace: f.join(".")
                    }, l), (q = e[K]) || (q = e[K] = [], q.delegateCount = 0, k.setup && !1 !== k.setup.call(a, n, f, I) || (a.addEventListener ? a.addEventListener(K, I, !1) : a.attachEvent && a.attachEvent("on" + K, I))), k.add && (k.add.call(a, m), m.handler.guid || (m.handler.guid = c.guid)), d ? q.splice(q.delegateCount++, 0, m) : q.push(m), h.event.global[K] = !0);
                a = null
            }
        },
        remove: function(a, b, c, n, d) {
            var f, e, y, l, k, I, m, q, K, ja,
                r, xa = h.hasData(a) && h._data(a);
            if (xa && (I = xa.events)) {
                b = (b || "").match(va) || [""];
                for (k = b.length; k--;)
                    if (y = zb.exec(b[k]) || [], K = r = y[1], ja = (y[2] || "").split(".").sort(), K) {
                        m = h.event.special[K] || {};
                        K = (n ? m.delegateType : m.bindType) || K;
                        q = I[K] || [];
                        y = y[2] && new RegExp("(^|\\.)" + ja.join("\\.(?:.*\\.|)") + "(\\.|$)");
                        for (l = f = q.length; f--;) e = q[f], !d && r !== e.origType || c && c.guid !== e.guid || y && !y.test(e.namespace) || n && n !== e.selector && ("**" !== n || !e.selector) || (q.splice(f, 1), e.selector && q.delegateCount--, m.remove && m.remove.call(a,
                            e));
                        l && !q.length && (m.teardown && !1 !== m.teardown.call(a, ja, xa.handle) || h.removeEvent(a, K, xa.handle), delete I[K])
                    } else
                        for (K in I) h.event.remove(a, K + b[k], c, n, !0);
                h.isEmptyObject(I) && (delete xa.handle, h._removeData(a, "events"))
            }
        },
        trigger: function(a, b, c, n) {
            var d, f, y, l, k, I, m = [c || N],
                q = Wa.call(a, "type") ? a.type : a;
            I = Wa.call(a, "namespace") ? a.namespace.split(".") : [];
            if (y = d = c = c || N, 3 !== c.nodeType && 8 !== c.nodeType && !Eb.test(q + h.event.triggered) && (0 <= q.indexOf(".") && (I = q.split("."), q = I.shift(), I.sort()), f = 0 > q.indexOf(":") &&
                    "on" + q, a = a[h.expando] ? a : new h.Event(q, "object" == typeof a && a), a.isTrigger = n ? 2 : 3, a.namespace = I.join("."), a.namespace_re = a.namespace ? new RegExp("(^|\\.)" + I.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, a.result = void 0, a.target || (a.target = c), b = null == b ? [a] : h.makeArray(b, [a]), k = h.event.special[q] || {}, n || !k.trigger || !1 !== k.trigger.apply(c, b))) {
                if (!n && !k.noBubble && !h.isWindow(c)) {
                    l = k.delegateType || q;
                    for (Eb.test(l + q) || (y = y.parentNode); y; y = y.parentNode) m.push(y), d = y;
                    d === (c.ownerDocument || N) && m.push(d.defaultView ||
                        d.parentWindow || e)
                }
                for (I = 0;
                    (y = m[I++]) && !a.isPropagationStopped();) a.type = 1 < I ? l : k.bindType || q, (d = (h._data(y, "events") || {})[a.type] && h._data(y, "handle")) && d.apply(y, b), (d = f && y[f]) && d.apply && h.acceptData(y) && (a.result = d.apply(y, b), !1 === a.result && a.preventDefault());
                if (a.type = q, !(n || a.isDefaultPrevented() || k._default && !1 !== k._default.apply(m.pop(), b)) && h.acceptData(c) && f && c[q] && !h.isWindow(c)) {
                    (d = c[f]) && (c[f] = null);
                    h.event.triggered = q;
                    try {
                        c[q]()
                    } catch (K) {}
                    h.event.triggered = void 0;
                    d && (c[f] = d)
                }
                return a.result
            }
        },
        dispatch: function(a) {
            a = h.event.fix(a);
            var b, c, n, d, f, e = [],
                y = da.call(arguments);
            b = (h._data(this, "events") || {})[a.type] || [];
            var l = h.event.special[a.type] || {};
            if (y[0] = a, a.delegateTarget = this, !l.preDispatch || !1 !== l.preDispatch.call(this, a)) {
                e = h.event.handlers.call(this, a, b);
                for (b = 0;
                    (d = e[b++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = d.elem, f = 0;
                        (n = d.handlers[f++]) && !a.isImmediatePropagationStopped();) a.namespace_re && !a.namespace_re.test(n.namespace) || (a.handleObj = n, a.data = n.data, c = ((h.event.special[n.origType] || {}).handle || n.handler).apply(d.elem, y), void 0 === c || !1 !== (a.result = c) || (a.preventDefault(), a.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(a, b) {
            var c, n, d, f, e = [],
                y = b.delegateCount,
                l = a.target;
            if (y && l.nodeType && (!a.button || "click" !== a.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== a.type)) {
                        d = [];
                        for (f = 0; y > f; f++) n = b[f], c = n.selector + " ", void 0 === d[c] && (d[c] = n.needsContext ? 0 <= h(c, this).index(l) : h.find(c, this, null, [l]).length), d[c] && d.push(n);
                        d.length && e.push({
                            elem: l,
                            handlers: d
                        })
                    }
            return y < b.length && e.push({
                elem: this,
                handlers: b.slice(y)
            }), e
        },
        fix: function(a) {
            if (a[h.expando]) return a;
            var b, c, n;
            b = a.type;
            var d = a,
                f = this.fixHooks[b];
            f || (this.fixHooks[b] = f = Lb.test(b) ? this.mouseHooks : Kb.test(b) ? this.keyHooks : {});
            n = f.props ? this.props.concat(f.props) : this.props;
            a = new h.Event(d);
            for (b = n.length; b--;) c = n[b], a[c] = d[c];
            return a.target || (a.target = d.srcElement || N), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: ["char", "charCode", "key", "keyCode"],
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, n, d, f = b.button,
                    h = b.fromElement;
                return null == a.pageX && null != b.clientX && (n = a.target.ownerDocument || N, d = n.documentElement, c = n.body, a.pageX = b.clientX + (d && d.scrollLeft || c && c.scrollLeft || 0) - (d && d.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || c && c.scrollTop || 0) - (d && d.clientTop || c && c.clientTop || 0)), !a.relatedTarget && h && (a.relatedTarget = h === a.target ? b.toElement : h), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== z() && this.focus) try {
                        return this.focus(), !1
                    } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === z() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return h.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(a) {
                    return h.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, n) {
            a = h.extend(new h.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            n ? h.event.trigger(a, null, b) : h.event.dispatch.call(b, a);
            a.isDefaultPrevented() && c.preventDefault()
        }
    };
    h.removeEvent = N.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function(a, b, c) {
        b = "on" + b;
        a.detachEvent && ("undefined" === typeof a[b] && (a[b] = null), a.detachEvent(b, c))
    };
    h.Event = function(a, b) {
        return this instanceof h.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented &&
            !1 === a.returnValue ? v : D) : this.type = a, b && h.extend(this, b), this.timeStamp = a && a.timeStamp || h.now(), void(this[h.expando] = !0)) : new h.Event(a, b)
    };
    h.Event.prototype = {
        isDefaultPrevented: D,
        isPropagationStopped: D,
        isImmediatePropagationStopped: D,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = v;
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = v;
            a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = v;
            a && a.stopImmediatePropagation && a.stopImmediatePropagation();
            this.stopPropagation()
        }
    };
    h.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        h.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, n = a.relatedTarget,
                    d = a.handleObj;
                return (!n || n !== this && !h.contains(this, n)) && (a.type = d.origType, c = d.handler.apply(this, arguments),
                    a.type = b), c
            }
        }
    });
    H.submitBubbles || (h.event.special.submit = {
        setup: function() {
            return h.nodeName(this, "form") ? !1 : void h.event.add(this, "click._submit keypress._submit", function(a) {
                a = a.target;
                (a = h.nodeName(a, "input") || h.nodeName(a, "button") ? a.form : void 0) && !h._data(a, "submitBubbles") && (h.event.add(a, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }), h._data(a, "submitBubbles", !0))
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && h.event.simulate("submit",
                this.parentNode, a, !0))
        },
        teardown: function() {
            return h.nodeName(this, "form") ? !1 : void h.event.remove(this, "._submit")
        }
    });
    H.changeBubbles || (h.event.special.change = {
        setup: function() {
            return ma.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (h.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), h.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1);
                h.event.simulate("change",
                    this, a, !0)
            })), !1) : void h.event.add(this, "beforeactivate._change", function(a) {
                a = a.target;
                ma.test(a.nodeName) && !h._data(a, "changeBubbles") && (h.event.add(a, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || h.event.simulate("change", this.parentNode, a, !0)
                }), h._data(a, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return h.event.remove(this,
                "._change"), !ma.test(this.nodeName)
        }
    });
    H.focusinBubbles || h.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            h.event.simulate(b, a.target, h.event.fix(a), !0)
        };
        h.event.special[b] = {
            setup: function() {
                var n = this.ownerDocument || this,
                    d = h._data(n, b);
                d || n.addEventListener(a, c, !0);
                h._data(n, b, (d || 0) + 1)
            },
            teardown: function() {
                var n = this.ownerDocument || this,
                    d = h._data(n, b) - 1;
                d ? h._data(n, b, d) : (n.removeEventListener(a, c, !0), h._removeData(n, b))
            }
        }
    });
    h.fn.extend({
        on: function(a, b, c, n, d) {
            var f, e;
            if ("object" ==
                typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a) this.on(f, b, c, a[f], d);
                return this
            }
            if (null == c && null == n ? (n = b, c = b = void 0) : null == n && ("string" == typeof b ? (n = c, c = void 0) : (n = c, c = b, b = void 0)), !1 === n) n = D;
            else if (!n) return this;
            return 1 === d && (e = n, n = function(a) {
                return h().off(a), e.apply(this, arguments)
            }, n.guid = e.guid || (e.guid = h.guid++)), this.each(function() {
                h.event.add(this, a, n, c, b)
            })
        },
        one: function(a, b, c, n) {
            return this.on(a, b, c, n, 1)
        },
        off: function(a, b, c) {
            var n, d;
            if (a && a.preventDefault && a.handleObj) return n =
                a.handleObj, h(a.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
            if ("object" == typeof a) {
                for (d in a) this.off(d, b, a[d]);
                return this
            }
            return (!1 === b || "function" == typeof b) && (c = b, b = void 0), !1 === c && (c = D), this.each(function() {
                h.event.remove(this, a, c, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                h.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? h.event.trigger(a, b, c, !0) : void 0
        }
    });
    var tb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Qa = / jQuery\d+="(?:null|\d+)"/g,
        La = new RegExp("<(?:" + tb + ")[\\s/>]", "i"),
        Za = /^\s+/,
        Sa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        za = /<([\w:]+)/,
        Ca = /<tbody/i,
        Gb = /<|&#?\w+;/,
        Fb = /<(?:script|style|link)/i,
        Ga = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fa = /^$|\/(?:java|ecma)script/i,
        mb = /^true\/(.*)/,
        nb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        la = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>",
                "</object>"
            ],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: H.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        T = A(N).appendChild(N.createElement("div"));
    la.optgroup = la.option;
    la.tbody = la.tfoot = la.colgroup = la.caption = la.thead;
    la.th = la.td;
    h.extend({
        clone: function(a, b, c) {
            var n, d, f, e, y, l = h.contains(a.ownerDocument, a);
            if (H.html5Clone || h.isXMLDoc(a) || !La.test("<" +
                    a.nodeName + ">") ? f = a.cloneNode(!0) : (T.innerHTML = a.outerHTML, T.removeChild(f = T.firstChild)), !(H.noCloneEvent && H.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || h.isXMLDoc(a)))
                for (n = r(f), y = r(a), e = 0; null != (d = y[e]); ++e)
                    if (n[e]) {
                        var k = n[e],
                            I = void 0,
                            m = void 0,
                            q = void 0;
                        if (1 === k.nodeType) {
                            if (I = k.nodeName.toLowerCase(), !H.noCloneEvent && k[h.expando]) {
                                q = h._data(k);
                                for (m in q.events) h.removeEvent(k, m, q.handle);
                                k.removeAttribute(h.expando)
                            }
                            "script" === I && k.text !== d.text ? (w(k).text = d.text, E(k)) : "object" === I ? (k.parentNode &&
                                (k.outerHTML = d.outerHTML), H.html5Clone && d.innerHTML && !h.trim(k.innerHTML) && (k.innerHTML = d.innerHTML)) : "input" === I && ha.test(d.type) ? (k.defaultChecked = k.checked = d.checked, k.value !== d.value && (k.value = d.value)) : "option" === I ? k.defaultSelected = k.selected = d.defaultSelected : ("input" === I || "textarea" === I) && (k.defaultValue = d.defaultValue)
                        }
                    }
            if (b)
                if (c)
                    for (y = y || r(a), n = n || r(f), e = 0; null != (d = y[e]); e++) F(d, n[e]);
                else F(a, f);
            return n = r(f, "script"), 0 < n.length && C(n, !l && r(a, "script")), f
        },
        buildFragment: function(a, b, c, n) {
            for (var d,
                    f, e, y, l, k, I, m = a.length, q = A(b), K = [], ja = 0; m > ja; ja++)
                if (f = a[ja], f || 0 === f)
                    if ("object" === h.type(f)) h.merge(K, f.nodeType ? [f] : f);
                    else if (Gb.test(f)) {
                y = y || q.appendChild(b.createElement("div"));
                l = (za.exec(f) || ["", ""])[1].toLowerCase();
                I = la[l] || la._default;
                y.innerHTML = I[1] + f.replace(Sa, "<$1></$2>") + I[2];
                for (d = I[0]; d--;) y = y.lastChild;
                if (!H.leadingWhitespace && Za.test(f) && K.push(b.createTextNode(Za.exec(f)[0])), !H.tbody)
                    for (d = (f = "table" !== l || Ca.test(f) ? "<table>" !== I[1] || Ca.test(f) ? 0 : y : y.firstChild) && f.childNodes.length; d--;) h.nodeName(k =
                        f.childNodes[d], "tbody") && !k.childNodes.length && f.removeChild(k);
                h.merge(K, y.childNodes);
                for (y.textContent = ""; y.firstChild;) y.removeChild(y.firstChild);
                y = q.lastChild
            } else K.push(b.createTextNode(f));
            y && q.removeChild(y);
            H.appendChecked || h.grep(r(K, "input"), B);
            for (ja = 0; f = K[ja++];)
                if ((!n || -1 === h.inArray(f, n)) && (e = h.contains(f.ownerDocument, f), y = r(q.appendChild(f), "script"), e && C(y), c))
                    for (d = 0; f = y[d++];) fa.test(f.type || "") && c.push(f);
            return q
        },
        cleanData: function(a, b) {
            for (var c, n, d, f, e = 0, y = h.expando, l =
                    h.cache, k = H.deleteExpando, I = h.event.special; null != (c = a[e]); e++)
                if ((b || h.acceptData(c)) && (d = c[y], f = d && l[d])) {
                    if (f.events)
                        for (n in f.events) I[n] ? h.event.remove(c, n) : h.removeEvent(c, n, f.handle);
                    l[d] && (delete l[d], k ? delete c[y] : "undefined" !== typeof c.removeAttribute ? c.removeAttribute(y) : c[y] = null, ea.push(d))
                }
        }
    });
    h.fn.extend({
        text: function(a) {
            return Pa(this, function(a) {
                return void 0 === a ? h.text(this) : this.empty().append((this[0] && this[0].ownerDocument || N).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments,
                function(a) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || t(this, a).appendChild(a)
                })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = t(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, b) {
            for (var c, n = a ? h.filter(a, this) : this, d = 0; null != (c = n[d]); d++) b || 1 !== c.nodeType || h.cleanData(r(c)), c.parentNode && (b && h.contains(c.ownerDocument, c) && C(r(c, "script")), c.parentNode.removeChild(c));
            return this
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && h.cleanData(r(a, !1)); a.firstChild;) a.removeChild(a.firstChild);
                a.options && h.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                return h.clone(this,
                    a, b)
            })
        },
        html: function(a) {
            return Pa(this, function(a) {
                var b = this[0] || {},
                    c = 0,
                    n = this.length;
                if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(Qa, "") : void 0;
                if (!("string" != typeof a || Fb.test(a) || !H.htmlSerialize && La.test(a) || !H.leadingWhitespace && Za.test(a) || la[(za.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(Sa, "<$1></$2>");
                    try {
                        for (; n > c; c++) b = this[c] || {}, 1 === b.nodeType && (h.cleanData(r(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (d) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a =
                arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode;
                h.cleanData(r(this));
                a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, b) {
            a = hb.apply([], a);
            var c, n, d, f, e = 0,
                y = this.length,
                l = this,
                k = y - 1,
                I = a[0],
                m = h.isFunction(I);
            if (m || 1 < y && "string" == typeof I && !H.checkClone && Ga.test(I)) return this.each(function(c) {
                var n = l.eq(c);
                m && (a[0] = I.call(this, c, n.html()));
                n.domManip(a, b)
            });
            if (y && (f = h.buildFragment(a,
                    this[0].ownerDocument, !1, this), c = f.firstChild, 1 === f.childNodes.length && (f = c), c)) {
                d = h.map(r(f, "script"), w);
                for (n = d.length; y > e; e++) c = f, e !== k && (c = h.clone(c, !0, !0), n && h.merge(d, r(c, "script"))), b.call(this[e], c, e);
                if (n)
                    for (f = d[d.length - 1].ownerDocument, h.map(d, E), e = 0; n > e; e++) c = d[e], fa.test(c.type || "") && !h._data(c, "globalEval") && h.contains(f, c) && (c.src ? h._evalUrl && h._evalUrl(c.src) : h.globalEval((c.text || c.textContent || c.innerHTML || "").replace(nb, "")));
                f = c = null
            }
            return this
        }
    });
    h.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        h.fn[a] = function(a) {
            for (var c = 0, n = [], d = h(a), f = d.length - 1; f >= c; c++) a = c === f ? this : this.clone(!0), h(d[c])[b](a), Oa.apply(n, a.get());
            return this.pushStack(n)
        }
    });
    var S, ia = {};
    ! function() {
        var a;
        H.shrinkWrapBlocks = function() {
            if (null != a) return a;
            a = !1;
            var b, c, n;
            return c = N.getElementsByTagName("body")[0], c && c.style ? (b = N.createElement("div"), n = N.createElement("div"), n.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                c.appendChild(n).appendChild(b), "undefined" !== typeof b.style.zoom && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(N.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(n), a) : void 0
        }
    }();
    var G = /^margin/,
        ua = new RegExp("^(" + Ha + ")(?!px)[a-z%]+$", "i"),
        Y, Q, ra = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (Y = function(a) {
        return a.ownerDocument.defaultView.opener ?
            a.ownerDocument.defaultView.getComputedStyle(a, null) : e.getComputedStyle(a, null)
    }, Q = function(a, b, c) {
        var n, d, f, e, y = a.style;
        return c = c || Y(a), e = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== e || h.contains(a.ownerDocument, a) || (e = h.style(a, b)), ua.test(e) && G.test(b) && (n = y.width, d = y.minWidth, f = y.maxWidth, y.minWidth = y.maxWidth = y.width = e, e = c.width, y.width = n, y.minWidth = d, y.maxWidth = f)), void 0 === e ? e : e + ""
    }) : N.documentElement.currentStyle && (Y = function(a) {
        return a.currentStyle
    }, Q = function(a, b, c) {
        var n, d, f, e, h = a.style;
        return c = c || Y(a), e = c ? c[b] : void 0, null == e && h && h[b] && (e = h[b]), ua.test(e) && !ra.test(b) && (n = h.left, d = a.runtimeStyle, f = d && d.left, f && (d.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : e, e = h.pixelLeft + "px", h.left = n, f && (d.left = f)), void 0 === e ? e : e + "" || "auto"
    });
    ! function() {
        var a, b, c, n, d, f, y;
        if (a = N.createElement("div"), a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = a.getElementsByTagName("a")[0], b = c && c.style) {
            var l = function() {
                var a, b, c, h;
                (b = N.getElementsByTagName("body")[0]) &&
                b.style && (a = N.createElement("div"), c = N.createElement("div"), c.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", b.appendChild(c).appendChild(a), a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", n = d = !1, y = !0, e.getComputedStyle && (n = "1%" !== (e.getComputedStyle(a, null) || {}).top, d = "4px" === (e.getComputedStyle(a, null) || {
                        width: "4px"
                    }).width, h = a.appendChild(N.createElement("div")),
                    h.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", h.style.marginRight = h.style.width = "0", a.style.width = "1px", y = !parseFloat((e.getComputedStyle(h, null) || {}).marginRight), a.removeChild(h)), a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", h = a.getElementsByTagName("td"), h[0].style.cssText = "margin:0;border:0;padding:0;display:none", f = 0 === h[0].offsetHeight, f && (h[0].style.display = "", h[1].style.display =
                    "none", f = 0 === h[0].offsetHeight), b.removeChild(c))
            };
            b.cssText = "float:left;opacity:.5";
            H.opacity = "0.5" === b.opacity;
            H.cssFloat = !!b.cssFloat;
            a.style.backgroundClip = "content-box";
            a.cloneNode(!0).style.backgroundClip = "";
            H.clearCloneStyle = "content-box" === a.style.backgroundClip;
            H.boxSizing = "" === b.boxSizing || "" === b.MozBoxSizing || "" === b.WebkitBoxSizing;
            h.extend(H, {
                reliableHiddenOffsets: function() {
                    return null == f && l(), f
                },
                boxSizingReliable: function() {
                    return null == d && l(), d
                },
                pixelPosition: function() {
                    return null ==
                        n && l(), n
                },
                reliableMarginRight: function() {
                    return null == y && l(), y
                }
            })
        }
    }();
    h.swap = function(a, b, c, n) {
        var d, f = {};
        for (d in b) f[d] = a.style[d], a.style[d] = b[d];
        c = c.apply(a, n || []);
        for (d in b) a.style[d] = f[d];
        return c
    };
    var Hb = /alpha\([^)]*\)/i,
        Yb = /opacity\s*=\s*([^)]*)/,
        Mb = /^(none|table(?!-c[ea]).+)/,
        cc = new RegExp("^(" + Ha + ")(.*)$", "i"),
        dc = new RegExp("^([+-])=(" + Ha + ")", "i"),
        ec = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Nb = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        cb = ["Webkit", "O", "Moz", "ms"];
    h.extend({
        cssHooks: {
            opacity: {
                get: function(a,
                    b) {
                    if (b) {
                        var c = Q(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": H.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, n) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var d, f, e, y = h.camelCase(b),
                    l = a.style;
                if (b = h.cssProps[y] || (h.cssProps[y] = pa(l, y)), e = h.cssHooks[b] || h.cssHooks[y], void 0 === c) return e && "get" in e && void 0 !== (d = e.get(a, !1, n)) ?
                    d : l[b];
                if (f = typeof c, "string" === f && (d = dc.exec(c)) && (c = (d[1] + 1) * d[2] + parseFloat(h.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || h.cssNumber[y] || (c += "px"), H.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (l[b] = "inherit"), !(e && "set" in e && void 0 === (c = e.set(a, c, n))))) try {
                    l[b] = c
                } catch (k) {}
            }
        },
        css: function(a, b, c, n) {
            var d, f, e, y = h.camelCase(b);
            return b = h.cssProps[y] || (h.cssProps[y] = pa(a.style, y)), e = h.cssHooks[b] || h.cssHooks[y], e && "get" in e && (f = e.get(a, !0, c)), void 0 === f && (f = Q(a, b, n)), "normal" ===
                f && b in Nb && (f = Nb[b]), "" === c || c ? (d = parseFloat(f), !0 === c || h.isNumeric(d) ? d || 0 : f) : f
        }
    });
    h.each(["height", "width"], function(a, b) {
        h.cssHooks[b] = {
            get: function(a, c, n) {
                return c ? Mb.test(h.css(a, "display")) && 0 === a.offsetWidth ? h.swap(a, ec, function() {
                    return X(a, b, n)
                }) : X(a, b, n) : void 0
            },
            set: function(a, c, n) {
                var d = n && Y(a);
                return qa(a, c, n ? sa(a, b, n, H.boxSizing && "border-box" === h.css(a, "boxSizing", !1, d), d) : 0)
            }
        }
    });
    H.opacity || (h.cssHooks.opacity = {
        get: function(a, b) {
            return Yb.test((b && a.currentStyle ? a.currentStyle.filter :
                a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                n = a.currentStyle,
                d = h.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                f = n && n.filter || c.filter || "";
            c.zoom = 1;
            (1 <= b || "" === b) && "" === h.trim(f.replace(Hb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || n && !n.filter) || (c.filter = Hb.test(f) ? f.replace(Hb, d) : f + " " + d)
        }
    });
    h.cssHooks.marginRight = L(H.reliableMarginRight, function(a, b) {
        return b ? h.swap(a, {
            display: "inline-block"
        }, Q, [a, "marginRight"]) : void 0
    });
    h.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        h.cssHooks[a + b] = {
            expand: function(c) {
                var n = 0,
                    d = {};
                for (c = "string" == typeof c ? c.split(" ") : [c]; 4 > n; n++) d[a + Ka[n] + b] = c[n] || c[n - 2] || c[0];
                return d
            }
        };
        G.test(a) || (h.cssHooks[a + b].set = qa)
    });
    h.fn.extend({
        css: function(a, b) {
            return Pa(this, function(a, b, c) {
                var n, d = {},
                    f = 0;
                if (h.isArray(b)) {
                    c = Y(a);
                    for (n = b.length; n > f; f++) d[b[f]] = h.css(a, b[f], !1, c);
                    return d
                }
                return void 0 !== c ? h.style(a, b, c) : h.css(a, b)
            }, a, b, 1 < arguments.length)
        },
        show: function() {
            return ka(this, !0)
        },
        hide: function() {
            return ka(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                lb(this) ? h(this).show() : h(this).hide()
            })
        }
    });
    h.Tween = R;
    R.prototype = {
        constructor: R,
        init: function(a, b, c, n, d, f) {
            this.elem = a;
            this.prop = c;
            this.easing = d || "swing";
            this.options = b;
            this.start = this.now = this.cur();
            this.end = n;
            this.unit = f || (h.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = R.propHooks[this.prop];
            return a && a.get ? a.get(this) : R.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = R.propHooks[this.prop];
            return this.options.duration ?
                this.pos = b = h.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : R.propHooks._default.set(this), this
        }
    };
    R.prototype.init.prototype = R.prototype;
    R.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = h.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function(a) {
                h.fx.step[a.prop] ?
                    h.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[h.cssProps[a.prop]] || h.cssHooks[a.prop]) ? h.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    };
    R.propHooks.scrollTop = R.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    };
    h.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    };
    h.fx = R.prototype.init;
    h.fx.step = {};
    var Ab, Ib, Tb = /^(?:toggle|show|hide)$/,
        Ub = new RegExp("^(?:([+-])=|)(" + Ha + ")([a-z%]*)$", "i"),
        Ta = /queueHooks$/,
        ub = [function(a, b, c) {
            var n, d, f, e, y, l, k, I = this,
                m = {},
                q = a.style,
                K = a.nodeType && lb(a),
                ja = h._data(a, "fxshow");
            c.queue || (e = h._queueHooks(a, "fx"), null == e.unqueued && (e.unqueued = 0, y = e.empty.fire, e.empty.fire = function() {
                e.unqueued || y()
            }), e.unqueued++, I.always(function() {
                I.always(function() {
                    e.unqueued--;
                    h.queue(a, "fx").length || e.empty.fire()
                })
            }));
            1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [q.overflow, q.overflowX, q.overflowY], l = h.css(a, "display"), k = "none" === l ? h._data(a, "olddisplay") || P(a.nodeName) :
                l, "inline" === k && "none" === h.css(a, "float") && (H.inlineBlockNeedsLayout && "inline" !== P(a.nodeName) ? q.zoom = 1 : q.display = "inline-block"));
            c.overflow && (q.overflow = "hidden", H.shrinkWrapBlocks() || I.always(function() {
                q.overflow = c.overflow[0];
                q.overflowX = c.overflow[1];
                q.overflowY = c.overflow[2]
            }));
            for (n in b)
                if (d = b[n], Tb.exec(d)) {
                    if (delete b[n], f = f || "toggle" === d, d === (K ? "hide" : "show")) {
                        if ("show" !== d || !ja || void 0 === ja[n]) continue;
                        K = !0
                    }
                    m[n] = ja && ja[n] || h.style(a, n)
                } else l = void 0;
            if (h.isEmptyObject(m)) "inline" === ("none" ===
                l ? P(a.nodeName) : l) && (q.display = l);
            else
                for (n in ja ? "hidden" in ja && (K = ja.hidden) : ja = h._data(a, "fxshow", {}), f && (ja.hidden = !K), K ? h(a).show() : I.done(function() {
                        h(a).hide()
                    }), I.done(function() {
                        var b;
                        h._removeData(a, "fxshow");
                        for (b in m) h.style(a, b, m[b])
                    }), m) b = O(K ? ja[n] : 0, n, I), n in ja || (ja[n] = b.start, K && (b.end = b.start, b.start = "width" === n || "height" === n ? 1 : 0))
        }],
        db = {
            "*": [function(a, b) {
                var c = this.createTween(a, b),
                    n = c.cur(),
                    d = Ub.exec(b),
                    f = d && d[3] || (h.cssNumber[a] ? "" : "px"),
                    e = (h.cssNumber[a] || "px" !== f && +n) && Ub.exec(h.css(c.elem,
                        a)),
                    y = 1,
                    l = 20;
                if (e && e[3] !== f) {
                    f = f || e[3];
                    d = d || [];
                    e = +n || 1;
                    do y = y || ".5", e /= y, h.style(c.elem, a, e + f); while (y !== (y = c.cur() / n) && 1 !== y && --l)
                }
                return d && (e = c.start = +e || +n || 0, c.unit = f, c.end = d[1] ? e + (d[1] + 1) * d[2] : +d[2]), c
            }]
        };
    h.Animation = h.extend(ca, {
        tweener: function(a, b) {
            h.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, n = 0, d = a.length; d > n; n++) c = a[n], db[c] = db[c] || [], db[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? ub.unshift(a) : ub.push(a)
        }
    });
    h.speed = function(a, b, c) {
        var n = a && "object" == typeof a ? h.extend({}, a) : {
            complete: c ||
                !c && b || h.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !h.isFunction(b) && b
        };
        return n.duration = h.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in h.fx.speeds ? h.fx.speeds[n.duration] : h.fx.speeds._default, (null == n.queue || !0 === n.queue) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
            h.isFunction(n.old) && n.old.call(this);
            n.queue && h.dequeue(this, n.queue)
        }, n
    };
    h.fn.extend({
        fadeTo: function(a, b, c, n) {
            return this.filter(lb).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, n)
        },
        animate: function(a,
            b, c, n) {
            var d = h.isEmptyObject(a),
                f = h.speed(b, c, n);
            b = function() {
                var b = ca(this, h.extend({}, a), f);
                (d || h._data(this, "finish")) && b.stop(!0)
            };
            return b.finish = b, d || !1 === f.queue ? this.each(b) : this.queue(f.queue, b)
        },
        stop: function(a, b, c) {
            var n = function(a) {
                var b = a.stop;
                delete a.stop;
                b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && !1 !== a && this.queue(a || "fx", []), this.each(function() {
                var b = !0,
                    d = null != a && a + "queueHooks",
                    f = h.timers,
                    e = h._data(this);
                if (d) e[d] && e[d].stop && n(e[d]);
                else
                    for (d in e) e[d] && e[d].stop &&
                        Ta.test(d) && n(e[d]);
                for (d = f.length; d--;) f[d].elem !== this || null != a && f[d].queue !== a || (f[d].anim.stop(c), b = !1, f.splice(d, 1));
                !b && c || h.dequeue(this, a)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"), this.each(function() {
                var b, c = h._data(this),
                    n = c[a + "queue"];
                b = c[a + "queueHooks"];
                var d = h.timers,
                    f = n ? n.length : 0;
                c.finish = !0;
                h.queue(this, a, []);
                b && b.stop && b.stop.call(this, !0);
                for (b = d.length; b--;) d[b].elem === this && d[b].queue === a && (d[b].anim.stop(!0), d.splice(b, 1));
                for (b = 0; f > b; b++) n[b] && n[b].finish && n[b].finish.call(this);
                delete c.finish
            })
        }
    });
    h.each(["toggle", "show", "hide"], function(a, b) {
        var c = h.fn[b];
        h.fn[b] = function(a, n, d) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(ba(b, !0), a, n, d)
        }
    });
    h.each({
        slideDown: ba("show"),
        slideUp: ba("hide"),
        slideToggle: ba("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        h.fn[a] = function(a, c, n) {
            return this.animate(b, a, c, n)
        }
    });
    h.timers = [];
    h.fx.tick = function() {
        var a, b = h.timers,
            c = 0;
        for (Ab = h.now(); c < b.length; c++) a =
            b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || h.fx.stop();
        Ab = void 0
    };
    h.fx.timer = function(a) {
        h.timers.push(a);
        a() ? h.fx.start() : h.timers.pop()
    };
    h.fx.interval = 13;
    h.fx.start = function() {
        Ib || (Ib = setInterval(h.fx.tick, h.fx.interval))
    };
    h.fx.stop = function() {
        clearInterval(Ib);
        Ib = null
    };
    h.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    h.fn.delay = function(a, b) {
        return a = h.fx ? h.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
            var n = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(n)
            }
        })
    };
    (function() {
        var a, b, c, n,
            d;
        b = N.createElement("div");
        b.setAttribute("className", "t");
        b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        n = b.getElementsByTagName("a")[0];
        c = N.createElement("select");
        d = c.appendChild(N.createElement("option"));
        a = b.getElementsByTagName("input")[0];
        n.style.cssText = "top:1px";
        H.getSetAttribute = "t" !== b.className;
        H.style = /top/.test(n.getAttribute("style"));
        H.hrefNormalized = "/a" === n.getAttribute("href");
        H.checkOn = !!a.value;
        H.optSelected = d.selected;
        H.enctype = !!N.createElement("form").enctype;
        c.disabled = !0;
        H.optDisabled = !d.disabled;
        a = N.createElement("input");
        a.setAttribute("value", "");
        H.input = "" === a.getAttribute("value");
        a.value = "t";
        a.setAttribute("type", "radio");
        H.radioValue = "t" === a.value
    })();
    var Zb = /\r/g;
    h.fn.extend({
        val: function(a) {
            var b, c, n, d = this[0];
            if (arguments.length) return n = h.isFunction(a), this.each(function(c) {
                var d;
                1 === this.nodeType && (d = n ? a.call(this, c, h(this).val()) : a, null == d ? d = "" : "number" == typeof d ? d += "" : h.isArray(d) && (d = h.map(d, function(a) {
                        return null == a ? "" : a + ""
                    })), b = h.valHooks[this.type] ||
                    h.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, d, "value") || (this.value = d))
            });
            if (d) return b = h.valHooks[d.type] || h.valHooks[d.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(d, "value")) ? c : (c = d.value, "string" == typeof c ? c.replace(Zb, "") : null == c ? "" : c)
        }
    });
    h.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = h.find.attr(a, "value");
                    return null != b ? b : h.trim(h.text(a))
                }
            },
            select: {
                get: function(a) {
                    for (var b, c = a.options, n = a.selectedIndex, d = "select-one" === a.type || 0 > n, f = d ? null : [], e =
                            d ? n + 1 : c.length, y = 0 > n ? e : d ? n : 0; e > y; y++)
                        if (b = c[y], !(!b.selected && y !== n || (H.optDisabled ? b.disabled : null !== b.getAttribute("disabled")) || b.parentNode.disabled && h.nodeName(b.parentNode, "optgroup"))) {
                            if (a = h(b).val(), d) return a;
                            f.push(a)
                        }
                    return f
                },
                set: function(a, b) {
                    for (var c, n, d = a.options, f = h.makeArray(b), e = d.length; e--;)
                        if (n = d[e], 0 <= h.inArray(h.valHooks.option.get(n), f)) try {
                            n.selected = c = !0
                        } catch (y) {
                            n.scrollHeight
                        } else n.selected = !1;
                    return c || (a.selectedIndex = -1), d
                }
            }
        }
    });
    h.each(["radio", "checkbox"], function() {
        h.valHooks[this] = {
            set: function(a, b) {
                return h.isArray(b) ? a.checked = 0 <= h.inArray(h(a).val(), b) : void 0
            }
        };
        H.checkOn || (h.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var ob, Na, Ua = h.expr.attrHandle,
        vb = /^(?:checked|selected)$/i,
        eb = H.getSetAttribute,
        Ob = H.input;
    h.fn.extend({
        attr: function(a, b) {
            return Pa(this, h.attr, a, b, 1 < arguments.length)
        },
        removeAttr: function(a) {
            return this.each(function() {
                h.removeAttr(this, a)
            })
        }
    });
    h.extend({
        attr: function(a, b, c) {
            var n, d, f = a.nodeType;
            if (a && 3 !== f && 8 !==
                f && 2 !== f) return "undefined" === typeof a.getAttribute ? h.prop(a, b, c) : (1 === f && h.isXMLDoc(a) || (b = b.toLowerCase(), n = h.attrHooks[b] || (h.expr.match.bool.test(b) ? Na : ob)), void 0 === c ? n && "get" in n && null !== (d = n.get(a, b)) ? d : (d = h.find.attr(a, b), null == d ? void 0 : d) : null !== c ? n && "set" in n && void 0 !== (d = n.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), c) : void h.removeAttr(a, b))
        },
        removeAttr: function(a, b) {
            var c, n, d = 0,
                f = b && b.match(va);
            if (f && 1 === a.nodeType)
                for (; c = f[d++];) n = h.propFix[c] || c, h.expr.match.bool.test(c) ? Ob && eb || !vb.test(c) ?
                    a[n] = !1 : a[h.camelCase("default-" + c)] = a[n] = !1 : h.attr(a, c, ""), a.removeAttribute(eb ? c : n)
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!H.radioValue && "radio" === b && h.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        }
    });
    Na = {
        set: function(a, b, c) {
            return !1 === b ? h.removeAttr(a, c) : Ob && eb || !vb.test(c) ? a.setAttribute(!eb && h.propFix[c] || c, c) : a[h.camelCase("default-" + c)] = a[c] = !0, c
        }
    };
    h.each(h.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = Ua[b] || h.find.attr;
        Ua[b] = Ob && eb || !vb.test(b) ?
            function(a, b, n) {
                var d, f;
                return n || (f = Ua[b], Ua[b] = d, d = null != c(a, b, n) ? b.toLowerCase() : null, Ua[b] = f), d
            } : function(a, b, c) {
                return c ? void 0 : a[h.camelCase("default-" + b)] ? b.toLowerCase() : null
            }
    });
    Ob && eb || (h.attrHooks.value = {
        set: function(a, b, c) {
            return h.nodeName(a, "input") ? void(a.defaultValue = b) : ob && ob.set(a, b, c)
        }
    });
    eb || (ob = {
            set: function(a, b, c) {
                var n = a.getAttributeNode(c);
                return n || a.setAttributeNode(n = a.ownerDocument.createAttribute(c)), n.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
            }
        }, Ua.id = Ua.name =
        Ua.coords = function(a, b, c) {
            var n;
            return c ? void 0 : (n = a.getAttributeNode(b)) && "" !== n.value ? n.value : null
        }, h.valHooks.button = {
            get: function(a, b) {
                var c = a.getAttributeNode(b);
                return c && c.specified ? c.value : void 0
            },
            set: ob.set
        }, h.attrHooks.contenteditable = {
            set: function(a, b, c) {
                ob.set(a, "" === b ? !1 : b, c)
            }
        }, h.each(["width", "height"], function(a, b) {
            h.attrHooks[b] = {
                set: function(a, c) {
                    return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
                }
            }
        }));
    H.style || (h.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a,
            b) {
            return a.style.cssText = b + ""
        }
    });
    var fc = /^(?:input|select|textarea|button|object)$/i,
        $b = /^(?:a|area)$/i;
    h.fn.extend({
        prop: function(a, b) {
            return Pa(this, h.prop, a, b, 1 < arguments.length)
        },
        removeProp: function(a) {
            return a = h.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a]
                } catch (b) {}
            })
        }
    });
    h.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(a, b, c) {
            var n, d, f, e = a.nodeType;
            if (a && 3 !== e && 8 !== e && 2 !== e) return f = 1 !== e || !h.isXMLDoc(a), f && (b = h.propFix[b] || b, d = h.propHooks[b]), void 0 !==
                c ? d && "set" in d && void 0 !== (n = d.set(a, c, b)) ? n : a[b] = c : d && "get" in d && null !== (n = d.get(a, b)) ? n : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = h.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : fc.test(a.nodeName) || $b.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    });
    H.hrefNormalized || h.each(["href", "src"], function(a, b) {
        h.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    });
    H.optSelected || (h.propHooks.selected = {
        get: function(a) {
            a = a.parentNode;
            return a && (a.selectedIndex, a.parentNode && a.parentNode.selectedIndex),
                null
        }
    });
    h.each("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" "), function() {
        h.propFix[this.toLowerCase()] = this
    });
    H.enctype || (h.propFix.enctype = "encoding");
    var Ea = /[\t\r\n\f]/g;
    h.fn.extend({
        addClass: function(a) {
            var b, c, n, d, f, e = 0,
                y = this.length;
            b = "string" == typeof a && a;
            if (h.isFunction(a)) return this.each(function(b) {
                h(this).addClass(a.call(this, b, this.className))
            });
            if (b)
                for (b = (a || "").match(va) || []; y > e; e++)
                    if (c = this[e], n = 1 === c.nodeType &&
                        (c.className ? (" " + c.className + " ").replace(Ea, " ") : " ")) {
                        for (f = 0; d = b[f++];) 0 > n.indexOf(" " + d + " ") && (n += d + " ");
                        n = h.trim(n);
                        c.className !== n && (c.className = n)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, n, d, f, e = 0,
                y = this.length;
            b = 0 === arguments.length || "string" == typeof a && a;
            if (h.isFunction(a)) return this.each(function(b) {
                h(this).removeClass(a.call(this, b, this.className))
            });
            if (b)
                for (b = (a || "").match(va) || []; y > e; e++)
                    if (c = this[e], n = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ea, " ") : "")) {
                        for (f =
                            0; d = b[f++];)
                            for (; 0 <= n.indexOf(" " + d + " ");) n = n.replace(" " + d + " ", " ");
                        n = a ? h.trim(n) : "";
                        c.className !== n && (c.className = n)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(h.isFunction(a) ? function(c) {
                h(this).toggleClass(a.call(this, c, this.className, b), b)
            } : function() {
                if ("string" === c)
                    for (var b, n = 0, d = h(this), f = a.match(va) || []; b = f[n++];) d.hasClass(b) ? d.removeClass(b) : d.addClass(b);
                else("undefined" === c || "boolean" ===
                    c) && (this.className && h._data(this, "__className__", this.className), this.className = this.className || !1 === a ? "" : h._data(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            a = " " + a + " ";
            for (var b = 0, c = this.length; c > b; b++)
                if (1 === this[b].nodeType && 0 <= (" " + this[b].className + " ").replace(Ea, " ").indexOf(a)) return !0;
            return !1
        }
    });
    h.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
        function(a, b) {
            h.fn[b] = function(a, c) {
                return 0 < arguments.length ? this.on(b, null, a, c) : this.trigger(b)
            }
        });
    h.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, n) {
            return this.on(b, a, c, n)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var Vb = h.now(),
        Pb = /\?/,
        Wb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    h.parseJSON = function(a) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(a + "");
        var b, c = null,
            n = h.trim(a + "");
        return n && !h.trim(n.replace(Wb, function(a, n, d, f) {
            return b && n && (c = 0), 0 === c ? a : (b = d || n, c += !f - !d, "")
        })) ? Function("return " + n)() : h.error("Invalid JSON: " + a)
    };
    h.parseXML = function(a) {
        var b, c;
        if (!a || "string" != typeof a) return null;
        try {
            e.DOMParser ? (c = new DOMParser, b = c.parseFromString(a, "text/xml")) : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a))
        } catch (n) {
            b = void 0
        }
        return b && b.documentElement &&
            !b.getElementsByTagName("parsererror").length || h.error("Invalid XML: " + a), b
    };
    var pb, fb, Qb = /#.*$/,
        Rb = /([?&])_=[^&]*/,
        ac = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        gc = /^(?:GET|HEAD)$/,
        bc = /^\/\//,
        Jb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Va = {},
        Bb = {},
        Xb = "*/".concat("*");
    try {
        fb = location.href
    } catch (hc) {
        fb = N.createElement("a"), fb.href = "", fb = fb.href
    }
    pb = Jb.exec(fb.toLowerCase()) || [];
    h.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: fb,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(pb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Xb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": h.parseJSON,
                "text xml": h.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? wa(wa(a,
                h.ajaxSettings), b) : wa(h.ajaxSettings, a)
        },
        ajaxPrefilter: W(Va),
        ajaxTransport: W(Bb),
        ajax: function(a, b) {
            function c(a, b, n, d) {
                var I, v, t, u, w = b;
                if (2 !== U) {
                    U = 2;
                    y && clearTimeout(y);
                    k = void 0;
                    e = d || "";
                    x.readyState = 0 < a ? 4 : 0;
                    d = 200 <= a && 300 > a || 304 === a;
                    if (n) {
                        t = m;
                        for (var gb = x, T, B, z, na, M = t.contents, C = t.dataTypes;
                            "*" === C[0];) C.shift(), void 0 === B && (B = t.mimeType || gb.getResponseHeader("Content-Type"));
                        if (B)
                            for (na in M)
                                if (M[na] && M[na].test(B)) {
                                    C.unshift(na);
                                    break
                                }
                        if (C[0] in n) z = C[0];
                        else {
                            for (na in n) {
                                if (!C[0] || t.converters[na +
                                        " " + C[0]]) {
                                    z = na;
                                    break
                                }
                                T || (T = na)
                            }
                            z = z || T
                        }
                        t = z ? (z !== C[0] && C.unshift(z), n[z]) : void 0
                    }
                    var D;
                    a: {
                        n = m;T = t;B = x;z = d;
                        var Da, S, Aa;t = {};gb = n.dataTypes.slice();
                        if (gb[1])
                            for (Da in n.converters) t[Da.toLowerCase()] = n.converters[Da];
                        for (na = gb.shift(); na;)
                            if (n.responseFields[na] && (B[n.responseFields[na]] = T), !Aa && z && n.dataFilter && (T = n.dataFilter(T, n.dataType)), Aa = na, na = gb.shift())
                                if ("*" === na) na = Aa;
                                else if ("*" !== Aa && Aa !== na) {
                            if (Da = t[Aa + " " + na] || t["* " + na], !Da)
                                for (D in t)
                                    if (S = D.split(" "), S[1] === na && (Da = t[Aa + " " + S[0]] ||
                                            t["* " + S[0]])) {
                                        !0 === Da ? Da = t[D] : !0 !== t[D] && (na = S[0], gb.unshift(S[1]));
                                        break
                                    }
                            if (!0 !== Da)
                                if (Da && n["throws"]) T = Da(T);
                                else try {
                                    T = Da(T)
                                } catch (G) {
                                    D = {
                                        state: "parsererror",
                                        error: Da ? G : "No conversion from " + Aa + " to " + na
                                    };
                                    break a
                                }
                        }
                        D = {
                            state: "success",
                            data: T
                        }
                    }
                    t = D;
                    d ? (m.ifModified && (u = x.getResponseHeader("Last-Modified"), u && (h.lastModified[f] = u), u = x.getResponseHeader("etag"), u && (h.etag[f] = u)), 204 === a || "HEAD" === m.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = t.state, I = t.data, v = t.error, d = !v)) : (v = w, (a || !w) && (w = "error",
                        0 > a && (a = 0)));
                    x.status = a;
                    x.statusText = (b || w) + "";
                    d ? ja.resolveWith(q, [I, w, x]) : ja.rejectWith(q, [x, w, v]);
                    x.statusCode(xa);
                    xa = void 0;
                    l && K.trigger(d ? "ajaxSuccess" : "ajaxError", [x, m, d ? I : v]);
                    r.fireWith(q, [x, w]);
                    l && (K.trigger("ajaxComplete", [x, m]), --h.active || h.event.trigger("ajaxStop"))
                }
            }
            "object" == typeof a && (b = a, a = void 0);
            b = b || {};
            var n, d, f, e, y, l, k, I, m = h.ajaxSetup({}, b),
                q = m.context || m,
                K = m.context && (q.nodeType || q.jquery) ? h(q) : h.event,
                ja = h.Deferred(),
                r = h.Callbacks("once memory"),
                xa = m.statusCode || {},
                v = {},
                t = {},
                U = 0,
                u = "canceled",
                x = {
                    readyState: 0,
                    getResponseHeader: function(a) {
                        var b;
                        if (2 === U) {
                            if (!I)
                                for (I = {}; b = ac.exec(e);) I[b[1].toLowerCase()] = b[2];
                            b = I[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function() {
                        return 2 === U ? e : null
                    },
                    setRequestHeader: function(a, b) {
                        var c = a.toLowerCase();
                        return U || (a = t[c] = t[c] || a, v[a] = b), this
                    },
                    overrideMimeType: function(a) {
                        return U || (m.mimeType = a), this
                    },
                    statusCode: function(a) {
                        var b;
                        if (a)
                            if (2 > U)
                                for (b in a) xa[b] = [xa[b], a[b]];
                            else x.always(a[x.status]);
                        return this
                    },
                    abort: function(a) {
                        a =
                            a || u;
                        return k && k.abort(a), c(0, a), this
                    }
                };
            if (ja.promise(x).complete = r.add, x.success = x.done, x.error = x.fail, m.url = ((a || m.url || fb) + "").replace(Qb, "").replace(bc, pb[1] + "//"), m.type = b.method || b.type || m.method || m.type, m.dataTypes = h.trim(m.dataType || "*").toLowerCase().match(va) || [""], null == m.crossDomain && (n = Jb.exec(m.url.toLowerCase()), m.crossDomain = !(!n || n[1] === pb[1] && n[2] === pb[2] && (n[3] || ("http:" === n[1] ? "80" : "443")) === (pb[3] || ("http:" === pb[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data &&
                (m.data = h.param(m.data, m.traditional)), ta(Va, m, b, x), 2 === U) return x;
            (l = h.event && m.global) && 0 === h.active++ && h.event.trigger("ajaxStart");
            m.type = m.type.toUpperCase();
            m.hasContent = !gc.test(m.type);
            f = m.url;
            m.hasContent || (m.data && (f = m.url += (Pb.test(f) ? "&" : "?") + m.data, delete m.data), !1 === m.cache && (m.url = Rb.test(f) ? f.replace(Rb, "$1_=" + Vb++) : f + (Pb.test(f) ? "&" : "?") + "_=" + Vb++));
            m.ifModified && (h.lastModified[f] && x.setRequestHeader("If-Modified-Since", h.lastModified[f]), h.etag[f] && x.setRequestHeader("If-None-Match",
                h.etag[f]));
            (m.data && m.hasContent && !1 !== m.contentType || b.contentType) && x.setRequestHeader("Content-Type", m.contentType);
            x.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Xb + "; q=0.01" : "") : m.accepts["*"]);
            for (d in m.headers) x.setRequestHeader(d, m.headers[d]);
            if (m.beforeSend && (!1 === m.beforeSend.call(q, x, m) || 2 === U)) return x.abort();
            u = "abort";
            for (d in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) x[d](m[d]);
            if (k = ta(Bb, m, b, x)) {
                x.readyState = 1;
                l &&
                    K.trigger("ajaxSend", [x, m]);
                m.async && 0 < m.timeout && (y = setTimeout(function() {
                    x.abort("timeout")
                }, m.timeout));
                try {
                    U = 1, k.send(v, c)
                } catch (w) {
                    if (!(2 > U)) throw w;
                    c(-1, w)
                }
            } else c(-1, "No Transport");
            return x
        },
        getJSON: function(a, b, c) {
            return h.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return h.get(a, void 0, b, "script")
        }
    });
    h.each(["get", "post"], function(a, b) {
        h[b] = function(a, c, n, d) {
            return h.isFunction(c) && (d = d || n, n = c, c = void 0), h.ajax({
                url: a,
                type: b,
                dataType: d,
                data: c,
                success: n
            })
        }
    });
    h._evalUrl = function(a) {
        return h.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    };
    h.fn.extend({
        wrapAll: function(a) {
            if (h.isFunction(a)) return this.each(function(b) {
                h(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = h(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]);
                b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return this.each(h.isFunction(a) ? function(b) {
                h(this).wrapInner(a.call(this,
                    b))
            } : function() {
                var b = h(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = h.isFunction(a);
            return this.each(function(c) {
                h(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                h.nodeName(this, "body") || h(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    h.expr.filters.hidden = function(a) {
        return 0 >= a.offsetWidth && 0 >= a.offsetHeight || !H.reliableHiddenOffsets() && "none" === (a.style && a.style.display || h.css(a, "display"))
    };
    h.expr.filters.visible =
        function(a) {
            return !h.expr.filters.hidden(a)
        };
    var Sb = /%20/g,
        n = /\[\]$/,
        y = /\r?\n/g,
        I = /^(?:submit|button|image|reset|file)$/i,
        K = /^(?:input|select|textarea|keygen)/i;
    h.param = function(a, b) {
        var c, n = [],
            d = function(a, b) {
                b = h.isFunction(b) ? b() : null == b ? "" : b;
                n[n.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
        if (void 0 === b && (b = h.ajaxSettings && h.ajaxSettings.traditional), h.isArray(a) || a.jquery && !h.isPlainObject(a)) h.each(a, function() {
            d(this.name, this.value)
        });
        else
            for (c in a) aa(c, a[c], b, d);
        return n.join("&").replace(Sb,
            "+")
    };
    h.fn.extend({
        serialize: function() {
            return h.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = h.prop(this, "elements");
                return a ? h.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !h(this).is(":disabled") && K.test(this.nodeName) && !I.test(a) && (this.checked || !ha.test(a))
            }).map(function(a, b) {
                var c = h(this).val();
                return null == c ? null : h.isArray(c) ? h.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(y, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(y,
                        "\r\n")
                }
            }).get()
        }
    });
    h.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        var a;
        if (!(a = !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && ga())) a: {
            try {
                a = new e.ActiveXObject("Microsoft.XMLHTTP");
                break a
            } catch (b) {}
            a = void 0
        }
        return a
    } : ga;
    var xa = 0,
        ja = {},
        U = h.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var a in ja) ja[a](void 0, !0)
    });
    H.cors = !!U && "withCredentials" in U;
    (U = H.ajax = !!U) && h.ajaxTransport(function(a) {
        if (!a.crossDomain || H.cors) {
            var b;
            return {
                send: function(c,
                    n) {
                    var d, f = a.xhr(),
                        e = ++xa;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                        for (d in a.xhrFields) f[d] = a.xhrFields[d];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType);
                    a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (d in c) void 0 !== c[d] && f.setRequestHeader(d, c[d] + "");
                    f.send(a.hasContent && a.data || null);
                    b = function(c, d) {
                        var y, l, k;
                        if (b && (d || 4 === f.readyState))
                            if (delete ja[e], b = void 0, f.onreadystatechange = h.noop, d) 4 !== f.readyState && f.abort();
                            else {
                                k = {};
                                y = f.status;
                                "string" == typeof f.responseText && (k.text = f.responseText);
                                try {
                                    l = f.statusText
                                } catch (m) {
                                    l = ""
                                }
                                y || !a.isLocal || a.crossDomain ? 1223 === y && (y = 204) : y = k.text ? 200 : 404
                            }
                        k && n(y, l, k, f.getAllResponseHeaders())
                    };
                    a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = ja[e] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    });
    h.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return h.globalEval(a),
                    a
            }
        }
    });
    h.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1);
        a.crossDomain && (a.type = "GET", a.global = !1)
    });
    h.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = N.head || h("head")[0] || N.documentElement;
            return {
                send: function(n, d) {
                    b = N.createElement("script");
                    b.async = !0;
                    a.scriptCharset && (b.charset = a.scriptCharset);
                    b.src = a.url;
                    b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b),
                            b = null, c || d(200, "success"))
                    };
                    c.insertBefore(b, c.firstChild)
                },
                abort: function() {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var gb = [],
        na = /(=)\?(?=&|$)|\?\?/;
    h.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = gb.pop() || h.expando + "_" + Vb++;
            return this[a] = !0, a
        }
    });
    h.ajaxPrefilter("json jsonp", function(a, b, c) {
        var n, d, f, y = !1 !== a.jsonp && (na.test(a.url) ? "url" : "string" == typeof a.data && !(a.contentType || "").indexOf("application/x-www-form-urlencoded") && na.test(a.data) && "data");
        return y || "jsonp" === a.dataTypes[0] ? (n = a.jsonpCallback =
            h.isFunction(a.jsonpCallback) ? a.jsonpCallback() : a.jsonpCallback, y ? a[y] = a[y].replace(na, "$1" + n) : !1 !== a.jsonp && (a.url += (Pb.test(a.url) ? "&" : "?") + a.jsonp + "=" + n), a.converters["script json"] = function() {
                return f || h.error(n + " was not called"), f[0]
            }, a.dataTypes[0] = "json", d = e[n], e[n] = function() {
                f = arguments
            }, c.always(function() {
                e[n] = d;
                a[n] && (a.jsonpCallback = b.jsonpCallback, gb.push(n));
                f && h.isFunction(d) && d(f[0]);
                f = d = void 0
            }), "script") : void 0
    });
    h.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a) return null;
        "boolean" == typeof b && (c = b, b = !1);
        b = b || N;
        var n = Db.exec(a);
        c = !c && [];
        return n ? [b.createElement(n[1])] : (n = h.buildFragment([a], b, c), c && c.length && h(c).remove(), h.merge([], n.childNodes))
    };
    var Aa = h.fn.load;
    h.fn.load = function(a, b, c) {
        if ("string" != typeof a && Aa) return Aa.apply(this, arguments);
        var n, d, f, e = this,
            y = a.indexOf(" ");
        return 0 <= y && (n = h.trim(a.slice(y, a.length)), a = a.slice(0, y)), h.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), 0 < e.length && h.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            d =
                arguments;
            e.html(n ? h("<div>").append(h.parseHTML(a)).find(n) : a)
        }).complete(c && function(a, b) {
            e.each(c, d || [a.responseText, b, a])
        }), this
    };
    h.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        h.fn[b] = function(a) {
            return this.on(b, a)
        }
    });
    h.expr.filters.animated = function(a) {
        return h.grep(h.timers, function(b) {
            return a === b.elem
        }).length
    };
    var wb = e.document.documentElement;
    h.offset = {
        setOffset: function(a, b, c) {
            var n, d, f, e, y, l, k = h.css(a, "position"),
                m = h(a),
                I = {};
            "static" ===
            k && (a.style.position = "relative");
            y = m.offset();
            f = h.css(a, "top");
            l = h.css(a, "left");
            ("absolute" === k || "fixed" === k) && -1 < h.inArray("auto", [f, l]) ? (n = m.position(), e = n.top, d = n.left) : (e = parseFloat(f) || 0, d = parseFloat(l) || 0);
            h.isFunction(b) && (b = b.call(a, c, y));
            null != b.top && (I.top = b.top - y.top + e);
            null != b.left && (I.left = b.left - y.left + d);
            "using" in b ? b.using.call(a, I) : m.css(I)
        }
    };
    h.fn.extend({
        offset: function(a) {
            if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                h.offset.setOffset(this, a, b)
            });
            var b, c, n = {
                    top: 0,
                    left: 0
                },
                d = this[0],
                f = d && d.ownerDocument;
            if (f) return b = f.documentElement, h.contains(b, d) ? ("undefined" !== typeof d.getBoundingClientRect && (n = d.getBoundingClientRect()), c = oa(f), {
                top: n.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: n.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : n
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                        top: 0,
                        left: 0
                    },
                    n = this[0];
                return "fixed" === h.css(n, "position") ? b = n.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), h.nodeName(a[0], "html") || (c = a.offset()),
                    c.top += h.css(a[0], "borderTopWidth", !0), c.left += h.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - h.css(n, "marginTop", !0),
                    left: b.left - c.left - h.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || wb; a && !h.nodeName(a, "html") && "static" === h.css(a, "position");) a = a.offsetParent;
                return a || wb
            })
        }
    });
    h.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        h.fn[a] = function(n) {
            return Pa(this, function(a, n, d) {
                var f = oa(a);
                return void 0 ===
                    d ? f ? b in f ? f[b] : f.document.documentElement[n] : a[n] : void(f ? f.scrollTo(c ? h(f).scrollLeft() : d, c ? d : h(f).scrollTop()) : a[n] = d)
            }, a, n, arguments.length, null)
        }
    });
    h.each(["top", "left"], function(a, b) {
        h.cssHooks[b] = L(H.pixelPosition, function(a, c) {
            return c ? (c = Q(a, b), ua.test(c) ? h(a).position()[b] + "px" : c) : void 0
        })
    });
    h.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        h.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, n) {
            h.fn[n] = function(n, d) {
                var f = arguments.length && (c || "boolean" != typeof n),
                    e = c || (!0 ===
                        n || !0 === d ? "margin" : "border");
                return Pa(this, function(b, c, n) {
                    var d;
                    return h.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (d = b.documentElement, Math.max(b.body["scroll" + a], d["scroll" + a], b.body["offset" + a], d["offset" + a], d["client" + a])) : void 0 === n ? h.css(b, c, e) : h.style(b, c, n, e)
                }, b, f ? n : void 0, f, null)
            }
        })
    });
    h.fn.size = function() {
        return this.length
    };
    h.fn.andSelf = h.fn.addBack;
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return h
    });
    var $a = e.jQuery,
        ic = e.$;
    return h.noConflict =
        function(a) {
            return e.$ === h && (e.$ = ic), a && e.jQuery === h && (e.jQuery = $a), h
        }, "undefined" === typeof c && (e.jQuery = e.$ = h), h
});
(function(e, c, k) {
    var m = function(a) {
        function b(c) {
            var d, f, e = {};
            a.each(c, function(a) {
                (d = a.match(/^([^A-Z]+?)([A-Z])/)) && -1 !== "a aa ai ao as b fn i m o s ".indexOf(d[1] + " ") && (f = a.replace(d[0], d[2].toLowerCase()), e[f] = a, "o" === d[1] && b(c[a]))
            });
            c._hungarianMap = e
        }

        function d(c, f, e) {
            c._hungarianMap || b(c);
            var h;
            a.each(f, function(b) {
                h = c._hungarianMap[b];
                h === k || !e && f[h] !== k || ("o" === h.charAt(0) ? (f[h] || (f[h] = {}), a.extend(!0, f[h], f[b]), d(c[h], f[h], e)) : f[h] = f[b])
            })
        }

        function l(a) {
            var b = G.defaults.oLanguage,
                c = a.sZeroRecords;
            !a.sEmptyTable && c && "No data available in table" === b.sEmptyTable && Ca(a, a, "sZeroRecords", "sEmptyTable");
            !a.sLoadingRecords && c && "Loading..." === b.sLoadingRecords && Ca(a, a, "sZeroRecords", "sLoadingRecords");
            a.sInfoThousands && (a.sThousands = a.sInfoThousands);
            (a = a.sDecimal) && S(a)
        }

        function m(a) {
            Na(a, "ordering", "bSort");
            Na(a, "orderMulti", "bSortMulti");
            Na(a, "orderClasses", "bSortClasses");
            Na(a, "orderCellsTop", "bSortCellsTop");
            Na(a, "order", "aaSorting");
            Na(a, "orderFixed", "aaSortingFixed");
            Na(a, "paging", "bPaginate");
            Na(a, "pagingType", "sPaginationType");
            Na(a, "pageLength", "iDisplayLength");
            Na(a, "searching", "bFilter");
            "boolean" === typeof a.sScrollX && (a.sScrollX = a.sScrollX ? "100%" : "");
            if (a = a.aoSearchCols)
                for (var b = 0, c = a.length; b < c; b++) a[b] && d(G.models.oSearch, a[b])
        }

        function u(b) {
            Na(b, "orderable", "bSortable");
            Na(b, "orderData", "aDataSort");
            Na(b, "orderSequence", "asSorting");
            Na(b, "orderDataType", "sortDataType");
            var c = b.aDataSort;
            c && !a.isArray(c) && (b.aDataSort = [c])
        }

        function x(b) {
            if (!G.__browser) {
                var c = {};
                G.__browser = c;
                var d = a("<div/>").css({
                        position: "fixed",
                        top: 0,
                        left: 0,
                        height: 1,
                        width: 1,
                        overflow: "hidden"
                    }).append(a("<div/>").css({
                        position: "absolute",
                        top: 1,
                        left: 1,
                        width: 100,
                        overflow: "scroll"
                    }).append(a("<div/>").css({
                        width: "100%",
                        height: 10
                    }))).appendTo("body"),
                    f = d.children(),
                    e = f.children();
                c.barWidth = f[0].offsetWidth - f[0].clientWidth;
                c.bScrollOversize = 100 === e[0].offsetWidth && 100 !== f[0].clientWidth;
                c.bScrollbarLeft = 1 !== Math.round(e.offset().left);
                c.bBounding = d[0].getBoundingClientRect().width ? !0 : !1;
                d.remove()
            }
            a.extend(b.oBrowser,
                G.__browser);
            b.oScroll.iBarWidth = G.__browser.barWidth
        }

        function f(a, b, c, d, f, e) {
            var h, l = !1;
            for (c !== k && (h = c, l = !0); d !== f;) a.hasOwnProperty(d) && (h = l ? b(h, a[d], d, a) : a[d], l = !0, d += e);
            return h
        }

        function v(b, d) {
            var f = G.defaults.column,
                e = b.aoColumns.length,
                f = a.extend({}, G.models.oColumn, f, {
                    nTh: d ? d : c.createElement("th"),
                    sTitle: f.sTitle ? f.sTitle : d ? d.innerHTML : "",
                    aDataSort: f.aDataSort ? f.aDataSort : [e],
                    mData: f.mData ? f.mData : e,
                    idx: e
                });
            b.aoColumns.push(f);
            f = b.aoPreSearchCols;
            f[e] = a.extend({}, G.models.oSearch, f[e]);
            D(b,
                e, a(d).data())
        }

        function D(b, c, f) {
            c = b.aoColumns[c];
            var e = b.oClasses,
                h = a(c.nTh);
            if (!c.sWidthOrig) {
                c.sWidthOrig = h.attr("width") || null;
                var l = (h.attr("style") || "").match(/width:\s*(\d+[pxem%]+)/);
                l && (c.sWidthOrig = l[1])
            }
            f !== k && null !== f && (u(f), d(G.defaults.column, f), f.mDataProp !== k && !f.mData && (f.mData = f.mDataProp), f.sType && (c._sManualType = f.sType), f.className && !f.sClass && (f.sClass = f.className), a.extend(c, f), Ca(c, f, "sWidth", "sWidthOrig"), f.iDataSort !== k && (c.aDataSort = [f.iDataSort]), Ca(c, f, "aDataSort"));
            var m =
                c.mData,
                q = pa(m),
                r = c.mRender ? pa(c.mRender) : null;
            f = function(a) {
                return "string" === typeof a && -1 !== a.indexOf("@")
            };
            c._bAttrSrc = a.isPlainObject(m) && (f(m.sort) || f(m.type) || f(m.filter));
            c.fnGetData = function(a, b, c) {
                var n = q(a, b, k, c);
                return r && b ? r(n, b, a, c) : n
            };
            c.fnSetData = function(a, b, c) {
                return ka(m)(a, b, c)
            };
            "number" !== typeof m && (b._rowReadObject = !0);
            b.oFeatures.bSort || (c.bSortable = !1, h.addClass(e.sSortableNone));
            b = -1 !== a.inArray("asc", c.asSorting);
            f = -1 !== a.inArray("desc", c.asSorting);
            c.bSortable && (b || f) ? b && !f ?
                (c.sSortingClass = e.sSortableAsc, c.sSortingClassJUI = e.sSortJUIAscAllowed) : !b && f ? (c.sSortingClass = e.sSortableDesc, c.sSortingClassJUI = e.sSortJUIDescAllowed) : (c.sSortingClass = e.sSortable, c.sSortingClassJUI = e.sSortJUI) : (c.sSortingClass = e.sSortableNone, c.sSortingClassJUI = "")
        }

        function z(a) {
            if (!1 !== a.oFeatures.bAutoWidth) {
                var b = a.aoColumns;
                kb(a);
                for (var c = 0, d = b.length; c < d; c++) b[c].nTh.style.width = b[c].sWidth
            }
            b = a.oScroll;
            "" === b.sY && "" === b.sX || Ya(a);
            fa(a, null, "column-sizing", [a])
        }

        function A(a, b) {
            var c = t(a,
                "bVisible");
            return "number" === typeof c[b] ? c[b] : null
        }

        function r(b, c) {
            var d = t(b, "bVisible"),
                d = a.inArray(c, d);
            return -1 !== d ? d : null
        }

        function B(a) {
            return t(a, "bVisible").length
        }

        function t(b, c) {
            var d = [];
            a.map(b.aoColumns, function(a, b) {
                a[c] && d.push(b)
            });
            return d
        }

        function w(a) {
            var b = a.aoColumns,
                c = a.aoData,
                d = G.ext.type.detect,
                f, e, h, l, m, q, r, t, v;
            f = 0;
            for (e = b.length; f < e; f++)
                if (r = b[f], v = [], !r.sType && r._sManualType) r.sType = r._sManualType;
                else if (!r.sType) {
                h = 0;
                for (l = d.length; h < l; h++) {
                    m = 0;
                    for (q = c.length; m < q; m++) {
                        v[m] ===
                            k && (v[m] = J(a, m, f, "type"));
                        t = d[h](v[m], a);
                        if (!t && h !== d.length - 1) break;
                        if ("html" === t) break
                    }
                    if (t) {
                        r.sType = t;
                        break
                    }
                }
                r.sType || (r.sType = "string")
            }
        }

        function E(b, c, d, f) {
            var e, h, l, m, q, r, t = b.aoColumns;
            if (c)
                for (e = c.length - 1; 0 <= e; e--) {
                    r = c[e];
                    var u = r.targets !== k ? r.targets : r.aTargets;
                    a.isArray(u) || (u = [u]);
                    h = 0;
                    for (l = u.length; h < l; h++)
                        if ("number" === typeof u[h] && 0 <= u[h]) {
                            for (; t.length <= u[h];) v(b);
                            f(u[h], r)
                        } else if ("number" === typeof u[h] && 0 > u[h]) f(t.length + u[h], r);
                    else if ("string" === typeof u[h])
                        for (m = 0, q = t.length; m <
                            q; m++)("_all" == u[h] || a(t[m].nTh).hasClass(u[h])) && f(m, r)
                }
            if (d)
                for (e = 0, b = d.length; e < b; e++) f(e, d[e])
        }

        function C(b, c, d, f) {
            var e = b.aoData.length,
                h = a.extend(!0, {}, G.models.oRow, {
                    src: d ? "dom" : "data",
                    idx: e
                });
            h._aData = c;
            b.aoData.push(h);
            for (var l = b.aoColumns, m = 0, q = l.length; m < q; m++) l[m].sType = null;
            b.aiDisplayMaster.push(e);
            c = b.rowIdFn(c);
            c !== k && (b.aIds[c] = h);
            !d && b.oFeatures.bDeferRender || ba(b, e, d, f);
            return e
        }

        function F(b, c) {
            var d;
            c instanceof a || (c = a(c));
            return c.map(function(a, c) {
                d = V(b, c);
                return C(b, d.data,
                    c, d.cells)
            })
        }

        function J(a, b, c, d) {
            var f = a.iDraw,
                e = a.aoColumns[c],
                h = a.aoData[b]._aData,
                l = e.sDefaultContent;
            c = e.fnGetData(h, d, {
                settings: a,
                row: b,
                col: c
            });
            if (c === k) return a.iDrawError != f && null === l && (za(a, 0, "Requested unknown parameter " + ("function" == typeof e.mData ? "{function}" : "'" + e.mData + "'") + " for row " + b, 4), a.iDrawError = f), l;
            if ((c === h || null === c) && null !== l) c = l;
            else if ("function" === typeof c) return c.call(h);
            return null === c && "display" == d ? "" : c
        }

        function P(a, b, c, d) {
            a.aoColumns[c].fnSetData(a.aoData[b]._aData,
                d, {
                    settings: a,
                    row: b,
                    col: c
                })
        }

        function L(b) {
            return a.map(b.match(/(\\.|[^\.])+/g) || [""], function(a) {
                return a.replace(/\\./g, ".")
            })
        }

        function pa(b) {
            if (a.isPlainObject(b)) {
                var c = {};
                a.each(b, function(a, b) {
                    b && (c[a] = pa(b))
                });
                return function(a, b, n, d) {
                    var f = c[b] || c._;
                    return f !== k ? f(a, b, n, d) : a
                }
            }
            if (null === b) return function(a) {
                return a
            };
            if ("function" === typeof b) return function(a, c, d, f) {
                return b(a, c, d, f)
            };
            if ("string" === typeof b && (-1 !== b.indexOf(".") || -1 !== b.indexOf("[") || -1 !== b.indexOf("("))) {
                var d = function(b,
                    c, n) {
                    var f, e;
                    if ("" !== n) {
                        e = L(n);
                        for (var h = 0, l = e.length; h < l; h++) {
                            n = e[h].match(Ua);
                            f = e[h].match(vb);
                            if (n) {
                                e[h] = e[h].replace(Ua, "");
                                "" !== e[h] && (b = b[e[h]]);
                                f = [];
                                e.splice(0, h + 1);
                                e = e.join(".");
                                if (a.isArray(b))
                                    for (h = 0, l = b.length; h < l; h++) f.push(d(b[h], c, e));
                                b = n[0].substring(1, n[0].length - 1);
                                b = "" === b ? f : f.join(b);
                                break
                            } else if (f) {
                                e[h] = e[h].replace(vb, "");
                                b = b[e[h]]();
                                continue
                            }
                            if (null === b || b[e[h]] === k) return k;
                            b = b[e[h]]
                        }
                    }
                    return b
                };
                return function(a, c) {
                    return d(a, c, b)
                }
            }
            return function(a) {
                return a[b]
            }
        }

        function ka(b) {
            if (a.isPlainObject(b)) return ka(b._);
            if (null === b) return function() {};
            if ("function" === typeof b) return function(a, c, d) {
                b(a, "set", c, d)
            };
            if ("string" === typeof b && (-1 !== b.indexOf(".") || -1 !== b.indexOf("[") || -1 !== b.indexOf("("))) {
                var c = function(b, n, d) {
                    d = L(d);
                    var f;
                    f = d[d.length - 1];
                    for (var e, h, l = 0, m = d.length - 1; l < m; l++) {
                        e = d[l].match(Ua);
                        h = d[l].match(vb);
                        if (e) {
                            d[l] = d[l].replace(Ua, "");
                            b[d[l]] = [];
                            f = d.slice();
                            f.splice(0, l + 1);
                            e = f.join(".");
                            if (a.isArray(n))
                                for (h = 0, m = n.length; h < m; h++) f = {}, c(f, n[h], e), b[d[l]].push(f);
                            else b[d[l]] = n;
                            return
                        }
                        h && (d[l] = d[l].replace(vb,
                            ""), b = b[d[l]](n));
                        if (null === b[d[l]] || b[d[l]] === k) b[d[l]] = {};
                        b = b[d[l]]
                    }
                    if (f.match(vb)) b[f.replace(vb, "")](n);
                    else b[f.replace(Ua, "")] = n
                };
                return function(a, d) {
                    return c(a, d, b)
                }
            }
            return function(a, c) {
                a[b] = c
            }
        }

        function qa(a) {
            return Ta(a.aoData, "_aData")
        }

        function sa(a) {
            a.aoData.length = 0;
            a.aiDisplayMaster.length = 0;
            a.aiDisplay.length = 0;
            a.aIds = {}
        }

        function X(a, b, c) {
            for (var d = -1, f = 0, e = a.length; f < e; f++) a[f] == b ? d = f : a[f] > b && a[f]--; - 1 != d && c === k && a.splice(d, 1)
        }

        function R(a, b, c, d) {
            var f = a.aoData[b],
                e, h = function(c,
                    d) {
                    for (; c.childNodes.length;) c.removeChild(c.firstChild);
                    c.innerHTML = J(a, b, d, "display")
                };
            if ("dom" !== c && (c && "auto" !== c || "dom" !== f.src)) {
                var l = f.anCells;
                if (l)
                    if (d !== k) h(l[d], d);
                    else
                        for (c = 0, e = l.length; c < e; c++) h(l[c], c)
            } else f._aData = V(a, f, d, d === k ? k : f._aData).data;
            f._aSortData = null;
            f._aFilterData = null;
            h = a.aoColumns;
            if (d !== k) h[d].sType = null;
            else {
                c = 0;
                for (e = h.length; c < e; c++) h[c].sType = null;
                O(a, f)
            }
        }

        function V(b, c, d, f) {
            var e = [],
                h = c.firstChild,
                l, m, q = 0,
                r, t = b.aoColumns,
                v = b._rowReadObject;
            f = f !== k ? f : v ? {} : [];
            var u =
                function(a, b) {
                    if ("string" === typeof a) {
                        var c = a.indexOf("@"); - 1 !== c && (c = a.substring(c + 1), ka(a)(f, b.getAttribute(c)))
                    }
                },
                x = function(b) {
                    if (d === k || d === q) m = t[q], r = a.trim(b.innerHTML), m && m._bAttrSrc ? (ka(m.mData._)(f, r), u(m.mData.sort, b), u(m.mData.type, b), u(m.mData.filter, b)) : v ? (m._setter || (m._setter = ka(m.mData)), m._setter(f, r)) : f[q] = r;
                    q++
                };
            if (h)
                for (; h;) {
                    l = h.nodeName.toUpperCase();
                    if ("TD" == l || "TH" == l) x(h), e.push(h);
                    h = h.nextSibling
                } else {
                    e = c.anCells;
                    l = 0;
                    for (var w = e.length; l < w; l++) x(e[l])
                }(c = h ? c : c.nTr) && (c = c.getAttribute("id")) &&
                ka(b.rowId)(f, c);
            return {
                data: f,
                cells: e
            }
        }

        function ba(a, b, d, f) {
            var e = a.aoData[b],
                h = e._aData,
                l = [],
                k, m, q, r, t;
            if (null === e.nTr) {
                k = d || c.createElement("tr");
                e.nTr = k;
                e.anCells = l;
                k._DT_RowIndex = b;
                O(a, e);
                r = 0;
                for (t = a.aoColumns.length; r < t; r++) {
                    q = a.aoColumns[r];
                    m = d ? f[r] : c.createElement(q.sCellType);
                    l.push(m);
                    if (!d || q.mRender || q.mData !== r) m.innerHTML = J(a, b, r, "display");
                    q.sClass && (m.className += " " + q.sClass);
                    q.bVisible && !d ? k.appendChild(m) : !q.bVisible && d && m.parentNode.removeChild(m);
                    q.fnCreatedCell && q.fnCreatedCell.call(a.oInstance,
                        m, J(a, b, r), h, b, r)
                }
                fa(a, "aoRowCreatedCallback", null, [k, h, b])
            }
            e.nTr.setAttribute("role", "row")
        }

        function O(b, c) {
            var d = c.nTr,
                f = c._aData;
            if (d) {
                var e = b.rowIdFn(f);
                e && (d.id = e);
                f.DT_RowClass && (e = f.DT_RowClass.split(" "), c.__rowc = c.__rowc ? ob(c.__rowc.concat(e)) : e, a(d).removeClass(c.__rowc.join(" ")).addClass(f.DT_RowClass));
                f.DT_RowAttr && a(d).attr(f.DT_RowAttr);
                f.DT_RowData && a(d).data(f.DT_RowData)
            }
        }

        function Z(b) {
            var c, d, f, e, h, l = b.nTHead,
                k = b.nTFoot,
                m = 0 === a("th, td", l).length,
                q = b.oClasses,
                r = b.aoColumns;
            m &&
                (e = a("<tr/>").appendTo(l));
            c = 0;
            for (d = r.length; c < d; c++) h = r[c], f = a(h.nTh).addClass(h.sClass), m && f.appendTo(e), b.oFeatures.bSort && (f.addClass(h.sSortingClass), !1 !== h.bSortable && (f.attr("tabindex", b.iTabIndex).attr("aria-controls", b.sTableId), zb(b, h.nTh, c))), h.sTitle != f[0].innerHTML && f.html(h.sTitle), nb(b, "header")(b, f, h, q);
            m && aa(b.aoHeader, l);
            a(l).find(">tr").attr("role", "row");
            a(l).find(">tr>th, >tr>td").addClass(q.sHeaderTH);
            a(k).find(">tr>th, >tr>td").addClass(q.sFooterTH);
            if (null !== k)
                for (b = b.aoFooter[0],
                    c = 0, d = b.length; c < d; c++) h = r[c], h.nTf = b[c].cell, h.sClass && a(h.nTf).addClass(h.sClass)
        }

        function ca(b, c, d) {
            var f, e, h, l = [],
                m = [],
                q = b.aoColumns.length,
                r;
            if (c) {
                d === k && (d = !1);
                f = 0;
                for (e = c.length; f < e; f++) {
                    l[f] = c[f].slice();
                    l[f].nTr = c[f].nTr;
                    for (h = q - 1; 0 <= h; h--) b.aoColumns[h].bVisible || d || l[f].splice(h, 1);
                    m.push([])
                }
                f = 0;
                for (e = l.length; f < e; f++) {
                    if (b = l[f].nTr)
                        for (; h = b.firstChild;) b.removeChild(h);
                    h = 0;
                    for (c = l[f].length; h < c; h++)
                        if (r = q = 1, m[f][h] === k) {
                            b.appendChild(l[f][h].cell);
                            for (m[f][h] = 1; l[f + q] !== k && l[f][h].cell ==
                                l[f + q][h].cell;) m[f + q][h] = 1, q++;
                            for (; l[f][h + r] !== k && l[f][h].cell == l[f][h + r].cell;) {
                                for (d = 0; d < q; d++) m[f + d][h + r] = 1;
                                r++
                            }
                            a(l[f][h].cell).attr("rowspan", q).attr("colspan", r)
                        }
                }
            }
        }

        function W(b) {
            var c = fa(b, "aoPreDrawCallback", "preDraw", [b]);
            if (-1 !== a.inArray(!1, c)) Fa(b, !1);
            else {
                var c = [],
                    d = 0,
                    f = b.asStripeClasses,
                    e = f.length,
                    h = b.oLanguage,
                    l = b.iInitDisplayStart,
                    m = "ssp" == la(b),
                    q = b.aiDisplay;
                b.bDrawing = !0;
                l !== k && -1 !== l && (b._iDisplayStart = m ? l : l >= b.fnRecordsDisplay() ? 0 : l, b.iInitDisplayStart = -1);
                var l = b._iDisplayStart,
                    r = b.fnDisplayEnd();
                if (b.bDeferLoading) b.bDeferLoading = !1, b.iDraw++, Fa(b, !1);
                else if (m) {
                    if (!b.bDestroying && !ea(b)) return
                } else b.iDraw++;
                if (0 !== q.length)
                    for (h = m ? b.aoData.length : r, m = m ? 0 : l; m < h; m++) {
                        var t = q[m],
                            v = b.aoData[t];
                        null === v.nTr && ba(b, t);
                        t = v.nTr;
                        if (0 !== e) {
                            var u = f[d % e];
                            v._sRowStripe != u && (a(t).removeClass(v._sRowStripe).addClass(u), v._sRowStripe = u)
                        }
                        fa(b, "aoRowCallback", null, [t, v._aData, d, m]);
                        c.push(t);
                        d++
                    } else d = h.sZeroRecords, 1 == b.iDraw && "ajax" == la(b) ? d = h.sLoadingRecords : h.sEmptyTable && 0 === b.fnRecordsTotal() &&
                        (d = h.sEmptyTable), c[0] = a("<tr/>", {
                            "class": e ? f[0] : ""
                        }).append(a("<td />", {
                            valign: "top",
                            colSpan: B(b),
                            "class": b.oClasses.sRowEmpty
                        }).html(d))[0];
                fa(b, "aoHeaderCallback", "header", [a(b.nTHead).children("tr")[0], qa(b), l, r, q]);
                fa(b, "aoFooterCallback", "footer", [a(b.nTFoot).children("tr")[0], qa(b), l, r, q]);
                f = a(b.nTBody);
                f.children().detach();
                f.append(a(c));
                fa(b, "aoDrawCallback", "draw", [b]);
                b.bSorted = !1;
                b.bFiltered = !1;
                b.bDrawing = !1
            }
        }

        function ta(a, b) {
            var c = a.oFeatures,
                d = c.bFilter;
            c.bSort && Kb(a);
            d ? Ma(a, a.oPreviousSearch) :
                a.aiDisplay = a.aiDisplayMaster.slice();
            !0 !== b && (a._iDisplayStart = 0);
            a._drawHold = b;
            W(a);
            a._drawHold = !1
        }

        function wa(b) {
            var c = b.oClasses,
                d = a(b.nTable),
                d = a("<div/>").insertBefore(d),
                f = b.oFeatures,
                e = a("<div/>", {
                    id: b.sTableId + "_wrapper",
                    "class": c.sWrapper + (b.nTFoot ? "" : " " + c.sNoFooter)
                });
            b.nHolding = d[0];
            b.nTableWrapper = e[0];
            b.nTableReinsertBefore = b.nTable.nextSibling;
            for (var h = b.sDom.split(""), l, k, m, q, r, t, v = 0; v < h.length; v++) {
                l = null;
                k = h[v];
                if ("<" == k) {
                    m = a("<div/>")[0];
                    q = h[v + 1];
                    if ("'" == q || '"' == q) {
                        r = "";
                        for (t =
                            2; h[v + t] != q;) r += h[v + t], t++;
                        "H" == r ? r = c.sJUIHeader : "F" == r && (r = c.sJUIFooter); - 1 != r.indexOf(".") ? (q = r.split("."), m.id = q[0].substr(1, q[0].length - 1), m.className = q[1]) : "#" == r.charAt(0) ? m.id = r.substr(1, r.length - 1) : m.className = r;
                        v += t
                    }
                    e.append(m);
                    e = a(m)
                } else if (">" == k) e = e.parent();
                else if ("l" == k && f.bPaginate && f.bLengthChange) l = Ia(b);
                else if ("f" == k && f.bFilter) l = Ba(b);
                else if ("r" == k && f.bProcessing) l = va(b);
                else if ("t" == k) l = Xa(b);
                else if ("i" == k && f.bInfo) l = jb(b);
                else if ("p" == k && f.bPaginate) l = ab(b);
                else if (0 !== G.ext.feature.length)
                    for (m =
                        G.ext.feature, t = 0, q = m.length; t < q; t++)
                        if (k == m[t].cFeature) {
                            l = m[t].fnInit(b);
                            break
                        }
                l && (m = b.aanFeatures, m[k] || (m[k] = []), m[k].push(l), e.append(l))
            }
            d.replaceWith(e);
            b.nHolding = null
        }

        function aa(b, c) {
            var d = a(c).children("tr"),
                f, e, h, l, k, m, q, r, t, v;
            b.splice(0, b.length);
            h = 0;
            for (m = d.length; h < m; h++) b.push([]);
            h = 0;
            for (m = d.length; h < m; h++)
                for (f = d[h], e = f.firstChild; e;) {
                    if ("TD" == e.nodeName.toUpperCase() || "TH" == e.nodeName.toUpperCase()) {
                        r = 1 * e.getAttribute("colspan");
                        t = 1 * e.getAttribute("rowspan");
                        r = r && 0 !== r && 1 !== r ? r :
                            1;
                        t = t && 0 !== t && 1 !== t ? t : 1;
                        l = 0;
                        for (k = b[h]; k[l];) l++;
                        q = l;
                        v = 1 === r ? !0 : !1;
                        for (k = 0; k < r; k++)
                            for (l = 0; l < t; l++) b[h + l][q + k] = {
                                cell: e,
                                unique: v
                            }, b[h + l].nTr = f
                    }
                    e = e.nextSibling
                }
        }

        function ga(a, b, c) {
            var d = [];
            c || (c = a.aoHeader, b && (c = [], aa(c, b)));
            b = 0;
            for (var f = c.length; b < f; b++)
                for (var e = 0, h = c[b].length; e < h; e++) !c[b][e].unique || d[e] && a.bSortCellsTop || (d[e] = c[b][e].cell);
            return d
        }

        function oa(b, c, d) {
            fa(b, "aoServerParams", "serverParams", [c]);
            if (c && a.isArray(c)) {
                var f = {},
                    e = /(.*?)\[\]$/;
                a.each(c, function(a, b) {
                    var c = b.name.match(e);
                    c ? (c = c[0], f[c] || (f[c] = []), f[c].push(b.value)) : f[b.name] = b.value
                });
                c = f
            }
            var h, l = b.ajax,
                k = b.oInstance,
                m = function(a) {
                    fa(b, null, "xhr", [b, a, b.jqXHR]);
                    d(a)
                };
            if (a.isPlainObject(l) && l.data) {
                h = l.data;
                var q = a.isFunction(h) ? h(c, b) : h;
                c = a.isFunction(h) && q ? q : a.extend(!0, c, q);
                delete l.data
            }
            q = {
                data: c,
                success: function(a) {
                    var c = a.error || a.sError;
                    c && za(b, 0, c);
                    b.json = a;
                    m(a)
                },
                dataType: "json",
                cache: !1,
                type: b.sServerMethod,
                error: function(c, d) {
                    var f = fa(b, null, "xhr", [b, null, b.jqXHR]); - 1 === a.inArray(!0, f) && ("parsererror" ==
                        d ? za(b, 0, "Invalid JSON response", 1) : 4 === c.readyState && za(b, 0, "Ajax error", 7));
                    Fa(b, !1)
                }
            };
            b.oAjaxData = c;
            fa(b, null, "preXhr", [b, c]);
            b.fnServerData ? b.fnServerData.call(k, b.sAjaxSource, a.map(c, function(a, b) {
                return {
                    name: b,
                    value: a
                }
            }), m, b) : b.sAjaxSource || "string" === typeof l ? b.jqXHR = a.ajax(a.extend(q, {
                url: l || b.sAjaxSource
            })) : a.isFunction(l) ? b.jqXHR = l.call(k, c, m, b) : (b.jqXHR = a.ajax(a.extend(q, l)), l.data = h)
        }

        function ea(a) {
            return a.bAjaxDataGet ? (a.iDraw++, Fa(a, !0), oa(a, da(a), function(b) {
                hb(a, b)
            }), !1) : !0
        }

        function da(b) {
            var c =
                b.aoColumns,
                d = c.length,
                f = b.oFeatures,
                e = b.oPreviousSearch,
                h = b.aoPreSearchCols,
                l, k = [],
                m, q, r, t = ma(b);
            l = b._iDisplayStart;
            m = !1 !== f.bPaginate ? b._iDisplayLength : -1;
            var v = function(a, b) {
                k.push({
                    name: a,
                    value: b
                })
            };
            v("sEcho", b.iDraw);
            v("iColumns", d);
            v("sColumns", Ta(c, "sName").join(","));
            v("iDisplayStart", l);
            v("iDisplayLength", m);
            var u = {
                draw: b.iDraw,
                columns: [],
                order: [],
                start: l,
                length: m,
                search: {
                    value: e.sSearch,
                    regex: e.bRegex
                }
            };
            for (l = 0; l < d; l++) q = c[l], r = h[l], m = "function" == typeof q.mData ? "function" : q.mData, u.columns.push({
                data: m,
                name: q.sName,
                searchable: q.bSearchable,
                orderable: q.bSortable,
                search: {
                    value: r.sSearch,
                    regex: r.bRegex
                }
            }), v("mDataProp_" + l, m), f.bFilter && (v("sSearch_" + l, r.sSearch), v("bRegex_" + l, r.bRegex), v("bSearchable_" + l, q.bSearchable)), f.bSort && v("bSortable_" + l, q.bSortable);
            f.bFilter && (v("sSearch", e.sSearch), v("bRegex", e.bRegex));
            f.bSort && (a.each(t, function(a, b) {
                u.order.push({
                    column: b.col,
                    dir: b.dir
                });
                v("iSortCol_" + a, b.col);
                v("sSortDir_" + a, b.dir)
            }), v("iSortingCols", t.length));
            c = G.ext.legacy.ajax;
            return null === c ? b.sAjaxSource ?
                k : u : c ? k : u
        }

        function hb(a, b) {
            var c = Oa(a, b),
                d = b.sEcho !== k ? b.sEcho : b.draw,
                f = b.iTotalRecords !== k ? b.iTotalRecords : b.recordsTotal,
                e = b.iTotalDisplayRecords !== k ? b.iTotalDisplayRecords : b.recordsFiltered;
            if (d) {
                if (1 * d < a.iDraw) return;
                a.iDraw = 1 * d
            }
            sa(a);
            a._iRecordsTotal = parseInt(f, 10);
            a._iRecordsDisplay = parseInt(e, 10);
            d = 0;
            for (f = c.length; d < f; d++) C(a, c[d]);
            a.aiDisplay = a.aiDisplayMaster.slice();
            a.bAjaxDataGet = !1;
            W(a);
            a._bInitComplete || bb(a, b);
            a.bAjaxDataGet = !0;
            Fa(a, !1)
        }

        function Oa(b, c) {
            var d = a.isPlainObject(b.ajax) &&
                b.ajax.dataSrc !== k ? b.ajax.dataSrc : b.sAjaxDataProp;
            return "data" === d ? c.aaData || c[d] : "" !== d ? pa(d)(c) : c
        }

        function Ba(b) {
            var d = b.oClasses,
                f = b.sTableId,
                e = b.oLanguage,
                h = b.oPreviousSearch,
                l = b.aanFeatures,
                k = '<input type="search" class="' + d.sFilterInput + '"/>',
                m = e.sSearch,
                m = m.match(/_INPUT_/) ? m.replace("_INPUT_", k) : m + k,
                d = a("<div/>", {
                    id: l.f ? null : f + "_filter",
                    "class": d.sFilter
                }).append(a("<label/>").append(m)),
                l = function() {
                    var a = this.value ? this.value : "";
                    a != h.sSearch && (Ma(b, {
                        sSearch: a,
                        bRegex: h.bRegex,
                        bSmart: h.bSmart,
                        bCaseInsensitive: h.bCaseInsensitive
                    }), b._iDisplayStart = 0, W(b))
                },
                k = null !== b.searchDelay ? b.searchDelay : "ssp" === la(b) ? 400 : 0,
                q = a("input", d).val(h.sSearch).attr("placeholder", e.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT", k ? Ha(l, k) : l).bind("keypress.DT", function(a) {
                    if (13 == a.keyCode) return !1
                }).attr("aria-controls", f);
            a(b.nTable).on("search.dt.DT", function(a, d) {
                if (b === d) try {
                    q[0] !== c.activeElement && q.val(h.sSearch)
                } catch (f) {}
            });
            return d[0]
        }

        function Ma(a, b, c) {
            var d = a.oPreviousSearch,
                f = a.aoPreSearchCols,
                e = function(a) {
                    d.sSearch = a.sSearch;
                    d.bRegex = a.bRegex;
                    d.bSmart = a.bSmart;
                    d.bCaseInsensitive = a.bCaseInsensitive
                };
            w(a);
            if ("ssp" != la(a)) {
                H(a, b.sSearch, c, b.bEscapeRegex !== k ? !b.bEscapeRegex : b.bRegex, b.bSmart, b.bCaseInsensitive);
                e(b);
                for (b = 0; b < f.length; b++) Wa(a, f[b].sSearch, b, f[b].bEscapeRegex !== k ? !f[b].bEscapeRegex : f[b].bRegex, f[b].bSmart, f[b].bCaseInsensitive);
                qb(a)
            } else e(b);
            a.bFiltered = !0;
            fa(a, null, "search", [a])
        }

        function qb(b) {
            for (var c = G.ext.search, d = b.aiDisplay, f, e, h = 0, l = c.length; h <
                l; h++) {
                for (var k = [], m = 0, q = d.length; m < q; m++) e = d[m], f = b.aoData[e], c[h](b, f._aFilterData, e, f._aData, m) && k.push(e);
                d.length = 0;
                a.merge(d, k)
            }
        }

        function Wa(a, b, c, d, f, e) {
            if ("" !== b) {
                var l = a.aiDisplay;
                d = h(b, d, f, e);
                for (f = l.length - 1; 0 <= f; f--) b = a.aoData[l[f]]._aFilterData[c], d.test(b) || l.splice(f, 1)
            }
        }

        function H(a, b, c, d, f, e) {
            d = h(b, d, f, e);
            f = a.oPreviousSearch.sSearch;
            e = a.aiDisplayMaster;
            var l;
            0 !== G.ext.search.length && (c = !0);
            l = ib(a);
            if (0 >= b.length) a.aiDisplay = e.slice();
            else {
                if (l || c || f.length > b.length || 0 !== b.indexOf(f) ||
                    a.bSorted) a.aiDisplay = e.slice();
                b = a.aiDisplay;
                for (c = b.length - 1; 0 <= c; c--) d.test(a.aoData[b[c]]._sFilterRow) || b.splice(c, 1)
            }
        }

        function h(b, c, d, f) {
            b = c ? b : xb(b);
            d && (b = "^(?=.*?" + a.map(b.match(/"[^"]+"|[^ ]+/g) || [""], function(a) {
                if ('"' === a.charAt(0)) {
                    var b = a.match(/^"(.*)"$/);
                    a = b ? b[1] : a
                }
                return a.replace('"', "")
            }).join(")(?=.*?") + ").*$");
            return RegExp(b, f ? "i" : "")
        }

        function xb(a) {
            return a.replace(ec, "\\$1")
        }

        function ib(a) {
            var b = a.aoColumns,
                c, d, f, e, h, l, k, m, q = G.ext.type.search;
            c = !1;
            d = 0;
            for (e = a.aoData.length; d <
                e; d++)
                if (m = a.aoData[d], !m._aFilterData) {
                    l = [];
                    f = 0;
                    for (h = b.length; f < h; f++) c = b[f], c.bSearchable ? (k = J(a, d, f, "filter"), q[c.sType] && (k = q[c.sType](k)), null === k && (k = ""), "string" !== typeof k && k.toString && (k = k.toString())) : k = "", k.indexOf && -1 !== k.indexOf("&") && (eb.innerHTML = k, k = Ob ? eb.textContent : eb.innerText), k.replace && (k = k.replace(/[\r\n]/g, "")), l.push(k);
                    m._aFilterData = l;
                    m._sFilterRow = l.join("  ");
                    c = !0
                }
            return c
        }

        function rb(a) {
            return {
                search: a.sSearch,
                smart: a.bSmart,
                regex: a.bRegex,
                caseInsensitive: a.bCaseInsensitive
            }
        }

        function Cb(a) {
            return {
                sSearch: a.search,
                bSmart: a.smart,
                bRegex: a.regex,
                bCaseInsensitive: a.caseInsensitive
            }
        }

        function jb(b) {
            var c = b.sTableId,
                d = b.aanFeatures.i,
                f = a("<div/>", {
                    "class": b.oClasses.sInfo,
                    id: d ? null : c + "_info"
                });
            d || (b.aoDrawCallback.push({
                fn: sb,
                sName: "information"
            }), f.attr("role", "status").attr("aria-live", "polite"), a(b.nTable).attr("aria-describedby", c + "_info"));
            return f[0]
        }

        function sb(b) {
            var c = b.aanFeatures.i;
            if (0 !== c.length) {
                var d = b.oLanguage,
                    f = b._iDisplayStart + 1,
                    e = b.fnDisplayEnd(),
                    h = b.fnRecordsTotal(),
                    l = b.fnRecordsDisplay(),
                    k = l ? d.sInfo : d.sInfoEmpty;
                l !== h && (k += " " + d.sInfoFiltered);
                k += d.sInfoPostFix;
                k = Db(b, k);
                d = d.fnInfoCallback;
                null !== d && (k = d.call(b.oInstance, b, f, e, h, l, k));
                a(c).html(k)
            }
        }

        function Db(a, b) {
            var c = a.fnFormatNumber,
                d = a._iDisplayStart + 1,
                f = a._iDisplayLength,
                e = a.fnRecordsDisplay(),
                h = -1 === f;
            return b.replace(/_START_/g, c.call(a, d)).replace(/_END_/g, c.call(a, a.fnDisplayEnd())).replace(/_MAX_/g, c.call(a, a.fnRecordsTotal())).replace(/_TOTAL_/g, c.call(a, e)).replace(/_PAGE_/g, c.call(a, h ? 1 : Math.ceil(d /
                f))).replace(/_PAGES_/g, c.call(a, h ? 1 : Math.ceil(e / f)))
        }

        function yb(a) {
            var b, c, d = a.iInitDisplayStart,
                f = a.aoColumns,
                e;
            c = a.oFeatures;
            var h = a.bDeferLoading;
            if (a.bInitialised) {
                wa(a);
                Z(a);
                ca(a, a.aoHeader);
                ca(a, a.aoFooter);
                Fa(a, !0);
                c.bAutoWidth && kb(a);
                b = 0;
                for (c = f.length; b < c; b++) e = f[b], e.sWidth && (e.nTh.style.width = ha(e.sWidth));
                fa(a, null, "preInit", [a]);
                ta(a);
                f = la(a);
                if ("ssp" != f || h) "ajax" == f ? oa(a, [], function(c) {
                        var f = Oa(a, c);
                        for (b = 0; b < f.length; b++) C(a, f[b]);
                        a.iInitDisplayStart = d;
                        ta(a);
                        Fa(a, !1);
                        bb(a, c)
                    }, a) :
                    (Fa(a, !1), bb(a))
            } else setTimeout(function() {
                yb(a)
            }, 200)
        }

        function bb(a, b) {
            a._bInitComplete = !0;
            (b || a.oInit.aaData) && z(a);
            fa(a, "aoInitComplete", "init", [a, b])
        }

        function N(a, b) {
            var c = parseInt(b, 10);
            a._iDisplayLength = c;
            mb(a);
            fa(a, null, "length", [a, c])
        }

        function Ia(b) {
            for (var c = b.oClasses, d = b.sTableId, f = b.aLengthMenu, e = a.isArray(f[0]), h = e ? f[0] : f, f = e ? f[1] : f, e = a("<select/>", {
                    name: d + "_length",
                    "aria-controls": d,
                    "class": c.sLengthSelect
                }), l = 0, k = h.length; l < k; l++) e[0][l] = new Option(f[l], h[l]);
            var m = a("<div><label/></div>").addClass(c.sLength);
            b.aanFeatures.l || (m[0].id = d + "_length");
            m.children().append(b.oLanguage.sLengthMenu.replace("_MENU_", e[0].outerHTML));
            a("select", m).val(b._iDisplayLength).bind("change.DT", function() {
                N(b, a(this).val());
                W(b)
            });
            a(b.nTable).bind("length.dt.DT", function(c, d, f) {
                b === d && a("select", m).val(f)
            });
            return m[0]
        }

        function ab(b) {
            var c = b.sPaginationType,
                d = G.ext.pager[c],
                f = "function" === typeof d,
                e = function(a) {
                    W(a)
                },
                c = a("<div/>").addClass(b.oClasses.sPaging + c)[0],
                h = b.aanFeatures;
            f || d.fnInit(b, c, e);
            h.p || (c.id = b.sTableId +
                "_paginate", b.aoDrawCallback.push({
                    fn: function(a) {
                        if (f) {
                            var b = a._iDisplayStart,
                                c = a._iDisplayLength,
                                n = a.fnRecordsDisplay(),
                                l = -1 === c,
                                b = l ? 0 : Math.ceil(b / c),
                                c = l ? 1 : Math.ceil(n / c),
                                n = d(b, c),
                                k, l = 0;
                            for (k = h.p.length; l < k; l++) nb(a, "pageButton")(a, h.p[l], l, n, b, c)
                        } else d.fnUpdate(a, e)
                    },
                    sName: "pagination"
                }));
            return c
        }

        function ya(a, b, c) {
            var d = a._iDisplayStart,
                f = a._iDisplayLength,
                e = a.fnRecordsDisplay();
            0 === e || -1 === f ? d = 0 : "number" === typeof b ? (d = b * f, d > e && (d = 0)) : "first" == b ? d = 0 : "previous" == b ? (d = 0 <= f ? d - f : 0, 0 > d && (d = 0)) : "next" ==
                b ? d + f < e && (d += f) : "last" == b ? d = Math.floor((e - 1) / f) * f : za(a, 0, "Unknown paging action: " + b, 5);
            b = a._iDisplayStart !== d;
            a._iDisplayStart = d;
            b && (fa(a, null, "page", [a]), c && W(a));
            return b
        }

        function va(b) {
            return a("<div/>", {
                id: b.aanFeatures.r ? null : b.sTableId + "_processing",
                "class": b.oClasses.sProcessing
            }).html(b.oLanguage.sProcessing).insertBefore(b.nTable)[0]
        }

        function Fa(b, c) {
            b.oFeatures.bProcessing && a(b.aanFeatures.r).css("display", c ? "block" : "none");
            fa(b, null, "processing", [b, c])
        }

        function Xa(b) {
            var c = a(b.nTable);
            c.attr("role", "grid");
            var d = b.oScroll;
            if ("" === d.sX && "" === d.sY) return b.nTable;
            var f = d.sX,
                e = d.sY,
                h = b.oClasses,
                l = c.children("caption"),
                k = l.length ? l[0]._captionSide : null,
                m = a(c[0].cloneNode(!1)),
                q = a(c[0].cloneNode(!1)),
                r = c.children("tfoot");
            d.sX && "100%" === c.attr("width") && c.removeAttr("width");
            r.length || (r = null);
            m = a("<div/>", {
                "class": h.sScrollWrapper
            }).append(a("<div/>", {
                "class": h.sScrollHead
            }).css({
                overflow: "hidden",
                position: "relative",
                border: 0,
                width: f ? f ? ha(f) : null : "100%"
            }).append(a("<div/>", {
                "class": h.sScrollHeadInner
            }).css({
                "box-sizing": "content-box",
                width: d.sXInner || "100%"
            }).append(m.removeAttr("id").css("margin-left", 0).append("top" === k ? l : null).append(c.children("thead"))))).append(a("<div/>", {
                "class": h.sScrollBody
            }).css({
                position: "relative",
                "overflow-y": "auto",
                "overflow-x": "hidden",
                width: f ? ha(f) : null
            }).append(c));
            r && m.append(a("<div/>", {
                "class": h.sScrollFoot
            }).css({
                overflow: "hidden",
                border: 0,
                width: f ? f ? ha(f) : null : "100%"
            }).append(a("<div/>", {
                "class": h.sScrollFootInner
            }).append(q.removeAttr("id").css("margin-left", 0).append("bottom" === k ? l : null).append(c.children("tfoot")))));
            var c = m.children(),
                t = c[0],
                h = c[1],
                v = r ? c[2] : null;
            if (f) a(h).on("scroll.DT", function() {
                var a = this.scrollLeft;
                t.scrollLeft = a;
                r && (v.scrollLeft = a)
            });
            a(h).css(e && d.bCollapse ? "max-height" : "height", e);
            b.nScrollHead = t;
            b.nScrollBody = h;
            b.nScrollFoot = v;
            b.aoDrawCallback.push({
                fn: Ya,
                sName: "scrolling"
            });
            return m[0]
        }

        function Ya(b) {
            var c = b.oScroll,
                d = c.sX,
                f = c.sXInner,
                e = c.sY,
                c = c.iBarWidth,
                h = a(b.nScrollHead),
                l = h[0].style,
                k = h.children("div"),
                m = k[0].style,
                q = k.children("table"),
                k = b.nScrollBody,
                r = a(k),
                t = k.style,
                v = a(b.nScrollFoot).children("div"),
                u = v.children("table"),
                x = a(b.nTHead),
                w = a(b.nTable),
                T = w[0],
                B = T.style,
                z = b.nTFoot ? a(b.nTFoot) : null,
                C = b.oBrowser,
                D = C.bScrollOversize,
                S, G, ia, E, F = [],
                J = [],
                P = [],
                L, ua = function(a) {
                    a = a.style;
                    a.paddingTop = "0";
                    a.paddingBottom = "0";
                    a.borderTopWidth = "0";
                    a.borderBottomWidth = "0";
                    a.height = 0
                };
            w.children("thead, tfoot").remove();
            E = x.clone().prependTo(w);
            x = x.find("tr");
            G = E.find("tr");
            E.find("th, td").removeAttr("tabindex");
            z && (ia = z.clone().prependTo(w), S = z.find("tr"), ia = ia.find("tr"));
            d || (t.width = "100%", h[0].style.width =
                "100%");
            a.each(ga(b, E), function(a, c) {
                L = A(b, a);
                c.style.width = b.aoColumns[L].sWidth
            });
            z && Ja(function(a) {
                a.style.width = ""
            }, ia);
            h = w.outerWidth();
            "" === d ? (B.width = "100%", D && (w.find("tbody").height() > k.offsetHeight || "scroll" == r.css("overflow-y")) && (B.width = ha(w.outerWidth() - c)), h = w.outerWidth()) : "" !== f && (B.width = ha(f), h = w.outerWidth());
            Ja(ua, G);
            Ja(function(b) {
                P.push(b.innerHTML);
                F.push(ha(a(b).css("width")))
            }, G);
            Ja(function(a, b) {
                a.style.width = F[b]
            }, x);
            a(G).height(0);
            z && (Ja(ua, ia), Ja(function(b) {
                    J.push(ha(a(b).css("width")))
                },
                ia), Ja(function(a, b) {
                a.style.width = J[b]
            }, S), a(ia).height(0));
            Ja(function(a, b) {
                a.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + P[b] + "</div>";
                a.style.width = F[b]
            }, G);
            z && Ja(function(a, b) {
                a.innerHTML = "";
                a.style.width = J[b]
            }, ia);
            w.outerWidth() < h ? (S = k.scrollHeight > k.offsetHeight || "scroll" == r.css("overflow-y") ? h + c : h, D && (k.scrollHeight > k.offsetHeight || "scroll" == r.css("overflow-y")) && (B.width = ha(S - c)), "" !== d && "" === f || za(b, 1, "Possible column misalignment", 6)) : S = "100%";
            t.width =
                ha(S);
            l.width = ha(S);
            z && (b.nScrollFoot.style.width = ha(S));
            !e && D && (t.height = ha(T.offsetHeight + c));
            d = w.outerWidth();
            q[0].style.width = ha(d);
            m.width = ha(d);
            f = w.height() > k.clientHeight || "scroll" == r.css("overflow-y");
            e = "padding" + (C.bScrollbarLeft ? "Left" : "Right");
            m[e] = f ? c + "px" : "0px";
            z && (u[0].style.width = ha(d), v[0].style.width = ha(d), v[0].style[e] = f ? c + "px" : "0px");
            r.scroll();
            !b.bSorted && !b.bFiltered || b._drawHold || (k.scrollTop = 0)
        }

        function Ja(a, b, c) {
            for (var d = 0, f = 0, e = b.length, h, l; f < e;) {
                h = b[f].firstChild;
                for (l =
                    c ? c[f].firstChild : null; h;) 1 === h.nodeType && (c ? a(h, l, d) : a(h, d), d++), h = h.nextSibling, l = c ? l.nextSibling : null;
                f++
            }
        }

        function kb(b) {
            var c = b.nTable,
                d = b.aoColumns,
                f = b.oScroll,
                h = f.sY,
                l = f.sX,
                k = f.sXInner,
                m = d.length,
                q = t(b, "bVisible"),
                r = a("th", b.nTHead),
                v = c.getAttribute("width"),
                u = c.parentNode,
                x = !1,
                w, T, C;
            C = b.oBrowser;
            f = C.bScrollOversize;
            (w = c.style.width) && -1 !== w.indexOf("%") && (v = w);
            for (w = 0; w < q.length; w++) T = d[q[w]], null !== T.sWidth && (T.sWidth = Ka(T.sWidthOrig, u), x = !0);
            if (f || !x && !l && !h && m == B(b) && m == r.length)
                for (w =
                    0; w < m; w++) {
                    if (q = A(b, w)) d[q].sWidth = ha(r.eq(w).width())
                } else {
                    m = a(c).clone().css("visibility", "hidden").removeAttr("id");
                    m.find("tbody tr").remove();
                    var D = a("<tr/>").appendTo(m.find("tbody"));
                    m.find("thead, tfoot").remove();
                    m.append(a(b.nTHead).clone()).append(a(b.nTFoot).clone());
                    m.find("tfoot th, tfoot td").css("width", "");
                    r = ga(b, m.find("thead")[0]);
                    for (w = 0; w < q.length; w++) T = d[q[w]], r[w].style.width = null !== T.sWidthOrig && "" !== T.sWidthOrig ? ha(T.sWidthOrig) : "";
                    if (b.aoData.length)
                        for (w = 0; w < q.length; w++) x =
                            q[w], T = d[x], a(lb(b, x)).clone(!1).append(T.sContentPadding).appendTo(D);
                    x = a("<div/>").css(l || h ? {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: 1,
                        right: 0,
                        overflow: "hidden"
                    } : {}).append(m).appendTo(u);
                    l && k ? m.width(k) : l ? (m.css("width", "auto"), m.width() < u.clientWidth && m.width(u.clientWidth)) : h ? m.width(u.clientWidth) : v && m.width(v);
                    if (l) {
                        for (w = k = 0; w < q.length; w++) T = d[q[w]], h = C.bBounding ? r[w].getBoundingClientRect().width : a(r[w]).outerWidth(), k += null === T.sWidthOrig ? h : parseInt(T.sWidth, 10) + h - a(r[w]).width();
                        m.width(ha(k));
                        c.style.width = ha(k)
                    }
                    for (w = 0; w < q.length; w++)
                        if (T = d[q[w]], C = a(r[w]).width()) T.sWidth = ha(C);
                    c.style.width = ha(m.css("width"));
                    x.remove()
                }
            v && (c.style.width = ha(v));
            !v && !l || b._reszEvt || (c = function() {
                a(e).bind("resize.DT-" + b.sInstance, Ha(function() {
                    z(b)
                }))
            }, f ? setTimeout(c, 1E3) : c(), b._reszEvt = !0)
        }

        function Ha(a, b) {
            var c = b !== k ? b : 200,
                d, f;
            return function() {
                var b = this,
                    e = +new Date,
                    h = arguments;
                d && e < d + c ? (clearTimeout(f), f = setTimeout(function() {
                    d = k;
                    a.apply(b, h)
                }, c)) : (d = e, a.apply(b, h))
            }
        }

        function Ka(b, d) {
            if (!b) return 0;
            var f = a("<div/>").css("width", ha(b)).appendTo(d || c.body),
                e = f[0].offsetWidth;
            f.remove();
            return e
        }

        function lb(b, c) {
            var d = Pa(b, c);
            if (0 > d) return null;
            var f = b.aoData[d];
            return f.nTr ? f.anCells[c] : a("<td/>").html(J(b, d, c, "display"))[0]
        }

        function Pa(a, b) {
            for (var c, d = -1, f = -1, e = 0, h = a.aoData.length; e < h; e++) c = J(a, e, b, "display") + "", c = c.replace(fc, ""), c.length > d && (d = c.length, f = e);
            return f
        }

        function ha(a) {
            return null === a ? "0px" : "number" == typeof a ? 0 > a ? "0px" : a + "px" : a.match(/\d$/) ? a + "px" : a
        }

        function ma(b) {
            var c, d, f = [],
                e = b.aoColumns,
                h, l, m, q;
            c = b.aaSortingFixed;
            d = a.isPlainObject(c);
            var r = [];
            h = function(b) {
                b.length && !a.isArray(b[0]) ? r.push(b) : a.merge(r, b)
            };
            a.isArray(c) && h(c);
            d && c.pre && h(c.pre);
            h(b.aaSorting);
            d && c.post && h(c.post);
            for (b = 0; b < r.length; b++)
                for (q = r[b][0], h = e[q].aDataSort, c = 0, d = h.length; c < d; c++) l = h[c], m = e[l].sType || "string", r[b]._idx === k && (r[b]._idx = a.inArray(r[b][1], e[l].asSorting)), f.push({
                    src: q,
                    col: l,
                    dir: r[b][1],
                    index: r[b]._idx,
                    type: m,
                    formatter: G.ext.type.order[m + "-pre"]
                });
            return f
        }

        function Kb(a) {
            var b,
                c, d = [],
                f = G.ext.type.order,
                e = a.aoData,
                h = 0,
                l, k = a.aiDisplayMaster,
                m;
            w(a);
            m = ma(a);
            b = 0;
            for (c = m.length; b < c; b++) l = m[b], l.formatter && h++, Qa(a, l.col);
            if ("ssp" != la(a) && 0 !== m.length) {
                b = 0;
                for (c = k.length; b < c; b++) d[k[b]] = b;
                h === m.length ? k.sort(function(a, b) {
                    var c, f, h, n, l = m.length,
                        k = e[a]._aSortData,
                        q = e[b]._aSortData;
                    for (h = 0; h < l; h++)
                        if (n = m[h], c = k[n.col], f = q[n.col], c = c < f ? -1 : c > f ? 1 : 0, 0 !== c) return "asc" === n.dir ? c : -c;
                    c = d[a];
                    f = d[b];
                    return c < f ? -1 : c > f ? 1 : 0
                }) : k.sort(function(a, b) {
                    var c, h, n, l, k = m.length,
                        q = e[a]._aSortData,
                        y = e[b]._aSortData;
                    for (n = 0; n < k; n++)
                        if (l = m[n], c = q[l.col], h = y[l.col], l = f[l.type + "-" + l.dir] || f["string-" + l.dir], c = l(c, h), 0 !== c) return c;
                    c = d[a];
                    h = d[b];
                    return c < h ? -1 : c > h ? 1 : 0
                })
            }
            a.bSorted = !0
        }

        function Lb(a) {
            var b, c, d = a.aoColumns,
                f = ma(a);
            a = a.oLanguage.oAria;
            for (var e = 0, h = d.length; e < h; e++) {
                c = d[e];
                var l = c.asSorting;
                b = c.sTitle.replace(/<.*?>/g, "");
                var k = c.nTh;
                k.removeAttribute("aria-sort");
                c.bSortable && (0 < f.length && f[0].col == e ? (k.setAttribute("aria-sort", "asc" == f[0].dir ? "ascending" : "descending"), c = l[f[0].index + 1] || l[0]) : c = l[0],
                    b += "asc" === c ? a.sSortAscending : a.sSortDescending);
                k.setAttribute("aria-label", b)
            }
        }

        function Eb(b, c, d, f) {
            var e = b.aaSorting,
                h = b.aoColumns[c].asSorting,
                l = function(b, c) {
                    var d = b._idx;
                    d === k && (d = a.inArray(b[1], h));
                    return d + 1 < h.length ? d + 1 : c ? null : 0
                };
            "number" === typeof e[0] && (e = b.aaSorting = [e]);
            d && b.oFeatures.bSortMulti ? (d = a.inArray(c, Ta(e, "0")), -1 !== d ? (c = l(e[d], !0), null === c && 1 === e.length && (c = 0), null === c ? e.splice(d, 1) : (e[d][1] = h[c], e[d]._idx = c)) : (e.push([c, h[0], 0]), e[e.length - 1]._idx = 0)) : e.length && e[0][0] == c ?
                (c = l(e[0]), e.length = 1, e[0][1] = h[c], e[0]._idx = c) : (e.length = 0, e.push([c, h[0]]), e[0]._idx = 0);
            ta(b);
            "function" == typeof f && f(b)
        }

        function zb(a, b, c, d) {
            var f = a.aoColumns[c];
            Fb(b, {}, function(b) {
                !1 !== f.bSortable && (a.oFeatures.bProcessing ? (Fa(a, !0), setTimeout(function() {
                    Eb(a, c, b.shiftKey, d);
                    "ssp" !== la(a) && Fa(a, !1)
                }, 0)) : Eb(a, c, b.shiftKey, d))
            })
        }

        function tb(b) {
            var c = b.aLastSort,
                d = b.oClasses.sSortColumn,
                f = ma(b),
                e = b.oFeatures,
                h, l;
            if (e.bSort && e.bSortClasses) {
                e = 0;
                for (h = c.length; e < h; e++) l = c[e].src, a(Ta(b.aoData, "anCells",
                    l)).removeClass(d + (2 > e ? e + 1 : 3));
                e = 0;
                for (h = f.length; e < h; e++) l = f[e].src, a(Ta(b.aoData, "anCells", l)).addClass(d + (2 > e ? e + 1 : 3))
            }
            b.aLastSort = f
        }

        function Qa(a, b) {
            var c = a.aoColumns[b],
                d = G.ext.order[c.sSortDataType],
                f;
            d && (f = d.call(a.oInstance, a, b, r(a, b)));
            for (var e, h = G.ext.type.order[c.sType + "-pre"], l = 0, k = a.aoData.length; l < k; l++)
                if (c = a.aoData[l], c._aSortData || (c._aSortData = []), !c._aSortData[b] || d) e = d ? f[l] : J(a, l, b, "sort"), c._aSortData[b] = h ? h(e) : e
        }

        function La(b) {
            if (b.oFeatures.bStateSave && !b.bDestroying) {
                var c = {
                    time: +new Date,
                    start: b._iDisplayStart,
                    length: b._iDisplayLength,
                    order: a.extend(!0, [], b.aaSorting),
                    search: rb(b.oPreviousSearch),
                    columns: a.map(b.aoColumns, function(a, c) {
                        return {
                            visible: a.bVisible,
                            search: rb(b.aoPreSearchCols[c])
                        }
                    })
                };
                fa(b, "aoStateSaveParams", "stateSaveParams", [b, c]);
                b.oSavedState = c;
                b.fnStateSaveCallback.call(b.oInstance, b, c)
            }
        }

        function Za(b) {
            var c, d, f = b.aoColumns;
            if (b.oFeatures.bStateSave) {
                var e = b.fnStateLoadCallback.call(b.oInstance, b);
                if (e && e.time && (c = fa(b, "aoStateLoadParams", "stateLoadParams", [b, e]), -1 === a.inArray(!1, c) && (c = b.iStateDuration, !(0 < c && e.time < +new Date - 1E3 * c) && f.length === e.columns.length))) {
                    b.oLoadedState = a.extend(!0, {}, e);
                    e.start !== k && (b._iDisplayStart = e.start, b.iInitDisplayStart = e.start);
                    e.length !== k && (b._iDisplayLength = e.length);
                    e.order !== k && (b.aaSorting = [], a.each(e.order, function(a, c) {
                        b.aaSorting.push(c[0] >= f.length ? [0, c[1]] : c)
                    }));
                    e.search !== k && a.extend(b.oPreviousSearch, Cb(e.search));
                    c = 0;
                    for (d = e.columns.length; c < d; c++) {
                        var h = e.columns[c];
                        h.visible !== k && (f[c].bVisible =
                            h.visible);
                        h.search !== k && a.extend(b.aoPreSearchCols[c], Cb(h.search))
                    }
                    fa(b, "aoStateLoaded", "stateLoaded", [b, e])
                }
            }
        }

        function Sa(b) {
            var c = G.settings;
            b = a.inArray(b, Ta(c, "nTable"));
            return -1 !== b ? c[b] : null
        }

        function za(a, b, c, d) {
            c = "DataTables warning: " + (a ? "table id=" + a.sTableId + " - " : "") + c;
            d && (c += ". For more information about this error, please see http://datatables.net/tn/" + d);
            if (b) e.console && console.log && console.log(c);
            else if (b = G.ext, b = b.sErrMode || b.errMode, a && fa(a, null, "error", [a, d, c]), "alert" == b) alert(c);
            else {
                if ("throw" == b) throw Error(c);
                "function" == typeof b && b(a, d, c)
            }
        }

        function Ca(b, c, d, f) {
            a.isArray(d) ? a.each(d, function(d, f) {
                a.isArray(f) ? Ca(b, c, f[0], f[1]) : Ca(b, c, f)
            }) : (f === k && (f = d), c[d] !== k && (b[f] = c[d]))
        }

        function Gb(b, c, d) {
            var f, e;
            for (e in c) c.hasOwnProperty(e) && (f = c[e], a.isPlainObject(f) ? (a.isPlainObject(b[e]) || (b[e] = {}), a.extend(!0, b[e], f)) : b[e] = d && "data" !== e && "aaData" !== e && a.isArray(f) ? f.slice() : f);
            return b
        }

        function Fb(b, c, d) {
            a(b).bind("click.DT", c, function(a) {
                b.blur();
                d(a)
            }).bind("keypress.DT",
                c,
                function(a) {
                    13 === a.which && (a.preventDefault(), d(a))
                }).bind("selectstart.DT", function() {
                return !1
            })
        }

        function Ga(a, b, c, d) {
            c && a[b].push({
                fn: c,
                sName: d
            })
        }

        function fa(b, c, d, f) {
            var e = [];
            c && (e = a.map(b[c].slice().reverse(), function(a) {
                return a.fn.apply(b.oInstance, f)
            }));
            null !== d && (c = a.Event(d + ".dt"), a(b.nTable).trigger(c, f), e.push(c.result));
            return e
        }

        function mb(a) {
            var b = a._iDisplayStart,
                c = a.fnDisplayEnd(),
                d = a._iDisplayLength;
            b >= c && (b = c - d);
            b -= b % d;
            if (-1 === d || 0 > b) b = 0;
            a._iDisplayStart = b
        }

        function nb(b, c) {
            var d =
                b.renderer,
                f = G.ext.renderer[c];
            return a.isPlainObject(d) && d[c] ? f[d[c]] || f._ : "string" === typeof d ? f[d] || f._ : f._
        }

        function la(a) {
            return a.oFeatures.bServerSide ? "ssp" : a.ajax || a.sAjaxSource ? "ajax" : "dom"
        }

        function T(a, b) {
            var c = [],
                c = hc.numbers_length,
                d = Math.floor(c / 2);
            b <= c ? c = db(0, b) : a <= d ? (c = db(0, c - 2), c.push("ellipsis"), c.push(b - 1)) : (a >= b - 1 - d ? c = db(b - (c - 2), b) : (c = db(a - d + 2, a + d - 1), c.push("ellipsis"), c.push(b - 1)), c.splice(0, 0, "ellipsis"), c.splice(0, 0, 0));
            c.DT_el = "span";
            return c
        }

        function S(b) {
            a.each({
                num: function(a) {
                    return Sb(a,
                        b)
                },
                "num-fmt": function(a) {
                    return Sb(a, b, Nb)
                },
                "html-num": function(a) {
                    return Sb(a, b, Mb)
                },
                "html-num-fmt": function(a) {
                    return Sb(a, b, Mb, Nb)
                }
            }, function(a, c) {
                ua.type.order[a + b + "-pre"] = c;
                a.match(/^html\-/) && (ua.type.search[a + b] = ua.type.search.html)
            })
        }

        function ia(a) {
            return function() {
                var b = [Sa(this[G.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));
                return G.ext.internal[a].apply(this, b)
            }
        }
        var G, ua, Y, Q, ra, Hb = {},
            Yb = /[\r\n]/g,
            Mb = /<.*?>/g,
            cc = /^[\w\+\-]/,
            dc = /[\w\+\-]$/,
            ec = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\|\$|\^|\-)/g,
            Nb = /[',$\u00a3\u20ac\u00a5%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi,
            cb = function(a) {
                return a && !0 !== a && "-" !== a ? !1 : !0
            },
            Ab = function(a) {
                var b = parseInt(a, 10);
                return !isNaN(b) && isFinite(a) ? b : null
            },
            Ib = function(a, b) {
                Hb[b] || (Hb[b] = RegExp(xb(b), "g"));
                return "string" === typeof a && "." !== b ? a.replace(/\./g, "").replace(Hb[b], ".") : a
            },
            Tb = function(a, b, c) {
                var d = "string" === typeof a;
                if (cb(a)) return !0;
                b && d && (a = Ib(a, b));
                c && d && (a = a.replace(Nb, ""));
                return !isNaN(parseFloat(a)) && isFinite(a)
            },
            Ub = function(a, b, c) {
                return cb(a) ? !0 : cb(a) ||
                    "string" === typeof a ? Tb(a.replace(Mb, ""), b, c) ? !0 : null : null
            },
            Ta = function(a, b, c) {
                var d = [],
                    f = 0,
                    e = a.length;
                if (c !== k)
                    for (; f < e; f++) a[f] && a[f][b] && d.push(a[f][b][c]);
                else
                    for (; f < e; f++) a[f] && d.push(a[f][b]);
                return d
            },
            ub = function(a, b, c, d) {
                var f = [],
                    e = 0,
                    h = b.length;
                if (d !== k)
                    for (; e < h; e++) a[b[e]][c] && f.push(a[b[e]][c][d]);
                else
                    for (; e < h; e++) f.push(a[b[e]][c]);
                return f
            },
            db = function(a, b) {
                var c = [],
                    d;
                b === k ? (b = 0, d = a) : (d = b, b = a);
                for (var f = b; f < d; f++) c.push(f);
                return c
            },
            Zb = function(a) {
                for (var b = [], c = 0, d = a.length; c < d; c++) a[c] &&
                    b.push(a[c]);
                return b
            },
            ob = function(a) {
                var b = [],
                    c, d, f = a.length,
                    e, h = 0;
                d = 0;
                a: for (; d < f; d++) {
                    c = a[d];
                    for (e = 0; e < h; e++)
                        if (b[e] === c) continue a;
                    b.push(c);
                    h++
                }
                return b
            },
            Na = function(a, b, c) {
                a[b] !== k && (a[c] = a[b])
            },
            Ua = /\[.*?\]$/,
            vb = /\(\)$/,
            eb = a("<div>")[0],
            Ob = eb.textContent !== k,
            fc = /<.*?>/g;
        G = function(b) {
            this.$ = function(a, b) {
                return this.api(!0).$(a, b)
            };
            this._ = function(a, b) {
                return this.api(!0).rows(a, b).data()
            };
            this.api = function(a) {
                return a ? new Y(Sa(this[ua.iApiIndex])) : new Y(this)
            };
            this.fnAddData = function(b, c) {
                var d =
                    this.api(!0),
                    f = a.isArray(b) && (a.isArray(b[0]) || a.isPlainObject(b[0])) ? d.rows.add(b) : d.row.add(b);
                (c === k || c) && d.draw();
                return f.flatten().toArray()
            };
            this.fnAdjustColumnSizing = function(a) {
                var b = this.api(!0).columns.adjust(),
                    c = b.settings()[0],
                    d = c.oScroll;
                a === k || a ? b.draw(!1) : ("" !== d.sX || "" !== d.sY) && Ya(c)
            };
            this.fnClearTable = function(a) {
                var b = this.api(!0).clear();
                (a === k || a) && b.draw()
            };
            this.fnClose = function(a) {
                this.api(!0).row(a).child.hide()
            };
            this.fnDeleteRow = function(a, b, c) {
                var d = this.api(!0);
                a = d.rows(a);
                var f = a.settings()[0],
                    e = f.aoData[a[0][0]];
                a.remove();
                b && b.call(this, f, e);
                (c === k || c) && d.draw();
                return e
            };
            this.fnDestroy = function(a) {
                this.api(!0).destroy(a)
            };
            this.fnDraw = function(a) {
                this.api(!0).draw(a)
            };
            this.fnFilter = function(a, b, c, d, f, e) {
                f = this.api(!0);
                null === b || b === k ? f.search(a, c, d, e) : f.column(b).search(a, c, d, e);
                f.draw()
            };
            this.fnGetData = function(a, b) {
                var c = this.api(!0);
                if (a !== k) {
                    var d = a.nodeName ? a.nodeName.toLowerCase() : "";
                    return b !== k || "td" == d || "th" == d ? c.cell(a, b).data() : c.row(a).data() || null
                }
                return c.data().toArray()
            };
            this.fnGetNodes = function(a) {
                var b = this.api(!0);
                return a !== k ? b.row(a).node() : b.rows().nodes().flatten().toArray()
            };
            this.fnGetPosition = function(a) {
                var b = this.api(!0),
                    c = a.nodeName.toUpperCase();
                return "TR" == c ? b.row(a).index() : "TD" == c || "TH" == c ? (a = b.cell(a).index(), [a.row, a.columnVisible, a.column]) : null
            };
            this.fnIsOpen = function(a) {
                return this.api(!0).row(a).child.isShown()
            };
            this.fnOpen = function(a, b, c) {
                return this.api(!0).row(a).child(b, c).show().child()[0]
            };
            this.fnPageChange = function(a, b) {
                var c = this.api(!0).page(a);
                (b === k || b) && c.draw(!1)
            };
            this.fnSetColumnVis = function(a, b, c) {
                a = this.api(!0).column(a).visible(b);
                (c === k || c) && a.columns.adjust().draw()
            };
            this.fnSettings = function() {
                return Sa(this[ua.iApiIndex])
            };
            this.fnSort = function(a) {
                this.api(!0).order(a).draw()
            };
            this.fnSortListener = function(a, b, c) {
                this.api(!0).order.listener(a, b, c)
            };
            this.fnUpdate = function(a, b, c, d, f) {
                var e = this.api(!0);
                c === k || null === c ? e.row(b).data(a) : e.cell(b, c).data(a);
                (f === k || f) && e.columns.adjust();
                (d === k || d) && e.draw();
                return 0
            };
            this.fnVersionCheck =
                ua.fnVersionCheck;
            var c = this,
                f = b === k,
                e = this.length;
            f && (b = {});
            this.oApi = this.internal = ua.internal;
            for (var h in G.ext.internal) h && (this[h] = ia(h));
            this.each(function() {
                var h = {},
                    h = 1 < e ? Gb(h, b, !0) : b,
                    r = 0,
                    t, w = this.getAttribute("id"),
                    T = !1,
                    B = G.defaults,
                    z = a(this);
                if ("table" != this.nodeName.toLowerCase()) za(null, 0, "Non-table node initialisation (" + this.nodeName + ")", 2);
                else {
                    m(B);
                    u(B.column);
                    d(B, B, !0);
                    d(B.column, B.column, !0);
                    d(B, a.extend(h, z.data()));
                    var S = G.settings,
                        r = 0;
                    for (t = S.length; r < t; r++) {
                        var ia = S[r];
                        if (ia.nTable ==
                            this || ia.nTHead.parentNode == this || ia.nTFoot && ia.nTFoot.parentNode == this) {
                            r = h.bRetrieve !== k ? h.bRetrieve : B.bRetrieve;
                            if (f || r) return ia.oInstance;
                            if (h.bDestroy !== k ? h.bDestroy : B.bDestroy) {
                                ia.oInstance.fnDestroy();
                                break
                            } else {
                                za(ia, 0, "Cannot reinitialise DataTable", 3);
                                return
                            }
                        }
                        if (ia.sTableId == this.id) {
                            S.splice(r, 1);
                            break
                        }
                    }
                    if (null === w || "" === w) this.id = w = "DataTables_Table_" + G.ext._unique++;
                    var A = a.extend(!0, {}, G.models.oSettings, {
                        sDestroyWidth: z[0].style.width,
                        sInstance: w,
                        sTableId: w
                    });
                    A.nTable = this;
                    A.oApi =
                        c.internal;
                    A.oInit = h;
                    S.push(A);
                    A.oInstance = 1 === c.length ? c : z.dataTable();
                    m(h);
                    h.oLanguage && l(h.oLanguage);
                    h.aLengthMenu && !h.iDisplayLength && (h.iDisplayLength = a.isArray(h.aLengthMenu[0]) ? h.aLengthMenu[0][0] : h.aLengthMenu[0]);
                    h = Gb(a.extend(!0, {}, B), h);
                    Ca(A.oFeatures, h, "bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));
                    Ca(A, h, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed",
                        "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"],
                        ["oSearch", "oPreviousSearch"],
                        ["aoSearchCols", "aoPreSearchCols"],
                        ["iDisplayLength", "_iDisplayLength"],
                        ["bJQueryUI", "bJUI"]
                    ]);
                    Ca(A.oScroll, h, [
                        ["sScrollX", "sX"],
                        ["sScrollXInner", "sXInner"],
                        ["sScrollY", "sY"],
                        ["bScrollCollapse", "bCollapse"]
                    ]);
                    Ca(A.oLanguage, h, "fnInfoCallback");
                    Ga(A, "aoDrawCallback", h.fnDrawCallback, "user");
                    Ga(A, "aoServerParams", h.fnServerParams, "user");
                    Ga(A, "aoStateSaveParams", h.fnStateSaveParams, "user");
                    Ga(A, "aoStateLoadParams", h.fnStateLoadParams, "user");
                    Ga(A, "aoStateLoaded", h.fnStateLoaded, "user");
                    Ga(A, "aoRowCallback", h.fnRowCallback, "user");
                    Ga(A, "aoRowCreatedCallback", h.fnCreatedRow, "user");
                    Ga(A, "aoHeaderCallback", h.fnHeaderCallback, "user");
                    Ga(A, "aoFooterCallback", h.fnFooterCallback, "user");
                    Ga(A, "aoInitComplete", h.fnInitComplete, "user");
                    Ga(A, "aoPreDrawCallback",
                        h.fnPreDrawCallback, "user");
                    A.rowIdFn = pa(h.rowId);
                    x(A);
                    w = A.oClasses;
                    h.bJQueryUI ? (a.extend(w, G.ext.oJUIClasses, h.oClasses), h.sDom === B.sDom && "lfrtip" === B.sDom && (A.sDom = '<"H"lfr>t<"F"ip>'), A.renderer) ? a.isPlainObject(A.renderer) && !A.renderer.header && (A.renderer.header = "jqueryui") : A.renderer = "jqueryui" : a.extend(w, G.ext.classes, h.oClasses);
                    z.addClass(w.sTable);
                    A.iInitDisplayStart === k && (A.iInitDisplayStart = h.iDisplayStart, A._iDisplayStart = h.iDisplayStart);
                    null !== h.iDeferLoading && (A.bDeferLoading = !0, r = a.isArray(h.iDeferLoading),
                        A._iRecordsDisplay = r ? h.iDeferLoading[0] : h.iDeferLoading, A._iRecordsTotal = r ? h.iDeferLoading[1] : h.iDeferLoading);
                    var J = A.oLanguage;
                    a.extend(!0, J, h.oLanguage);
                    "" !== J.sUrl && (a.ajax({
                        dataType: "json",
                        url: J.sUrl,
                        success: function(b) {
                            l(b);
                            d(B.oLanguage, b);
                            a.extend(!0, J, b);
                            yb(A)
                        },
                        error: function() {
                            yb(A)
                        }
                    }), T = !0);
                    null === h.asStripeClasses && (A.asStripeClasses = [w.sStripeOdd, w.sStripeEven]);
                    var r = A.asStripeClasses,
                        xa = z.children("tbody").find("tr").eq(0); - 1 !== a.inArray(!0, a.map(r, function(a) {
                            return xa.hasClass(a)
                        })) &&
                        (a("tbody tr", this).removeClass(r.join(" ")), A.asDestroyStripes = r.slice());
                    S = [];
                    r = this.getElementsByTagName("thead");
                    0 !== r.length && (aa(A.aoHeader, r[0]), S = ga(A));
                    if (null === h.aoColumns)
                        for (ia = [], r = 0, t = S.length; r < t; r++) ia.push(null);
                    else ia = h.aoColumns;
                    r = 0;
                    for (t = ia.length; r < t; r++) v(A, S ? S[r] : null);
                    E(A, h.aoColumnDefs, ia, function(a, b) {
                        D(A, a, b)
                    });
                    if (xa.length) {
                        var P = function(a, b) {
                            return null !== a.getAttribute("data-" + b) ? b : null
                        };
                        a(xa[0]).children("th, td").each(function(a, b) {
                            var c = A.aoColumns[a];
                            if (c.mData ===
                                a) {
                                var d = P(b, "sort") || P(b, "order"),
                                    f = P(b, "filter") || P(b, "search");
                                if (null !== d || null !== f) c.mData = {
                                    _: a + ".display",
                                    sort: null !== d ? a + ".@data-" + d : k,
                                    type: null !== d ? a + ".@data-" + d : k,
                                    filter: null !== f ? a + ".@data-" + f : k
                                }, D(A, a)
                            }
                        })
                    }
                    var L = A.oFeatures;
                    h.bStateSave && (L.bStateSave = !0, Za(A, h), Ga(A, "aoDrawCallback", La, "state_save"));
                    if (h.aaSorting === k)
                        for (S = A.aaSorting, r = 0, t = S.length; r < t; r++) S[r][1] = A.aoColumns[r].asSorting[0];
                    tb(A);
                    L.bSort && Ga(A, "aoDrawCallback", function() {
                        if (A.bSorted) {
                            var b = ma(A),
                                c = {};
                            a.each(b, function(a,
                                b) {
                                c[b.src] = b.dir
                            });
                            fa(A, null, "order", [A, b, c]);
                            Lb(A)
                        }
                    });
                    Ga(A, "aoDrawCallback", function() {
                        (A.bSorted || "ssp" === la(A) || L.bDeferRender) && tb(A)
                    }, "sc");
                    r = z.children("caption").each(function() {
                        this._captionSide = z.css("caption-side")
                    });
                    t = z.children("thead");
                    0 === t.length && (t = a("<thead/>").appendTo(this));
                    A.nTHead = t[0];
                    t = z.children("tbody");
                    0 === t.length && (t = a("<tbody/>").appendTo(this));
                    A.nTBody = t[0];
                    t = z.children("tfoot");
                    0 === t.length && 0 < r.length && ("" !== A.oScroll.sX || "" !== A.oScroll.sY) && (t = a("<tfoot/>").appendTo(this));
                    0 === t.length || 0 === t.children().length ? z.addClass(w.sNoFooter) : 0 < t.length && (A.nTFoot = t[0], aa(A.aoFooter, A.nTFoot));
                    if (h.aaData)
                        for (r = 0; r < h.aaData.length; r++) C(A, h.aaData[r]);
                    else(A.bDeferLoading || "dom" == la(A)) && F(A, a(A.nTBody).children("tr"));
                    A.aiDisplay = A.aiDisplayMaster.slice();
                    A.bInitialised = !0;
                    !1 === T && yb(A)
                }
            });
            c = null;
            return this
        };
        var $b = [],
            Ea = Array.prototype,
            Vb = function(b) {
                var c, d, f = G.settings,
                    e = a.map(f, function(a) {
                        return a.nTable
                    });
                if (b) {
                    if (b.nTable && b.oApi) return [b];
                    if (b.nodeName && "table" ===
                        b.nodeName.toLowerCase()) return c = a.inArray(b, e), -1 !== c ? [f[c]] : null;
                    if (b && "function" === typeof b.settings) return b.settings().toArray();
                    "string" === typeof b ? d = a(b) : b instanceof a && (d = b)
                } else return [];
                if (d) return d.map(function() {
                    c = a.inArray(this, e);
                    return -1 !== c ? f[c] : null
                }).toArray()
            };
        Y = function(b, c) {
            if (!(this instanceof Y)) return new Y(b, c);
            var d = [],
                f = function(a) {
                    (a = Vb(a)) && (d = d.concat(a))
                };
            if (a.isArray(b))
                for (var e = 0, h = b.length; e < h; e++) f(b[e]);
            else f(b);
            this.context = ob(d);
            c && a.merge(this, c);
            this.selector = {
                rows: null,
                cols: null,
                opts: null
            };
            Y.extend(this, this, $b)
        };
        G.Api = Y;
        a.extend(Y.prototype, {
            any: function() {
                return 0 !== this.count()
            },
            concat: Ea.concat,
            context: [],
            count: function() {
                return this.flatten().length
            },
            each: function(a) {
                for (var b = 0, c = this.length; b < c; b++) a.call(this, this[b], b, this);
                return this
            },
            eq: function(a) {
                var b = this.context;
                return b.length > a ? new Y(b[a], this[a]) : null
            },
            filter: function(a) {
                var b = [];
                if (Ea.filter) b = Ea.filter.call(this, a, this);
                else
                    for (var c = 0, d = this.length; c < d; c++) a.call(this, this[c],
                        c, this) && b.push(this[c]);
                return new Y(this.context, b)
            },
            flatten: function() {
                var a = [];
                return new Y(this.context, a.concat.apply(a, this.toArray()))
            },
            join: Ea.join,
            indexOf: Ea.indexOf || function(a, b) {
                for (var c = b || 0, d = this.length; c < d; c++)
                    if (this[c] === a) return c;
                return -1
            },
            iterator: function(a, b, c, d) {
                var f = [],
                    e, h, l, m, q, r = this.context,
                    t, v, u = this.selector;
                "string" === typeof a && (d = c, c = b, b = a, a = !1);
                h = 0;
                for (l = r.length; h < l; h++) {
                    var w = new Y(r[h]);
                    if ("table" === b) e = c.call(w, r[h], h), e !== k && f.push(e);
                    else if ("columns" === b ||
                        "rows" === b) e = c.call(w, r[h], this[h], h), e !== k && f.push(e);
                    else if ("column" === b || "column-rows" === b || "row" === b || "cell" === b)
                        for (v = this[h], "column-rows" === b && (t = Qb(r[h], u.opts)), m = 0, q = v.length; m < q; m++) e = v[m], e = "cell" === b ? c.call(w, r[h], e.row, e.column, h, m) : c.call(w, r[h], e, h, m, t), e !== k && f.push(e)
                }
                return f.length || d ? (a = new Y(r, a ? f.concat.apply([], f) : f), b = a.selector, b.rows = u.rows, b.cols = u.cols, b.opts = u.opts, a) : this
            },
            lastIndexOf: Ea.lastIndexOf || function(a, b) {
                return this.indexOf.apply(this.toArray.reverse(), arguments)
            },
            length: 0,
            map: function(a) {
                var b = [];
                if (Ea.map) b = Ea.map.call(this, a, this);
                else
                    for (var c = 0, d = this.length; c < d; c++) b.push(a.call(this, this[c], c));
                return new Y(this.context, b)
            },
            pluck: function(a) {
                return this.map(function(b) {
                    return b[a]
                })
            },
            pop: Ea.pop,
            push: Ea.push,
            reduce: Ea.reduce || function(a, b) {
                return f(this, a, b, 0, this.length, 1)
            },
            reduceRight: Ea.reduceRight || function(a, b) {
                return f(this, a, b, this.length - 1, -1, -1)
            },
            reverse: Ea.reverse,
            selector: null,
            shift: Ea.shift,
            sort: Ea.sort,
            splice: Ea.splice,
            toArray: function() {
                return Ea.slice.call(this)
            },
            to$: function() {
                return a(this)
            },
            toJQuery: function() {
                return a(this)
            },
            unique: function() {
                return new Y(this.context, ob(this))
            },
            unshift: Ea.unshift
        });
        Y.extend = function(b, c, d) {
            if (d.length && c && (c instanceof Y || c.__dt_wrapper)) {
                var f, e, h, l = function(a, b, c) {
                    return function() {
                        var d = b.apply(a, arguments);
                        Y.extend(d, d, c.methodExt);
                        return d
                    }
                };
                f = 0;
                for (e = d.length; f < e; f++) h = d[f], c[h.name] = "function" === typeof h.val ? l(b, h.val, h) : a.isPlainObject(h.val) ? {} : h.val, c[h.name].__dt_wrapper = !0, Y.extend(b, c[h.name], h.propExt)
            }
        };
        Y.register = Q = function(b, c) {
            if (a.isArray(b))
                for (var d = 0, f = b.length; d < f; d++) Y.register(b[d], c);
            else
                for (var e = b.split("."), h = $b, l, k, d = 0, f = e.length; d < f; d++) {
                    l = (k = -1 !== e[d].indexOf("()")) ? e[d].replace("()", "") : e[d];
                    var m;
                    a: {
                        m = 0;
                        for (var q = h.length; m < q; m++)
                            if (h[m].name === l) {
                                m = h[m];
                                break a
                            }
                        m = null
                    }
                    m || (m = {
                        name: l,
                        val: {},
                        methodExt: [],
                        propExt: []
                    }, h.push(m));
                    d === f - 1 ? m.val = c : h = k ? m.methodExt : m.propExt
                }
        };
        Y.registerPlural = ra = function(b, c, d) {
            Y.register(b, d);
            Y.register(c, function() {
                var b = d.apply(this, arguments);
                return b ===
                    this ? this : b instanceof Y ? b.length ? a.isArray(b[0]) ? new Y(b.context, b[0]) : b[0] : k : b
            })
        };
        Q("tables()", function(b) {
            var c;
            if (b) {
                c = Y;
                var d = this.context;
                if ("number" === typeof b) b = [d[b]];
                else {
                    var f = a.map(d, function(a) {
                        return a.nTable
                    });
                    b = a(f).filter(b).map(function() {
                        var b = a.inArray(this, f);
                        return d[b]
                    }).toArray()
                }
                c = new c(b)
            } else c = this;
            return c
        });
        Q("table()", function(a) {
            a = this.tables(a);
            var b = a.context;
            return b.length ? new Y(b[0]) : a
        });
        ra("tables().nodes()", "table().node()", function() {
            return this.iterator("table",
                function(a) {
                    return a.nTable
                }, 1)
        });
        ra("tables().body()", "table().body()", function() {
            return this.iterator("table", function(a) {
                return a.nTBody
            }, 1)
        });
        ra("tables().header()", "table().header()", function() {
            return this.iterator("table", function(a) {
                return a.nTHead
            }, 1)
        });
        ra("tables().footer()", "table().footer()", function() {
            return this.iterator("table", function(a) {
                return a.nTFoot
            }, 1)
        });
        ra("tables().containers()", "table().container()", function() {
            return this.iterator("table", function(a) {
                    return a.nTableWrapper
                },
                1)
        });
        Q("draw()", function(a) {
            return this.iterator("table", function(b) {
                "page" === a ? W(b) : ("string" === typeof a && (a = "full-hold" === a ? !1 : !0), ta(b, !1 === a))
            })
        });
        Q("page()", function(a) {
            return a === k ? this.page.info().page : this.iterator("table", function(b) {
                ya(b, a)
            })
        });
        Q("page.info()", function() {
            if (0 === this.context.length) return k;
            var a = this.context[0],
                b = a._iDisplayStart,
                c = a._iDisplayLength,
                d = a.fnRecordsDisplay(),
                f = -1 === c;
            return {
                page: f ? 0 : Math.floor(b / c),
                pages: f ? 1 : Math.ceil(d / c),
                start: b,
                end: a.fnDisplayEnd(),
                length: c,
                recordsTotal: a.fnRecordsTotal(),
                recordsDisplay: d,
                serverSide: "ssp" === la(a)
            }
        });
        Q("page.len()", function(a) {
            return a === k ? 0 !== this.context.length ? this.context[0]._iDisplayLength : k : this.iterator("table", function(b) {
                N(b, a)
            })
        });
        var Pb = function(a, b, c) {
            if (c) {
                var d = new Y(a);
                d.one("draw", function() {
                    c(d.ajax.json())
                })
            }
            if ("ssp" == la(a)) ta(a, b);
            else {
                Fa(a, !0);
                var f = a.jqXHR;
                f && 4 !== f.readyState && f.abort();
                oa(a, [], function(c) {
                    sa(a);
                    c = Oa(a, c);
                    for (var d = 0, f = c.length; d < f; d++) C(a, c[d]);
                    ta(a, b);
                    Fa(a, !1)
                })
            }
        };
        Q("ajax.json()",
            function() {
                var a = this.context;
                if (0 < a.length) return a[0].json
            });
        Q("ajax.params()", function() {
            var a = this.context;
            if (0 < a.length) return a[0].oAjaxData
        });
        Q("ajax.reload()", function(a, b) {
            return this.iterator("table", function(c) {
                Pb(c, !1 === b, a)
            })
        });
        Q("ajax.url()", function(b) {
            var c = this.context;
            if (b === k) {
                if (0 === c.length) return k;
                c = c[0];
                return c.ajax ? a.isPlainObject(c.ajax) ? c.ajax.url : c.ajax : c.sAjaxSource
            }
            return this.iterator("table", function(c) {
                a.isPlainObject(c.ajax) ? c.ajax.url = b : c.ajax = b
            })
        });
        Q("ajax.url().load()",
            function(a, b) {
                return this.iterator("table", function(c) {
                    Pb(c, !1 === b, a)
                })
            });
        var Wb = function(b, c, d, f, e) {
                var h = [],
                    l, m, q, r, t, v;
                q = typeof c;
                c && "string" !== q && "function" !== q && c.length !== k || (c = [c]);
                q = 0;
                for (r = c.length; q < r; q++)
                    for (m = c[q] && c[q].split ? c[q].split(",") : [c[q]], t = 0, v = m.length; t < v; t++)(l = d("string" === typeof m[t] ? a.trim(m[t]) : m[t])) && l.length && (h = h.concat(l));
                b = ua.selector[b];
                if (b.length)
                    for (q = 0, r = b.length; q < r; q++) h = b[q](f, e, h);
                return ob(h)
            },
            pb = function(b) {
                b || (b = {});
                b.filter && b.search === k && (b.search =
                    b.filter);
                return a.extend({
                    search: "none",
                    order: "current",
                    page: "all"
                }, b)
            },
            fb = function(a) {
                for (var b = 0, c = a.length; b < c; b++)
                    if (0 < a[b].length) return a[0] = a[b], a[0].length = 1, a.length = 1, a.context = [a.context[b]], a;
                a.length = 0;
                return a
            },
            Qb = function(b, c) {
                var d, f, e, h = [],
                    l = b.aiDisplay;
                d = b.aiDisplayMaster;
                var k = c.search;
                f = c.order;
                e = c.page;
                if ("ssp" == la(b)) return "removed" === k ? [] : db(0, d.length);
                if ("current" == e)
                    for (d = b._iDisplayStart, f = b.fnDisplayEnd(); d < f; d++) h.push(l[d]);
                else if ("current" == f || "applied" == f) h = "none" ==
                    k ? d.slice() : "applied" == k ? l.slice() : a.map(d, function(b) {
                        return -1 === a.inArray(b, l) ? b : null
                    });
                else if ("index" == f || "original" == f)
                    for (d = 0, f = b.aoData.length; d < f; d++) "none" == k ? h.push(d) : (e = a.inArray(d, l), (-1 === e && "removed" == k || 0 <= e && "applied" == k) && h.push(d));
                return h
            };
        Q("rows()", function(b, c) {
            b === k ? b = "" : a.isPlainObject(b) && (c = b, b = "");
            c = pb(c);
            var d = this.iterator("table", function(d) {
                var f = c;
                return Wb("row", b, function(b) {
                    var c = Ab(b);
                    if (null !== c && !f) return [c];
                    var e = Qb(d, f);
                    if (null !== c && -1 !== a.inArray(c, e)) return [c];
                    if (!b) return e;
                    if ("function" === typeof b) return a.map(e, function(a) {
                        var c = d.aoData[a];
                        return b(a, c._aData, c.nTr) ? a : null
                    });
                    c = Zb(ub(d.aoData, e, "nTr"));
                    return b.nodeName && -1 !== a.inArray(b, c) ? [b._DT_RowIndex] : "string" === typeof b && "#" === b.charAt(0) && (e = d.aIds[b.replace(/^#/, "")], e !== k) ? [e.idx] : a(c).filter(b).map(function() {
                        return this._DT_RowIndex
                    }).toArray()
                }, d, f)
            }, 1);
            d.selector.rows = b;
            d.selector.opts = c;
            return d
        });
        Q("rows().nodes()", function() {
            return this.iterator("row", function(a, b) {
                return a.aoData[b].nTr ||
                    k
            }, 1)
        });
        Q("rows().data()", function() {
            return this.iterator(!0, "rows", function(a, b) {
                return ub(a.aoData, b, "_aData")
            }, 1)
        });
        ra("rows().cache()", "row().cache()", function(a) {
            return this.iterator("row", function(b, c) {
                var d = b.aoData[c];
                return "search" === a ? d._aFilterData : d._aSortData
            }, 1)
        });
        ra("rows().invalidate()", "row().invalidate()", function(a) {
            return this.iterator("row", function(b, c) {
                R(b, c, a)
            })
        });
        ra("rows().indexes()", "row().index()", function() {
            return this.iterator("row", function(a, b) {
                return b
            }, 1)
        });
        ra("rows().ids()",
            "row().id()",
            function(a) {
                for (var b = [], c = this.context, d = 0, f = c.length; d < f; d++)
                    for (var e = 0, h = this[d].length; e < h; e++) {
                        var l = c[d].rowIdFn(c[d].aoData[this[d][e]]._aData);
                        b.push((!0 === a ? "#" : "") + l)
                    }
                return new Y(c, b)
            });
        ra("rows().remove()", "row().remove()", function() {
            var a = this;
            this.iterator("row", function(b, c, d) {
                var f = b.aoData,
                    e = f[c];
                f.splice(c, 1);
                for (var h = 0, l = f.length; h < l; h++) null !== f[h].nTr && (f[h].nTr._DT_RowIndex = h);
                X(b.aiDisplayMaster, c);
                X(b.aiDisplay, c);
                X(a[d], c, !1);
                mb(b);
                c = b.rowIdFn(e._aData);
                c !==
                    k && delete b.aIds[c]
            });
            this.iterator("table", function(a) {
                for (var b = 0, c = a.aoData.length; b < c; b++) a.aoData[b].idx = b
            });
            return this
        });
        Q("rows.add()", function(b) {
            var c = this.iterator("table", function(a) {
                    var c, d, f, e = [];
                    d = 0;
                    for (f = b.length; d < f; d++) c = b[d], c.nodeName && "TR" === c.nodeName.toUpperCase() ? e.push(F(a, c)[0]) : e.push(C(a, c));
                    return e
                }, 1),
                d = this.rows(-1);
            d.pop();
            a.merge(d, c);
            return d
        });
        Q("row()", function(a, b) {
            return fb(this.rows(a, b))
        });
        Q("row().data()", function(a) {
            var b = this.context;
            if (a === k) return b.length &&
                this.length ? b[0].aoData[this[0]]._aData : k;
            b[0].aoData[this[0]]._aData = a;
            R(b[0], this[0], "data");
            return this
        });
        Q("row().node()", function() {
            var a = this.context;
            return a.length && this.length ? a[0].aoData[this[0]].nTr || null : null
        });
        Q("row.add()", function(b) {
            b instanceof a && b.length && (b = b[0]);
            var c = this.iterator("table", function(a) {
                return b.nodeName && "TR" === b.nodeName.toUpperCase() ? F(a, b)[0] : C(a, b)
            });
            return this.row(c[0])
        });
        var Rb = function(a, b) {
                var c = a.context;
                c.length && (c = c[0].aoData[b !== k ? b : a[0]]) && c._details &&
                    (c._details.remove(), c._detailsShow = k, c._details = k)
            },
            ac = function(a, b) {
                var c = a.context;
                if (c.length && a.length) {
                    var d = c[0].aoData[a[0]];
                    if (d._details) {
                        (d._detailsShow = b) ? d._details.insertAfter(d.nTr): d._details.detach();
                        var f = c[0],
                            e = new Y(f),
                            h = f.aoData;
                        e.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");
                        0 < Ta(h, "_details").length && (e.on("draw.dt.DT_details", function(a, b) {
                                f === b && e.rows({
                                    page: "current"
                                }).eq(0).each(function(a) {
                                    a = h[a];
                                    a._detailsShow && a._details.insertAfter(a.nTr)
                                })
                            }),
                            e.on("column-visibility.dt.DT_details", function(a, b) {
                                if (f === b)
                                    for (var c, d = B(b), e = 0, l = h.length; e < l; e++) c = h[e], c._details && c._details.children("td[colspan]").attr("colspan", d)
                            }), e.on("destroy.dt.DT_details", function(a, b) {
                                if (f === b)
                                    for (var c = 0, d = h.length; c < d; c++) h[c]._details && Rb(e, c)
                            }))
                    }
                }
            };
        Q("row().child()", function(b, c) {
            var d = this.context;
            if (b === k) return d.length && this.length ? d[0].aoData[this[0]]._details : k;
            if (!0 === b) this.child.show();
            else if (!1 === b) Rb(this);
            else if (d.length && this.length) {
                var f = d[0],
                    d = d[0].aoData[this[0]],
                    e = [],
                    h = function(b, c) {
                        if (a.isArray(b) || b instanceof a)
                            for (var d = 0, l = b.length; d < l; d++) h(b[d], c);
                        else b.nodeName && "tr" === b.nodeName.toLowerCase() ? e.push(b) : (d = a("<tr><td/></tr>").addClass(c), a("td", d).addClass(c).html(b)[0].colSpan = B(f), e.push(d[0]))
                    };
                h(b, c);
                d._details && d._details.remove();
                d._details = a(e);
                d._detailsShow && d._details.insertAfter(d.nTr)
            }
            return this
        });
        Q(["row().child.show()", "row().child().show()"], function() {
            ac(this, !0);
            return this
        });
        Q(["row().child.hide()", "row().child().hide()"],
            function() {
                ac(this, !1);
                return this
            });
        Q(["row().child.remove()", "row().child().remove()"], function() {
            Rb(this);
            return this
        });
        Q("row().child.isShown()", function() {
            var a = this.context;
            return a.length && this.length ? a[0].aoData[this[0]]._detailsShow || !1 : !1
        });
        var gc = /^(.+):(name|visIdx|visible)$/,
            bc = function(a, b, c, d, f) {
                c = [];
                d = 0;
                for (var e = f.length; d < e; d++) c.push(J(a, f[d], b));
                return c
            };
        Q("columns()", function(b, c) {
            b === k ? b = "" : a.isPlainObject(b) && (c = b, b = "");
            c = pb(c);
            var d = this.iterator("table", function(d) {
                var f =
                    b,
                    e = c,
                    h = d.aoColumns,
                    l = Ta(h, "sName"),
                    k = Ta(h, "nTh");
                return Wb("column", f, function(b) {
                    var c = Ab(b);
                    if ("" === b) return db(h.length);
                    if (null !== c) return [0 <= c ? c : h.length + c];
                    if ("function" === typeof b) {
                        var f = Qb(d, e);
                        return a.map(h, function(a, c) {
                            return b(c, bc(d, c, 0, 0, f), k[c]) ? c : null
                        })
                    }
                    var m = "string" === typeof b ? b.match(gc) : "";
                    if (m) switch (m[2]) {
                        case "visIdx":
                        case "visible":
                            c = parseInt(m[1], 10);
                            if (0 > c) {
                                var n = a.map(h, function(a, b) {
                                    return a.bVisible ? b : null
                                });
                                return [n[n.length + c]]
                            }
                            return [A(d, c)];
                        case "name":
                            return a.map(l,
                                function(a, b) {
                                    return a === m[1] ? b : null
                                })
                    } else return a(k).filter(b).map(function() {
                        return a.inArray(this, k)
                    }).toArray()
                }, d, e)
            }, 1);
            d.selector.cols = b;
            d.selector.opts = c;
            return d
        });
        ra("columns().header()", "column().header()", function() {
            return this.iterator("column", function(a, b) {
                return a.aoColumns[b].nTh
            }, 1)
        });
        ra("columns().footer()", "column().footer()", function() {
            return this.iterator("column", function(a, b) {
                return a.aoColumns[b].nTf
            }, 1)
        });
        ra("columns().data()", "column().data()", function() {
            return this.iterator("column-rows",
                bc, 1)
        });
        ra("columns().dataSrc()", "column().dataSrc()", function() {
            return this.iterator("column", function(a, b) {
                return a.aoColumns[b].mData
            }, 1)
        });
        ra("columns().cache()", "column().cache()", function(a) {
            return this.iterator("column-rows", function(b, c, d, f, e) {
                return ub(b.aoData, e, "search" === a ? "_aFilterData" : "_aSortData", c)
            }, 1)
        });
        ra("columns().nodes()", "column().nodes()", function() {
            return this.iterator("column-rows", function(a, b, c, d, f) {
                return ub(a.aoData, f, "anCells", b)
            }, 1)
        });
        ra("columns().visible()", "column().visible()",
            function(b, c) {
                return this.iterator("column", function(d, f) {
                    if (b === k) return d.aoColumns[f].bVisible;
                    var e = d.aoColumns,
                        h = e[f],
                        l = d.aoData,
                        m, q, r;
                    if (b !== k && h.bVisible !== b) {
                        if (b) {
                            var t = a.inArray(!0, Ta(e, "bVisible"), f + 1);
                            m = 0;
                            for (q = l.length; m < q; m++) r = l[m].nTr, e = l[m].anCells, r && r.insertBefore(e[f], e[t] || null)
                        } else a(Ta(d.aoData, "anCells", f)).detach();
                        h.bVisible = b;
                        ca(d, d.aoHeader);
                        ca(d, d.aoFooter);
                        if (c === k || c) z(d), (d.oScroll.sX || d.oScroll.sY) && Ya(d);
                        fa(d, null, "column-visibility", [d, f, b]);
                        La(d)
                    }
                })
            });
        ra("columns().indexes()",
            "column().index()",
            function(a) {
                return this.iterator("column", function(b, c) {
                    return "visible" === a ? r(b, c) : c
                }, 1)
            });
        Q("columns.adjust()", function() {
            return this.iterator("table", function(a) {
                z(a)
            }, 1)
        });
        Q("column.index()", function(a, b) {
            if (0 !== this.context.length) {
                var c = this.context[0];
                if ("fromVisible" === a || "toData" === a) return A(c, b);
                if ("fromData" === a || "toVisible" === a) return r(c, b)
            }
        });
        Q("column()", function(a, b) {
            return fb(this.columns(a, b))
        });
        Q("cells()", function(b, c, d) {
            a.isPlainObject(b) && (b.row === k ? (d = b, b =
                null) : (d = c, c = null));
            a.isPlainObject(c) && (d = c, c = null);
            if (null === c || c === k) return this.iterator("table", function(c) {
                var f = b,
                    e = pb(d),
                    h = c.aoData,
                    l = Qb(c, e),
                    m = Zb(ub(h, l, "anCells")),
                    q = a([].concat.apply([], m)),
                    r, t = c.aoColumns.length,
                    v, u, w, x, y, T;
                return Wb("cell", f, function(b) {
                    var d = "function" === typeof b;
                    if (null === b || b === k || d) {
                        v = [];
                        u = 0;
                        for (w = l.length; u < w; u++)
                            for (r = l[u], x = 0; x < t; x++) y = {
                                row: r,
                                column: x
                            }, d ? (T = h[r], b(y, J(c, r, x), T.anCells ? T.anCells[x] : null) && v.push(y)) : v.push(y);
                        return v
                    }
                    return a.isPlainObject(b) ? [b] : q.filter(b).map(function(b, c) {
                        if (c.parentNode) r = c.parentNode._DT_RowIndex;
                        else
                            for (b = 0, w = h.length; b < w; b++)
                                if (-1 !== a.inArray(c, h[b].anCells)) {
                                    r = b;
                                    break
                                } return {
                            row: r,
                            column: a.inArray(c, h[r].anCells)
                        }
                    }).toArray()
                }, c, e)
            });
            var f = this.columns(c, d),
                e = this.rows(b, d),
                h, l, m, q, r, t = this.iterator("table", function(a, b) {
                    h = [];
                    l = 0;
                    for (m = e[b].length; l < m; l++)
                        for (q = 0, r = f[b].length; q < r; q++) h.push({
                            row: e[b][l],
                            column: f[b][q]
                        });
                    return h
                }, 1);
            a.extend(t.selector, {
                cols: c,
                rows: b,
                opts: d
            });
            return t
        });
        ra("cells().nodes()",
            "cell().node()",
            function() {
                return this.iterator("cell", function(a, b, c) {
                    return (a = a.aoData[b].anCells) ? a[c] : k
                }, 1)
            });
        Q("cells().data()", function() {
            return this.iterator("cell", function(a, b, c) {
                return J(a, b, c)
            }, 1)
        });
        ra("cells().cache()", "cell().cache()", function(a) {
            a = "search" === a ? "_aFilterData" : "_aSortData";
            return this.iterator("cell", function(b, c, d) {
                return b.aoData[c][a][d]
            }, 1)
        });
        ra("cells().render()", "cell().render()", function(a) {
            return this.iterator("cell", function(b, c, d) {
                return J(b, c, d, a)
            }, 1)
        });
        ra("cells().indexes()",
            "cell().index()",
            function() {
                return this.iterator("cell", function(a, b, c) {
                    return {
                        row: b,
                        column: c,
                        columnVisible: r(a, c)
                    }
                }, 1)
            });
        ra("cells().invalidate()", "cell().invalidate()", function(a) {
            return this.iterator("cell", function(b, c, d) {
                R(b, c, a, d)
            })
        });
        Q("cell()", function(a, b, c) {
            return fb(this.cells(a, b, c))
        });
        Q("cell().data()", function(a) {
            var b = this.context,
                c = this[0];
            if (a === k) return b.length && c.length ? J(b[0], c[0].row, c[0].column) : k;
            P(b[0], c[0].row, c[0].column, a);
            R(b[0], c[0].row, "data", c[0].column);
            return this
        });
        Q("order()", function(b, c) {
            var d = this.context;
            if (b === k) return 0 !== d.length ? d[0].aaSorting : k;
            "number" === typeof b ? b = [
                [b, c]
            ] : a.isArray(b[0]) || (b = Array.prototype.slice.call(arguments));
            return this.iterator("table", function(a) {
                a.aaSorting = b.slice()
            })
        });
        Q("order.listener()", function(a, b, c) {
            return this.iterator("table", function(d) {
                zb(d, a, b, c)
            })
        });
        Q(["columns().order()", "column().order()"], function(b) {
            var c = this;
            return this.iterator("table", function(d, f) {
                var e = [];
                a.each(c[f], function(a, c) {
                    e.push([c, b])
                });
                d.aaSorting = e
            })
        });
        Q("search()", function(b, c, d, f) {
            var e = this.context;
            return b === k ? 0 !== e.length ? e[0].oPreviousSearch.sSearch : k : this.iterator("table", function(e) {
                e.oFeatures.bFilter && Ma(e, a.extend({}, e.oPreviousSearch, {
                    sSearch: b + "",
                    bRegex: null === c ? !1 : c,
                    bSmart: null === d ? !0 : d,
                    bCaseInsensitive: null === f ? !0 : f
                }), 1)
            })
        });
        ra("columns().search()", "column().search()", function(b, c, d, f) {
            return this.iterator("column", function(e, h) {
                var l = e.aoPreSearchCols;
                if (b === k) return l[h].sSearch;
                e.oFeatures.bFilter && (a.extend(l[h], {
                    sSearch: b + "",
                    bRegex: null === c ? !1 : c,
                    bSmart: null === d ? !0 : d,
                    bCaseInsensitive: null === f ? !0 : f
                }), Ma(e, e.oPreviousSearch, 1))
            })
        });
        Q("state()", function() {
            return this.context.length ? this.context[0].oSavedState : null
        });
        Q("state.clear()", function() {
            return this.iterator("table", function(a) {
                a.fnStateSaveCallback.call(a.oInstance, a, {})
            })
        });
        Q("state.loaded()", function() {
            return this.context.length ? this.context[0].oLoadedState : null
        });
        Q("state.save()", function() {
            return this.iterator("table", function(a) {
                La(a)
            })
        });
        G.versionCheck =
            G.fnVersionCheck = function(a) {
                var b = G.version.split(".");
                a = a.split(".");
                for (var c, d, f = 0, e = a.length; f < e; f++)
                    if (c = parseInt(b[f], 10) || 0, d = parseInt(a[f], 10) || 0, c !== d) return c > d;
                return !0
            };
        G.isDataTable = G.fnIsDataTable = function(b) {
            var c = a(b).get(0),
                d = !1;
            a.each(G.settings, function(b, f) {
                var e = f.nScrollHead ? a("table", f.nScrollHead)[0] : null,
                    h = f.nScrollFoot ? a("table", f.nScrollFoot)[0] : null;
                if (f.nTable === c || e === c || h === c) d = !0
            });
            return d
        };
        G.tables = G.fnTables = function(b) {
            var c = !1;
            a.isPlainObject(b) && (c = b.api, b = b.visible);
            var d = a.map(G.settings, function(c) {
                if (!b || b && a(c.nTable).is(":visible")) return c.nTable
            });
            return c ? new Y(d) : d
        };
        G.util = {
            throttle: Ha,
            escapeRegex: xb
        };
        G.camelToHungarian = d;
        Q("$()", function(b, c) {
            var d = this.rows(c).nodes(),
                d = a(d);
            return a([].concat(d.filter(b).toArray(), d.find(b).toArray()))
        });
        a.each(["on", "one", "off"], function(b, c) {
            Q(c + "()", function() {
                var b = Array.prototype.slice.call(arguments);
                b[0].match(/\.dt\b/) || (b[0] += ".dt");
                var d = a(this.tables().nodes());
                d[c].apply(d, b);
                return this
            })
        });
        Q("clear()",
            function() {
                return this.iterator("table", function(a) {
                    sa(a)
                })
            });
        Q("settings()", function() {
            return new Y(this.context, this.context)
        });
        Q("init()", function() {
            var a = this.context;
            return a.length ? a[0].oInit : null
        });
        Q("data()", function() {
            return this.iterator("table", function(a) {
                return Ta(a.aoData, "_aData")
            }).flatten()
        });
        Q("destroy()", function(b) {
            b = b || !1;
            return this.iterator("table", function(c) {
                var d = c.nTableWrapper.parentNode,
                    f = c.oClasses,
                    h = c.nTable,
                    l = c.nTBody,
                    k = c.nTHead,
                    m = c.nTFoot,
                    q = a(h),
                    l = a(l),
                    r = a(c.nTableWrapper),
                    t = a.map(c.aoData, function(a) {
                        return a.nTr
                    }),
                    v;
                c.bDestroying = !0;
                fa(c, "aoDestroyCallback", "destroy", [c]);
                b || (new Y(c)).columns().visible(!0);
                r.unbind(".DT").find(":not(tbody *)").unbind(".DT");
                a(e).unbind(".DT-" + c.sInstance);
                h != k.parentNode && (q.children("thead").detach(), q.append(k));
                m && h != m.parentNode && (q.children("tfoot").detach(), q.append(m));
                c.aaSorting = [];
                c.aaSortingFixed = [];
                tb(c);
                a(t).removeClass(c.asStripeClasses.join(" "));
                a("th, td", k).removeClass(f.sSortable + " " + f.sSortableAsc + " " + f.sSortableDesc +
                    " " + f.sSortableNone);
                c.bJUI && (a("th span." + f.sSortIcon + ", td span." + f.sSortIcon, k).detach(), a("th, td", k).each(function() {
                    var b = a("div." + f.sSortJUIWrapper, this);
                    a(this).append(b.contents());
                    b.detach()
                }));
                l.children().detach();
                l.append(t);
                k = b ? "remove" : "detach";
                q[k]();
                r[k]();
                !b && d && (d.insertBefore(h, c.nTableReinsertBefore), q.css("width", c.sDestroyWidth).removeClass(f.sTable), (v = c.asDestroyStripes.length) && l.children().each(function(b) {
                    a(this).addClass(c.asDestroyStripes[b % v])
                }));
                d = a.inArray(c, G.settings); -
                1 !== d && G.settings.splice(d, 1)
            })
        });
        a.each(["column", "row", "cell"], function(a, b) {
            Q(b + "s().every()", function(a) {
                return this.iterator(b, function(c, d, f, e, h) {
                    a.call((new Y(c))[b](d, "cell" === b ? f : k), d, f, e, h)
                })
            })
        });
        Q("i18n()", function(b, c, d) {
            var f = this.context[0];
            b = pa(b)(f.oLanguage);
            b === k && (b = c);
            d !== k && a.isPlainObject(b) && (b = b[d] !== k ? b[d] : b._);
            return b.replace("%d", d)
        });
        G.version = "1.10.9";
        G.settings = [];
        G.models = {};
        G.models.oSearch = {
            bCaseInsensitive: !0,
            sSearch: "",
            bRegex: !1,
            bSmart: !0
        };
        G.models.oRow = {
            nTr: null,
            anCells: null,
            _aData: [],
            _aSortData: null,
            _aFilterData: null,
            _sFilterRow: null,
            _sRowStripe: "",
            src: null,
            idx: -1
        };
        G.models.oColumn = {
            idx: null,
            aDataSort: null,
            asSorting: null,
            bSearchable: null,
            bSortable: null,
            bVisible: null,
            _sManualType: null,
            _bAttrSrc: !1,
            fnCreatedCell: null,
            fnGetData: null,
            fnSetData: null,
            mData: null,
            mRender: null,
            nTh: null,
            nTf: null,
            sClass: null,
            sContentPadding: null,
            sDefaultContent: null,
            sName: null,
            sSortDataType: "std",
            sSortingClass: null,
            sSortingClassJUI: null,
            sTitle: null,
            sType: null,
            sWidth: null,
            sWidthOrig: null
        };
        G.defaults = {
            aaData: null,
            aaSorting: [
                [0, "asc"]
            ],
            aaSortingFixed: [],
            ajax: null,
            aLengthMenu: [10, 25, 50, 100],
            aoColumns: null,
            aoColumnDefs: null,
            aoSearchCols: [],
            asStripeClasses: null,
            bAutoWidth: !0,
            bDeferRender: !1,
            bDestroy: !1,
            bFilter: !0,
            bInfo: !0,
            bJQueryUI: !1,
            bLengthChange: !0,
            bPaginate: !0,
            bProcessing: !1,
            bRetrieve: !1,
            bScrollCollapse: !1,
            bServerSide: !1,
            bSort: !0,
            bSortMulti: !0,
            bSortCellsTop: !1,
            bSortClasses: !0,
            bStateSave: !1,
            fnCreatedRow: null,
            fnDrawCallback: null,
            fnFooterCallback: null,
            fnFormatNumber: function(a) {
                return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                    this.oLanguage.sThousands)
            },
            fnHeaderCallback: null,
            fnInfoCallback: null,
            fnInitComplete: null,
            fnPreDrawCallback: null,
            fnRowCallback: null,
            fnServerData: null,
            fnServerParams: null,
            fnStateLoadCallback: function(a) {
                try {
                    return JSON.parse((-1 === a.iStateDuration ? sessionStorage : localStorage).getItem("DataTables_" + a.sInstance + "_" + location.pathname))
                } catch (b) {}
            },
            fnStateLoadParams: null,
            fnStateLoaded: null,
            fnStateSaveCallback: function(a, b) {
                try {
                    (-1 === a.iStateDuration ? sessionStorage : localStorage).setItem("DataTables_" + a.sInstance +
                        "_" + location.pathname, JSON.stringify(b))
                } catch (c) {}
            },
            fnStateSaveParams: null,
            iStateDuration: 7200,
            iDeferLoading: null,
            iDisplayLength: 10,
            iDisplayStart: 0,
            iTabIndex: 0,
            oClasses: {},
            oLanguage: {
                oAria: {
                    sSortAscending: ": activate to sort column ascending",
                    sSortDescending: ": activate to sort column descending"
                },
                oPaginate: {
                    sFirst: "First",
                    sLast: "Last",
                    sNext: "Next",
                    sPrevious: "Previous"
                },
                sEmptyTable: "No data available in table",
                sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
                sInfoEmpty: "Showing 0 to 0 of 0 entries",
                sInfoFiltered: "(filtered from _MAX_ total entries)",
                sInfoPostFix: "",
                sDecimal: "",
                sThousands: ",",
                sLengthMenu: "Show _MENU_ entries",
                sLoadingRecords: "Loading...",
                sProcessing: "Processing...",
                sSearch: "Search:",
                sSearchPlaceholder: "",
                sUrl: "",
                sZeroRecords: "No matching records found"
            },
            oSearch: a.extend({}, G.models.oSearch),
            sAjaxDataProp: "data",
            sAjaxSource: null,
            sDom: "lfrtip",
            searchDelay: null,
            sPaginationType: "simple_numbers",
            sScrollX: "",
            sScrollXInner: "",
            sScrollY: "",
            sServerMethod: "GET",
            renderer: null,
            rowId: "DT_RowId"
        };
        b(G.defaults);
        G.defaults.column = {
            aDataSort: null,
            iDataSort: -1,
            asSorting: ["asc", "desc"],
            bSearchable: !0,
            bSortable: !0,
            bVisible: !0,
            fnCreatedCell: null,
            mData: null,
            mRender: null,
            sCellType: "td",
            sClass: "",
            sContentPadding: "",
            sDefaultContent: null,
            sName: "",
            sSortDataType: "std",
            sTitle: null,
            sType: null,
            sWidth: null
        };
        b(G.defaults.column);
        G.models.oSettings = {
            oFeatures: {
                bAutoWidth: null,
                bDeferRender: null,
                bFilter: null,
                bInfo: null,
                bLengthChange: null,
                bPaginate: null,
                bProcessing: null,
                bServerSide: null,
                bSort: null,
                bSortMulti: null,
                bSortClasses: null,
                bStateSave: null
            },
            oScroll: {
                bCollapse: null,
                iBarWidth: 0,
                sX: null,
                sXInner: null,
                sY: null
            },
            oLanguage: {
                fnInfoCallback: null
            },
            oBrowser: {
                bScrollOversize: !1,
                bScrollbarLeft: !1,
                bBounding: !1,
                barWidth: 0
            },
            ajax: null,
            aanFeatures: [],
            aoData: [],
            aiDisplay: [],
            aiDisplayMaster: [],
            aIds: {},
            aoColumns: [],
            aoHeader: [],
            aoFooter: [],
            oPreviousSearch: {},
            aoPreSearchCols: [],
            aaSorting: null,
            aaSortingFixed: [],
            asStripeClasses: null,
            asDestroyStripes: [],
            sDestroyWidth: 0,
            aoRowCallback: [],
            aoHeaderCallback: [],
            aoFooterCallback: [],
            aoDrawCallback: [],
            aoRowCreatedCallback: [],
            aoPreDrawCallback: [],
            aoInitComplete: [],
            aoStateSaveParams: [],
            aoStateLoadParams: [],
            aoStateLoaded: [],
            sTableId: "",
            nTable: null,
            nTHead: null,
            nTFoot: null,
            nTBody: null,
            nTableWrapper: null,
            bDeferLoading: !1,
            bInitialised: !1,
            aoOpenRows: [],
            sDom: null,
            searchDelay: null,
            sPaginationType: "two_button",
            iStateDuration: 0,
            aoStateSave: [],
            aoStateLoad: [],
            oSavedState: null,
            oLoadedState: null,
            sAjaxSource: null,
            sAjaxDataProp: null,
            bAjaxDataGet: !0,
            jqXHR: null,
            json: k,
            oAjaxData: k,
            fnServerData: null,
            aoServerParams: [],
            sServerMethod: null,
            fnFormatNumber: null,
            aLengthMenu: null,
            iDraw: 0,
            bDrawing: !1,
            iDrawError: -1,
            _iDisplayLength: 10,
            _iDisplayStart: 0,
            _iRecordsTotal: 0,
            _iRecordsDisplay: 0,
            bJUI: null,
            oClasses: {},
            bFiltered: !1,
            bSorted: !1,
            bSortCellsTop: null,
            oInit: null,
            aoDestroyCallback: [],
            fnRecordsTotal: function() {
                return "ssp" == la(this) ? 1 * this._iRecordsTotal : this.aiDisplayMaster.length
            },
            fnRecordsDisplay: function() {
                return "ssp" == la(this) ? 1 * this._iRecordsDisplay : this.aiDisplay.length
            },
            fnDisplayEnd: function() {
                var a =
                    this._iDisplayLength,
                    b = this._iDisplayStart,
                    c = b + a,
                    d = this.aiDisplay.length,
                    f = this.oFeatures,
                    e = f.bPaginate;
                return f.bServerSide ? !1 === e || -1 === a ? b + d : Math.min(b + a, this._iRecordsDisplay) : !e || c > d || -1 === a ? d : c
            },
            oInstance: null,
            sInstance: null,
            iTabIndex: 0,
            nScrollHead: null,
            nScrollFoot: null,
            aLastSort: [],
            oPlugins: {},
            rowIdFn: null,
            rowId: null
        };
        G.ext = ua = {
            buttons: {},
            classes: {},
            errMode: "alert",
            feature: [],
            search: [],
            selector: {
                cell: [],
                column: [],
                row: []
            },
            internal: {},
            legacy: {
                ajax: null
            },
            pager: {},
            renderer: {
                pageButton: {},
                header: {}
            },
            order: {},
            type: {
                detect: [],
                search: {},
                order: {}
            },
            _unique: 0,
            fnVersionCheck: G.fnVersionCheck,
            iApiIndex: 0,
            oJUIClasses: {},
            sVersion: G.version
        };
        a.extend(ua, {
            afnFiltering: ua.search,
            aTypes: ua.type.detect,
            ofnSearch: ua.type.search,
            oSort: ua.type.order,
            afnSortData: ua.order,
            aoFeatures: ua.feature,
            oApi: ua.internal,
            oStdClasses: ua.classes,
            oPagination: ua.pager
        });
        a.extend(G.ext.classes, {
            sTable: "dataTable",
            sNoFooter: "no-footer",
            sPageButton: "paginate_button",
            sPageButtonActive: "current",
            sPageButtonDisabled: "disabled",
            sStripeOdd: "odd",
            sStripeEven: "even",
            sRowEmpty: "dataTables_empty",
            sWrapper: "dataTables_wrapper",
            sFilter: "dataTables_filter",
            sInfo: "dataTables_info",
            sPaging: "dataTables_paginate paging_",
            sLength: "dataTables_length",
            sProcessing: "dataTables_processing",
            sSortAsc: "sorting_asc",
            sSortDesc: "sorting_desc",
            sSortable: "sorting",
            sSortableAsc: "sorting_asc_disabled",
            sSortableDesc: "sorting_desc_disabled",
            sSortableNone: "sorting_disabled",
            sSortColumn: "sorting_",
            sFilterInput: "",
            sLengthSelect: "",
            sScrollWrapper: "dataTables_scroll",
            sScrollHead: "dataTables_scrollHead",
            sScrollHeadInner: "dataTables_scrollHeadInner",
            sScrollBody: "dataTables_scrollBody",
            sScrollFoot: "dataTables_scrollFoot",
            sScrollFootInner: "dataTables_scrollFootInner",
            sHeaderTH: "",
            sFooterTH: "",
            sSortJUIAsc: "",
            sSortJUIDesc: "",
            sSortJUI: "",
            sSortJUIAscAllowed: "",
            sSortJUIDescAllowed: "",
            sSortJUIWrapper: "",
            sSortIcon: "",
            sJUIHeader: "",
            sJUIFooter: ""
        });
        var Jb = "",
            Jb = "",
            Va = Jb + "ui-state-default",
            Bb = Jb + "css_right ui-icon ui-icon-",
            Xb = Jb + "fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";
        a.extend(G.ext.oJUIClasses,
            G.ext.classes, {
                sPageButton: "fg-button ui-button " + Va,
                sPageButtonActive: "ui-state-disabled",
                sPageButtonDisabled: "ui-state-disabled",
                sPaging: "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",
                sSortAsc: Va + " sorting_asc",
                sSortDesc: Va + " sorting_desc",
                sSortable: Va + " sorting",
                sSortableAsc: Va + " sorting_asc_disabled",
                sSortableDesc: Va + " sorting_desc_disabled",
                sSortableNone: Va + " sorting_disabled",
                sSortJUIAsc: Bb + "triangle-1-n",
                sSortJUIDesc: Bb + "triangle-1-s",
                sSortJUI: Bb +
                    "carat-2-n-s",
                sSortJUIAscAllowed: Bb + "carat-1-n",
                sSortJUIDescAllowed: Bb + "carat-1-s",
                sSortJUIWrapper: "DataTables_sort_wrapper",
                sSortIcon: "DataTables_sort_icon",
                sScrollHead: "dataTables_scrollHead " + Va,
                sScrollFoot: "dataTables_scrollFoot " + Va,
                sHeaderTH: Va,
                sFooterTH: Va,
                sJUIHeader: Xb + " ui-corner-tl ui-corner-tr",
                sJUIFooter: Xb + " ui-corner-bl ui-corner-br"
            });
        var hc = G.ext.pager;
        a.extend(hc, {
            simple: function() {
                return ["previous", "next"]
            },
            full: function() {
                return ["first", "previous", "next", "last"]
            },
            numbers: function(a,
                b) {
                return [T(a, b)]
            },
            simple_numbers: function(a, b) {
                return ["previous", T(a, b), "next"]
            },
            full_numbers: function(a, b) {
                return ["first", "previous", T(a, b), "next", "last"]
            },
            _numbers: T,
            numbers_length: 7
        });
        a.extend(!0, G.ext.renderer, {
            pageButton: {
                _: function(b, d, f, e, h, l) {
                    var k = b.oClasses,
                        m = b.oLanguage.oPaginate,
                        q, r, t = 0,
                        v = function(c, d) {
                            var e, u, w, x, T = function(a) {
                                ya(b, a.data.action, !0)
                            };
                            e = 0;
                            for (u = d.length; e < u; e++)
                                if (x = d[e], a.isArray(x)) w = a("<" + (x.DT_el || "div") + "/>").appendTo(c), v(w, x);
                                else {
                                    q = null;
                                    r = "";
                                    switch (x) {
                                        case "ellipsis":
                                            c.append('<span class="ellipsis">&#x2026;</span>');
                                            break;
                                        case "first":
                                            q = m.sFirst;
                                            r = x + (0 < h ? "" : " " + k.sPageButtonDisabled);
                                            break;
                                        case "previous":
                                            q = m.sPrevious;
                                            r = x + (0 < h ? "" : " " + k.sPageButtonDisabled);
                                            break;
                                        case "next":
                                            q = m.sNext;
                                            r = x + (h < l - 1 ? "" : " " + k.sPageButtonDisabled);
                                            break;
                                        case "last":
                                            q = m.sLast;
                                            r = x + (h < l - 1 ? "" : " " + k.sPageButtonDisabled);
                                            break;
                                        default:
                                            q = x + 1, r = h === x ? k.sPageButtonActive : ""
                                    }
                                    null !== q && (w = a("<a>", {
                                            "class": k.sPageButton + " " + r,
                                            "aria-controls": b.sTableId,
                                            "data-dt-idx": t,
                                            tabindex: b.iTabIndex,
                                            id: 0 === f && "string" === typeof x ? b.sTableId + "_" + x : null
                                        }).html(q).appendTo(c),
                                        Fb(w, {
                                            action: x
                                        }, T), t++)
                                }
                        },
                        u;
                    try {
                        u = a(d).find(c.activeElement).data("dt-idx")
                    } catch (w) {}
                    v(a(d).empty(), e);
                    u && a(d).find("[data-dt-idx=" + u + "]").focus()
                }
            }
        });
        a.extend(G.ext.type.detect, [function(a, b) {
            var c = b.oLanguage.sDecimal;
            return Tb(a, c) ? "num" + c : null
        }, function(a) {
            if (!(!a || a instanceof Date || cc.test(a) && dc.test(a))) return null;
            var b = Date.parse(a);
            return null !== b && !isNaN(b) || cb(a) ? "date" : null
        }, function(a, b) {
            var c = b.oLanguage.sDecimal;
            return Tb(a, c, !0) ? "num-fmt" + c : null
        }, function(a, b) {
            var c = b.oLanguage.sDecimal;
            return Ub(a, c) ? "html-num" + c : null
        }, function(a, b) {
            var c = b.oLanguage.sDecimal;
            return Ub(a, c, !0) ? "html-num-fmt" + c : null
        }, function(a) {
            return cb(a) || "string" === typeof a && -1 !== a.indexOf("<") ? "html" : null
        }]);
        a.extend(G.ext.type.search, {
            html: function(a) {
                return cb(a) ? a : "string" === typeof a ? a.replace(Yb, " ").replace(Mb, "") : ""
            },
            string: function(a) {
                return cb(a) ? a : "string" === typeof a ? a.replace(Yb, " ") : a
            }
        });
        var Sb = function(a, b, c, d) {
            if (0 !== a && (!a || "-" === a)) return -Infinity;
            b && (a = Ib(a, b));
            a.replace && (c && (a = a.replace(c,
                "")), d && (a = a.replace(d, "")));
            return 1 * a
        };
        a.extend(ua.type.order, {
            "date-pre": function(a) {
                return Date.parse(a) || 0
            },
            "html-pre": function(a) {
                return cb(a) ? "" : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() : a + ""
            },
            "string-pre": function(a) {
                return cb(a) ? "" : "string" === typeof a ? a.toLowerCase() : a.toString ? a.toString() : ""
            },
            "string-asc": function(a, b) {
                return a < b ? -1 : a > b ? 1 : 0
            },
            "string-desc": function(a, b) {
                return a < b ? 1 : a > b ? -1 : 0
            }
        });
        S("");
        a.extend(!0, G.ext.renderer, {
            header: {
                _: function(b, c, d, f) {
                    a(b.nTable).on("order.dt.DT",
                        function(a, e, h, l) {
                            b === e && (a = d.idx, c.removeClass(d.sSortingClass + " " + f.sSortAsc + " " + f.sSortDesc).addClass("asc" == l[a] ? f.sSortAsc : "desc" == l[a] ? f.sSortDesc : d.sSortingClass))
                        })
                },
                jqueryui: function(b, c, d, f) {
                    a("<div/>").addClass(f.sSortJUIWrapper).append(c.contents()).append(a("<span/>").addClass(f.sSortIcon + " " + d.sSortingClassJUI)).appendTo(c);
                    a(b.nTable).on("order.dt.DT", function(a, e, h, l) {
                        b === e && (a = d.idx, c.removeClass(f.sSortAsc + " " + f.sSortDesc).addClass("asc" == l[a] ? f.sSortAsc : "desc" == l[a] ? f.sSortDesc :
                            d.sSortingClass), c.find("span." + f.sSortIcon).removeClass(f.sSortJUIAsc + " " + f.sSortJUIDesc + " " + f.sSortJUI + " " + f.sSortJUIAscAllowed + " " + f.sSortJUIDescAllowed).addClass("asc" == l[a] ? f.sSortJUIAsc : "desc" == l[a] ? f.sSortJUIDesc : d.sSortingClassJUI))
                    })
                }
            }
        });
        G.render = {
            number: function(a, b, c, d, f) {
                return {
                    display: function(e) {
                        if ("number" !== typeof e && "string" !== typeof e) return e;
                        var h = 0 > e ? "-" : "";
                        e = Math.abs(parseFloat(e));
                        var l = parseInt(e, 10);
                        e = c ? b + (e - l).toFixed(c).substring(2) : "";
                        return h + (d || "") + l.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                            a) + e + (f || "")
                    }
                }
            }
        };
        a.extend(G.ext.internal, {
            _fnExternApiFunc: ia,
            _fnBuildAjax: oa,
            _fnAjaxUpdate: ea,
            _fnAjaxParameters: da,
            _fnAjaxUpdateDraw: hb,
            _fnAjaxDataSrc: Oa,
            _fnAddColumn: v,
            _fnColumnOptions: D,
            _fnAdjustColumnSizing: z,
            _fnVisibleToColumnIndex: A,
            _fnColumnIndexToVisible: r,
            _fnVisbleColumns: B,
            _fnGetColumns: t,
            _fnColumnTypes: w,
            _fnApplyColumnDefs: E,
            _fnHungarianMap: b,
            _fnCamelToHungarian: d,
            _fnLanguageCompat: l,
            _fnBrowserDetect: x,
            _fnAddData: C,
            _fnAddTr: F,
            _fnNodeToDataIndex: function(a, b) {
                return b._DT_RowIndex !== k ? b._DT_RowIndex :
                    null
            },
            _fnNodeToColumnIndex: function(b, c, d) {
                return a.inArray(d, b.aoData[c].anCells)
            },
            _fnGetCellData: J,
            _fnSetCellData: P,
            _fnSplitObjNotation: L,
            _fnGetObjectDataFn: pa,
            _fnSetObjectDataFn: ka,
            _fnGetDataMaster: qa,
            _fnClearTable: sa,
            _fnDeleteIndex: X,
            _fnInvalidate: R,
            _fnGetRowElements: V,
            _fnCreateTr: ba,
            _fnBuildHead: Z,
            _fnDrawHead: ca,
            _fnDraw: W,
            _fnReDraw: ta,
            _fnAddOptionsHtml: wa,
            _fnDetectHeader: aa,
            _fnGetUniqueThs: ga,
            _fnFeatureHtmlFilter: Ba,
            _fnFilterComplete: Ma,
            _fnFilterCustom: qb,
            _fnFilterColumn: Wa,
            _fnFilter: H,
            _fnFilterCreateSearch: h,
            _fnEscapeRegex: xb,
            _fnFilterData: ib,
            _fnFeatureHtmlInfo: jb,
            _fnUpdateInfo: sb,
            _fnInfoMacros: Db,
            _fnInitialise: yb,
            _fnInitComplete: bb,
            _fnLengthChange: N,
            _fnFeatureHtmlLength: Ia,
            _fnFeatureHtmlPaginate: ab,
            _fnPageChange: ya,
            _fnFeatureHtmlProcessing: va,
            _fnProcessingDisplay: Fa,
            _fnFeatureHtmlTable: Xa,
            _fnScrollDraw: Ya,
            _fnApplyToChildren: Ja,
            _fnCalculateColumnWidths: kb,
            _fnThrottle: Ha,
            _fnConvertToWidth: Ka,
            _fnGetWidestNode: lb,
            _fnGetMaxLenString: Pa,
            _fnStringToCss: ha,
            _fnSortFlatten: ma,
            _fnSort: Kb,
            _fnSortAria: Lb,
            _fnSortListener: Eb,
            _fnSortAttachListener: zb,
            _fnSortingClasses: tb,
            _fnSortData: Qa,
            _fnSaveState: La,
            _fnLoadState: Za,
            _fnSettingsFromNode: Sa,
            _fnLog: za,
            _fnMap: Ca,
            _fnBindAction: Fb,
            _fnCallbackReg: Ga,
            _fnCallbackFire: fa,
            _fnLengthOverflow: mb,
            _fnRenderer: nb,
            _fnDataSource: la,
            _fnRowAttributes: O,
            _fnCalculateEnd: function() {}
        });
        a.fn.dataTable = G;
        a.fn.dataTableSettings = G.settings;
        a.fn.dataTableExt = G.ext;
        a.fn.DataTable = function(b) {
            return a(this).dataTable(b).api()
        };
        a.each(G, function(b, c) {
            a.fn.DataTable[b] = c
        });
        return a.fn.dataTable
    };
    "function" ===
    typeof define && define.amd ? define("datatables", ["jquery"], m) : "object" === typeof exports ? module.exports = m(require("jquery")) : jQuery && !jQuery.fn.dataTable && m(jQuery)
})(window, document);
var caretPositionAmp;
jQuery.fn.extend({
    getSelection: function() {
        var e = this.jquery ? this[0] : this,
            c, k, m, a = 0;
        e.onmousedown = function() {
            document.selection && "number" != typeof e.selectionStart ? document.selection.empty() : window.getSelection().removeAllRanges()
        };
        if (document.selection) {
            var b = document.selection.createRange(),
                d = 0,
                l = 0,
                q = 0;
            null != e.value.match(/\n/g) && (a = e.value.match(/\n/g).length);
            if (b.text) {
                m = b.text;
                if ("number" == typeof e.selectionStart) {
                    if (c = e.selectionStart, k = e.selectionEnd, c == k) return {
                        start: c,
                        end: k,
                        text: b.text,
                        length: k -
                            c
                    }
                } else {
                    var u;
                    c = e.createTextRange();
                    k = c.duplicate();
                    m = c.text;
                    c.moveToBookmark(b.getBookmark());
                    u = c.text;
                    k.setEndPoint("EndToStart", c);
                    if (m == u && m != b.text) return this;
                    c = k.text.length;
                    k = k.text.length + b.text.length
                }
                if (0 < a)
                    for (m = 0; m <= a; m++) u = e.value.indexOf("\n", l), -1 != u && u < c ? (l = u + 1, d++, q = d) : -1 != u && u >= c && u <= k ? u == c + 1 ? (d--, q--, l = u + 1) : (l = u + 1, q++) : m = a;
                1 == b.text.indexOf("\n", 0) && (q += 2);
                c -= d;
                k -= q;
                return {
                    start: c,
                    end: k,
                    text: b.text,
                    length: k - c
                }
            }
            e.focus();
            "number" == typeof e.selectionStart ? c = e.selectionStart : (b = document.selection.createRange(),
                c = e.createTextRange(), k = c.duplicate(), c.moveToBookmark(b.getBookmark()), k.setEndPoint("EndToStart", c), c = k.text.length);
            if (0 < a)
                for (m = 0; m <= a; m++) u = e.value.indexOf("\n", l), -1 != u && u < c ? (l = u + 1, d++) : m = a;
            c -= d;
            return {
                start: c,
                end: c,
                text: b.text,
                length: 0
            }
        }
        return "number" == typeof e.selectionStart ? (c = e.selectionStart, k = e.selectionEnd, m = e.value.substring(e.selectionStart, e.selectionEnd), {
            start: c,
            end: k,
            text: m,
            length: k - c
        }) : {
            start: void 0,
            end: void 0,
            text: void 0,
            length: void 0
        }
    },
    replaceSelection: function(e) {
        var c = this.jquery ?
            this[0] : this,
            k, m;
        m = 0;
        var a, b, d = 0,
            l = 0,
            q = void 0 == c.scrollTop ? 0 : c.scrollTop;
        if (document.selection && "number" != typeof c.selectionStart) {
            q = document.selection.createRange();
            if ("number" != typeof c.selectionStart) {
                var u;
                b = c.createTextRange();
                a = b.duplicate();
                k = b.text;
                b.moveToBookmark(q.getBookmark());
                u = b.text;
                a.setEndPoint("EndToStart", b);
                if (k == u && k != q.text) return this
            }
            if (q.text) {
                part = q.text;
                null != c.value.match(/\n/g) && (d = c.value.match(/\n/g).length);
                k = a.text.length;
                if (0 < d)
                    for (u = 0; u <= d; u++) {
                        var x = c.value.indexOf("\n",
                            m); - 1 != x && x < k ? (m = x + 1, l++) : u = d
                    }
                q.text = e;
                caretPositionAmp = a.text.length + e.length;
                b.move("character", caretPositionAmp);
                document.selection.empty();
                c.blur()
            }
        } else "number" == typeof c.selectionStart && c.selectionStart != c.selectionEnd && (k = c.selectionStart, m = c.selectionEnd, c.value = c.value.substr(0, k) + e + c.value.substr(m), m = k + e.length, c.setSelectionRange(m, m), c.scrollTop = q);
        return this
    },
    setSelection: function(e, c) {
        e = parseInt(e);
        c = parseInt(c);
        var k = this.jquery ? this[0] : this;
        k.focus();
        "number" != typeof k.selectionStart &&
            (re = k.createTextRange(), re.text.length < c && (c = re.text.length + 1));
        if (c < e) return this;
        if (document.selection) {
            var m = 0,
                a = 0,
                b = 0,
                d = 0;
            if ("number" != typeof k.selectionStart) re.collapse(!0), re.moveEnd("character", c), re.moveStart("character", e), re.select();
            else if ("number" == typeof k.selectionStart) {
                null != k.value.match(/\n/g) && (m = k.value.match(/\n/g).length);
                if (0 < m)
                    for (var l = 0; l <= m; l++) {
                        var q = k.value.indexOf("\n", b); - 1 != q && q < e ? (b = q + 1, a++, d = a) : -1 != q && q >= e && q <= c ? q == e + 1 ? (a--, d--, b = q + 1) : (b = q + 1, d++) : l = m
                    }
                k.selectionStart =
                    e + a;
                k.selectionEnd = c + d
            }
            return this
        }
        if (k.selectionStart) return k.focus(), k.selectionStart = e, k.selectionEnd = c, this
    },
    insertAtCaretPos: function(e) {
        var c = this.jquery ? this[0] : this,
            k, m, a, b, d, l, q = m = 0,
            u = void 0 == c.scrollTop ? 0 : c.scrollTop;
        c.focus();
        if (document.selection && "number" != typeof c.selectionStart && (null != c.value.match(/\n/g) && (q = c.value.match(/\n/g).length), k = parseInt(caretPositionAmp), 0 < q))
            for (var x = 0; x <= q; x++) {
                var f = c.value.indexOf("\n", a); - 1 != f && f <= k && (a = f + 1, --k, m++)
            }
        caretPositionAmp = parseInt(caretPositionAmp);
        c.onmouseup = function() {
            document.selection && "number" != typeof c.selectionStart && (c.focus(), b = document.selection.createRange(), d = c.createTextRange(), l = d.duplicate(), d.moveToBookmark(b.getBookmark()), l.setEndPoint("EndToStart", d), caretPositionAmp = l.text.length)
        };
        if (document.selection && "number" != typeof c.selectionStart) {
            b = document.selection.createRange();
            if (0 != b.text.length) return this;
            d = c.createTextRange();
            textLength = d.text.length;
            l = d.duplicate();
            d.moveToBookmark(b.getBookmark());
            l.setEndPoint("EndToStart",
                d);
            k = l.text.length;
            0 < caretPositionAmp && 0 == k ? (m = caretPositionAmp - m, d.move("character", m), d.select(), b = document.selection.createRange(), caretPositionAmp += e.length) : 0 <= caretPositionAmp || 0 != textLength ? 0 <= caretPositionAmp || 0 != k ? !(0 <= caretPositionAmp) && 0 < k ? (d.move("character", 0), document.selection.empty(), d.select(), b = document.selection.createRange(), caretPositionAmp = k + e.length) : 0 <= caretPositionAmp && caretPositionAmp == textLength ? (0 != textLength ? (d.move("character", textLength), d.select()) : d.move("character",
                0), b = document.selection.createRange(), caretPositionAmp = e.length + textLength) : (0 <= caretPositionAmp && 0 != k && caretPositionAmp >= k ? (m = caretPositionAmp - k, d.move("character", m)) : 0 <= caretPositionAmp && 0 != k && caretPositionAmp < k && d.move("character", 0), document.selection.empty(), d.select(), b = document.selection.createRange(), caretPositionAmp += e.length) : (d.move("character", textLength), d.select(), b = document.selection.createRange(), caretPositionAmp = e.length + textLength) : (b = document.selection.createRange(), caretPositionAmp =
                e.length + textLength);
            b.text = e;
            c.focus()
        } else "number" == typeof c.selectionStart && c.selectionStart == c.selectionEnd && (a = c.selectionStart + e.length, k = c.selectionStart, m = c.selectionEnd, c.value = c.value.substr(0, k) + e + c.value.substr(m), c.setSelectionRange(a, a), c.scrollTop = u);
        return this
    },
    setCaretPos: function(e) {
        var c = this.jquery ? this[0] : this,
            k, m = 0,
            a = 0,
            b;
        c.focus();
        if (0 == parseInt(e)) return this;
        if (0 < parseInt(e)) {
            if (e = parseInt(e) - 1, document.selection && "number" == typeof c.selectionStart && c.selectionStart == c.selectionEnd &&
                (null != c.value.match(/\n/g) && (m = c.value.match(/\n/g).length), 0 < m))
                for (var d = 0; d <= m; d++) b = c.value.indexOf("\n", k), -1 != b && b <= e && (k = b + 1, e = parseInt(e) + 1)
        } else if (0 > parseInt(e))
            if (e = parseInt(e) + 1, document.selection && "number" != typeof c.selectionStart) {
                if (e = c.value.length + parseInt(e), null != c.value.match(/\n/g) && (m = c.value.match(/\n/g).length), 0 < m) {
                    for (d = 0; d <= m; d++) b = c.value.indexOf("\n", k), -1 != b && b <= e && (k = b + 1, e = parseInt(e) - 1, a += 1);
                    e = e + a - m
                }
            } else if (document.selection && "number" == typeof c.selectionStart) {
            if (e =
                c.value.length + parseInt(e), null != c.value.match(/\n/g) && (m = c.value.match(/\n/g).length), 0 < m)
                for (e = parseInt(e) - m, d = 0; d <= m; d++) b = c.value.indexOf("\n", k), -1 != b && b <= e && (k = b + 1, e = parseInt(e) + 1, a += 1)
        } else e = c.value.length + parseInt(e);
        else return this;
        if (document.selection && "number" != typeof c.selectionStart) {
            k = document.selection.createRange();
            if (0 != k.text) return this;
            c = c.createTextRange();
            c.collapse(!0);
            c.moveEnd("character", e);
            c.moveStart("character", e);
            c.select();
            caretPositionAmp = e
        } else "number" == typeof c.selectionStart &&
            c.selectionStart == c.selectionEnd && c.setSelectionRange(e, e);
        return this
    },
    countCharacters: function(e) {
        e = this.jquery ? this[0] : this;
        return null != e.value.match(/\r/g) ? e.value.length - e.value.match(/\r/g).length : e.value.length
    },
    setMaxLength: function(e, c) {
        this.each(function() {
            var k = this.jquery ? this[0] : this,
                m = k.type,
                a, b;
            0 > parseInt(e) && (e = 1E8);
            "text" == m && (k.maxLength = e);
            if ("textarea" == m || "text" == m) k.onkeypress = function(d) {
                var l = k.value.match(/\r/g);
                b = e;
                null != l && (b = parseInt(b) + l.length);
                d = d || event;
                l = d.keyCode;
                a = document.selection ? 0 < document.selection.createRange().text.length : k.selectionStart != k.selectionEnd;
                if (k.value.length >= b && (47 < l || 32 == l || 0 == l || 13 == l) && !d.ctrlKey && !d.altKey && !a) return k.value = k.value.substring(0, b), "function" == typeof c && c(), !1
            }, k.onkeyup = function() {
                var a = k.value.match(/\r/g),
                    l = 0,
                    m = 0;
                b = e;
                if (null != a) {
                    for (var u = 0; u <= a.length; u++) k.value.indexOf("\n", m) <= parseInt(e) && (l++, m = k.value.indexOf("\n", m) + 1);
                    b = parseInt(e) + l
                }
                if (k.value.length > b) return k.value = k.value.substring(0, b), "function" ==
                    typeof c && c(), this
            };
            else return this
        });
        return this
    }
});
(function(e) {
    e.asuggestKeys = {
        UNKNOWN: 0,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DEL: 46,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        COMMA: 188,
        PAGEUP: 33,
        PAGEDOWN: 34,
        BACKSPACE: 8,
        SPACE: 32
    };
    e.asuggestFocused = null;
    e.fn.asuggest = function(c, k) {
        return this.each(function() {
            e.makeSuggest(this, c, k)
        })
    };
    e.fn.asuggest.defaults = {
        delimiters: "\n ",
        minChunkSize: 1,
        cycleOnTab: !0,
        autoComplete: !0,
        endingSymbols: " ",
        stopSuggestionKeys: [e.asuggestKeys.RETURN, e.asuggestKeys.SPACE]
    };
    e.makeSuggest = function(c, k, m) {
        m = e.extend({}, e.fn.asuggest.defaults,
            m);
        var a = e.asuggestKeys,
            b = e(c);
        b.suggests = k;
        b.options = m;
        b.getChunk = function() {
            var a = this.options.delimiters.split(""),
                b = this.val().substr(0, this.getSelection().start),
                c = -1,
                e;
            for (e in a) {
                var k = b.lastIndexOf(a[e]);
                k > c && (c = k)
            }
            return 0 > c ? b : b.substr(c + 1)
        };
        b.getCompletion = function(a) {
            for (var b = this.getChunk(), c = this.getSelection().text, e = this.suggests, k = !1, f = null, m = 0; m < e.length; m++) {
                var D = e[m];
                if (0 == D.indexOf(b))
                    if (a)
                        if (b + c == D) k = !0;
                        else {
                            if (k) return D.substr(b.length);
                            null == f && (f = D)
                        }
                else return D.substr(b.length)
            }
            return a &&
                f ? f.substr(b.length) : null
        };
        b.updateSelection = function(a) {
            if (a) {
                var c = b.getSelection().start,
                    e = c + a.length;
                "" == b.getSelection().text ? (b.val().length == c && b.setCaretPos(c + 1E4), b.insertAtCaretPos(a)) : b.replaceSelection(a);
                b.setSelection(c, e)
            }
        };
        b.keydown(function(c) {
            if (c.keyCode == a.TAB && b.options.cycleOnTab) return b.getChunk().length >= b.options.minChunkSize && b.updateSelection(b.getCompletion(performCycle = !0)), c.preventDefault(), c.stopPropagation(), b.focus(), e.asuggestFocused = this, !1;
            if (b.getSelection().length &&
                -1 != e.inArray(c.keyCode, b.options.stopSuggestionKeys)) {
                var l = b.getSelection().end + b.options.endingSymbols.length,
                    k = b.getSelection().text + b.options.endingSymbols;
                b.replaceSelection(k);
                b.setSelection(l, l);
                c.preventDefault();
                c.stopPropagation();
                this.focus();
                e.asuggestFocused = this;
                return !1
            }
        });
        b.keyup(function(c) {
            var e = c.altKey || c.metaKey || c.ctrlKey,
                k = e || c.shiftKey;
            switch (c.keyCode) {
                case a.UNKNOWN:
                case a.SHIFT:
                case a.CTRL:
                case a.ALT:
                case a.RETURN:
                    break;
                case a.TAB:
                    if (!k && b.options.cycleOnTab) break;
                case a.ESC:
                case a.BACKSPACE:
                case a.DEL:
                case a.UP:
                case a.DOWN:
                case a.LEFT:
                case a.RIGHT:
                    !k &&
                        b.options.autoComplete && b.replaceSelection("");
                    break;
                default:
                    !e && b.options.autoComplete && b.getChunk().length >= b.options.minChunkSize && b.updateSelection(b.getCompletion(performCycle = !1))
            }
        });
        return b
    }
})(jQuery);
var LZString = function() {
    function e(a, b) {
        if (!k[a]) {
            k[a] = {};
            for (var c = 0; c < a.length; c++) k[a][a.charAt(c)] = c
        }
        return k[a][b]
    }
    var c = String.fromCharCode,
        k = {},
        m = {
            compressToBase64: function(a) {
                if (null == a) return "";
                a = m._compress(a, 6, function(a) {
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)
                });
                switch (a.length % 4) {
                    default:
                        case 0:
                        return a;
                    case 1:
                            return a + "===";
                    case 2:
                            return a + "==";
                    case 3:
                            return a + "="
                }
            },
            decompressFromBase64: function(a) {
                return null == a ? "" : "" == a ? null : m._decompress(a.length,
                    32,
                    function(b) {
                        return e("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a.charAt(b))
                    })
            },
            compressToUTF16: function(a) {
                return null == a ? "" : m._compress(a, 15, function(a) {
                    return c(a + 32)
                }) + " "
            },
            decompressFromUTF16: function(a) {
                return null == a ? "" : "" == a ? null : m._decompress(a.length, 16384, function(b) {
                    return a.charCodeAt(b) - 32
                })
            },
            compressToUint8Array: function(a) {
                a = m.compress(a);
                for (var b = new Uint8Array(2 * a.length), c = 0, e = a.length; e > c; c++) {
                    var k = a.charCodeAt(c);
                    b[2 * c] = k >>> 8;
                    b[2 * c + 1] = k % 256
                }
                return b
            },
            decompressFromUint8Array: function(a) {
                if (null === a || void 0 === a) return m.decompress(a);
                for (var b = Array(a.length / 2), d = 0, e = b.length; e > d; d++) b[d] = 256 * a[2 * d] + a[2 * d + 1];
                var k = [];
                return b.forEach(function(a) {
                    k.push(c(a))
                }), m.decompress(k.join(""))
            },
            compressToEncodedURIComponent: function(a) {
                return null == a ? "" : m._compress(a, 6, function(a) {
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(a)
                })
            },
            decompressFromEncodedURIComponent: function(a) {
                return null == a ? "" : "" == a ? null : (a = a.replace(/ /g,
                    "+"), m._decompress(a.length, 32, function(b) {
                    return e("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", a.charAt(b))
                }))
            },
            compress: function(a) {
                return m._compress(a, 16, function(a) {
                    return c(a)
                })
            },
            _compress: function(a, b, c) {
                if (null == a) return "";
                var e, k, m, x = {},
                    f = {},
                    v = "",
                    D = "",
                    z = "",
                    A = 2,
                    r = 3,
                    B = 2,
                    t = [],
                    w = 0,
                    E = 0;
                for (m = 0; m < a.length; m += 1)
                    if (v = a.charAt(m), Object.prototype.hasOwnProperty.call(x, v) || (x[v] = r++, f[v] = !0), D = z + v, Object.prototype.hasOwnProperty.call(x, D)) z = D;
                    else {
                        if (Object.prototype.hasOwnProperty.call(f,
                                z)) {
                            if (256 > z.charCodeAt(0)) {
                                for (e = 0; B > e; e++) w <<= 1, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++;
                                k = z.charCodeAt(0);
                                for (e = 0; 8 > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1
                            } else {
                                k = 1;
                                for (e = 0; B > e; e++) w = w << 1 | k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k = 0;
                                k = z.charCodeAt(0);
                                for (e = 0; 16 > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1
                            }
                            A--;
                            0 == A && (A = Math.pow(2, B), B++);
                            delete f[z]
                        } else
                            for (k = x[z], e = 0; B > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1;
                        A--;
                        0 == A && (A = Math.pow(2, B), B++);
                        x[D] = r++;
                        z = String(v)
                    }
                if ("" !==
                    z) {
                    if (Object.prototype.hasOwnProperty.call(f, z)) {
                        if (256 > z.charCodeAt(0)) {
                            for (e = 0; B > e; e++) w <<= 1, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++;
                            k = z.charCodeAt(0);
                            for (e = 0; 8 > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1
                        } else {
                            k = 1;
                            for (e = 0; B > e; e++) w = w << 1 | k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k = 0;
                            k = z.charCodeAt(0);
                            for (e = 0; 16 > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1
                        }
                        A--;
                        0 == A && (A = Math.pow(2, B), B++);
                        delete f[z]
                    } else
                        for (k = x[z], e = 0; B > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1;
                    A--;
                    0 ==
                        A && (Math.pow(2, B), B++)
                }
                k = 2;
                for (e = 0; B > e; e++) w = w << 1 | 1 & k, E == b - 1 ? (E = 0, t.push(c(w)), w = 0) : E++, k >>= 1;
                for (;;) {
                    if (w <<= 1, E == b - 1) {
                        t.push(c(w));
                        break
                    }
                    E++
                }
                return t.join("")
            },
            decompress: function(a) {
                return null == a ? "" : "" == a ? null : m._decompress(a.length, 32768, function(b) {
                    return a.charCodeAt(b)
                })
            },
            _decompress: function(a, b, d) {
                var e, k, m, x, f, v, D = [],
                    z = 4,
                    A = 4,
                    r = 3;
                k = "";
                var B = [],
                    t = d(0),
                    w = b,
                    E = 1;
                for (e = 0; 3 > e; e += 1) D[e] = e;
                k = 0;
                x = Math.pow(2, 2);
                for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                switch (k) {
                    case 0:
                        k =
                            0;
                        x = Math.pow(2, 8);
                        for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                        v = c(k);
                        break;
                    case 1:
                        k = 0;
                        x = Math.pow(2, 16);
                        for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                        v = c(k);
                        break;
                    case 2:
                        return ""
                }
                e = D[3] = v;
                for (B.push(v);;) {
                    if (E > a) return "";
                    k = 0;
                    x = Math.pow(2, r);
                    for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                    switch (v = k) {
                        case 0:
                            k = 0;
                            x = Math.pow(2, 8);
                            for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                            D[A++] = c(k);
                            v = A - 1;
                            z--;
                            break;
                        case 1:
                            k = 0;
                            x =
                                Math.pow(2, 16);
                            for (f = 1; f != x;) m = t & w, w >>= 1, 0 == w && (w = b, t = d(E++)), k |= (0 < m ? 1 : 0) * f, f <<= 1;
                            D[A++] = c(k);
                            v = A - 1;
                            z--;
                            break;
                        case 2:
                            return B.join("")
                    }
                    if (0 == z && (z = Math.pow(2, r), r++), D[v]) k = D[v];
                    else {
                        if (v !== A) return null;
                        k = e + e.charAt(0)
                    }
                    B.push(k);
                    D[A++] = e + k.charAt(0);
                    z--;
                    e = k;
                    0 == z && (z = Math.pow(2, r), r++)
                }
            }
        };
    return m
}();
"function" == typeof define && define.amd ? define(function() {
    return LZString
}) : "undefined" != typeof module && null != module && (module.exports = LZString);
! function() {
    var e = {},
        c = null,
        k = !0,
        m = !1;
    try {
        "undefined" != typeof AudioContext ? c = new AudioContext : "undefined" != typeof webkitAudioContext ? c = new webkitAudioContext : k = !1
    } catch (a) {
        k = !1
    }
    if (!k)
        if ("undefined" != typeof Audio) try {
            new Audio
        } catch (b) {
            m = !0
        } else m = !0;
    if (k) {
        var d = "undefined" == typeof c.createGain ? c.createGainNode() : c.createGain();
        d.gain.value = 1;
        d.connect(c.destination)
    }
    var l = function(a) {
        this._volume = 1;
        this._muted = !1;
        this.usingWebAudio = k;
        this.ctx = c;
        this.noAudio = m;
        this._howls = [];
        this._codecs = a;
        this.iOSAutoEnable = !0
    };
    l.prototype = {
        volume: function(a) {
            if (a = parseFloat(a), 0 <= a && 1 >= a) {
                this._volume = a;
                k && (d.gain.value = a);
                for (var b in this._howls)
                    if (this._howls.hasOwnProperty(b) && !1 === this._howls[b]._webAudio)
                        for (a = 0; a < this._howls[b]._audioNode.length; a++) this._howls[b]._audioNode[a].volume = this._howls[b]._volume * this._volume;
                return this
            }
            return k ? d.gain.value : this._volume
        },
        mute: function() {
            return this._setMuted(!0), this
        },
        unmute: function() {
            return this._setMuted(!1), this
        },
        _setMuted: function(a) {
            this._muted = a;
            k && (d.gain.value =
                a ? 0 : this._volume);
            for (var b in this._howls)
                if (this._howls.hasOwnProperty(b) && !1 === this._howls[b]._webAudio)
                    for (var c = 0; c < this._howls[b]._audioNode.length; c++) this._howls[b]._audioNode[c].muted = a
        },
        codecs: function(a) {
            return this._codecs[a]
        },
        _enableiOSAudio: function() {
            var a = this;
            if (!c || !a._iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                a._iOSEnabled = !1;
                var b = function() {
                    var d = c.createBuffer(1, 1, 22050),
                        f = c.createBufferSource();
                    f.buffer = d;
                    f.connect(c.destination);
                    "undefined" == typeof f.start ?
                        f.noteOn(0) : f.start(0);
                    setTimeout(function() {
                        f.playbackState !== f.PLAYING_STATE && f.playbackState !== f.FINISHED_STATE || (a._iOSEnabled = !0, a.iOSAutoEnable = !1, window.removeEventListener("touchend", b, !1))
                    }, 0)
                };
                return window.addEventListener("touchend", b, !1), a
            }
        }
    };
    var q = null,
        u = {};
    m || (q = new Audio, u = {
        mp3: !!q.canPlayType("audio/mpeg;").replace(/^no$/, ""),
        opus: !!q.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
        ogg: !!q.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
        wav: !!q.canPlayType('audio/wav; codecs="1"').replace(/^no$/,
            ""),
        aac: !!q.canPlayType("audio/aac;").replace(/^no$/, ""),
        m4a: !!(q.canPlayType("audio/x-m4a;") || q.canPlayType("audio/m4a;") || q.canPlayType("audio/aac;")).replace(/^no$/, ""),
        mp4: !!(q.canPlayType("audio/x-mp4;") || q.canPlayType("audio/mp4;") || q.canPlayType("audio/aac;")).replace(/^no$/, ""),
        weba: !!q.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
    });
    var x = new l(u),
        f = function(a) {
            this._autoplay = a.autoplay || !1;
            this._buffer = a.buffer || !1;
            this._duration = a.duration || 0;
            this._format = a.format || null;
            this._loop = a.loop || !1;
            this._loaded = !1;
            this._sprite = a.sprite || {};
            this._src = a.src || "";
            this._pos3d = a.pos3d || [0, 0, -.5];
            this._volume = void 0 !== a.volume ? a.volume : 1;
            this._urls = a.urls || [];
            this._rate = a.rate || 1;
            this._model = a.model || null;
            this._onload = [a.onload || function() {}];
            this._onloaderror = [a.onloaderror || function() {}];
            this._onend = [a.onend || function() {}];
            this._onpause = [a.onpause || function() {}];
            this._onplay = [a.onplay || function() {}];
            this._onendTimer = [];
            this._webAudio = k && !this._buffer;
            this._audioNode = [];
            this._webAudio &&
                this._setupAudioNode();
            "undefined" != typeof c && c && x.iOSAutoEnable && x._enableiOSAudio();
            x._howls.push(this);
            this.load()
        };
    if (f.prototype = {
            load: function() {
                var a = this,
                    b = null;
                if (m) return void a.on("loaderror", Error("No audio support."));
                for (var c = 0; c < a._urls.length; c++) {
                    var d, f;
                    if (a._format) d = a._format;
                    else {
                        if (f = a._urls[c], d = /^data:audio\/([^;,]+);/i.exec(f), d || (d = /\.([^.]+)$/.exec(f.split("?", 1)[0])), !d) return void a.on("loaderror", Error("Could not extract format from passed URLs, please add format parameter."));
                        d = d[1].toLowerCase()
                    }
                    if (u[d]) {
                        b = a._urls[c];
                        break
                    }
                }
                if (!b) return void a.on("loaderror", Error("No codec support for selected audio sources."));
                if (a._src = b, a._webAudio) v(a, b);
                else {
                    var e = new Audio;
                    e.addEventListener("error", function() {
                        e.error && 4 === e.error.code && (l.noAudio = !0);
                        a.on("loaderror", {
                            type: e.error ? e.error.code : 0
                        })
                    }, !1);
                    a._audioNode.push(e);
                    e.src = b;
                    e._pos = 0;
                    e.preload = "auto";
                    e.volume = x._muted ? 0 : a._volume * x.volume();
                    var k = function() {
                        a._duration = Math.ceil(10 * e.duration) / 10;
                        0 === Object.getOwnPropertyNames(a._sprite).length &&
                            (a._sprite = {
                                _default: [0, 1E3 * a._duration]
                            });
                        a._loaded || (a._loaded = !0, a.on("load"));
                        a._autoplay && a.play();
                        e.removeEventListener("canplaythrough", k, !1)
                    };
                    e.addEventListener("canplaythrough", k, !1);
                    e.load()
                }
                return a
            },
            urls: function(a) {
                return a ? (this.stop(), this._urls = "string" == typeof a ? [a] : a, this._loaded = !1, this.load(), this) : this._urls
            },
            play: function(a, b) {
                var d = this;
                return "function" == typeof a && (b = a), a && "function" != typeof a || (a = "_default"), d._loaded ? d._sprite[a] ? (d._inactiveNode(function(f) {
                    f._sprite = a;
                    var e =
                        0 < f._pos ? f._pos : d._sprite[a][0] / 1E3,
                        l = 0;
                    d._webAudio ? (l = d._sprite[a][1] / 1E3 - f._pos, 0 < f._pos && (e = d._sprite[a][0] / 1E3 + e)) : l = d._sprite[a][1] / 1E3 - (e - d._sprite[a][0] / 1E3);
                    var k, m = !(!d._loop && !d._sprite[a][2]),
                        q = "string" == typeof b ? b : Math.round(Date.now() * Math.random()) + "";
                    if (function() {
                            k = setTimeout(function() {
                                !d._webAudio && m && d.stop(q).play(a, q);
                                d._webAudio && !m && (d._nodeById(q).paused = !0, d._nodeById(q)._pos = 0, d._clearEndTimer(q));
                                d._webAudio || m || d.stop(q);
                                d.on("end", q)
                            }, l / d._rate * 1E3);
                            d._onendTimer.push({
                                timer: k,
                                id: q
                            })
                        }(), d._webAudio) {
                        var v = d._sprite[a][0] / 1E3,
                            u = d._sprite[a][1] / 1E3;
                        f.id = q;
                        f.paused = !1;
                        A(d, [m, v, u], q);
                        d._playStart = c.currentTime;
                        f.gain.value = d._volume;
                        "undefined" == typeof f.bufferSource.start ? m ? f.bufferSource.noteGrainOn(0, e, 86400) : f.bufferSource.noteGrainOn(0, e, l) : m ? f.bufferSource.start(0, e, 86400) : f.bufferSource.start(0, e, l)
                    } else {
                        if (4 !== f.readyState && (f.readyState || !navigator.isCocoonJS)) return d._clearEndTimer(q),
                            function() {
                                var c = a,
                                    e = b,
                                    l = function() {
                                        d.play(c, e);
                                        f.removeEventListener("canplaythrough",
                                            l, !1)
                                    };
                                f.addEventListener("canplaythrough", l, !1)
                            }(), d;
                        f.readyState = 4;
                        f.id = q;
                        f.currentTime = e;
                        f.muted = x._muted || f.muted;
                        f.volume = d._volume * x.volume();
                        setTimeout(function() {
                            f.play()
                        }, 0)
                    }
                    return d.on("play"), "function" == typeof b && b(q), d
                }), d) : ("function" == typeof b && b(), d) : (d.on("load", function() {
                    d.play(a, b)
                }), d)
            },
            pause: function(a) {
                var b = this;
                if (!b._loaded) return b.on("play", function() {
                    b.pause(a)
                }), b;
                b._clearEndTimer(a);
                var c = a ? b._nodeById(a) : b._activeNode();
                if (c)
                    if (c._pos = b.pos(null, a), b._webAudio) {
                        if (!c.bufferSource ||
                            c.paused) return b;
                        c.paused = !0;
                        "undefined" == typeof c.bufferSource.stop ? c.bufferSource.noteOff(0) : c.bufferSource.stop(0)
                    } else c.pause();
                return b.on("pause"), b
            },
            stop: function(a) {
                var b = this;
                if (!b._loaded) return b.on("play", function() {
                    b.stop(a)
                }), b;
                b._clearEndTimer(a);
                var c = a ? b._nodeById(a) : b._activeNode();
                if (c)
                    if (c._pos = 0, b._webAudio) {
                        if (!c.bufferSource || c.paused) return b;
                        c.paused = !0;
                        "undefined" == typeof c.bufferSource.stop ? c.bufferSource.noteOff(0) : c.bufferSource.stop(0)
                    } else isNaN(c.duration) || (c.pause(),
                        c.currentTime = 0);
                return b
            },
            mute: function(a) {
                var b = this;
                if (!b._loaded) return b.on("play", function() {
                    b.mute(a)
                }), b;
                var c = a ? b._nodeById(a) : b._activeNode();
                return c && (b._webAudio ? c.gain.value = 0 : c.muted = !0), b
            },
            unmute: function(a) {
                var b = this;
                if (!b._loaded) return b.on("play", function() {
                    b.unmute(a)
                }), b;
                var c = a ? b._nodeById(a) : b._activeNode();
                return c && (b._webAudio ? c.gain.value = b._volume : c.muted = !1), b
            },
            volume: function(a, b) {
                var c = this;
                if (a = parseFloat(a), 0 <= a && 1 >= a) {
                    if (c._volume = a, !c._loaded) return c.on("play",
                        function() {
                            c.volume(a, b)
                        }), c;
                    var d = b ? c._nodeById(b) : c._activeNode();
                    return d && (c._webAudio ? d.gain.value = a : d.volume = a * x.volume()), c
                }
                return c._volume
            },
            loop: function(a) {
                return "boolean" == typeof a ? (this._loop = a, this) : this._loop
            },
            sprite: function(a) {
                return "object" == typeof a ? (this._sprite = a, this) : this._sprite
            },
            pos: function(a, b) {
                var d = this;
                if (!d._loaded) return d.on("load", function() {
                    d.pos(a)
                }), "number" == typeof a ? d : d._pos || 0;
                a = parseFloat(a);
                var f = b ? d._nodeById(b) : d._activeNode();
                if (f) return 0 <= a ? (d.pause(b),
                    f._pos = a, d.play(f._sprite, b), d) : d._webAudio ? f._pos + (c.currentTime - d._playStart) : f.currentTime;
                if (0 <= a) return d;
                for (f = 0; f < d._audioNode.length; f++)
                    if (d._audioNode[f].paused && 4 === d._audioNode[f].readyState) return d._webAudio ? d._audioNode[f]._pos : d._audioNode[f].currentTime
            },
            pos3d: function(a, b, c, d) {
                var f = this;
                if (b = "undefined" != typeof b && b ? b : 0, c = "undefined" != typeof c && c ? c : -.5, !f._loaded) return f.on("play", function() {
                    f.pos3d(a, b, c, d)
                }), f;
                if (!(0 <= a || 0 > a)) return f._pos3d;
                if (f._webAudio) {
                    var e = d ? f._nodeById(d) :
                        f._activeNode();
                    e && (f._pos3d = [a, b, c], e.panner.setPosition(a, b, c), e.panner.panningModel = f._model || "HRTF")
                }
                return f
            },
            fade: function(a, b, c, d, f) {
                var e = this,
                    l = Math.abs(a - b),
                    k = a > b ? "down" : "up",
                    l = l / .01,
                    m = c / l;
                if (!e._loaded) return e.on("load", function() {
                    e.fade(a, b, c, d, f)
                }), e;
                e.volume(a, f);
                for (var q = 1; l >= q; q++) ! function() {
                    var a = Math.round(1E3 * (e._volume + ("up" === k ? .01 : -.01) * q)) / 1E3;
                    setTimeout(function() {
                        e.volume(a, f);
                        a === b && d && d()
                    }, m * q)
                }()
            },
            fadeIn: function(a, b, c) {
                return this.volume(0).play().fade(0, a, b, c)
            },
            fadeOut: function(a,
                b, c, d) {
                var f = this;
                return f.fade(f._volume, a, b, function() {
                    c && c();
                    f.pause(d);
                    f.on("end")
                }, d)
            },
            _nodeById: function(a) {
                for (var b = this._audioNode[0], c = 0; c < this._audioNode.length; c++)
                    if (this._audioNode[c].id === a) {
                        b = this._audioNode[c];
                        break
                    }
                return b
            },
            _activeNode: function() {
                for (var a = null, b = 0; b < this._audioNode.length; b++)
                    if (!this._audioNode[b].paused) {
                        a = this._audioNode[b];
                        break
                    }
                return this._drainPool(), a
            },
            _inactiveNode: function(a) {
                for (var b = null, c = 0; c < this._audioNode.length; c++)
                    if (this._audioNode[c].paused &&
                        4 === this._audioNode[c].readyState) {
                        a(this._audioNode[c]);
                        b = !0;
                        break
                    }
                if (this._drainPool(), !b) {
                    var d;
                    if (this._webAudio) d = this._setupAudioNode(), a(d);
                    else {
                        this.load();
                        d = this._audioNode[this._audioNode.length - 1];
                        var f = navigator.isCocoonJS ? "canplaythrough" : "loadedmetadata",
                            e = function() {
                                d.removeEventListener(f, e, !1);
                                a(d)
                            };
                        d.addEventListener(f, e, !1)
                    }
                }
            },
            _drainPool: function() {
                var a, b = 0;
                for (a = 0; a < this._audioNode.length; a++) this._audioNode[a].paused && b++;
                for (a = this._audioNode.length - 1; 0 <= a && !(5 >= b); a--) this._audioNode[a].paused &&
                    (this._webAudio && this._audioNode[a].disconnect(0), b--, this._audioNode.splice(a, 1))
            },
            _clearEndTimer: function(a) {
                for (var b = -1, c = 0; c < this._onendTimer.length; c++)
                    if (this._onendTimer[c].id === a) {
                        b = c;
                        break
                    }(a = this._onendTimer[b]) && (clearTimeout(a.timer), this._onendTimer.splice(b, 1))
            },
            _setupAudioNode: function() {
                var a = this._audioNode,
                    b = this._audioNode.length;
                return a[b] = "undefined" == typeof c.createGain ? c.createGainNode() : c.createGain(), a[b].gain.value = this._volume, a[b].paused = !0, a[b]._pos = 0, a[b].readyState =
                    4, a[b].connect(d), a[b].panner = c.createPanner(), a[b].panner.panningModel = this._model || "equalpower", a[b].panner.setPosition(this._pos3d[0], this._pos3d[1], this._pos3d[2]), a[b].panner.connect(a[b]), a[b]
            },
            on: function(a, b) {
                var c = this["_on" + a];
                if ("function" == typeof b) c.push(b);
                else
                    for (var d = 0; d < c.length; d++) b ? c[d].call(this, b) : c[d].call(this);
                return this
            },
            off: function(a, b) {
                var c = this["_on" + a];
                if (b)
                    for (var d = 0; d < c.length; d++) {
                        if (b === c[d]) {
                            c.splice(d, 1);
                            break
                        }
                    } else this["_on" + a] = [];
                return this
            },
            unload: function() {
                for (var a =
                        this._audioNode, b = 0; b < this._audioNode.length; b++) a[b].paused || (this.stop(a[b].id), this.on("end", a[b].id)), this._webAudio ? a[b].disconnect(0) : a[b].src = "";
                for (b = 0; b < this._onendTimer.length; b++) clearTimeout(this._onendTimer[b].timer);
                a = x._howls.indexOf(this);
                null !== a && 0 <= a && x._howls.splice(a, 1);
                delete e[this._src]
            }
        }, k) var v = function(a, b) {
            if (b in e) return a._duration = e[b].duration, void z(a);
            if (/^data:[^;]+;base64,/.test(b)) {
                for (var c = atob(b.split(",")[1]), d = new Uint8Array(c.length), f = 0; f < c.length; ++f) d[f] =
                    c.charCodeAt(f);
                D(d.buffer, a, b)
            } else {
                var l = new XMLHttpRequest;
                l.open("GET", b, !0);
                l.responseType = "arraybuffer";
                l.onload = function() {
                    D(l.response, a, b)
                };
                l.onerror = function() {
                    a._webAudio && (a._buffer = !0, a._webAudio = !1, a._audioNode = [], delete a._gainNode, delete e[b], a.load())
                };
                try {
                    l.send()
                } catch (k) {
                    l.onerror()
                }
            }
        },
        D = function(a, b, d) {
            c.decodeAudioData(a, function(a) {
                a && (e[d] = a, z(b, a))
            }, function(a) {
                b.on("loaderror", a)
            })
        },
        z = function(a, b) {
            a._duration = b ? b.duration : a._duration;
            0 === Object.getOwnPropertyNames(a._sprite).length &&
                (a._sprite = {
                    _default: [0, 1E3 * a._duration]
                });
            a._loaded || (a._loaded = !0, a.on("load"));
            a._autoplay && a.play()
        },
        A = function(a, b, d) {
            d = a._nodeById(d);
            d.bufferSource = c.createBufferSource();
            d.bufferSource.buffer = e[a._src];
            d.bufferSource.connect(d.panner);
            d.bufferSource.loop = b[0];
            b[0] && (d.bufferSource.loopStart = b[1], d.bufferSource.loopEnd = b[1] + b[2]);
            d.bufferSource.playbackRate.value = a._rate
        };
    "function" == typeof define && define.amd && define(function() {
        return {
            Howler: x,
            Howl: f
        }
    });
    "undefined" != typeof exports && (exports.Howler =
        x, exports.Howl = f);
    "undefined" != typeof window && (window.Howler = x, window.Howl = f)
}();
! function(e, c, k, m) {
    function a(a, b, c) {
        return setTimeout(x(a, c), b)
    }

    function b(a, b, c) {
        return Array.isArray(a) ? (d(a, c[b], c), !0) : !1
    }

    function d(a, b, c) {
        var d;
        if (a)
            if (a.forEach) a.forEach(b, c);
            else if (a.length !== m)
            for (d = 0; d < a.length;) b.call(c, a[d], d, a), d++;
        else
            for (d in a) a.hasOwnProperty(d) && b.call(c, a[d], d, a)
    }

    function l(a, b, c) {
        for (var d = Object.keys(b), f = 0; f < d.length;)(!c || c && a[d[f]] === m) && (a[d[f]] = b[d[f]]), f++;
        return a
    }

    function q(a, b) {
        return l(a, b, !0)
    }

    function u(a, b, c) {
        var d = b.prototype;
        b = a.prototype = Object.create(d);
        b.constructor = a;
        b._super = d;
        c && l(b, c)
    }

    function x(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function f(a, b) {
        return typeof a == xb ? a.apply(b ? b[0] || m : m, b) : a
    }

    function v(a, b, c) {
        d(A(b), function(b) {
            a.addEventListener(b, c, !1)
        })
    }

    function D(a, b, c) {
        d(A(b), function(b) {
            a.removeEventListener(b, c, !1)
        })
    }

    function z(a, b) {
        for (; a;) {
            if (a == b) return !0;
            a = a.parentNode
        }
        return !1
    }

    function A(a) {
        return a.trim().split(/\s+/g)
    }

    function r(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length;) {
            if (c && a[d][c] ==
                b || !c && a[d] === b) return d;
            d++
        }
        return -1
    }

    function B(a) {
        return Array.prototype.slice.call(a, 0)
    }

    function t(a, b, c) {
        for (var d = [], f = [], e = 0; e < a.length;) {
            var h = b ? a[e][b] : a[e];
            0 > r(f, h) && d.push(a[e]);
            f[e] = h;
            e++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()), d
    }

    function w(a, b) {
        for (var c, d, f = b[0].toUpperCase() + b.slice(1), e = 0; e < H.length;) {
            if (c = H[e], d = c ? c + f : b, d in a) return d;
            e++
        }
        return m
    }

    function E(a) {
        a = a.ownerDocument;
        return a.defaultView || a.parentWindow
    }

    function C(a, b) {
        var c = this;
        this.manager =
            a;
        this.callback = b;
        this.element = a.element;
        this.target = a.options.inputTarget;
        this.domHandler = function(b) {
            f(a.options.enable, [a]) && c.handler(b)
        };
        this.init()
    }

    function F(a) {
        var b = a.options.inputClass;
        return new(b ? b : yb ? X : bb ? V : Db ? O : sa)(a, J)
    }

    function J(a, b, c) {
        var d = c.pointers.length,
            f = c.changedPointers.length,
            e = b & Ia && 0 === d - f,
            d = b & (ya | va) && 0 === d - f;
        c.isFirst = !!e;
        c.isFinal = !!d;
        e && (a.session = {});
        c.eventType = b;
        b = a.session;
        e = c.pointers;
        d = e.length;
        b.firstInput || (b.firstInput = P(c));
        1 < d && !b.firstMultiple ? b.firstMultiple =
            P(c) : 1 === d && (b.firstMultiple = !1);
        var f = b.firstInput,
            h = (d = b.firstMultiple) ? d.center : f.center,
            l = c.center = L(e);
        c.timeStamp = Cb();
        c.deltaTime = c.timeStamp - f.timeStamp;
        c.angle = qa(h, l);
        c.distance = ka(h, l);
        var f = c.center,
            h = b.offsetDelta || {},
            l = b.prevDelta || {},
            k = b.prevInput || {};
        (c.eventType === Ia || k.eventType === ya) && (l = b.prevDelta = {
            x: k.deltaX || 0,
            y: k.deltaY || 0
        }, h = b.offsetDelta = {
            x: f.x,
            y: f.y
        });
        c.deltaX = l.x + (f.x - h.x);
        c.deltaY = l.y + (f.y - h.y);
        c.offsetDirection = pa(c.deltaX, c.deltaY);
        d ? (f = d.pointers, f = ka(e[0], e[1], Pa) /
            ka(f[0], f[1], Pa)) : f = 1;
        c.scale = f;
        d ? (d = d.pointers, e = qa(e[1], e[0], Pa) - qa(d[1], d[0], Pa)) : e = 0;
        c.rotation = e;
        h = b.lastInterval || c;
        e = c.timeStamp - h.timeStamp;
        c.eventType != va && (e > N || h.velocity === m) ? (f = h.deltaX - c.deltaX, h = h.deltaY - c.deltaY, l = f / e || 0, k = h / e || 0, e = l, d = k, l = rb(l) > rb(k) ? l : k, f = pa(f, h), b.lastInterval = c) : (l = h.velocity, e = h.velocityX, d = h.velocityY, f = h.direction);
        c.velocity = l;
        c.velocityX = e;
        c.velocityY = d;
        c.direction = f;
        b = a.element;
        z(c.srcEvent.target, b) && (b = c.srcEvent.target);
        c.target = b;
        a.emit("hammer.input",
            c);
        a.recognize(c);
        a.session.prevInput = c
    }

    function P(a) {
        for (var b = [], c = 0; c < a.pointers.length;) b[c] = {
            clientX: ib(a.pointers[c].clientX),
            clientY: ib(a.pointers[c].clientY)
        }, c++;
        return {
            timeStamp: Cb(),
            pointers: b,
            center: L(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }

    function L(a) {
        var b = a.length;
        if (1 === b) return {
            x: ib(a[0].clientX),
            y: ib(a[0].clientY)
        };
        for (var c = 0, d = 0, f = 0; b > f;) c += a[f].clientX, d += a[f].clientY, f++;
        return {
            x: ib(c / b),
            y: ib(d / b)
        }
    }

    function pa(a, b) {
        return a === b ? Fa : rb(a) >= rb(b) ? 0 < a ? Xa : Ya : 0 < b ? Ja : kb
    }

    function ka(a,
        b, c) {
        c || (c = lb);
        var d = b[c[0]] - a[c[0]];
        a = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + a * a)
    }

    function qa(a, b, c) {
        c || (c = lb);
        return 180 * Math.atan2(b[c[1]] - a[c[1]], b[c[0]] - a[c[0]]) / Math.PI
    }

    function sa() {
        this.evEl = ma;
        this.evWin = Kb;
        this.allow = !0;
        this.pressed = !1;
        C.apply(this, arguments)
    }

    function X() {
        this.evEl = zb;
        this.evWin = tb;
        C.apply(this, arguments);
        this.store = this.manager.session.pointerEvents = []
    }

    function R() {
        this.evTarget = La;
        this.evWin = Za;
        this.started = !1;
        C.apply(this, arguments)
    }

    function V() {
        this.evTarget = za;
        this.targetIds = {};
        C.apply(this, arguments)
    }

    function ba(a, b) {
        var c = B(a.touches),
            d = this.targetIds;
        if (b & (Ia | ab) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
        var f, e = B(a.changedTouches),
            h = [],
            l = this.target;
        if (f = c.filter(function(a) {
                return z(a.target, l)
            }), b === Ia)
            for (c = 0; c < f.length;) d[f[c].identifier] = !0, c++;
        for (c = 0; c < e.length;) d[e[c].identifier] && h.push(e[c]), b & (ya | va) && delete d[e[c].identifier], c++;
        return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0
    }

    function O() {
        C.apply(this, arguments);
        var a = x(this.handler,
            this);
        this.touch = new V(this.manager, a);
        this.mouse = new sa(this.manager, a)
    }

    function Z(a, b) {
        this.manager = a;
        this.set(b)
    }

    function ca(a) {
        if (-1 < a.indexOf(fa)) return fa;
        var b = -1 < a.indexOf(mb),
            c = -1 < a.indexOf(nb);
        return b && c ? mb + " " + nb : b || c ? b ? mb : nb : -1 < a.indexOf(Ga) ? Ga : Fb
    }

    function W(a) {
        this.id = jb++;
        this.manager = null;
        this.options = q(a || {}, this.defaults);
        a = this.options.enable;
        this.options.enable = a === m ? !0 : a;
        this.state = la;
        this.simultaneous = {};
        this.requireFail = []
    }

    function ta(a) {
        return a == kb ? "down" : a == Ja ? "up" : a == Xa ?
            "left" : a == Ya ? "right" : ""
    }

    function wa(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }

    function aa() {
        W.apply(this, arguments)
    }

    function ga() {
        aa.apply(this, arguments);
        this.pY = this.pX = null
    }

    function oa() {
        aa.apply(this, arguments)
    }

    function ea() {
        W.apply(this, arguments);
        this._input = this._timer = null
    }

    function da() {
        aa.apply(this, arguments)
    }

    function hb() {
        aa.apply(this, arguments)
    }

    function Oa() {
        W.apply(this, arguments);
        this.pCenter = this.pTime = !1;
        this._input = this._timer = null;
        this.count = 0
    }

    function Ba(a, b) {
        b = b || {};
        var c = b.recognizers;
        return b.recognizers = c === m ? Ba.defaults.preset : c, new Ma(a, b)
    }

    function Ma(a, b) {
        b = b || {};
        this.options = q(b, Ba.defaults);
        this.options.inputTarget = this.options.inputTarget || a;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.element = a;
        this.input = F(this);
        this.touchAction = new Z(this, this.options.touchAction);
        qb(this, !0);
        d(b.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]);
            a[3] && b.requireFailure(a[3])
        }, this)
    }

    function qb(a, b) {
        var c = a.element;
        d(a.options.cssProps, function(a,
            d) {
            c.style[w(c.style, d)] = b ? a : ""
        })
    }

    function Wa(a, b) {
        var d = c.createEvent("Event");
        d.initEvent(a, !0, !0);
        d.gesture = b;
        b.target.dispatchEvent(d)
    }
    var H = " webkit moz MS ms o".split(" "),
        h = c.createElement("div"),
        xb = "function",
        ib = Math.round,
        rb = Math.abs,
        Cb = Date.now,
        jb = 1,
        sb = /mobile|tablet|ip(ad|hone|od)|android/i,
        Db = "ontouchstart" in e,
        yb = w(e, "PointerEvent") !== m,
        bb = Db && sb.test(navigator.userAgent),
        N = 25,
        Ia = 1,
        ab = 2,
        ya = 4,
        va = 8,
        Fa = 1,
        Xa = 2,
        Ya = 4,
        Ja = 8,
        kb = 16,
        Ha = Xa | Ya,
        Ka = Ja | kb,
        sb = Ha | Ka,
        lb = ["x", "y"],
        Pa = ["clientX", "clientY"];
    C.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && v(this.element, this.evEl, this.domHandler);
            this.evTarget && v(this.target, this.evTarget, this.domHandler);
            this.evWin && v(E(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && D(this.element, this.evEl, this.domHandler);
            this.evTarget && D(this.target, this.evTarget, this.domHandler);
            this.evWin && D(E(this.element), this.evWin, this.domHandler)
        }
    };
    var ha = {
            mousedown: Ia,
            mousemove: ab,
            mouseup: ya
        },
        ma = "mousedown",
        Kb = "mousemove mouseup";
    u(sa,
        C, {
            handler: function(a) {
                var b = ha[a.type];
                b & Ia && 0 === a.button && (this.pressed = !0);
                b & ab && 1 !== a.which && (b = ya);
                this.pressed && this.allow && (b & ya && (this.pressed = !1), this.callback(this.manager, b, {
                    pointers: [a],
                    changedPointers: [a],
                    pointerType: "mouse",
                    srcEvent: a
                }))
            }
        });
    var Lb = {
            pointerdown: Ia,
            pointermove: ab,
            pointerup: ya,
            pointercancel: va,
            pointerout: va
        },
        Eb = {
            2: "touch",
            3: "pen",
            4: "mouse",
            5: "kinect"
        },
        zb = "pointerdown",
        tb = "pointermove pointerup pointercancel";
    e.MSPointerEvent && (zb = "MSPointerDown", tb = "MSPointerMove MSPointerUp MSPointerCancel");
    u(X, C, {
        handler: function(a) {
            var b = this.store,
                c = !1,
                d = a.type.toLowerCase().replace("ms", ""),
                d = Lb[d],
                f = Eb[a.pointerType] || a.pointerType,
                e = "touch" == f,
                h = r(b, a.pointerId, "pointerId");
            d & Ia && (0 === a.button || e) ? 0 > h && (b.push(a), h = b.length - 1) : d & (ya | va) && (c = !0);
            0 > h || (b[h] = a, this.callback(this.manager, d, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }), c && b.splice(h, 1))
        }
    });
    var Qa = {
            touchstart: Ia,
            touchmove: ab,
            touchend: ya,
            touchcancel: va
        },
        La = "touchstart",
        Za = "touchstart touchmove touchend touchcancel";
    u(R, C, {
        handler: function(a) {
            var b = Qa[a.type];
            if (b === Ia && (this.started = !0), this.started) {
                var c, d = B(a.touches);
                c = B(a.changedTouches);
                c = (b & (ya | va) && (d = t(d.concat(c), "identifier", !0)), [d, c]);
                b & (ya | va) && 0 === c[0].length - c[1].length && (this.started = !1);
                this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: "touch",
                    srcEvent: a
                })
            }
        }
    });
    var Sa = {
            touchstart: Ia,
            touchmove: ab,
            touchend: ya,
            touchcancel: va
        },
        za = "touchstart touchmove touchend touchcancel";
    u(V, C, {
        handler: function(a) {
            var b = Sa[a.type],
                c = ba.call(this,
                    a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: "touch",
                srcEvent: a
            })
        }
    });
    u(O, C, {
        handler: function(a, b, c) {
            var d = "mouse" == c.pointerType;
            if ("touch" == c.pointerType) this.mouse.allow = !1;
            else if (d && !this.mouse.allow) return;
            b & (ya | va) && (this.mouse.allow = !0);
            this.callback(a, b, c)
        },
        destroy: function() {
            this.touch.destroy();
            this.mouse.destroy()
        }
    });
    var Ca = w(h.style, "touchAction"),
        Gb = Ca !== m,
        Fb = "auto",
        Ga = "manipulation",
        fa = "none",
        mb = "pan-x",
        nb = "pan-y";
    Z.prototype = {
        set: function(a) {
            "compute" ==
            a && (a = this.compute());
            Gb && (this.manager.element.style[Ca] = a);
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return d(this.manager.recognizers, function(b) {
                f(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }), ca(a.join(" "))
        },
        preventDefaults: function(a) {
            if (!Gb) {
                var b = a.srcEvent;
                a = a.offsetDirection;
                if (this.manager.session.prevented) return void b.preventDefault();
                var c = this.actions,
                    d = -1 < c.indexOf(fa),
                    f = -1 < c.indexOf(nb),
                    c = -1 < c.indexOf(mb);
                return d || f && a & Ha || c && a & Ka ? this.preventSrc(b) : void 0
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0;
            a.preventDefault()
        }
    };
    var la = 1;
    W.prototype = {
        defaults: {},
        set: function(a) {
            return l(this.options, a), this.manager && this.manager.touchAction.update(), this
        },
        recognizeWith: function(a) {
            if (b(a, "recognizeWith", this)) return this;
            var c = this.simultaneous;
            return a = wa(a, this), c[a.id] || (c[a.id] = a, a.recognizeWith(this)), this
        },
        dropRecognizeWith: function(a) {
            return b(a, "dropRecognizeWith",
                this) ? this : (a = wa(a, this), delete this.simultaneous[a.id], this)
        },
        requireFailure: function(a) {
            if (b(a, "requireFailure", this)) return this;
            var c = this.requireFail;
            return a = wa(a, this), -1 === r(c, a) && (c.push(a), a.requireFailure(this)), this
        },
        dropRequireFailure: function(a) {
            if (b(a, "dropRequireFailure", this)) return this;
            a = wa(a, this);
            a = r(this.requireFail, a);
            return -1 < a && this.requireFail.splice(a, 1), this
        },
        hasRequireFailures: function() {
            return 0 < this.requireFail.length
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(f) {
                c.manager.emit(c.options.event + (f ? d & 16 ? "cancel" : d & 8 ? "end" : d & 4 ? "move" : d & 2 ? "start" : "" : ""), a)
            }
            var c = this,
                d = this.state;
            8 > d && b(!0);
            b();
            8 <= d && b(!0)
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void(this.state = 32)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length;) {
                if (!(this.requireFail[a].state & (32 | la))) return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            a = l({}, a);
            return f(this.options.enable, [this, a]) ? (this.state & 56 && (this.state = la), this.state = this.process(a),
                void(this.state & 30 && this.tryEmit(a))) : (this.reset(), void(this.state = 32))
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    };
    u(aa, W, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
                c = a.eventType,
                d = b & 6;
            a = this.attrTest(a);
            return d && (c & va || !a) ? b | 16 : d || a ? c & ya ? b | 8 : b & 2 ? b | 4 : 2 : 32
        }
    });
    u(ga, aa, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: sb
        },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            return a & Ha && b.push(nb), a & Ka && b.push(mb), b
        },
        directionTest: function(a) {
            var b = this.options,
                c = !0,
                d = a.distance,
                f = a.direction,
                e = a.deltaX,
                h = a.deltaY;
            return f & b.direction || (b.direction & Ha ? (f = 0 === e ? Fa : 0 > e ? Xa : Ya, c = e != this.pX, d = Math.abs(a.deltaX)) : (f = 0 === h ? Fa : 0 > h ? Ja : kb, c = h != this.pY, d = Math.abs(a.deltaY))), a.direction = f, c && d > b.threshold && f & b.direction
        },
        attrTest: function(a) {
            return aa.prototype.attrTest.call(this, a) && (this.state & 2 || !(this.state & 2) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX;
            this.pY = a.deltaY;
            var b = ta(a.direction);
            b && this.manager.emit(this.options.event + b, a);
            this._super.emit.call(this, a)
        }
    });
    u(oa, aa, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [fa]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & 2)
        },
        emit: function(a) {
            (this._super.emit.call(this, a), 1 !== a.scale) && this.manager.emit(this.options.event + (1 > a.scale ? "in" : "out"), a)
        }
    });
    u(ea, W, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return [Fb]
        },
        process: function(b) {
            var c = this.options,
                d = b.pointers.length === c.pointers,
                f = b.distance < c.threshold,
                e = b.deltaTime > c.time;
            if (this._input = b, !f || !d || b.eventType & (ya | va) && !e) this.reset();
            else if (b.eventType & Ia) this.reset(), this._timer = a(function() {
                this.state = 8;
                this.tryEmit()
            }, c.time, this);
            else if (b.eventType & ya) return 8;
            return 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            8 === this.state && (a && a.eventType & ya ? this.manager.emit(this.options.event +
                "up", a) : (this._input.timeStamp = Cb(), this.manager.emit(this.options.event, this._input)))
        }
    });
    u(da, aa, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [fa]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & 2)
        }
    });
    u(hb, aa, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .65,
            direction: Ha | Ka,
            pointers: 1
        },
        getTouchAction: function() {
            return ga.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c =
                this.options.direction;
            return c & (Ha | Ka) ? b = a.velocity : c & Ha ? b = a.velocityX : c & Ka && (b = a.velocityY), this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && rb(b) > this.options.velocity && a.eventType & ya
        },
        emit: function(a) {
            var b = ta(a.direction);
            b && this.manager.emit(this.options.event + b, a);
            this.manager.emit(this.options.event, a)
        }
    });
    u(Oa, W, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [Ga]
        },
        process: function(b) {
            var c =
                this.options,
                d = b.pointers.length === c.pointers,
                f = b.distance < c.threshold,
                e = b.deltaTime < c.time;
            if (this.reset(), b.eventType & Ia && 0 === this.count) return this.failTimeout();
            if (f && e && d) {
                if (b.eventType != ya) return this.failTimeout();
                d = this.pTime ? b.timeStamp - this.pTime < c.interval : !0;
                f = !this.pCenter || ka(this.pCenter, b.center) < c.posThreshold;
                this.pTime = b.timeStamp;
                this.pCenter = b.center;
                f && d ? this.count += 1 : this.count = 1;
                this._input = b;
                if (0 === this.count % c.taps) return this.hasRequireFailures() ? (this._timer = a(function() {
                    this.state =
                        8;
                    this.tryEmit()
                }, c.interval, this), 2) : 8
            }
            return 32
        },
        failTimeout: function() {
            return this._timer = a(function() {
                this.state = 32
            }, this.options.interval, this), 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            8 == this.state && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    });
    Ba.VERSION = "2.0.4";
    Ba.defaults = {
        domEvents: !1,
        touchAction: "compute",
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [da, {
                enable: !1
            }],
            [oa, {
                    enable: !1
                },
                ["rotate"]
            ],
            [hb, {
                direction: Ha
            }],
            [ga,
                {
                    direction: Ha
                },
                ["swipe"]
            ],
            [Oa],
            [Oa, {
                    event: "doubletap",
                    taps: 2
                },
                ["tap"]
            ],
            [ea]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    Ma.prototype = {
        set: function(a) {
            return l(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
        },
        stop: function(a) {
            this.session.stopped = a ? 2 : 1
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers,
                    f = b.curRecognizer;
                (!f || f && f.state & 8) && (f = b.curRecognizer = null);
                for (var e = 0; e < d.length;) c = d[e], 2 === b.stopped || f && c != f && !c.canRecognizeWith(f) ? c.reset() : c.recognize(a), !f && c.state & 14 && (f = b.curRecognizer = c), e++
            }
        },
        get: function(a) {
            if (a instanceof W) return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++)
                if (b[c].options.event == a) return b[c];
            return null
        },
        add: function(a) {
            if (b(a, "add", this)) return this;
            var c = this.get(a.options.event);
            return c && this.remove(c), this.recognizers.push(a),
                a.manager = this, this.touchAction.update(), a
        },
        remove: function(a) {
            if (b(a, "remove", this)) return this;
            var c = this.recognizers;
            return a = this.get(a), c.splice(r(c, a), 1), this.touchAction.update(), this
        },
        on: function(a, b) {
            var c = this.handlers;
            return d(A(a), function(a) {
                c[a] = c[a] || [];
                c[a].push(b)
            }), this
        },
        off: function(a, b) {
            var c = this.handlers;
            return d(A(a), function(a) {
                b ? c[a].splice(r(c[a], b), 1) : delete c[a]
            }), this
        },
        emit: function(a, b) {
            this.options.domEvents && Wa(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a;
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                };
                for (var d = 0; d < c.length;) c[d](b), d++
            }
        },
        destroy: function() {
            this.element && qb(this, !1);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null
        }
    };
    l(Ba, {
        INPUT_START: Ia,
        INPUT_MOVE: ab,
        INPUT_END: ya,
        INPUT_CANCEL: va,
        STATE_POSSIBLE: la,
        STATE_BEGAN: 2,
        STATE_CHANGED: 4,
        STATE_ENDED: 8,
        STATE_RECOGNIZED: 8,
        STATE_CANCELLED: 16,
        STATE_FAILED: 32,
        DIRECTION_NONE: Fa,
        DIRECTION_LEFT: Xa,
        DIRECTION_RIGHT: Ya,
        DIRECTION_UP: Ja,
        DIRECTION_DOWN: kb,
        DIRECTION_HORIZONTAL: Ha,
        DIRECTION_VERTICAL: Ka,
        DIRECTION_ALL: sb,
        Manager: Ma,
        Input: C,
        TouchAction: Z,
        TouchInput: V,
        MouseInput: sa,
        PointerEventInput: X,
        TouchMouseInput: O,
        SingleTouchInput: R,
        Recognizer: W,
        AttrRecognizer: aa,
        Tap: Oa,
        Pan: ga,
        Swipe: hb,
        Pinch: oa,
        Rotate: da,
        Press: ea,
        on: v,
        off: D,
        each: d,
        merge: q,
        extend: l,
        inherit: u,
        bindFn: x,
        prefixed: w
    });
    typeof define == xb && define.amd ? define(function() {
        return Ba
    }) : "undefined" != typeof module && module.exports ? module.exports = Ba : e[k] = Ba
}(window, document, "Hammer");
! function(e, c) {
    "object" == typeof exports && "object" == typeof module ? module.exports = c() : "function" == typeof define && define.amd ? define("sheetrock", [], c) : "object" == typeof exports ? exports.sheetrock = c() : e.sheetrock = c()
}(this, function() {
    return function(e) {
        function c(m) {
            if (k[m]) return k[m].exports;
            var a = k[m] = {
                exports: {},
                id: m,
                loaded: !1
            };
            return e[m].call(a.exports, a, a.exports, c), a.loaded = !0, a.exports
        }
        var k = {};
        return c.m = e, c.c = k, c.p = "", c(0)
    }([function(e, c, k) {
        function m(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }

        function a() {
            function a(b) {
                if (b && "SheetrockError" === b.name && e && e.update && e.update({
                        failed: !0
                    }), c.callback) return void c.callback(b, f, k);
                if (b) throw b;
            }
            var c = 0 >= arguments.length || void 0 === arguments[0] ? {} : arguments[0],
                d = 1 >= arguments.length || void 0 === arguments[1] ? null : arguments[1],
                f = null,
                e = null,
                k = null;
            try {
                f = new l["default"](b({
                    target: this
                }, c), !!d), e = new q["default"](f), k = new u["default"](e)
            } catch (m) {
                a(m)
            }
            return d ? k.loadData(d, a) : f && e && k && (0, x["default"])(k, a), this
        }
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var b = Object.assign || function(a) {
                for (var b = 1; b < arguments.length; b++) {
                    var c = arguments[b],
                        d;
                    for (d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
                }
                return a
            },
            d = k(1),
            l = m(d),
            d = k(5),
            q = m(d),
            d = k(6),
            u = m(d),
            d = k(2);
        k = k(8);
        var x = m(k);
        b(a, {
            defaults: d.defaults,
            version: "1.1.0"
        });
        try {
            window.jQuery.fn.sheetrock = a
        } catch (f) {}
        c["default"] = a;
        e.exports = c["default"]
    }, function(e, c, k) {
        function m(a) {
            var b = {};
            return Object.keys(a).forEach(function(c) {
                ({}).hasOwnProperty.call(d.legacyOptions, c) ? b[d.legacyOptions[c]] =
                    a[c] : b[c] = a[c]
            }), b
        }

        function a(a, b) {
            if (b) return {
                data: b
            };
            var c = null;
            if (Object.keys(d.sheetTypes).forEach(function(b) {
                    b = d.sheetTypes[b];
                    b.keyFormat.test(a.url) && b.gidFormat.test(a.url) && (c = b)
                }), c) {
                var e = a.url.match(c.keyFormat)[1];
                return {
                    key: e,
                    gid: a.url.match(c.gidFormat)[1],
                    apiEndpoint: c.apiEndpoint.replace("%key%", e)
                }
            }
            throw new q["default"]("No key/gid in the provided URL.");
        }
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var b = Object.assign || function(a) {
                for (var b = 1; b < arguments.length; b++) {
                    var c =
                        arguments[b],
                        d;
                    for (d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
                }
                return a
            },
            d = function(a) {
                if (a && a.__esModule) return a;
                var b = {};
                if (null != a)
                    for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
                return b["default"] = a, b
            }(k(2)),
            l = k(3),
            q = (k = k(4)) && k.__esModule ? k : {
                "default": k
            };
        c["default"] = function x() {
            var c = 0 >= arguments.length || void 0 === arguments[0] ? {} : arguments[0],
                e = !(1 >= arguments.length || void 0 === arguments[1]) && arguments[1];
            if (!(this instanceof x)) throw new TypeError("Cannot call a class as a function");
            var c = m(c),
                k = {};
            if (k.target = (0, l.extractElement)(c.target), k.fetchSize = Math.max(0, parseInt(c.fetchSize, 10) || 0), !k.target && !c.callback) throw new q["default"]("No element targeted or callback provided.");
            this.user = b({}, d.defaults, c, k);
            this.request = a(this.user, e);
            this.requestIndex = this.request.key + "_" + this.request.gid + "_" + this.user.query
        };
        e.exports = c["default"]
    }, function(e, c) {
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        c.defaults = {
            url: "",
            query: "",
            target: null,
            fetchSize: 0,
            labels: [],
            rowTemplate: null,
            callback: null,
            reset: !1
        };
        c.legacyOptions = {
            sql: "query",
            resetStatus: "reset",
            chunkSize: "fetchSize",
            rowHandler: "rowTemplate"
        };
        c.sheetTypes = {
            2014: {
                apiEndpoint: "https://docs.google.com/spreadsheets/d/%key%/gviz/tq?",
                keyFormat: /spreadsheets\/d\/([^/#]+)/i,
                gidFormat: /gid=([^/&#]+)/i
            },
            2010: {
                apiEndpoint: "https://spreadsheets.google.com/tq?key=%key%&",
                keyFormat: /key=([^&#]+)/i,
                gidFormat: /gid=([^/&#]+)/i
            }
        }
    }, function(e, c) {
        function k(a, b) {
            return "<" + b + ">" + a + "</" + b + ">"
        }
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
            return typeof a
        } : function(a) {
            return a && "function" == typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a
        };
        c.append = function(a, b) {
            a && a.insertAdjacentHTML && a.insertAdjacentHTML("beforeEnd", b)
        };
        c.extractElement = function(a) {
            return "object" === ("undefined" == typeof a ? "undefined" : m(a)) && a.jquery && a.length && (a = a[0]), a && a.nodeType && 1 === a.nodeType ? a : null
        };
        c.getCellValue = function(a) {
            a = a.f || a.v || a;
            return a instanceof Array && (a = a.join("")),
                "object" === ("undefined" == typeof a ? "undefined" : m(a)) ? "" : ("" + a).replace(/^\s+|\s+$/, "")
        };
        c.hasClass = function(a, b) {
            return -1 !== (" " + a.className + " ").indexOf(" " + b + " ")
        };
        c.isTable = function(a) {
            return a && "TABLE" === a.tagName
        };
        c.toHTML = function(a) {
            var b = a.num ? "td" : "th",
                c = "";
            return Object.keys(a.cells).forEach(function(e) {
                c += k(a.cells[e], b)
            }), k(c, "tr")
        };
        c.wrapTag = k
    }, function(e, c) {
        function k(a, b) {
            if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " +
                typeof b);
            a.prototype = Object.create(b && b.prototype, {
                constructor: {
                    value: a,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
        }
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = function(a) {
            function b() {
                var a = 0 >= arguments.length || void 0 === arguments[0] ? "" : arguments[0],
                    c = 1 >= arguments.length || void 0 === arguments[1] ? null : arguments[1];
                if (!(this instanceof b)) throw new TypeError("Cannot call a class as a function");
                var e;
                e = Object.getPrototypeOf(b).call(this);
                if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                e = !e || "object" != typeof e && "function" != typeof e ? this : e;
                return e.name = "SheetrockError", e.code = c, e.message = a, e
            }
            return k(b, a), b
        }(Error);
        c["default"] = m;
        e.exports = c["default"]
    }, function(e, c, k) {
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = Object.assign || function(a) {
                for (var b = 1; b < arguments.length; b++) {
                    var c = arguments[b],
                        d;
                    for (d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
                }
                return a
            },
            a = function() {
                function a(b,
                    c) {
                    for (var d = 0; d < c.length; d++) {
                        var e = c[d];
                        e.enumerable = e.enumerable || !1;
                        e.configurable = !0;
                        "value" in e && (e.writable = !0);
                        Object.defineProperty(b, e.key, e)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            b = (k = k(4)) && k.__esModule ? k : {
                "default": k
            },
            d = {
                failed: !1,
                header: 0,
                labels: null,
                loaded: !1,
                offset: 0
            },
            l = {};
        k = function() {
            function c(a) {
                if (!(this instanceof c)) throw new TypeError("Cannot call a class as a function");
                if (this.options = a, this.index = a.requestIndex, this.state.failed) throw new b["default"]("A previous request for this resource failed.");
                if (this.state.loaded) throw new b["default"]("No more rows to load!");
            }
            return a(c, [{
                key: "update",
                value: function() {
                    l[this.index] = m(this.state, 0 >= arguments.length || void 0 === arguments[0] ? {} : arguments[0])
                }
            }, {
                key: "state",
                get: function() {
                    var a = this.options.user.reset || this.options.request.data;
                    return {}.hasOwnProperty.call(l, this.index) && !a || (l[this.index] = m({}, d)), l[this.index]
                }
            }, {
                key: "url",
                get: function() {
                    var a = this.options.user.fetchSize,
                        a = a ? " limit " + (a + 1) + " offset " + this.state.offset : "",
                        a = ["gid=" + encodeURIComponent(this.options.request.gid),
                            "tq=" + encodeURIComponent(this.options.user.query + a)
                        ];
                    return this.options.request.apiEndpoint + a.join("&")
                }
            }]), c
        }();
        c["default"] = k;
        e.exports = c["default"]
    }, function(e, c, k) {
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = function() {
                function a(b, c) {
                    for (var d = 0; d < c.length; d++) {
                        var e = c[d];
                        e.enumerable = e.enumerable || !1;
                        e.configurable = !0;
                        "value" in e && (e.writable = !0);
                        Object.defineProperty(b, e.key, e)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            a = k(7),
            b = a && a.__esModule ? a : {
                "default": a
            },
            d = (a = k(4)) && a.__esModule ? a : {
                "default": a
            },
            l = function(a) {
                if (a && a.__esModule) return a;
                var b = {};
                if (null != a)
                    for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
                return b["default"] = a, b
            }(k(3));
        k = function() {
            function a(b) {
                if (!(this instanceof a)) throw new TypeError("Cannot call a class as a function");
                this.request = b;
                this.options = b.options
            }
            return m(a, [{
                key: "setAttributes",
                value: function() {
                    var a = this.options.user.fetchSize,
                        b = this.raw.table.rows,
                        c = this.raw.table.cols,
                        d = {
                            last: b.length - 1,
                            rowNumberOffset: this.request.state.header ||
                                0
                        },
                        e = this.request.state.labels;
                    this.request.state.offset || (e = c.map(function(a, c) {
                        return a.label ? a.label.replace(/\s/g, "") : (d.last += 1, d.rowNumberOffset = 1, l.getCellValue(b[0].c[c]) || a.id)
                    }), this.request.update({
                        header: d.rowNumberOffset,
                        labels: e,
                        offset: this.request.state.offset + d.rowNumberOffset
                    }));
                    (!a || b.length - d.rowNumberOffset < a) && (d.last += 1, this.request.update({
                        loaded: !0
                    }));
                    a = this.options.user.labels;
                    d.labels = a && a.length === e.length ? a : e;
                    this.attributes = d
                }
            }, {
                key: "setOutput",
                value: function() {
                    var a =
                        this;
                    this.rows = [];
                    this.request.state.offset || this.attributes.rowNumberOffset || this.rows.push(new b["default"](0, this.attributes.labels, this.attributes.labels));
                    this.raw.table.rows.forEach(function(c, d) {
                        c.c && d < a.attributes.last && a.rows.push(new b["default"](a.request.state.offset + d + 1 - a.attributes.rowNumberOffset, c.c, a.attributes.labels))
                    });
                    this.request.update({
                        offset: this.request.state.offset + this.options.user.fetchSize
                    })
                }
            }, {
                key: "setHTML",
                value: function() {
                    var a = this.options.user.target,
                        b = this.options.user.rowTemplate ||
                        l.toHTML,
                        c = l.isTable(a),
                        d = a && l.hasClass(a, "sheetrock-header"),
                        e = "",
                        k = "";
                    this.rows.forEach(function(a) {
                        a.num ? k += b(a) : (c || d) && (e += b(a))
                    });
                    c && (e = l.wrapTag(e, "thead"), k = l.wrapTag(k, "tbody"));
                    l.append(a, e + k);
                    this.html = e + k
                }
            }, {
                key: "loadData",
                value: function(a, b) {
                    var c = null;
                    try {
                        this.raw = a, this.setAttributes(), this.setOutput(), this.setHTML()
                    } catch (e) {
                        c = new d["default"]("Unexpected API response format.")
                    }
                    b(c)
                }
            }]), a
        }();
        c["default"] = k;
        e.exports = c["default"]
    }, function(e, c, k) {
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = function() {
                function a(b, c) {
                    for (var e = 0; e < c.length; e++) {
                        var k = c[e];
                        k.enumerable = k.enumerable || !1;
                        k.configurable = !0;
                        "value" in k && (k.writable = !0);
                        Object.defineProperty(b, k.key, k)
                    }
                }
                return function(c, e, k) {
                    return e && a(c.prototype, e), k && a(c, k), c
                }
            }(),
            a = k(3);
        k = function() {
            function b(c, e, k) {
                if (!(this instanceof b)) throw new TypeError("Cannot call a class as a function");
                this.num = c;
                this.cellsArray = e.map(a.getCellValue);
                this.labels = k
            }
            return m(b, [{
                key: "cells",
                get: function() {
                    var a = this,
                        b = {};
                    return this.labels.forEach(function(c,
                        e) {
                        b[c] = a.cellsArray[e]
                    }), b
                }
            }]), b
        }();
        c["default"] = k;
        e.exports = c["default"]
    }, function(e, c, k) {
        Object.defineProperty(c, "__esModule", {
            value: !0
        });
        var m = (k = k(4)) && k.__esModule ? k : {
                "default": k
            },
            a = window.document.getElementsByTagName("head")[0],
            b = 0;
        c["default"] = function(c, e) {
            function k() {
                a.removeChild(u);
                delete window[x];
                e(new m["default"]("Request failed."))
            }
            var u = window.document.createElement("script"),
                x = "_sheetrock_callback_" + b;
            b += 1;
            window[x] = function(b) {
                a.removeChild(u);
                delete window[x];
                c.loadData(b, e)
            };
            u.addEventListener && (u.addEventListener("error", k, !1), u.addEventListener("abort", k, !1));
            u.type = "text/javascript";
            u.src = c.request.url + "&tqx=responseHandler:" + x;
            a.appendChild(u)
        };
        e.exports = c["default"]
    }])
});
(function(e, c) {
    "object" === typeof exports && exports && "string" !== typeof exports.nodeName ? c(exports) : "function" === typeof define && define.amd ? define(["exports"], c) : (e.Mustache = {}, c(e.Mustache))
})(this, function(e) {
    function c(a) {
        return "function" === typeof a
    }

    function k(a) {
        return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
    }

    function m(a, b) {
        return null != a && "object" === typeof a && b in a
    }

    function a(a, c) {
        function m(a) {
            "string" === typeof a && (a = a.split(r, 2));
            if (!f(a) || 2 !== a.length) throw Error("Invalid tags: " + a);
            sa = new RegExp(k(a[0]) + "\\s*");
            X = new RegExp("\\s*" + k(a[1]));
            R = new RegExp("\\s*" + k("}" + a[1]))
        }
        if (!a) return [];
        var q = [],
            u = [],
            x = [],
            z = !1,
            E = !1,
            sa, X, R;
        m(c || e.tags);
        for (var V = new l(a), ba, O, Z, ca; !V.eos();) {
            ba = V.pos;
            if (Z = V.scanUntil(sa)) {
                ca = 0;
                for (var W = Z.length; ca < W; ++ca)
                    if (O = Z.charAt(ca), v.call(D, O) ? E = !0 : x.push(u.length), u.push(["text", O, ba, ba + 1]), ba += 1, "\n" === O) {
                        if (z && !E)
                            for (; x.length;) delete u[x.pop()];
                        else x = [];
                        E = z = !1
                    }
            }
            if (!V.scan(sa)) break;
            z = !0;
            O = V.scan(w) || "name";
            V.scan(A);
            "=" === O ? (Z = V.scanUntil(B), V.scan(B),
                V.scanUntil(X)) : "{" === O ? (Z = V.scanUntil(R), V.scan(t), V.scanUntil(X), O = "&") : Z = V.scanUntil(X);
            if (!V.scan(X)) throw Error("Unclosed tag at " + V.pos);
            ca = [O, Z, ba, V.pos];
            u.push(ca);
            if ("#" === O || "^" === O) q.push(ca);
            else if ("/" === O) {
                O = q.pop();
                if (!O) throw Error('Unopened section "' + Z + '" at ' + ba);
                if (O[1] !== Z) throw Error('Unclosed section "' + O[1] + '" at ' + ba);
            } else "name" === O || "{" === O || "&" === O ? E = !0 : "=" === O && m(Z)
        }
        if (O = q.pop()) throw Error('Unclosed section "' + O[1] + '" at ' + V.pos);
        return d(b(u))
    }

    function b(a) {
        for (var b = [], c, d, f = 0, e = a.length; f < e; ++f)
            if (c = a[f]) "text" === c[0] && d && "text" === d[0] ? (d[1] += c[1], d[3] = c[3]) : (b.push(c), d = c);
        return b
    }

    function d(a) {
        for (var b = [], c = b, d = [], f, e = 0, l = a.length; e < l; ++e) switch (f = a[e], f[0]) {
            case "#":
            case "^":
                c.push(f);
                d.push(f);
                c = f[4] = [];
                break;
            case "/":
                c = d.pop();
                c[5] = f[2];
                c = 0 < d.length ? d[d.length - 1][4] : b;
                break;
            default:
                c.push(f)
        }
        return b
    }

    function l(a) {
        this.tail = this.string = a;
        this.pos = 0
    }

    function q(a, b) {
        this.view = a;
        this.cache = {
            ".": this.view
        };
        this.parent = b
    }

    function u() {
        this.cache = {}
    }
    var x = Object.prototype.toString,
        f = Array.isArray || function(a) {
            return "[object Array]" === x.call(a)
        },
        v = RegExp.prototype.test,
        D = /\S/,
        z = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        },
        A = /\s*/,
        r = /\s+/,
        B = /\s*=/,
        t = /\s*\}/,
        w = /#|\^|\/|>|\{|&|=|!/;
    l.prototype.eos = function() {
        return "" === this.tail
    };
    l.prototype.scan = function(a) {
        a = this.tail.match(a);
        if (!a || 0 !== a.index) return "";
        a = a[0];
        this.tail = this.tail.substring(a.length);
        this.pos += a.length;
        return a
    };
    l.prototype.scanUntil = function(a) {
        a = this.tail.search(a);
        var b;
        switch (a) {
            case -1:
                b = this.tail;
                this.tail = "";
                break;
            case 0:
                b = "";
                break;
            default:
                b = this.tail.substring(0, a), this.tail = this.tail.substring(a)
        }
        this.pos += b.length;
        return b
    };
    q.prototype.push = function(a) {
        return new q(a, this)
    };
    q.prototype.lookup = function(a) {
        var b = this.cache,
            d;
        if (b.hasOwnProperty(a)) d = b[a];
        else {
            for (var f = this, e, l, k = !1; f;) {
                if (0 < a.indexOf("."))
                    for (d = f.view, e = a.split("."), l = 0; null != d && l < e.length;) l === e.length - 1 && (k = m(d, e[l])), d = d[e[l++]];
                else d = f.view[a], k = m(f.view, a);
                if (k) break;
                f = f.parent
            }
            b[a] =
                d
        }
        c(d) && (d = d.call(this.view));
        return d
    };
    u.prototype.clearCache = function() {
        this.cache = {}
    };
    u.prototype.parse = function(b, c) {
        var d = this.cache,
            f = d[b];
        null == f && (f = d[b] = a(b, c));
        return f
    };
    u.prototype.render = function(a, b, c) {
        var d = this.parse(a);
        b = b instanceof q ? b : new q(b);
        return this.renderTokens(d, b, c, a)
    };
    u.prototype.renderTokens = function(a, b, c, d) {
        for (var f = "", e, l, k, m = 0, q = a.length; m < q; ++m) k = void 0, e = a[m], l = e[0], "#" === l ? k = this.renderSection(e, b, c, d) : "^" === l ? k = this.renderInverted(e, b, c, d) : ">" === l ? k = this.renderPartial(e,
            b, c, d) : "&" === l ? k = this.unescapedValue(e, b) : "name" === l ? k = this.escapedValue(e, b) : "text" === l && (k = this.rawValue(e)), void 0 !== k && (f += k);
        return f
    };
    u.prototype.renderSection = function(a, b, d, e) {
        function l(a) {
            return k.render(a, b, d)
        }
        var k = this,
            m = "",
            q = b.lookup(a[1]);
        if (q) {
            if (f(q))
                for (var r = 0, v = q.length; r < v; ++r) m += this.renderTokens(a[4], b.push(q[r]), d, e);
            else if ("object" === typeof q || "string" === typeof q || "number" === typeof q) m += this.renderTokens(a[4], b.push(q), d, e);
            else if (c(q)) {
                if ("string" !== typeof e) throw Error("Cannot use higher-order sections without the original template");
                q = q.call(b.view, e.slice(a[3], a[5]), l);
                null != q && (m += q)
            } else m += this.renderTokens(a[4], b, d, e);
            return m
        }
    };
    u.prototype.renderInverted = function(a, b, c, d) {
        var e = b.lookup(a[1]);
        if (!e || f(e) && 0 === e.length) return this.renderTokens(a[4], b, c, d)
    };
    u.prototype.renderPartial = function(a, b, d) {
        if (d && (a = c(d) ? d(a[1]) : d[a[1]], null != a)) return this.renderTokens(this.parse(a), b, d, a)
    };
    u.prototype.unescapedValue = function(a, b) {
        var c = b.lookup(a[1]);
        if (null != c) return c
    };
    u.prototype.escapedValue = function(a, b) {
        var c = b.lookup(a[1]);
        if (null != c) return e.escape(c)
    };
    u.prototype.rawValue = function(a) {
        return a[1]
    };
    e.name = "mustache.js";
    e.version = "2.2.1";
    e.tags = ["{{", "}}"];
    var E = new u;
    e.clearCache = function() {
        return E.clearCache()
    };
    e.parse = function(a, b) {
        return E.parse(a, b)
    };
    e.render = function(a, b, c) {
        if ("string" !== typeof a) throw b = TypeError, a = f(a) ? "array" : typeof a, new b('Invalid template! Template should be a "string" but "' + a + '" was given as the first argument for mustache#render(template, view, partials)');
        return E.render(a, b, c)
    };
    e.to_html =
        function(a, b, d, f) {
            a = e.render(a, b, d);
            if (c(f)) f(a);
            else return a
        };
    e.escape = function(a) {
        return String(a).replace(/[&<>"'`=\/]/g, function(a) {
            return z[a]
        })
    };
    e.Scanner = l;
    e.Context = q;
    e.Writer = u
});
Object.create || (Object.create = function() {
    function e() {}
    return function(c) {
        if (1 != arguments.length) throw Error("Object.create implementation only accepts one parameter.");
        return e.prototype = c, new e
    }
}());
Object.keys || (Object.keys = function(e, c, k) {
    k = [];
    for (c in e) k.hasOwnProperty.call(e, c) && k.push(c);
    return k
});
Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
    for (var c = 0; c < this.length; c++)
        if (this[c] === e) return c;
    return -1
});
Array.prototype.forEach || (Array.prototype.forEach = function(e) {
    if (void 0 === this || null === this) throw new TypeError;
    var c = Object(this),
        k = c.length >>> 0;
    if ("function" != typeof e) throw new TypeError;
    for (var m = 2 <= arguments.length ? arguments[1] : void 0, a = 0; k > a; a++) a in c && e.call(m, c[a], a, c);
    return this
});
Array.prototype.filter || (Array.prototype.filter = function(e, c) {
    var k = [];
    return this.forEach(function(m, a, b) {
        e.call(c || void 0, m, a, b) && k.push(m)
    }), k
});
Array.prototype.map || (Array.prototype.map = function(e, c) {
    var k = [];
    return this.forEach(function(m, a, b) {
        k.push(e.call(c || void 0, m, a, b))
    }), k
});
Array.isArray || (Array.isArray = function(e) {
    return "[object Array]" === Object.prototype.toString.call(e)
});
"object" != typeof window || "object" != typeof window.location || window.location.assign || (window.location.assign = function(e) {
    window.location = e
});
Function.prototype.bind || (Function.prototype.bind = function(e) {
    function c() {}
    if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var k = [].slice,
        m = k.call(arguments, 1),
        a = this,
        b = function() {
            return a.apply(this instanceof c ? this : e || window, m.concat(k.call(arguments)))
        };
    return c.prototype = this.prototype, b.prototype = new c, b
});
var hello = function(e) {
    return hello.use(e)
};
hello.utils = {
    extend: function(e) {
        return Array.prototype.slice.call(arguments, 1).forEach(function(c) {
            if (Array.isArray(e) && Array.isArray(c)) Array.prototype.push.apply(e, c);
            else if (e instanceof Object && c instanceof Object && e !== c)
                for (var k in c) e[k] = hello.utils.extend(e[k], c[k]);
            else Array.isArray(c) && (c = c.slice(0)), e = c
        }), e
    }
};
hello.utils.extend(hello, {
    settings: {
        redirect_uri: window.location.href.split("#")[0],
        response_type: "token",
        display: "popup",
        state: "",
        oauth_proxy: "https://auth-server.herokuapp.com/proxy",
        timeout: 2E4,
        popup: {
            resizable: 1,
            scrollbars: 1,
            width: 500,
            height: 550
        },
        scope: ["basic"],
        scope_map: {
            basic: ""
        },
        default_service: null,
        force: null,
        page_uri: window.location.href
    },
    services: {},
    use: function(e) {
        var c = Object.create(this);
        return c.settings = Object.create(this.settings), e && (c.settings.default_service = e), c.utils.Event.call(c),
            c
    },
    init: function(e, c) {
        var k = this.utils;
        if (!e) return this.services;
        for (var m in e) e.hasOwnProperty(m) && "object" != typeof e[m] && (e[m] = {
            id: e[m]
        });
        return k.extend(this.services, e), c && (k.extend(this.settings, c), "redirect_uri" in c && (this.settings.redirect_uri = k.url(c.redirect_uri).href)), this
    },
    login: function() {
        function e(a, b) {
            hello.emit(a, b)
        }

        function c(a) {
            return a
        }

        function k(a) {
            return !!a
        }
        var m, a = this.utils,
            b = a.error,
            d = a.Promise(),
            l = a.args({
                network: "s",
                options: "o",
                callback: "f"
            }, arguments),
            q = a.diffKey(l.options,
                this.settings),
            u = l.options = a.merge(this.settings, l.options || {});
        if (u.popup = a.merge(this.settings.popup, l.options.popup || {}), l.network = l.network || this.settings.default_service, d.proxy.then(l.callback, l.callback), d.proxy.then(e.bind(this, "auth.login auth"), e.bind(this, "auth.failed auth")), "string" != typeof l.network || !(l.network in this.services)) return d.reject(b("invalid_network", "The provided network was not recognized"));
        var x = this.services[l.network],
            f = a.globalEvent(function(c) {
                c = c ? JSON.parse(c) :
                    b("cancelled", "The authentication was not completed");
                c.error ? d.reject(c) : (a.store(c.network, c), d.fulfill({
                    network: c.network,
                    authResponse: c
                }))
            }),
            v = a.url(u.redirect_uri).href,
            D = x.oauth.response_type || u.response_type;
        /\bcode\b/.test(D) && !x.oauth.grant && (D = D.replace(/\bcode\b/, "token"));
        l.qs = a.merge(q, {
            client_id: encodeURIComponent(x.id),
            response_type: encodeURIComponent(D),
            redirect_uri: encodeURIComponent(v),
            state: {
                client_id: x.id,
                network: l.network,
                display: u.display,
                callback: f,
                state: u.state,
                redirect_uri: v
            }
        });
        var q = a.store(l.network),
            f = /[,\s]+/,
            z = this.settings.scope ? [this.settings.scope.toString()] : [],
            A = a.merge(this.settings.scope_map, x.scope || {});
        if ((u.scope && z.push(u.scope.toString()), q && "scope" in q && q.scope instanceof String && z.push(q.scope), z = z.join(",").split(f), z = a.unique(z).filter(k), l.qs.state.scope = z.join(","), z = z.map(function(a) {
                    return a in A ? A[a] : a
                }), z = z.join(",").split(f), z = a.unique(z).filter(k), l.qs.scope = z.join(x.scope_delim || ","), !1 === u.force && q && "access_token" in q && q.access_token && "expires" in
                q && q.expires > (new Date).getTime() / 1E3) && 0 === a.diff((q.scope || "").split(f), (l.qs.state.scope || "").split(f)).length) return d.fulfill({
            unchanged: !0,
            network: l.network,
            authResponse: q
        }), d;
        if ("page" === u.display && u.page_uri && (l.qs.state.page_uri = a.url(u.page_uri).href), "login" in x && "function" == typeof x.login && x.login(l), (!/\btoken\b/.test(D) || 2 > parseInt(x.oauth.version, 10) || "none" === u.display && x.oauth.grant && q && q.refresh_token) && (l.qs.state.oauth = x.oauth, l.qs.state.oauth_proxy = u.oauth_proxy), l.qs.state = encodeURIComponent(JSON.stringify(l.qs.state)),
            1 === parseInt(x.oauth.version, 10) ? m = a.qs(u.oauth_proxy, l.qs, c) : "none" === u.display && x.oauth.grant && q && q.refresh_token ? (l.qs.refresh_token = q.refresh_token, m = a.qs(u.oauth_proxy, l.qs, c)) : m = a.qs(x.oauth.auth, l.qs, c), e("auth.init", l), "none" === u.display) a.iframe(m, v);
        else if ("popup" === u.display) var r = a.popup(m, v, u.popup),
            B = setInterval(function() {
                    if ((!r || r.closed) && (clearInterval(B), !d.state)) {
                        var a = b("cancelled", "Login has been cancelled");
                        r || (a = b("blocked", "Popup was blocked"));
                        a.network = l.network;
                        d.reject(a)
                    }
                },
                100);
        else window.location = m;
        return d.proxy
    },
    logout: function() {
        function e(a, b) {
            hello.emit(a, b)
        }
        var c = this.utils,
            k = c.error,
            m = c.Promise(),
            a = c.args({
                name: "s",
                options: "o",
                callback: "f"
            }, arguments);
        if (a.options = a.options || {}, m.proxy.then(a.callback, a.callback), m.proxy.then(e.bind(this, "auth.logout auth"), e.bind(this, "error")), a.name = a.name || this.settings.default_service, a.authResponse = c.store(a.name), !a.name || a.name in this.services)
            if (a.name && a.authResponse) {
                var k = function(b) {
                        c.store(a.name, null);
                        m.fulfill(hello.utils.merge({
                                network: a.name
                            },
                            b || {}))
                    },
                    b = {};
                if (a.options.force) {
                    var d = this.services[a.name].logout;
                    if (d)
                        if ("function" == typeof d && (d = d(k, a)), "string" == typeof d) c.iframe(d), b.force = null, b.message = "Logout success on providers site was indeterminate";
                        else if (void 0 === d) return m.proxy
                }
                k(b)
            } else m.reject(k("invalid_session", "There was no session to remove"));
        else m.reject(k("invalid_network", "The network was unrecognized"));
        return m.proxy
    },
    getAuthResponse: function(e) {
        return e = e || this.settings.default_service, e && e in this.services ? this.utils.store(e) ||
            null : null
    },
    events: {}
});
hello.utils.extend(hello.utils, {
    error: function(e, c) {
        return {
            error: {
                code: e,
                message: c
            }
        }
    },
    qs: function(e, c, k) {
        if (c) {
            k = k || encodeURIComponent;
            for (var m in c) {
                var a = new RegExp("([\\?\\&])" + m + "=[^\\&]*");
                e.match(a) && (e = e.replace(a, "$1" + m + "=" + k(c[m])), delete c[m])
            }
        }
        return this.isEmpty(c) ? e : e + (-1 < e.indexOf("?") ? "&" : "?") + this.param(c, k)
    },
    param: function(e, c) {
        var k, m, a = {};
        if ("string" == typeof e) {
            if (c = c || decodeURIComponent, m = e.replace(/^[\#\?]/, "").match(/([^=\/\&]+)=([^\&]+)/g))
                for (var b = 0; b < m.length; b++) k = m[b].match(/([^=]+)=(.*)/),
                    a[k[1]] = c(k[2]);
            return a
        }
        c = c || encodeURIComponent;
        a = [];
        for (k in e) e.hasOwnProperty(k) && e.hasOwnProperty(k) && a.push([k, "?" === e[k] ? "?" : c(e[k])].join("="));
        return a.join("&")
    },
    store: function() {
        for (var e, c = ["localStorage", "sessionStorage"], k = -1; c[++k];) try {
            e = window[c[k]];
            e.setItem("test" + k, k);
            e.removeItem("test" + k);
            break
        } catch (m) {
            e = null
        }
        if (!e) {
            var a = null;
            e = {
                getItem: function(b) {
                    b += "=";
                    for (var c = document.cookie.split(";"), e = 0; e < c.length; e++) {
                        var k = c[e].replace(/(^\s+|\s+$)/, "");
                        if (k && 0 === k.indexOf(b)) return k.substr(b.length)
                    }
                    return a
                },
                setItem: function(b, c) {
                    a = c;
                    document.cookie = b + "=" + c
                }
            };
            a = e.getItem("hello")
        }
        return function(a, c, l) {
            l = {};
            try {
                l = JSON.parse(e.getItem("hello")) || {}
            } catch (k) {}
            if (a && void 0 === c) return l[a] || null;
            if (a && null === c) try {
                delete l[a]
            } catch (m) {
                l[a] = null
            } else {
                if (!a) return l;
                l[a] = c
            }
            e.setItem("hello", JSON.stringify(l));
            return l || null
        }
    }(),
    append: function(e, c, k) {
        var m = "string" == typeof e ? document.createElement(e) : e;
        if ("object" == typeof c)
            if ("tagName" in c) k = c;
            else
                for (var a in c)
                    if (c.hasOwnProperty(a))
                        if ("object" == typeof c[a])
                            for (var b in c[a]) c[a].hasOwnProperty(b) &&
                                (m[a][b] = c[a][b]);
                        else "html" === a ? m.innerHTML = c[a] : /^on/.test(a) ? m[a] = c[a] : m.setAttribute(a, c[a]);
        return "body" === k ? ! function l() {
            document.body ? document.body.appendChild(m) : setTimeout(l, 16)
        }() : "object" == typeof k ? k.appendChild(m) : "string" == typeof k && document.getElementsByTagName(k)[0].appendChild(m), m
    },
    iframe: function(e) {
        this.append("iframe", {
            src: e,
            style: {
                position: "absolute",
                left: "-1000px",
                bottom: 0,
                height: "1px",
                width: "1px"
            }
        }, "body")
    },
    merge: function() {
        var e = Array.prototype.slice.call(arguments);
        return e.unshift({}),
            this.extend.apply(null, e)
    },
    args: function(e, c) {
        var k = {},
            m = 0,
            a = null,
            b = null;
        for (b in e)
            if (e.hasOwnProperty(b)) break;
        if (1 === c.length && "object" == typeof c[0] && "o!" != e[b])
            for (b in c[0])
                if (e.hasOwnProperty(b) && b in e) return c[0];
        for (b in e)
            if (e.hasOwnProperty(b))
                if (a = typeof c[m], "function" == typeof e[b] && e[b].test(c[m]) || "string" == typeof e[b] && (-1 < e[b].indexOf("s") && "string" === a || -1 < e[b].indexOf("o") && "object" === a || -1 < e[b].indexOf("i") && "number" === a || -1 < e[b].indexOf("a") && "object" === a || -1 < e[b].indexOf("f") &&
                        "function" === a)) k[b] = c[m++];
                else if ("string" == typeof e[b] && -1 < e[b].indexOf("!")) return !1;
        return k
    },
    url: function(e) {
        if (e) {
            if (window.URL && URL instanceof Function && 0 !== URL.length) return new URL(e, window.location);
            var c = document.createElement("a");
            return c.href = e, c.cloneNode(!1)
        }
        return window.location
    },
    diff: function(e, c) {
        return c.filter(function(c) {
            return -1 === e.indexOf(c)
        })
    },
    diffKey: function(e, c) {
        if (e || !c) {
            var k = {},
                m;
            for (m in e) m in c || (k[m] = e[m]);
            return k
        }
        return e
    },
    unique: function(e) {
        return Array.isArray(e) ?
            e.filter(function(c, k) {
                return e.indexOf(c) === k
            }) : []
    },
    isEmpty: function(e) {
        if (!e) return !0;
        if (Array.isArray(e)) return !e.length;
        if ("object" == typeof e)
            for (var c in e)
                if (e.hasOwnProperty(c)) return !1;
        return !0
    },
    Promise: function() {
        var e = function(a) {
            return this instanceof e ? (this.id = "Thenable/1.0.6", this.state = 0, this.fulfillValue = void 0, this.rejectReason = void 0, this.onFulfilled = [], this.onRejected = [], this.proxy = {
                    then: this.then.bind(this)
                }, void("function" == typeof a && a.call(this, this.fulfill.bind(this), this.reject.bind(this)))) :
                new e(a)
        };
        e.prototype = {
            fulfill: function(a) {
                return c(this, 1, "fulfillValue", a)
            },
            reject: function(a) {
                return c(this, 2, "rejectReason", a)
            },
            then: function(b, c) {
                var m = new e;
                return this.onFulfilled.push(a(b, m, "fulfill")), this.onRejected.push(a(c, m, "reject")), k(this), m.proxy
            }
        };
        var c = function(a, b, c, e) {
                return 0 === a.state && (a.state = b, a[c] = e, k(a)), a
            },
            k = function(a) {
                1 === a.state ? m(a, "onFulfilled", a.fulfillValue) : 2 === a.state && m(a, "onRejected", a.rejectReason)
            },
            m = function(a, b, c) {
                if (0 !== a[b].length) {
                    var e = a[b];
                    a[b] = [];
                    a = function() {
                        for (var a = 0; a < e.length; a++) e[a](c)
                    };
                    "object" == typeof process && "function" == typeof process.nextTick ? process.nextTick(a) : "function" == typeof setImmediate ? setImmediate(a) : setTimeout(a, 0)
                }
            },
            a = function(a, c, e) {
                return function(k) {
                    if ("function" != typeof a) c[e].call(c, k);
                    else {
                        var m;
                        try {
                            m = a(k)
                        } catch (f) {
                            return void c.reject(f)
                        }
                        b(c, m)
                    }
                }
            },
            b = function(a, c) {
                if (a === c || a.proxy === c) return void a.reject(new TypeError("cannot resolve promise with itself"));
                var e;
                if ("object" == typeof c && null !== c || "function" ==
                    typeof c) try {
                    e = c.then
                } catch (k) {
                    return void a.reject(k)
                }
                if ("function" != typeof e) a.fulfill(c);
                else {
                    var m = !1;
                    try {
                        e.call(c, function(f) {
                            m || (m = !0, f === c ? a.reject(new TypeError("circular thenable chain")) : b(a, f))
                        }, function(b) {
                            m || (m = !0, a.reject(b))
                        })
                    } catch (f) {
                        m || a.reject(f)
                    }
                }
            };
        return e
    }(),
    Event: function() {
        var e = /[\s\,]+/;
        return this.parent = {
            events: this.events,
            findEvents: this.findEvents,
            parent: this.parent,
            utils: this.utils
        }, this.events = {}, this.on = function(c, k) {
            if (k && "function" == typeof k)
                for (var m = c.split(e),
                        a = 0; a < m.length; a++) this.events[m[a]] = [k].concat(this.events[m[a]] || []);
            return this
        }, this.off = function(c, e) {
            return this.findEvents(c, function(c, a) {
                e && this.events[c][a] !== e || (this.events[c][a] = null)
            }), this
        }, this.emit = function(c) {
            var e = Array.prototype.slice.call(arguments, 1);
            e.push(c);
            for (var m = function(a, d) {
                    e[e.length - 1] = "*" === a ? c : a;
                    this.events[a][d].apply(this, e)
                }, a = this; a && a.findEvents;) a.findEvents(c + ",*", m), a = a.parent;
            return this
        }, this.emitAfter = function() {
            var c = this,
                e = arguments;
            return setTimeout(function() {
                c.emit.apply(c,
                    e)
            }, 0), this
        }, this.findEvents = function(c, k) {
            var m = c.split(e),
                a;
            for (a in this.events)
                if (this.events.hasOwnProperty(a) && -1 < m.indexOf(a))
                    for (var b = 0; b < this.events[a].length; b++) this.events[a][b] && k.call(this, a, b)
        }, this
    },
    globalEvent: function(e, c) {
        return c = c || "_hellojs_" + parseInt(1E12 * Math.random(), 10).toString(36), window[c] = function() {
            try {
                e.apply(this, arguments) && delete window[c]
            } catch (k) {
                console.error(k)
            }
        }, c
    },
    popup: function(e, c, k) {
        var m = document.documentElement;
        if (k.height) {
            var a = void 0 !== window.screenTop ?
                window.screenTop : screen.top;
            k.top = parseInt(((screen.height || window.innerHeight || m.clientHeight) - k.height) / 2, 10) + a
        }
        k.width && (a = void 0 !== window.screenLeft ? window.screenLeft : screen.left, k.left = parseInt(((screen.width || window.innerWidth || m.clientWidth) - k.width) / 2, 10) + a);
        var b = [];
        Object.keys(k).forEach(function(a) {
            var c = k[a];
            b.push(a + (null !== c ? "=" + c : ""))
        }); - 1 !== navigator.userAgent.indexOf("Safari") && -1 === navigator.userAgent.indexOf("Chrome") && (e = c + "#oauth_redirect=" + encodeURIComponent(encodeURIComponent(e)));
        e = window.open(e, "_blank", b.join(","));
        return e && e.focus && e.focus(), e
    },
    responseHandler: function(e, c) {
        function k(b, c, e) {
            c = b.callback;
            var k = b.network;
            if (d.store(k, b), !("display" in b && "page" === b.display)) {
                if (e && c && c in e) {
                    try {
                        delete b.callback
                    } catch (l) {}
                    d.store(k, b);
                    b = JSON.stringify(b);
                    try {
                        m(e, c)(b)
                    } catch (q) {}
                }
                a()
            }
        }

        function m(a, b) {
            return 0 !== b.indexOf("_hellojs_") ? function() {
                throw "Could not execute callback " + b;
            } : a[b]
        }

        function a() {
            if (e.frameElement) c.document.body.removeChild(e.frameElement);
            else {
                try {
                    e.close()
                } catch (a) {}
                e.addEventListener &&
                    e.addEventListener("load", function() {
                        e.close()
                    })
            }
        }
        var b, d = this,
            l = e.location;
        if (b = d.param(l.search), b && b.state && (b.code || b.oauth_token)) {
            var q = JSON.parse(b.state);
            b.redirect_uri = q.redirect_uri || l.href.replace(/[\?\#].*$/, "");
            b = q.oauth_proxy + "?" + d.param(b);
            return void l.assign(b)
        }
        if (b = d.merge(d.param(l.search || ""), d.param(l.hash || "")), b && "state" in b) {
            try {
                q = JSON.parse(b.state), d.extend(b, q)
            } catch (u) {
                console.error("Could not decode state parameter")
            }
            "access_token" in b && b.access_token && b.network ? (b.expires_in &&
                0 !== parseInt(b.expires_in, 10) || (b.expires_in = 0), b.expires_in = parseInt(b.expires_in, 10), b.expires = (new Date).getTime() / 1E3 + (b.expires_in || 31536E3), k(b, e, c)) : "error" in b && b.error && b.network ? (b.error = {
                code: b.error,
                message: b.error_message || b.error_description
            }, k(b, e, c)) : b.callback && b.callback in c && (q = "result" in b && b.result ? JSON.parse(b.result) : !1, m(c, b.callback)(q), a());
            b.page_uri && l.assign(b.page_uri)
        } else if ("oauth_redirect" in b) return void l.assign(decodeURIComponent(b.oauth_redirect))
    }
});
hello.utils.Event.call(hello);
(function(e) {
    var c = {},
        k = {};
    e.on("auth.login, auth.logout", function(k) {
        k && "object" == typeof k && k.network && (c[k.network] = e.utils.store(k.network) || {})
    });
    (function a() {
        var b = (new Date).getTime() / 1E3,
            d = function(a) {
                e.emit("auth." + a, {
                    network: l,
                    authResponse: q
                })
            },
            l;
        for (l in e.services)
            if (e.services.hasOwnProperty(l) && e.services[l].id) {
                var q = e.utils.store(l) || {},
                    u = e.services[l],
                    x = c[l] || {};
                if (q && "callback" in q) {
                    var f = q.callback;
                    try {
                        delete q.callback
                    } catch (v) {}
                    e.utils.store(l, q);
                    try {
                        window[f](q)
                    } catch (D) {}
                }
                if (q &&
                    "expires" in q && q.expires < b) u = u.refresh || q.refresh_token, !u || l in k && !(k[l] < b) ? u || l in k || (d("expired"), k[l] = !0) : (e.emit("notice", l + " has expired trying to resignin"), e.login(l, {
                    display: "none",
                    force: !1
                }), k[l] = b + 600);
                else if (x.access_token !== q.access_token || x.expires !== q.expires) !q.access_token && x.access_token ? d("logout") : q.access_token && !x.access_token ? d("login") : q.expires !== x.expires && d("update"), c[l] = q, l in k && delete k[l]
            }
        setTimeout(a, 1E3)
    })()
})(hello);
hello.api = function() {
    function e(b) {
        b = b.replace(/\@\{([a-z\_\-]+)(\|.*?)?\}/gi, function(b, c, d) {
            b = d ? d.replace(/^\|/, "") : "";
            return c in a.query ? (b = a.query[c], delete a.query[c]) : a.data && c in a.data ? (b = a.data[c], delete a.data[c]) : d || m.reject(k("missing_attribute", "The attribute " + c + " is missing from the request")), b
        });
        b.match(/^https?:\/\//) || (b = l.base + b);
        a.url = b;
        c.request(a, function(b, d) {
            if (!a.formatResponse) return void(("object" == typeof d ? 400 <= d.statusCode : "object" == typeof b && "error" in b) ? m.reject(b) :
                m.fulfill(b));
            if (!0 === b ? b = {
                    success: !0
                } : b || (b = {}), "delete" === a.method && (b = !b || c.isEmpty(b) ? {
                    success: !0
                } : b), l.wrap && (a.path in l.wrap || "default" in l.wrap)) {
                var e = a.path in l.wrap ? a.path : "default";
                (e = ((new Date).getTime(), l.wrap[e](b, d, a))) && (b = e)
            }
            b && "paging" in b && b.paging.next && ("?" === b.paging.next[0] ? b.paging.next = a.path + b.paging.next : b.paging.next += "#" + a.path);
            !b || "error" in b ? m.reject(b) : m.fulfill(b)
        })
    }
    var c = this.utils,
        k = c.error,
        m = c.Promise(),
        a = c.args({
            path: "s!",
            query: "o",
            method: "s",
            data: "o",
            timeout: "i",
            callback: "f"
        }, arguments);
    a.method = (a.method || "get").toLowerCase();
    a.headers = a.headers || {};
    a.query = a.query || {};
    "get" !== a.method && "delete" !== a.method || (c.extend(a.query, a.data), a.data = {});
    var b = a.data = a.data || {};
    if (m.then(a.callback, a.callback), !a.path) return m.reject(k("invalid_path", "Missing the path parameter from the request"));
    a.path = a.path.replace(/^\/+/, "");
    var d = (a.path.split(/[\/\:]/, 2) || [])[0].toLowerCase();
    d in this.services && (a.network = d, a.path = a.path.replace(new RegExp("^" + d + ":?/?"), ""));
    a.network = this.settings.default_service = a.network || this.settings.default_service;
    var l = this.services[a.network];
    if (!l) return m.reject(k("invalid_network", "Could not match the service requested: " + a.network));
    if (a.method in l && a.path in l[a.method] && !1 === l[a.method][a.path]) return m.reject(k("invalid_path", "The provided path is not available on the selected network"));
    a.oauth_proxy || (a.oauth_proxy = this.settings.oauth_proxy);
    "proxy" in a || (a.proxy = a.oauth_proxy && l.oauth && 1 === parseInt(l.oauth.version,
        10));
    "timeout" in a || (a.timeout = this.settings.timeout);
    "formatResponse" in a || (a.formatResponse = !0);
    a.authResponse = this.getAuthResponse(a.network);
    a.authResponse && a.authResponse.access_token && (a.query.access_token = a.authResponse.access_token);
    var q, d = a.path;
    a.options = c.clone(a.query);
    a.data = c.clone(b);
    b = l[{
        "delete": "del"
    }[a.method] || a.method] || {};
    if ("get" === a.method) {
        var u = d.split(/[\?#]/)[1];
        u && (c.extend(a.query, c.param(u)), d = d.replace(/\?.*?(#|$)/, "$1"))
    }
    return (q = d.match(/#(.+)/, "")) ? (d = d.split("#")[0],
        a.path = q[1]) : d in b ? (a.path = d, d = b[d]) : "default" in b && (d = b["default"]), a.redirect_uri = this.settings.redirect_uri, a.xhr = l.xhr, a.jsonp = l.jsonp, a.form = l.form, "function" == typeof d ? d(a, e) : e(d), m.proxy
};
hello.utils.extend(hello.utils, {
    request: function(e, c) {
        function k(a, b) {
            var c;
            a.authResponse && a.authResponse.oauth && 1 === parseInt(a.authResponse.oauth.version, 10) && (c = a.query.access_token, delete a.query.access_token, a.proxy = !0);
            !a.data || "get" !== a.method && "delete" !== a.method || (m.extend(a.query, a.data), a.data = null);
            var d = m.qs(a.url, a.query);
            a.proxy && (d = m.qs(a.oauth_proxy, {
                path: d,
                access_token: c || "",
                then: a.proxy_response_type || ("get" === a.method.toLowerCase() ? "redirect" : "proxy"),
                method: a.method.toLowerCase(),
                suppress_response_codes: !0
            }));
            b(d)
        }
        var m = this,
            a = m.error;
        m.isEmpty(e.data) || "FileList" in window || !m.hasBinary(e.data) || (e.xhr = !1, e.jsonp = !1);
        if (this.request_cors(function() {
                return void 0 === e.xhr || e.xhr && ("function" != typeof e.xhr || e.xhr(e, e.query))
            })) return void k(e, function(a) {
            a = m.xhr(e.method, a, e.headers, e.data, c);
            a.onprogress = e.onprogress || null;
            a.upload && e.onuploadprogress && (a.upload.onprogress = e.onuploadprogress)
        });
        var b = e.query;
        if (e.query = m.clone(e.query), e.callbackID = m.globalEvent(), !1 !== e.jsonp) {
            if (e.query.callback =
                e.callbackID, "function" == typeof e.jsonp && e.jsonp(e, e.query), "get" === e.method) return void k(e, function(a) {
                m.jsonp(a, c, e.callbackID, e.timeout)
            });
            e.query = b
        }
        if (!1 !== e.form) {
            e.query.redirect_uri = e.redirect_uri;
            e.query.state = JSON.stringify({
                callback: e.callbackID
            });
            var d;
            if ("function" == typeof e.form && (d = e.form(e, e.query)), "post" === e.method && !1 !== d) return void k(e, function(a) {
                m.post(a, e.data, d, c, e.callbackID, e.timeout)
            })
        }
        c(a("invalid_request", "There was no mechanism for handling this request"))
    },
    request_cors: function(e) {
        return "withCredentials" in
            new XMLHttpRequest && e()
    },
    domInstance: function(e, c) {
        var k = "HTML" + (e || "").replace(/^[a-z]/, function(c) {
            return c.toUpperCase()
        }) + "Element";
        return c ? window[k] ? c instanceof window[k] : window.Element ? c instanceof window.Element && (!e || c.tagName && c.tagName.toLowerCase() === e) : !(c instanceof Object || c instanceof Array || c instanceof String || c instanceof Number) && c.tagName && c.tagName.toLowerCase() === e : !1
    },
    clone: function(e) {
        if (null === e || "object" != typeof e || e instanceof Date || "nodeName" in e || this.isBinary(e) || "function" ==
            typeof FormData && e instanceof FormData) return e;
        if (Array.isArray(e)) return e.map(this.clone.bind(this));
        var c = {},
            k;
        for (k in e) c[k] = this.clone(e[k]);
        return c
    },
    xhr: function(e, c, k, m, a) {
        var b = new XMLHttpRequest,
            d = this.error,
            l = !1;
        "blob" === e && (l = e, e = "GET");
        e = e.toUpperCase();
        b.onload = function(c) {
            c = b.response;
            try {
                c = JSON.parse(b.responseText)
            } catch (f) {
                401 === b.status && (c = d("access_denied", b.statusText))
            }
            for (var k = b.getAllResponseHeaders(), l, m = {}, q = /([a-z\-]+):\s?(.*);?/gi; l = q.exec(k);) m[l[1]] = l[2];
            m.statusCode =
                b.status;
            a(c || ("GET" === e ? d("empty_response", "Could not get resource") : {}), m)
        };
        b.onerror = function(c) {
            c = b.responseText;
            try {
                c = JSON.parse(b.responseText)
            } catch (f) {}
            a(c || d("access_denied", "Could not get resource"))
        };
        var q;
        if ("GET" === e || "DELETE" === e) m = null;
        else if (!(!m || "string" == typeof m || m instanceof FormData || m instanceof File || m instanceof Blob)) {
            var u = new FormData;
            for (q in m) m.hasOwnProperty(q) && (m[q] instanceof HTMLInputElement ? "files" in m[q] && 0 < m[q].files.length && u.append(q, m[q].files[0]) : m[q] instanceof Blob ? u.append(q, m[q], m.name) : u.append(q, m[q]));
            m = u
        }
        if (b.open(e, c, !0), l && ("responseType" in b ? b.responseType = l : b.overrideMimeType("text/plain; charset=x-user-defined")), k)
            for (q in k) b.setRequestHeader(q, k[q]);
        return b.send(m), b
    },
    jsonp: function(e, c, k, m) {
        var a, b = this.error,
            d = 0,
            l = document.getElementsByTagName("head")[0],
            q = b("server_error", "server_error"),
            u = function() {
                d++ || window.setTimeout(function() {
                    c(q);
                    l.removeChild(x)
                }, 0)
            };
        k = this.globalEvent(function(a) {
            return q = a, !0
        }, k);
        e = e.replace(/=\?(&|$)/, "=" +
            k + "$1");
        var x = this.append("script", {
            id: k,
            name: k,
            src: e,
            async: !0,
            onload: u,
            onerror: u,
            onreadystatechange: function() {
                /loaded|complete/i.test(this.readyState) && u()
            }
        }); - 1 < window.navigator.userAgent.toLowerCase().indexOf("opera") && (a = this.append("script", {
            text: "document.getElementById('" + k + "').onerror();"
        }), x.async = !1);
        m && window.setTimeout(function() {
            q = b("timeout", "timeout");
            u()
        }, m);
        l.appendChild(x);
        a && l.appendChild(a)
    },
    post: function(e, c, k, m, a, b) {
        var d, l = this.error,
            q = document,
            u = null,
            x = [],
            f = 0,
            v = null,
            D = 0,
            z =
            function(a) {
                D++ || m(a)
            };
        this.globalEvent(z, a);
        var A;
        try {
            A = q.createElement('<iframe name="' + a + '">')
        } catch (r) {
            A = q.createElement("iframe")
        }
        if (A.name = a, A.id = a, A.style.display = "none", k && k.callbackonload && (A.onload = function() {
                z({
                    response: "posted",
                    message: "Content was posted"
                })
            }), b && setTimeout(function() {
                z(l("timeout", "The post operation timed out"))
            }, b), q.body.appendChild(A), this.domInstance("form", c)) {
            u = c.form;
            for (f = 0; f < u.elements.length; f++) u.elements[f] !== c && u.elements[f].setAttribute("disabled", !0);
            c = u
        }
        if (this.domInstance("form", c))
            for (u = c, f = 0; f < u.elements.length; f++) u.elements[f].disabled || "file" !== u.elements[f].type || (u.encoding = u.enctype = "multipart/form-data", u.elements[f].setAttribute("name", "file"));
        else {
            for (v in c) c.hasOwnProperty(v) && this.domInstance("input", c[v]) && "file" === c[v].type && (u = c[v].form, u.encoding = u.enctype = "multipart/form-data");
            u || (u = q.createElement("form"), q.body.appendChild(u), d = u);
            var B;
            for (v in c)
                if (c.hasOwnProperty(v))
                    if ((k = this.domInstance("input", c[v]) || this.domInstance("textArea",
                            c[v]) || this.domInstance("select", c[v])) && c[v].form === u) k && c[v].name !== v && (c[v].setAttribute("name", v), c[v].name = v);
                    else {
                        b = u.elements[v];
                        if (B)
                            for (b instanceof NodeList || (b = [b]), f = 0; f < b.length; f++) b[f].parentNode.removeChild(b[f]);
                        B = q.createElement("input");
                        B.setAttribute("type", "hidden");
                        B.setAttribute("name", v);
                        k ? B.value = c[v].value : this.domInstance(null, c[v]) ? B.value = c[v].innerHTML || c[v].innerText : B.value = c[v];
                        u.appendChild(B)
                    }
            for (f = 0; f < u.elements.length; f++) B = u.elements[f], B.name in c || !0 === B.getAttribute("disabled") ||
                (B.setAttribute("disabled", !0), x.push(B))
        }
        u.setAttribute("method", "POST");
        u.setAttribute("target", a);
        u.target = a;
        u.setAttribute("action", e);
        setTimeout(function() {
            u.submit();
            setTimeout(function() {
                try {
                    d && d.parentNode.removeChild(d)
                } catch (a) {
                    try {
                        console.error("HelloJS: could not remove iframe")
                    } catch (b) {}
                }
                for (var c = 0; c < x.length; c++) x[c] && (x[c].setAttribute("disabled", !1), x[c].disabled = !1)
            }, 0)
        }, 100)
    },
    hasBinary: function(e) {
        for (var c in e)
            if (e.hasOwnProperty(c) && this.isBinary(e[c])) return !0;
        return !1
    },
    isBinary: function(e) {
        return e instanceof
        Object && (this.domInstance("input", e) && "file" === e.type || "FileList" in window && e instanceof window.FileList || "File" in window && e instanceof window.File || "Blob" in window && e instanceof window.Blob)
    },
    toBlob: function(e) {
        var c = /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i,
            k = e.match(c);
        if (!k) return e;
        e = atob(e.replace(c, ""));
        for (var c = [], m = 0; m < e.length; m++) c.push(e.charCodeAt(m));
        return new Blob([new Uint8Array(c)], {
            type: k[1]
        })
    }
});
(function(e) {
    var c = e.api,
        k = e.utils;
    k.extend(k, {
        dataToJSON: function(c) {
            var a = window,
                b = c.data;
            if (this.domInstance("form", b) ? b = this.nodeListToJSON(b.elements) : "NodeList" in a && b instanceof NodeList ? b = this.nodeListToJSON(b) : this.domInstance("input", b) && (b = this.nodeListToJSON([b])), ("File" in a && b instanceof a.File || "Blob" in a && b instanceof a.Blob || "FileList" in a && b instanceof a.FileList) && (b = {
                    file: b
                }), !("FormData" in a && b instanceof a.FormData))
                for (var d in b) b.hasOwnProperty(d) && ("FileList" in a && b[d] instanceof a.FileList ? 1 === b[d].length && (b[d] = b[d][0]) : this.domInstance("input", b[d]) && "file" === b[d].type || (this.domInstance("input", b[d]) || this.domInstance("select", b[d]) || this.domInstance("textArea", b[d]) ? b[d] = b[d].value : this.domInstance(null, b[d]) && (b[d] = b[d].innerHTML || b[d].innerText)));
            return c.data = b, b
        },
        nodeListToJSON: function(c) {
            for (var a = {}, b = 0; b < c.length; b++) {
                var d = c[b];
                !d.disabled && d.name && ("file" === d.type ? a[d.name] = d : a[d.name] = d.value || d.innerHTML)
            }
            return a
        }
    });
    e.api = function() {
        var e = k.args({
            path: "s!",
            method: "s",
            data: "o",
            timeout: "i",
            callback: "f"
        }, arguments);
        return e.data && k.dataToJSON(e), c.call(this, e)
    }
})(hello);
hello.utils.responseHandler(window, window.opener || window.parent);
"object" == typeof chrome && "object" == typeof chrome.identity && chrome.identity.launchWebAuthFlow && ! function() {
    function e(c, m) {
        var a = {
            closed: !1
        };
        return chrome.identity.launchWebAuthFlow({
            url: c,
            interactive: m
        }, function(b) {
            if (void 0 === b) return void(a.closed = !0);
            b = hello.utils.url(b);
            hello.utils.responseHandler({
                location: {
                    assign: function(a) {
                        e(a, !1)
                    },
                    search: b.search,
                    hash: b.hash,
                    href: b.href
                },
                close: function() {}
            }, window)
        }), a
    }
    hello.utils.popup = function(c) {
        return e(c, !0)
    };
    hello.utils.iframe = function(c) {
        e(c, !1)
    };
    hello.utils.request_cors = function(c) {
        return c(), !0
    };
    var c = {};
    chrome.storage.local.get("hello", function(e) {
        c = e.hello || {}
    });
    hello.utils.store = function(e, m) {
        return 0 === arguments.length ? c : 1 === arguments.length ? c[e] || null : m ? (c[e] = m, chrome.storage.local.set({
            hello: c
        }), m) : null === m ? (delete c[e], chrome.storage.local.set({
            hello: c
        }), null) : void 0
    }
}();
(function() {
    if (/^file:\/{3}[^\/]/.test(window.location.href) && window.cordova) {
        hello.utils.iframe = function(c, e) {
            hello.utils.popup(c, e, {
                hidden: "yes"
            })
        };
        var e = hello.utils.popup;
        hello.utils.popup = function(c, k, m) {
            var a = e.call(this, c, k, m);
            try {
                if (a && a.addEventListener) {
                    var b = hello.utils.url(k),
                        d = b.origin || b.protocol + "//" + b.hostname;
                    a.addEventListener("loadstart", function(b) {
                        b = b.url;
                        0 === b.indexOf(d) && (b = hello.utils.url(b), hello.utils.responseHandler({
                            location: {
                                assign: function(b) {
                                    a.executeScript({
                                        code: 'window.location.href = "' +
                                            b + ';"'
                                    })
                                },
                                search: b.search,
                                hash: b.hash,
                                href: b.href
                            },
                            close: function() {
                                if (a.close) {
                                    a.close();
                                    try {
                                        a.closed = !0
                                    } catch (b) {}
                                }
                            }
                        }, window))
                    })
                }
            } catch (l) {}
            return a
        }
    }
})();
(function(e) {
    function c(a) {
        a && "error" in a && (a.error = {
            code: "server_error",
            message: a.error.message || a.error
        })
    }

    function k(a, b, c) {
        "object" != typeof a || "undefined" != typeof Blob && a instanceof Blob || "undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer || "error" in a || (b = ("app_folder" !== a.root ? a.root : "") + a.path.replace(/\&/g, "%26"), b = b.replace(/^\//, ""), a.thumb_exists && (a.thumbnail = c.oauth_proxy + "?path=" + encodeURIComponent("https://api-content.dropbox.com/1/thumbnails/auto/" + b + "?format=jpeg&size=m") + "&access_token=" +
            c.options.access_token), a.type = a.is_dir ? "folder" : a.mime_type, a.name = a.path.replace(/.*\//g, ""), a.is_dir ? a.files = b.replace(/^\//, "") : (a.downloadLink = e.settings.oauth_proxy + "?path=" + encodeURIComponent("https://api-content.dropbox.com/1/files/auto/" + b) + "&access_token=" + c.options.access_token, a.file = "https://api-content.dropbox.com/1/files/auto/" + b), a.id || (a.id = a.path.replace(/^\//, "")))
    }

    function m(a) {
        return function(b, c) {
            delete b.query.limit;
            c(a)
        }
    }
    var a = {
            version: "1.0",
            auth: "https://www.dropbox.com/1/oauth/authorize",
            request: "https://api.dropbox.com/1/oauth/request_token",
            token: "https://api.dropbox.com/1/oauth/access_token"
        },
        b = {
            version: 2,
            auth: "https://www.dropbox.com/1/oauth2/authorize",
            grant: "https://api.dropbox.com/1/oauth2/token"
        };
    e.init({
        dropbox: {
            name: "Dropbox",
            oauth: b,
            login: function(c) {
                c.qs.scope = "";
                var k = decodeURIComponent(c.qs.redirect_uri);
                0 === k.indexOf("http:") && 0 !== k.indexOf("http://localhost/") ? e.services.dropbox.oauth = a : e.services.dropbox.oauth = b;
                c.options.popup.width = 1E3;
                c.options.popup.height = 1E3
            },
            base: "https://api.dropbox.com/1/",
            root: "sandbox",
            get: {
                me: "account/info",
                "me/files": m("metadata/auto/@{parent|}"),
                "me/folder": m("metadata/auto/@{id}"),
                "me/folders": m("metadata/auto/"),
                "default": function(a, b) {
                    a.path.match("https://api-content.dropbox.com/1/files/") && (a.method = "blob");
                    b(a.path)
                }
            },
            post: {
                "me/files": function(a, b) {
                    var c = a.data.parent,
                        k = a.data.name;
                    a.data = {
                        file: a.data.file
                    };
                    "string" == typeof a.data.file && (a.data.file = e.utils.toBlob(a.data.file));
                    b("https://api-content.dropbox.com/1/files_put/auto/" +
                        c + "/" + k)
                },
                "me/folders": function(a, b) {
                    var c = a.data.name;
                    a.data = {};
                    b("fileops/create_folder?root=@{root|sandbox}&" + e.utils.param({
                        path: c
                    }))
                }
            },
            del: {
                "me/files": "fileops/delete?root=@{root|sandbox}&path=@{id}",
                "me/folder": "fileops/delete?root=@{root|sandbox}&path=@{id}"
            },
            wrap: {
                me: function(a) {
                    if (c(a), !a.uid) return a;
                    a.name = a.display_name;
                    var b = a.name.split(" ");
                    return a.first_name = b.shift(), a.last_name = b.join(" "), a.id = a.uid, delete a.uid, delete a.display_name, a
                },
                "default": function(a, b, e) {
                    return c(a), a.is_dir &&
                        a.contents && (a.data = a.contents, delete a.contents, a.data.forEach(function(c) {
                            c.root = a.root;
                            k(c, b, e)
                        })), k(a, b, e), a.is_deleted && (a.success = !0), a
                }
            },
            xhr: function(a) {
                if (a.data && a.data.file) {
                    var b = a.data.file;
                    b && (b.files ? a.data = b.files[0] : a.data = b)
                }
                return "delete" === a.method && (a.method = "post"), !0
            },
            form: function(a, b) {
                delete b.state;
                delete b.redirect_uri
            }
        }
    })
})(hello);
(function(e) {
    function c(a) {
        return a.id && (a.thumbnail = a.picture = "https://graph.facebook.com/" + a.id + "/picture"), a
    }

    function k(a) {
        return "data" in a && a.data.forEach(c), a
    }

    function m(b, c, e) {
        if ("boolean" == typeof b && (b = {
                success: b
            }), b && "data" in b) {
            var k = e.query.access_token;
            b.data instanceof Array || (c = b.data, delete b.data, b.data = [c]);
            b.data.forEach(function(b) {
                b.picture && (b.thumbnail = b.picture);
                b.pictures = (b.images || []).sort(function(a, b) {
                    return a.width - b.width
                });
                b.cover_photo && b.cover_photo.id && (b.thumbnail =
                    a + b.cover_photo.id + "/picture?access_token=" + k);
                "album" === b.type && (b.files = b.photos = a + b.id + "/photos");
                b.can_upload && (b.upload_location = a + b.id + "/photos")
            })
        }
        return b
    }
    e.init({
        facebook: {
            name: "Facebook",
            oauth: {
                version: 2,
                auth: "https://www.facebook.com/dialog/oauth/",
                grant: "https://graph.facebook.com/oauth/access_token"
            },
            scope: {
                basic: "public_profile",
                email: "email",
                share: "user_posts",
                birthday: "user_birthday",
                events: "user_events",
                photos: "user_photos",
                videos: "user_videos",
                friends: "user_friends",
                files: "user_photos,user_videos",
                publish_files: "user_photos,user_videos,publish_actions",
                publish: "publish_actions",
                offline_access: ""
            },
            refresh: !1,
            login: function(a) {
                a.options.force && (a.qs.auth_type = "reauthenticate");
                a.qs.display = a.options.display || "popup"
            },
            logout: function(a, c) {
                var k = e.utils.globalEvent(a),
                    k = encodeURIComponent(e.settings.redirect_uri + "?" + e.utils.param({
                        callback: k,
                        result: JSON.stringify({
                            force: !0
                        }),
                        state: "{}"
                    })),
                    m = (c.authResponse || {}).access_token;
                return e.utils.iframe("https://www.facebook.com/logout.php?next=" + k + "&access_token=" +
                    m), m ? void 0 : !1
            },
            base: "https://graph.facebook.com/v2.7/",
            get: {
                me: "me?fields=email,first_name,last_name,name,timezone,verified",
                "me/friends": "me/friends",
                "me/following": "me/friends",
                "me/followers": "me/friends",
                "me/share": "me/feed",
                "me/like": "me/likes",
                "me/files": "me/albums",
                "me/albums": "me/albums?fields=cover_photo,name",
                "me/album": "@{id}/photos?fields=picture",
                "me/photos": "me/photos",
                "me/photo": "@{id}",
                "friend/albums": "@{id}/albums",
                "friend/photos": "@{id}/photos"
            },
            post: {
                "me/share": "me/feed",
                "me/photo": "@{id}"
            },
            wrap: {
                me: c,
                "me/friends": k,
                "me/following": k,
                "me/followers": k,
                "me/albums": m,
                "me/photos": m,
                "me/files": m,
                "default": m
            },
            xhr: function(a, c) {
                return "get" !== a.method && "post" !== a.method || (c.suppress_response_codes = !0), "post" === a.method && a.data && "string" == typeof a.data.file && (a.data.file = e.utils.toBlob(a.data.file)), !0
            },
            jsonp: function(a, c) {
                var k = a.method;
                "get" === k || e.utils.hasBinary(a.data) ? "delete" === a.method && (c.method = "delete", a.method = "post") : (a.data.method = k, a.method = "get")
            },
            form: function(a) {
                return {
                    callbackonload: !0
                }
            }
        }
    });
    var a = "https://graph.facebook.com/"
})(hello);
(function(e) {
    function c(a, b, c) {
        a = (c ? "" : "flickr:") + "?method=" + a + "&api_key=" + e.services.flickr.id + "&format=json";
        for (var d in b) b.hasOwnProperty(d) && (a += "&" + d + "=" + b[d]);
        return a
    }

    function k(a) {
        var b = e.getAuthResponse("flickr");
        a(b && b.user_nsid ? b.user_nsid : null)
    }

    function m(a, b) {
        return b || (b = {}),
            function(d, f) {
                k(function(d) {
                    b.user_id = d;
                    f(c(a, b, !0))
                })
            }
    }

    function a(a, b) {
        var c = "https://www.flickr.com/images/buddyicon.gif";
        return a.nsid && a.iconserver && a.iconfarm && (c = "https://farm" + a.iconfarm + ".staticflickr.com/" +
            a.iconserver + "/buddyicons/" + a.nsid + (b ? "_" + b : "") + ".jpg"), c
    }

    function b(a, b, c, d, f) {
        return f = f ? "_" + f : "", "https://farm" + b + ".staticflickr.com/" + c + "/" + a + "_" + d + f + ".jpg"
    }

    function d(a) {
        a && a.stat && "ok" != a.stat.toLowerCase() && (a.error = {
            code: "invalid_request",
            message: a.message
        })
    }

    function l(a) {
        if (a.photoset || a.photos) {
            a = u(a, "photoset" in a ? "photoset" : "photos");
            f(a);
            a.data = a.photo;
            delete a.photo;
            for (var c = 0; c < a.data.length; c++) {
                var d = a.data[c];
                d.name = d.title;
                d.picture = b(d.id, d.farm, d.server, d.secret, "");
                d.pictures =
                    q(d.id, d.farm, d.server, d.secret);
                d.source = b(d.id, d.farm, d.server, d.secret, "b");
                d.thumbnail = b(d.id, d.farm, d.server, d.secret, "m")
            }
        }
        return a
    }

    function q(a, c, d, f) {
        return [{
            id: "t",
            max: 100
        }, {
            id: "m",
            max: 240
        }, {
            id: "n",
            max: 320
        }, {
            id: "",
            max: 500
        }, {
            id: "z",
            max: 640
        }, {
            id: "c",
            max: 800
        }, {
            id: "b",
            max: 1024
        }, {
            id: "h",
            max: 1600
        }, {
            id: "k",
            max: 2048
        }, {
            id: "o",
            max: 2048
        }].map(function(e) {
            return {
                source: b(a, c, d, f, e.id),
                width: e.max,
                height: e.max
            }
        })
    }

    function u(a, b) {
        return b in a ? a = a[b] : "error" in a || (a.error = {
            code: "invalid_request",
            message: a.message ||
                "Failed to get data from Flickr"
        }), a
    }

    function x(b) {
        if (d(b), b.contacts) {
            b = u(b, "contacts");
            f(b);
            b.data = b.contact;
            delete b.contact;
            for (var c = 0; c < b.data.length; c++) {
                var e = b.data[c];
                e.id = e.nsid;
                e.name = e.realname || e.username;
                e.thumbnail = a(e, "m")
            }
        }
        return b
    }

    function f(a) {
        a.page && a.pages && a.page !== a.pages && (a.paging = {
            next: "?page=" + ++a.page
        })
    }
    e.init({
        flickr: {
            name: "Flickr",
            oauth: {
                version: "1.0a",
                auth: "https://www.flickr.com/services/oauth/authorize?perms=read",
                request: "https://www.flickr.com/services/oauth/request_token",
                token: "https://www.flickr.com/services/oauth/access_token"
            },
            base: "https://api.flickr.com/services/rest",
            get: {
                me: m("flickr.people.getInfo"),
                "me/friends": m("flickr.contacts.getList", {
                    per_page: "@{limit|50}"
                }),
                "me/following": m("flickr.contacts.getList", {
                    per_page: "@{limit|50}"
                }),
                "me/followers": m("flickr.contacts.getList", {
                    per_page: "@{limit|50}"
                }),
                "me/albums": m("flickr.photosets.getList", {
                    per_page: "@{limit|50}"
                }),
                "me/album": m("flickr.photosets.getPhotos", {
                    photoset_id: "@{id}"
                }),
                "me/photos": m("flickr.people.getPhotos", {
                    per_page: "@{limit|50}"
                })
            },
            wrap: {
                me: function(b) {
                    if (d(b), b = u(b, "person"), b.id) {
                        if (b.realname) {
                            b.name = b.realname._content;
                            var c = b.name.split(" ");
                            b.first_name = c.shift();
                            b.last_name = c.join(" ")
                        }
                        b.thumbnail = a(b, "l");
                        b.picture = a(b, "l")
                    }
                    return b
                },
                "me/friends": x,
                "me/followers": x,
                "me/following": x,
                "me/albums": function(a) {
                    return d(a), a = u(a, "photosets"), f(a), a.photoset && (a.data = a.photoset, a.data.forEach(function(a) {
                        a.name = a.title._content;
                        a.photos = "https://api.flickr.com/services/rest" + c("flickr.photosets.getPhotos", {
                            photoset_id: a.id
                        }, !0)
                    }), delete a.photoset), a
                },
                "me/photos": function(a) {
                    return d(a), l(a)
                },
                "default": function(a) {
                    return d(a), l(a)
                }
            },
            xhr: !1,
            jsonp: function(a, b) {
                "get" == a.method && (delete b.callback, b.jsoncallback = a.callbackID)
            }
        }
    })
})(hello);
(function(e) {
    function c(a) {
        !a.meta || 400 !== a.meta.code && 401 !== a.meta.code || (a.error = {
            code: "access_denied",
            message: a.meta.errorDetail
        })
    }

    function k(a) {
        a && a.id && (a.thumbnail = a.photo.prefix + "100x100" + a.photo.suffix, a.name = a.firstName + " " + a.lastName, a.first_name = a.firstName, a.last_name = a.lastName, a.contact && a.contact.email && (a.email = a.contact.email))
    }

    function m(a, b) {
        var c = b.access_token;
        return delete b.access_token, b.oauth_token = c, b.v = 20121125, !0
    }
    e.init({
        foursquare: {
            name: "Foursquare",
            oauth: {
                version: 2,
                auth: "https://foursquare.com/oauth2/authenticate",
                grant: "https://foursquare.com/oauth2/access_token"
            },
            refresh: !0,
            base: "https://api.foursquare.com/v2/",
            get: {
                me: "users/self",
                "me/friends": "users/self/friends",
                "me/followers": "users/self/friends",
                "me/following": "users/self/friends"
            },
            wrap: {
                me: function(a) {
                    return c(a), a && a.response && (a = a.response.user, k(a)), a
                },
                "default": function(a) {
                    return c(a), a && "response" in a && "friends" in a.response && "items" in a.response.friends && (a.data = a.response.friends.items, a.data.forEach(k), delete a.response), a
                }
            },
            xhr: m,
            jsonp: m
        }
    })
})(hello);
(function(e) {
    function c(c, a) {
        var b = a ? a.statusCode : c && "meta" in c && "status" in c.meta && c.meta.status;
        401 !== b && 403 !== b || (c.error = {
            code: "access_denied",
            message: c.message || (c.data ? c.data.message : "Could not get response")
        }, delete c.message)
    }

    function k(c) {
        c.id && (c.thumbnail = c.picture = c.avatar_url, c.name = c.login)
    }
    e.init({
        github: {
            name: "GitHub",
            oauth: {
                version: 2,
                auth: "https://github.com/login/oauth/authorize",
                grant: "https://github.com/login/oauth/access_token",
                response_type: "code"
            },
            scope: {
                email: "user:email"
            },
            base: "https://api.github.com/",
            get: {
                me: "user",
                "me/friends": "user/following?per_page=@{limit|100}",
                "me/following": "user/following?per_page=@{limit|100}",
                "me/followers": "user/followers?per_page=@{limit|100}",
                "me/like": "user/starred?per_page=@{limit|100}"
            },
            wrap: {
                me: function(e, a) {
                    return c(e, a), k(e), e
                },
                "default": function(e, a, b) {
                    c(e, a);
                    Array.isArray(e) && (e = {
                        data: e
                    });
                    e.data && (b = e, b.data && b.data.length && a && a.Link && (a = a.Link.match(/<(.*?)>;\s*rel=\"next\"/)) && (b.paging = {
                        next: a[1]
                    }), e.data.forEach(k));
                    return e
                }
            },
            xhr: function(c) {
                return "get" !== c.method && c.data && (c.headers = c.headers || {}, c.headers["Content-Type"] = "application/json", "object" == typeof c.data && (c.data = JSON.stringify(c.data))), !0
            }
        }
    })
})(hello);
(function(e) {
    function c(a) {
        return q(a), a.data = a.items, delete a.items, a
    }

    function k(a) {
        return a.error ? void 0 : (a.name || (a.name = a.title || a.message), a.picture || (a.picture = a.thumbnailLink), a.thumbnail || (a.thumbnail = a.thumbnailLink), "application/vnd.google-apps.folder" === a.mimeType && (a.type = "folder", a.files = "https://www.googleapis.com/drive/v2/files?q=%22" + a.id + "%22+in+parents"), a)
    }

    function m(a) {
        return {
            source: a.url,
            width: a.width,
            height: a.height
        }
    }

    function a(a) {
        if (q(a), "feed" in a && "entry" in a.feed) a.data =
            a.feed.entry.map(l), delete a.feed;
        else {
            if ("entry" in a) return l(a.entry);
            "items" in a ? (a.data = a.items.map(k), delete a.items) : k(a)
        }
        return a
    }

    function b(a) {
        a.name = a.displayName || a.name;
        a.picture = a.picture || (a.image ? a.image.url : null);
        a.thumbnail = a.picture
    }

    function d(a, b, c) {
        q(a);
        if ("feed" in a && "entry" in a.feed) {
            b = c.query.access_token;
            for (c = 0; c < a.feed.entry.length; c++) {
                var d = a.feed.entry[c];
                if (d.id = d.id.$t, d.name = d.title.$t, delete d.title, d.gd$email && (d.email = d.gd$email && 0 < d.gd$email.length ? d.gd$email[0].address :
                        null, d.emails = d.gd$email, delete d.gd$email), d.updated && (d.updated = d.updated.$t), d.link) {
                    var e = 0 < d.link.length ? d.link[0].href : null;
                    e && d.link[0].gd$etag && (e += (-1 < e.indexOf("?") ? "&" : "?") + "access_token=" + b, d.picture = e, d.thumbnail = e);
                    delete d.link
                }
                d.category && delete d.category
            }
            a.data = a.feed.entry;
            delete a.feed
        }
        return a
    }

    function l(a) {
        var b, c = a.media$group,
            d = c.media$content.length ? c.media$content[0] : {},
            e = (c.media$content || []).concat(c.media$thumbnail || []).map(m).sort(function(a, b) {
                return a.width - b.width
            }),
            k = 0,
            d = {
                id: a.id.$t,
                name: a.title.$t,
                description: a.summary.$t,
                updated_time: a.updated.$t,
                created_time: a.published.$t,
                picture: d ? d.url : null,
                pictures: e,
                images: [],
                thumbnail: d ? d.url : null,
                width: d.width,
                height: d.height
            };
        if ("link" in a)
            for (k = 0; k < a.link.length; k++)
                if (e = a.link[k], e.rel.match(/\#feed$/)) {
                    d.upload_location = d.files = d.photos = e.href;
                    break
                }
        if ("category" in a && a.category.length)
            for (b = a.category, k = 0; k < b.length; k++) b[k].scheme && b[k].scheme.match(/\#kind$/) && (d.type = b[k].term.replace(/^.*?\#/, ""));
        return "media$thumbnail" in
            c && c.media$thumbnail.length && (b = c.media$thumbnail, d.thumbnail = b[0].url, d.images = b.map(m)), b = c.media$content, b && b.length && d.images.push(m(b[0])), d
    }

    function q(a) {
        if ("feed" in a && a.feed.openSearch$itemsPerPage) {
            var b = parseInt(a.feed.openSearch$itemsPerPage.$t, 10),
                c = parseInt(a.feed.openSearch$startIndex.$t, 10);
            parseInt(a.feed.openSearch$totalResults.$t, 10) > c + b && (a.paging = {
                next: "?start=" + (c + b)
            })
        } else "nextPageToken" in a && (a.paging = {
            next: "?pageToken=" + a.nextPageToken
        })
    }

    function u() {
        function a(c) {
            var d = new FileReader;
            d.onload = function(a) {
                b(btoa(a.target.result), c.type + k + "Content-Transfer-Encoding: base64")
            };
            d.readAsBinaryString(c)
        }

        function b(a, d) {
            c.push(k + "Content-Type: " + d + k + k + a);
            e--;
            m()
        }
        var c = [],
            d = (1E10 * Math.random()).toString(32),
            e = 0,
            k = "\r\n",
            l = k + "--" + d,
            m = function() {},
            q = /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i;
        this.append = function(c, d) {
            "string" != typeof c && "length" in Object(c) || (c = [c]);
            for (var l = 0; l < c.length; l++) {
                e++;
                var m = c[l];
                if ("undefined" != typeof File && m instanceof File || "undefined" != typeof Blob &&
                    m instanceof Blob) a(m);
                else if ("string" == typeof m && m.match(q)) {
                    var t = m.match(q);
                    b(m.replace(q, ""), t[1] + k + "Content-Transfer-Encoding: base64")
                } else b(m, d)
            }
        };
        this.onready = function(a) {
            (m = function() {
                0 === e && (c.unshift(""), c.push("--"), a(c.join(l), d), c = [])
            })()
        }
    }

    function x(a, b) {
        var c = {};
        a.data && "undefined" != typeof HTMLInputElement && a.data instanceof HTMLInputElement && (a.data = {
            file: a.data
        });
        !a.data.name && Object(Object(a.data.file).files).length && "post" === a.method && (a.data.name = a.data.file.files[0].name);
        "post" === a.method ? a.data = {
            title: a.data.name,
            parents: [{
                id: a.data.parent || "root"
            }],
            file: a.data.file
        } : (c = a.data, a.data = {}, c.parent && (a.data.parents = [{
            id: a.data.parent || "root"
        }]), c.file && (a.data.file = c.file), c.name && (a.data.title = c.name));
        var d;
        if ("file" in a.data && (d = a.data.file, delete a.data.file, "object" == typeof d && "files" in d && (d = d.files), !d || !d.length)) return void b({
            error: {
                code: "request_invalid",
                message: "There were no files attached with this request to upload"
            }
        });
        var e = new u;
        e.append(JSON.stringify(a.data),
            "application/json");
        d && e.append(d);
        e.onready(function(d, e) {
            a.headers["content-type"] = 'multipart/related; boundary="' + e + '"';
            a.data = d;
            b("upload/drive/v2/files" + (c.id ? "/" + c.id : "") + "?uploadType=multipart")
        })
    }
    e.init({
        google: {
            name: "Google Plus",
            oauth: {
                version: 2,
                auth: "https://accounts.google.com/o/oauth2/auth",
                grant: "https://accounts.google.com/o/oauth2/token"
            },
            scope: {
                basic: "https://www.googleapis.com/auth/plus.me profile",
                email: "email",
                birthday: "",
                events: "",
                photos: "https://picasaweb.google.com/data/",
                videos: "http://gdata.youtube.com",
                friends: "https://www.google.com/m8/feeds, https://www.googleapis.com/auth/plus.login",
                files: "https://www.googleapis.com/auth/drive.readonly",
                publish: "",
                publish_files: "https://www.googleapis.com/auth/drive",
                share: "",
                create_event: "",
                offline_access: ""
            },
            scope_delim: " ",
            login: function(a) {
                "code" === a.qs.response_type && (a.qs.access_type = "offline");
                a.options.force && (a.qs.approval_prompt = "force")
            },
            base: "https://www.googleapis.com/",
            get: {
                me: "plus/v1/people/me",
                "me/friends": "plus/v1/people/me/people/visible?maxResults=@{limit|100}",
                "me/following": "https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=@{limit|1000}&start-index=@{start|1}",
                "me/followers": "https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=@{limit|1000}&start-index=@{start|1}",
                "me/contacts": "https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=@{limit|1000}&start-index=@{start|1}",
                "me/share": "plus/v1/people/me/activities/public?maxResults=@{limit|100}",
                "me/feed": "plus/v1/people/me/activities/public?maxResults=@{limit|100}",
                "me/albums": "https://picasaweb.google.com/data/feed/api/user/default?alt=json&max-results=@{limit|100}&start-index=@{start|1}",
                "me/album": function(a, b) {
                    var c = a.query.id;
                    delete a.query.id;
                    b(c.replace("/entry/", "/feed/"))
                },
                "me/photos": "https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photo&max-results=@{limit|100}&start-index=@{start|1}",
                "me/file": "drive/v2/files/@{id}",
                "me/files": "drive/v2/files?q=%22@{parent|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}",
                "me/folders": "drive/v2/files?q=%22@{id|root}%22+in+parents+and+mimeType+=+%22application/vnd.google-apps.folder%22+and+trashed=false&maxResults=@{limit|100}",
                "me/folder": "drive/v2/files?q=%22@{id|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}"
            },
            post: {
                "me/files": x,
                "me/folders": function(a, b) {
                    a.data = {
                        title: a.data.name,
                        parents: [{
                            id: a.data.parent || "root"
                        }],
                        mimeType: "application/vnd.google-apps.folder"
                    };
                    b("drive/v2/files")
                }
            },
            put: {
                "me/files": x
            },
            del: {
                "me/files": "drive/v2/files/@{id}",
                "me/folder": "drive/v2/files/@{id}"
            },
            patch: {
                "me/file": "drive/v2/files/@{id}"
            },
            wrap: {
                me: function(a) {
                    return a.id && (a.last_name = a.family_name || (a.name ? a.name.familyName :
                        null), a.first_name = a.given_name || (a.name ? a.name.givenName : null), a.emails && a.emails.length && (a.email = a.emails[0].value), b(a)), a
                },
                "me/friends": function(a) {
                    return a.items && (q(a), a.data = a.items, a.data.forEach(b), delete a.items), a
                },
                "me/contacts": d,
                "me/followers": d,
                "me/following": d,
                "me/share": c,
                "me/feed": c,
                "me/albums": a,
                "me/photos": function(a) {
                    a.data = a.feed.entry.map(l);
                    delete a.feed
                },
                "default": a
            },
            xhr: function(a) {
                if ("post" === a.method || "put" === a.method) {
                    if ("object" == typeof a.data) try {
                        a.data = JSON.stringify(a.data),
                            a.headers["content-type"] = "application/json"
                    } catch (b) {}
                } else "patch" === a.method && (e.utils.extend(a.query, a.data), a.data = null);
                return !0
            },
            form: !1
        }
    })
})(hello);
(function(e) {
    function c(a) {
        return "string" == typeof a ? {
            error: {
                code: "invalid_request",
                message: a
            }
        } : (a && "meta" in a && "error_type" in a.meta && (a.error = {
            code: a.meta.error_type,
            message: a.meta.error_message
        }), a)
    }

    function k(b) {
        return a(b), b && "data" in b && b.data.forEach(m), b
    }

    function m(a) {
        a.id && (a.thumbnail = a.profile_picture, a.name = a.full_name || a.username)
    }

    function a(a) {
        "pagination" in a && (a.paging = {
            next: a.pagination.next_url
        }, delete a.pagination)
    }
    e.init({
        instagram: {
            name: "Instagram",
            oauth: {
                version: 2,
                auth: "https://instagram.com/oauth/authorize/",
                grant: "https://api.instagram.com/oauth/access_token"
            },
            refresh: !0,
            scope: {
                basic: "basic",
                photos: "",
                friends: "relationships",
                publish: "likes comments",
                email: "",
                share: "",
                publish_files: "",
                files: "",
                videos: "",
                offline_access: ""
            },
            scope_delim: " ",
            base: "https://api.instagram.com/v1/",
            get: {
                me: "users/self",
                "me/feed": "users/self/feed?count=@{limit|100}",
                "me/photos": "users/self/media/recent?min_id=0&count=@{limit|100}",
                "me/friends": "users/self/follows?count=@{limit|100}",
                "me/following": "users/self/follows?count=@{limit|100}",
                "me/followers": "users/self/followed-by?count=@{limit|100}",
                "friend/photos": "users/@{id}/media/recent?min_id=0&count=@{limit|100}"
            },
            post: {
                "me/like": function(a, c) {
                    var e = a.data.id;
                    a.data = {};
                    c("media/" + e + "/likes")
                }
            },
            del: {
                "me/like": "media/@{id}/likes"
            },
            wrap: {
                me: function(a) {
                    return c(a), "data" in a && (a.id = a.data.id, a.thumbnail = a.data.profile_picture, a.name = a.data.full_name || a.data.username), a
                },
                "me/friends": k,
                "me/following": k,
                "me/followers": k,
                "me/photos": function(b) {
                    return c(b), a(b), "data" in b && (b.data = b.data.filter(function(a) {
                        return "image" ===
                            a.type
                    }), b.data.forEach(function(a) {
                        a.name = a.caption ? a.caption.text : null;
                        a.thumbnail = a.images.thumbnail.url;
                        a.picture = a.images.standard_resolution.url;
                        a.pictures = Object.keys(a.images).map(function(b) {
                            b = a.images[b];
                            return {
                                source: b.url,
                                width: b.width,
                                height: b.height
                            }
                        }).sort(function(a, b) {
                            return a.width - b.width
                        })
                    })), b
                },
                "default": function(b) {
                    return b = c(b), a(b), b
                }
            },
            xhr: function(a, c) {
                var e = a.method,
                    k = "get" !== e;
                return k && ("post" !== e && "put" !== e || !a.query.access_token || (a.data.access_token = a.query.access_token,
                    delete a.query.access_token), a.proxy = k), k
            },
            form: !1
        }
    })
})(hello);
(function(e) {
    function c(c, a) {
        var b, d;
        return c && "Message" in c && (d = c.Message, delete c.Message, "ErrorCode" in c ? (b = c.ErrorCode, delete c.ErrorCode) : b = k(a), c.error = {
            code: b,
            message: d,
            details: c
        }), c
    }

    function k(c) {
        switch (c.statusCode) {
            case 400:
                return "invalid_request";
            case 403:
                return "stale_token";
            case 401:
                return "invalid_token";
            case 500:
                return "server_error";
            default:
                return "server_error"
        }
    }
    e.init({
        joinme: {
            name: "join.me",
            oauth: {
                version: 2,
                auth: "https://secure.join.me/api/public/v1/auth/oauth2",
                grant: "https://secure.join.me/api/public/v1/auth/oauth2"
            },
            refresh: !1,
            scope: {
                basic: "user_info",
                user: "user_info",
                scheduler: "scheduler",
                start: "start_meeting",
                email: "",
                friends: "",
                share: "",
                publish: "",
                photos: "",
                publish_files: "",
                files: "",
                videos: "",
                offline_access: ""
            },
            scope_delim: " ",
            login: function(c) {
                c.options.popup.width = 400;
                c.options.popup.height = 700
            },
            base: "https://api.join.me/v1/",
            get: {
                me: "user",
                meetings: "meetings",
                "meetings/info": "meetings/@{id}"
            },
            post: {
                "meetings/start/adhoc": function(c, a) {
                    a("meetings/start")
                },
                "meetings/start/scheduled": function(c, a) {
                    var b =
                        c.data.meetingId;
                    c.data = {};
                    a("meetings/" + b + "/start")
                },
                "meetings/schedule": function(c, a) {
                    a("meetings")
                }
            },
            patch: {
                "meetings/update": function(c, a) {
                    a("meetings/" + c.data.meetingId)
                }
            },
            del: {
                "meetings/delete": "meetings/@{id}"
            },
            wrap: {
                me: function(e, a) {
                    return c(e, a), e.email ? (e.name = e.fullName, e.first_name = e.name.split(" ")[0], e.last_name = e.name.split(" ")[1], e.id = e.email, e) : e
                },
                "default": function(e, a) {
                    return c(e, a), e
                }
            },
            xhr: function(c, a) {
                var b = a.access_token;
                return delete a.access_token, c.headers.Authorization =
                    "Bearer " + b, "get" !== c.method && c.data && (c.headers["Content-Type"] = "application/json", "object" == typeof c.data && (c.data = JSON.stringify(c.data))), "put" === c.method && (c.method = "patch"), !0
            }
        }
    })
})(hello);
(function(e) {
    function c(a) {
        a && "errorCode" in a && (a.error = {
            code: a.status,
            message: a.message
        })
    }

    function k(a) {
        return a.error ? void 0 : (a.first_name = a.firstName, a.last_name = a.lastName, a.name = a.formattedName || a.first_name + " " + a.last_name, a.thumbnail = a.pictureUrl, a.email = a.emailAddress, a)
    }

    function m(b) {
        return c(b), a(b), b.values && (b.data = b.values.map(k), delete b.values), b
    }

    function a(a) {
        "_count" in a && "_start" in a && a._count + a._start < a._total && (a.paging = {
            next: "?start=" + (a._start + a._count) + "&count=" + a._count
        })
    }

    function b(a) {
        a.access_token && (a.oauth2_access_token = a.access_token, delete a.access_token)
    }

    function d(a, b) {
        a.headers["x-li-format"] = "json";
        var c = a.data.id;
        a.data = ("delete" !== a.method).toString();
        a.method = "put";
        b("people/~/network/updates/key=" + c + "/is-liked")
    }
    e.init({
        linkedin: {
            oauth: {
                version: 2,
                response_type: "code",
                auth: "https://www.linkedin.com/uas/oauth2/authorization",
                grant: "https://www.linkedin.com/uas/oauth2/accessToken"
            },
            refresh: !0,
            scope: {
                basic: "r_basicprofile",
                email: "r_emailaddress",
                files: "",
                friends: "",
                photos: "",
                publish: "w_share",
                publish_files: "w_share",
                share: "",
                videos: "",
                offline_access: ""
            },
            scope_delim: " ",
            base: "https://api.linkedin.com/v1/",
            get: {
                me: "people/~:(picture-url,first-name,last-name,id,formatted-name,email-address)",
                "me/share": "people/~/network/updates?count=@{limit|250}"
            },
            post: {
                "me/share": function(a, b) {
                    var c = {
                        visibility: {
                            code: "anyone"
                        }
                    };
                    a.data.id ? c.attribution = {
                        share: {
                            id: a.data.id
                        }
                    } : (c.comment = a.data.message, a.data.picture && a.data.link && (c.content = {
                        "submitted-url": a.data.link,
                        "submitted-image-url": a.data.picture
                    }));
                    a.data = JSON.stringify(c);
                    b("people/~/shares?format=json")
                },
                "me/like": d
            },
            del: {
                "me/like": d
            },
            wrap: {
                me: function(a) {
                    return c(a), k(a), a
                },
                "me/friends": m,
                "me/following": m,
                "me/followers": m,
                "me/share": function(b) {
                    return c(b), a(b), b.values && (b.data = b.values.map(k), b.data.forEach(function(a) {
                        a.message = a.headline
                    }), delete b.values), b
                },
                "default": function(b, d) {
                    c(b);
                    "{}" === JSON.stringify(b) && 200 === d.statusCode && (b.success = !0);
                    a(b)
                }
            },
            jsonp: function(a, c) {
                b(c);
                "get" === a.method &&
                    (c.format = "jsonp", c["error-callback"] = a.callbackID)
            },
            xhr: function(a, c) {
                return "get" !== a.method ? (b(c), a.headers["Content-Type"] = "application/json", a.headers["x-li-format"] = "json", a.proxy = !0, !0) : !1
            }
        }
    })
})(hello);
(function(e) {
    function c(c, a) {
        var b = a.access_token;
        return delete a.access_token, a.oauth_token = b, a["_status_code_map[302]"] = 200, !0
    }

    function k(c) {
        return c.id && (c.picture = c.avatar_url, c.thumbnail = c.avatar_url, c.name = c.username || c.full_name), c
    }
    e.init({
        soundcloud: {
            name: "SoundCloud",
            oauth: {
                version: 2,
                auth: "https://soundcloud.com/connect",
                grant: "https://soundcloud.com/oauth2/token"
            },
            base: "https://api.soundcloud.com/",
            get: {
                me: "me.json",
                "me/friends": "me/followings.json",
                "me/followers": "me/followers.json",
                "me/following": "me/followings.json",
                "default": function(c, a) {
                    a(c.path + ".json")
                }
            },
            wrap: {
                me: function(c) {
                    return k(c), c
                },
                "default": function(c) {
                    Array.isArray(c) && (c = {
                        data: c.map(k)
                    });
                    "next_href" in c && (c.paging = {
                        next: c.next_href
                    });
                    return c
                }
            },
            xhr: c,
            jsonp: c
        }
    })
})(hello);
(function(e) {
    function c(a) {
        if (a.id) {
            if (a.name) {
                var c = a.name.split(" ");
                a.first_name = c.shift();
                a.last_name = c.join(" ")
            }
            a.thumbnail = a.profile_image_url_https || a.profile_image_url
        }
        return a
    }

    function k(b) {
        return m(b), a(b), b.users && (b.data = b.users.map(c), delete b.users), b
    }

    function m(a) {
        a.errors && (a.error = {
            code: "request_failed",
            message: a.errors[0].message
        })
    }

    function a(a) {
        "next_cursor_str" in a && (a.paging = {
            next: "?cursor=" + a.next_cursor_str
        })
    }
    e.init({
        twitter: {
            oauth: {
                version: "1.0a",
                auth: "https://api.twitter.com/oauth/authenticate",
                request: "https://api.twitter.com/oauth/request_token",
                token: "https://api.twitter.com/oauth/access_token"
            },
            login: function(a) {
                this.oauth.auth = this.oauth.auth.replace("?force_login=true", "") + (a.options.force ? "?force_login=true" : "")
            },
            base: "https://api.twitter.com/1.1/",
            get: {
                me: "account/verify_credentials.json",
                "me/friends": "friends/list.json?count=@{limit|200}",
                "me/following": "friends/list.json?count=@{limit|200}",
                "me/followers": "followers/list.json?count=@{limit|200}",
                "me/share": "statuses/user_timeline.json?count=@{limit|200}",
                "me/like": "favorites/list.json?count=@{limit|200}"
            },
            post: {
                "me/share": function(a, c) {
                    var k = a.data;
                    a.data = null;
                    var m = [];
                    k.message && (m.push(k.message), delete k.message);
                    k.link && (m.push(k.link), delete k.link);
                    k.picture && (m.push(k.picture), delete k.picture);
                    m.length && (k.status = m.join(" "));
                    k.file ? (k["media[]"] = k.file, delete k.file, a.data = k, c("statuses/update_with_media.json")) : "id" in k ? c("statuses/retweet/" + k.id + ".json") : (e.utils.extend(a.query, k), c("statuses/update.json?include_entities=1"))
                },
                "me/like": function(a,
                    c) {
                    var e = a.data.id;
                    a.data = null;
                    c("favorites/create.json?id=" + e)
                }
            },
            del: {
                "me/like": function() {
                    p.method = "post";
                    var a = p.data.id;
                    p.data = null;
                    callback("favorites/destroy.json?id=" + a)
                }
            },
            wrap: {
                me: function(a) {
                    return m(a), c(a), a
                },
                "me/friends": k,
                "me/followers": k,
                "me/following": k,
                "me/share": function(b) {
                    return m(b), a(b), !b.error && "length" in b ? {
                        data: b
                    } : b
                },
                "default": function(b) {
                    var c = b;
                    return b = Array.isArray(c) ? {
                        data: c
                    } : c, a(b), b
                }
            },
            xhr: function(a) {
                return "get" !== a.method
            }
        }
    })
})(hello);
(function(e) {
    e.init({
        vk: {
            name: "Vk",
            oauth: {
                version: 2,
                auth: "https://oauth.vk.com/authorize",
                grant: "https://oauth.vk.com/access_token"
            },
            scope: {
                email: "email",
                friends: "friends",
                photos: "photos",
                videos: "video",
                share: "share",
                offline_access: "offline"
            },
            refresh: !0,
            login: function(c) {
                c.qs.display = window.navigator && window.navigator.userAgent && /ipad|phone|phone|android/.test(window.navigator.userAgent.toLowerCase()) ? "mobile" : "popup"
            },
            base: "https://api.vk.com/method/",
            get: {
                me: function(c, e) {
                    c.query.fields = "id,first_name,last_name,photo_max";
                    e("users.get")
                }
            },
            wrap: {
                me: function(c, e, m) {
                    c.error && (e = c.error, c.error = {
                        code: e.error_code,
                        message: e.error_msg
                    });
                    return null !== c && "response" in c && null !== c.response && c.response.length && (c = c.response[0], c.id = c.uid, c.thumbnail = c.picture = c.photo_max, c.name = c.first_name + " " + c.last_name, m.authResponse && null !== m.authResponse.email && (c.email = m.authResponse.email)), c
                }
            },
            xhr: !1,
            jsonp: !0,
            form: !1
        }
    })
})(hello);
(function(e) {
    function c(a) {
        return "data" in a && a.data.forEach(function(a) {
            a.picture && (a.thumbnail = a.picture);
            a.images && (a.pictures = a.images.map(k).sort(function(a, b) {
                return a.width - b.width
            }))
        }), a
    }

    function k(a) {
        return {
            width: a.width,
            height: a.height,
            source: a.source
        }
    }

    function m(a, c, e) {
        a.id && (c = e.query.access_token, a.emails && (a.email = a.emails.preferred), !1 !== a.is_friend) && (a.thumbnail = a.picture = "https://apis.live.net/v5.0/" + (a.user_id || a.id) + "/picture?access_token=" + c);
        return a
    }

    function a(a, c, e) {
        return "data" in
            a && a.data.forEach(function(a) {
                m(a, c, e)
            }), a
    }
    e.init({
        windows: {
            name: "Windows live",
            oauth: {
                version: 2,
                auth: "https://login.live.com/oauth20_authorize.srf",
                grant: "https://login.live.com/oauth20_token.srf"
            },
            refresh: !0,
            logout: function() {
                return "http://login.live.com/oauth20_logout.srf?ts=" + (new Date).getTime()
            },
            scope: {
                basic: "wl.signin,wl.basic",
                email: "wl.emails",
                birthday: "wl.birthday",
                events: "wl.calendars",
                photos: "wl.photos",
                videos: "wl.photos",
                friends: "wl.contacts_emails",
                files: "wl.skydrive",
                publish: "wl.share",
                publish_files: "wl.skydrive_update",
                share: "wl.share",
                create_event: "wl.calendars_update,wl.events_create",
                offline_access: "wl.offline_access"
            },
            base: "https://apis.live.net/v5.0/",
            get: {
                me: "me",
                "me/friends": "me/friends",
                "me/following": "me/contacts",
                "me/followers": "me/friends",
                "me/contacts": "me/contacts",
                "me/albums": "me/albums",
                "me/album": "@{id}/files",
                "me/photo": "@{id}",
                "me/files": "@{parent|me/skydrive}/files",
                "me/folders": "@{id|me/skydrive}/files",
                "me/folder": "@{id|me/skydrive}/files"
            },
            post: {
                "me/albums": "me/albums",
                "me/album": "@{id}/files/",
                "me/folders": "@{id|me/skydrive/}",
                "me/files": "@{parent|me/skydrive}/files"
            },
            del: {
                "me/album": "@{id}",
                "me/photo": "@{id}",
                "me/folder": "@{id}",
                "me/files": "@{id}"
            },
            wrap: {
                me: m,
                "me/friends": a,
                "me/contacts": a,
                "me/followers": a,
                "me/following": a,
                "me/albums": function(a) {
                    return "data" in a && a.data.forEach(function(a) {
                        a.photos = a.files = "https://apis.live.net/v5.0/" + a.id + "/photos"
                    }), a
                },
                "me/photos": c,
                "default": c
            },
            xhr: function(a) {
                return "get" === a.method || "delete" === a.method || e.utils.hasBinary(a.data) ||
                    ("string" == typeof a.data.file ? a.data.file = e.utils.toBlob(a.data.file) : (a.data = JSON.stringify(a.data), a.headers = {
                        "Content-Type": "application/json"
                    })), !0
            },
            jsonp: function(a) {
                "get" === a.method || e.utils.hasBinary(a.data) || (a.data.method = a.method, a.method = "get")
            }
        }
    })
})(hello);
(function(e) {
    function c(a) {
        a && "meta" in a && "error_type" in a.meta && (a.error = {
            code: a.meta.error_type,
            message: a.meta.error_message
        })
    }

    function k(b, e, k) {
        c(b);
        a(b, e, k);
        return b.query && b.query.results && b.query.results.contact && (b.data = b.query.results.contact, delete b.query, Array.isArray(b.data) || (b.data = [b.data]), b.data.forEach(m)), b
    }

    function m(a) {
        a.id = null;
        !a.fields || a.fields instanceof Array || (a.fields = [a.fields]);
        (a.fields || []).forEach(function(b) {
            "email" === b.type && (a.email = b.value);
            "name" === b.type && (a.first_name =
                b.value.givenName, a.last_name = b.value.familyName, a.name = b.value.givenName + " " + b.value.familyName);
            "yahooid" === b.type && (a.id = b.value)
        })
    }

    function a(a, b, c) {
        return a.query && a.query.count && c.options && (a.paging = {
            next: "?start=" + (a.query.count + (+c.options.start || 1))
        }), a
    }

    function b(a) {
        return "https://query.yahooapis.com/v1/yql?q=" + (a + " limit @{limit|100} offset @{start|0}").replace(/\s/g, "%20") + "&format=json"
    }
    e.init({
        yahoo: {
            oauth: {
                version: "1.0a",
                auth: "https://api.login.yahoo.com/oauth/v2/request_auth",
                request: "https://api.login.yahoo.com/oauth/v2/get_request_token",
                token: "https://api.login.yahoo.com/oauth/v2/get_token"
            },
            login: function(a) {
                a.options.popup.width = 560;
                try {
                    delete a.qs.state.scope
                } catch (b) {}
            },
            base: "https://social.yahooapis.com/v1/",
            get: {
                me: b("select * from social.profile(0) where guid=me"),
                "me/friends": b("select * from social.contacts(0) where guid=me"),
                "me/following": b("select * from social.contacts(0) where guid=me")
            },
            wrap: {
                me: function(a) {
                    if (c(a), a.query && a.query.results && a.query.results.profile) {
                        a = a.query.results.profile;
                        a.id = a.guid;
                        a.last_name =
                            a.familyName;
                        a.first_name = a.givenName || a.nickname;
                        var b = [];
                        a.first_name && b.push(a.first_name);
                        a.last_name && b.push(a.last_name);
                        a.name = b.join(" ");
                        a.email = a.emails && a.emails[0] ? a.emails[0].handle : null;
                        a.thumbnail = a.image ? a.image.imageUrl : null
                    }
                    return a
                },
                "me/friends": k,
                "me/following": k,
                "default": a
            }
        }
    })
})(hello);
"function" == typeof define && define.amd && define(function() {
    return hello
});
"object" == typeof module && module.exports && (module.exports = hello);