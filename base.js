!function(t) {
function(t, n, e) {
    var i = e(56).closest
      , r = Object.assign({}, e(1), e(57), e(23), e(13), e(8), e(18));
    function o() {
        var t, n = this;
        return this.width = this.wrapper.node().offsetWidth - this.margin.left - this.margin.right,
        this.height = ((t = n.width * n.aspect) > n.maxHeight ? n.maxHeight : t < n.minHeight ? n.minHeight : t) - n.margin.top - n.margin.bottom,
        this.x.range([0, this.width]),
        this.y.range([this.height, 0]),
        this.xAxisGenerator.tickValues(innerWidth < 500 ? [this.data[0].datetime, new Date(2020,1,15), this.lastDatum.datetime] : [this.data[0].datetime, new Date(2020,1,1), new Date(2020,1,15), new Date(2020,2,1), this.lastDatum.datetime]),
        this.yAxisGenerator.tickSize(this.width + 20),
        this.svg.attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).on("mousemove", (function(t) {
            return n.mousemove()
        }
        )).on("mouseout", (function(t) {
            return n.mouseout()
        }
        )),
        this.g.attr("transform", "translate(".concat([this.margin.left, this.margin.top], ")")),
        this.yAxis.style("display", "block").attr("transform", "translate(".concat(this.width, ")")).call(this.yAxisGenerator),
        this.yAxis.selectAll(".tick text").attr("dx", (function(t, e, i) {
            return e === i.length - 1 ? n.topTickOffset : 0
        }
        )),
        this.yAxis.selectAll(".tick line").attr("x2", (function(t, e, i) {
            return +r.select(i[e]).attr("x2") + (e === i.length - 1 ? n.topTickOffset : 0)
        }
        )),
        this.xAxis.attr("transform", "translate(0, ".concat(this.height, ")")).call(this.xAxisGenerator),
        this.area.attr("d", this.areaGenerator),
        this.last.attr("transform", (function(t) {
            return "translate(".concat([n.x(t.datetime), n.y(t.count)], ")")
        }
        )).selectAll("text").html(this.lastHtmlFormat),
        this
    }
    function a() {
        var t = this
          , n = i(this.data, this.x.invert(event.offsetX - this.margin.left), (function(t) {
            return t.datetime
        }
        ))
          , e = this.x(n.datetime);
        this.last.attr("transform", "translate(".concat([e, this.y(n.count)], ")")),
        this.lastValue.classed("hovered", (function(t) {
            return n.datetime !== t.datetime
        }
        )).selectAll("text").html((function(e) {
            return n.datetime === e.datetime ? t.lastHtmlFormat(e) : t.numberFormat(n.count)
        }
        )),
        this.hoverAxis.classed("show", 1).attr("transform", "translate(".concat([e, this.height], ")")),
        this.hoverAxisText.text(this.timeFormat(n.datetime)),
        this.xAxis.selectAll(".tick").style("opacity", (function(n) {
            return t.tickOpacity(Math.abs(t.x(n) - e))
        }
        ))
    }
    function s() {
        var t = this;
        this.last.attr("transform", (function(n) {
            return "translate(".concat([t.x(n.datetime), t.y(n.count)], ")")
        }
        )),
        this.lastValue.classed("hovered", 0).selectAll("text").html(this.lastHtmlFormat),
        this.hoverAxis.classed("show", 0),
        this.xAxis.selectAll(".tick").style("opacity", 1)
    }
    function u(t) {
        var n = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."][t.getMonth()]
          , e = t.getDate();
        return "".concat(n, " ").concat(e)
    }
    t.exports = {
        init: function(t, n) {
            var e = this;
            return this.wrapper = r.select(t),
            this.data = n,
            this.lastDatum = this.data[this.data.length - 1],
            this.draw = o,
            this.mousemove = a,
            this.mouseout = s,
            this.timeFormat = u,
            this.numberFormat = function(t) {
                return r.format(",")(t)
            }
            ,
            this.lastHtmlFormat = function(t) {
                return "<tspan>".concat(e.numberFormat(t.count), "</tspan><tspan y=18 x=0>cases</tspan>")
            }
            ,
            this.margin = {
                left: 58,
                right: 50,
                top: 10,
                bottom: 35
            },
            this.aspect = .5,
            this.width = 0,
            this.height = 0,
            this.minHeight = 300,
            this.maxHeight = 500,
            this.topTickOffset = 102,
            this.x = r.scaleTime().domain(r.extent(this.data, (function(t) {
                return t.datetime
            }
            ))),
            this.y = r.scaleLinear().domain([0, this.lastDatum.count]),
            this.tickOpacity = r.scaleLinear().domain([50, 150]).range([0, 1]).clamp(!0),
            this.areaGenerator = r.area().x((function(t) {
                return e.x(t.datetime)
            }
            )).y0((function(t) {
                return e.height
            }
            )).y1((function(t) {
                return e.y(t.count)
            }
            )),
            this.yAxisGenerator = r.axisLeft(this.y).tickValues(r.range(0, 3e3, 1e3)).tickFormat((function(t, n, i) {
                return n === i.length - 1 ? "".concat(e.numberFormat(t), " cases in the U.S.") : e.numberFormat(t)
            }
            )),
            this.xAxisGenerator = r.axisBottom(this.x).tickFormat((function(t) {
                return e.timeFormat(t)
            }
            )).tickSize(20),
            this.svg = this.wrapper.append("svg"),
            this.g = this.svg.append("g"),
            this.yAxis = this.g.append("g").attr("class", "axis y"),
            this.xAxis = this.g.append("g").attr("class", "axis x"),
            this.hoverAxis = this.g.append("g").attr("class", "axis hover").classed("show", 0),
            this.hoverAxis.append("line").attr("y2", 20),
            this.hoverAxisText = this.hoverAxis.append("text"),
            this.area = this.g.append("path").datum(this.data).attr("class", "area"),
            this.last = this.g.append("g").datum(this.lastDatum).attr("class", "last"),
            this.last.append("circle").attr("r", 4),
            this.lastValue = this.last.append("g").attr("class", "last-value"),
            this.lastValue.append("text").attr("class", "bg"),
            this.lastValue.append("text").attr("class", "fg"),
            this
        }
    }
}
, function(t, n, e) {
    var i = new (e(7).init)("#simulation-two-people",{
        height: 50,
        ticksToRecover: 1 / 0
    });
    function r() {
        for (var t = 0; t < 5; t++)
            i.addDatum({
                pos: [10 + i.width * (t / 5), i.height / 2],
                speed: 0 === t ? 1.5 : .1,
                radius: 10,
                angle: 0 == t ? 0 : 180,
                collided: !1,
                infected: 0 === t,
                id: t
            })
    }
    i.replayButton.on("click", (function(t) {
        i.data = [],
        i.storage = [],
        i.ticks = 0,
        i.hideReplayButton(),
        r()
    }
    )),
    t.exports = {
        simulation: i,
        init: r,
        tick: function() {
            i.ticks > 750 ? i.showReplayButton() : i.tick()
        }
    }
}
, function(t, n, e) {
    var i = new (e(7).init)("#simulation-recovery-demo",{
        height: 50,
        ticksToRecover: 100
    });
    function r() {
        for (var t = 0; t < 5; t++)
            i.addDatum({
                pos: [10 + i.width * (t / 5), i.height / 2],
                speed: 0 === t ? 1.5 : .1,
                radius: 10,
                angle: 0 == t ? 0 : 180,
                collided: !1,
                infected: 0 === t,
                id: t
            })
    }
    i.replayButton.on("click", (function(t) {
        i.data = [],
        i.storage = [],
        i.ticks = 0,
        i.hideReplayButton(),
        r()
    }
    )),
    t.exports = {
        simulation: i,
        init: r,
        tick: function() {
            i.ticks > 750 ? i.showReplayButton() : i.tick()
        }
    }
}
, function(t, n, e) {
    var i = e(9)
      , r = e(7)
      , o = e(17)
      , a = e(4)
      , s = a.SPEED
      , u = a.RADIUS
      , c = a.STARTING_BALLS
      , l = a.TOTAL_TICKS
      , h = a.STARTING_STORAGE
      , f = a.GIF_MODE
      , d = new r.init("#simulation-basic",{
        resetText: "Run a new simulation",
        storage: JSON.parse(JSON.stringify(h))
    })
      , p = u(d.width, d.height)
      , g = new o.init(f ? "#gif-basic" : "#summary-basic",d,{
        chart: !0,
        gifMode: f
    });
    function m() {
        for (var t = 0; t < c; t++)
            d.addDatum({
                pos: [0 === t ? d.width / 2 : i.randomUniform(20, d.width - 20)(), 0 === t ? d.height / 2 : i.randomUniform(20, d.height - 20)()],
                speed: s,
                radius: p,
                angle: i.randomUniform(0, 360)(),
                collided: !1,
                infected: 0 === t,
                id: t
            })
    }
    d.tick(),
    g.tick(),
    d.replayButton.on("click", (function(t) {
        d.data = [],
        d.storage = JSON.parse(JSON.stringify(h)),
        d.ticks = 0,
        d.hideReplayButton(),
        m()
    }
    )),
    t.exports = {
        simulation: d,
        summary: g,
        init: m,
        tick: function() {
            d.ticks > l ? d.showReplayButton() : (d.tick(),
            g.tick())
        }
    }
}
, function(t, n, e) {
    var i = Object.assign({}, e(9), e(13))
      , r = e(7)
      , o = e(17)
      , a = e(4)
      , s = a.SPEED
      , u = a.RADIUS
      , c = a.STARTING_BALLS
      , l = a.TOTAL_TICKS
      , h = a.STARTING_STORAGE
      , f = a.GIF_MODE
      , d = new r.init("#simulation-quarantine",{
        resetText: "Run a new simulation",
        storage: JSON.parse(JSON.stringify(h))
    })
      , p = u(d.width, d.height)
      , g = new o.init(f ? "#gif-quarantine" : "#summary-quarantine",d,{
        chart: !0,
        gifMode: f
    })
      , m = [[[.3 * d.width - 10, 0], [.3 * d.width - 10, d.height]], [[.3 * d.width + 10, 0], [.3 * d.width + 10, d.height]]]
      , v = i.scaleLinear().domain([l / 8, l / 2]).range([0, d.height / 6]).clamp(!0);
    function y() {
        d.walls = m;
        for (var t = 0; t < c; t++) {
            var n = {
                pos: [0 === t ? d.width / 10 : i.randomUniform(20, d.width - 20)(), 0 === t ? d.height / 2 : i.randomUniform(20, d.height - 20)()],
                speed: s,
                radius: p,
                angle: i.randomUniform(0, 360)(),
                collided: !1,
                infected: 0 === t,
                id: t
            };
            n.pos[0] >= .3 * d.width - 20 - p && n.pos[0] <= .3 * d.width + 20 + p && (n.pos[0] = Math.max(p, n.pos[0] - 40)),
            d.addDatum(n)
        }
    }
    d.tick(),
    g.tick(),
    d.replayButton.on("click", (function(t) {
        d.data = [],
        d.storage = JSON.parse(JSON.stringify(h)),
        d.ticks = 0,
        d.hideReplayButton(),
        y()
    }
    )),
    t.exports = {
        simulation: d,
        summary: g,
        init: y,
        tick: function() {
            d.ticks >= v.domain()[0] && d.ticks <= v.domain()[1] && (d.walls = function(t) {
                var n = v(t);
                return [[[.3 * d.width - 10, 0], [.3 * d.width - 10, .5 * d.height - n]], [[.3 * d.width + 10, 0], [.3 * d.width + 10, .5 * d.height - n]], [[.3 * d.width - 10, .5 * d.height - n], [.3 * d.width + 10, .5 * d.height - n]], [[.3 * d.width - 10, d.height], [.3 * d.width - 10, .5 * d.height + n]], [[.3 * d.width + 10, d.height], [.3 * d.width + 10, .5 * d.height + n]], [[.3 * d.width - 10, .5 * d.height + n], [.3 * d.width + 10, .5 * d.height + n]]]
            }(d.ticks)),
            d.ticks > l ? d.showReplayButton() : (d.tick(),
            g.tick())
        }
    }
}
, function(t, n, e) {
    var i = e(9)
      , r = e(7)
      , o = e(17)
      , a = e(4)
      , s = a.SPEED
      , u = a.RADIUS
      , c = a.STARTING_BALLS
      , l = a.TOTAL_TICKS
      , h = a.STARTING_STORAGE
      , f = a.GIF_MODE
      , d = new r.init("#simulation-stop",{
        resetText: "Run a new simulation",
        transferEnergy: !1,
        storage: JSON.parse(JSON.stringify(h))
    })
      , p = u(d.width, d.height)
      , g = new o.init(f ? "#gif-stop" : "#summary-stop",d,{
        chart: !0,
        gifMode: f
    });
    function m() {
        for (var t = 0; t < c; t++)
            d.addDatum({
                pos: [0 === t ? d.width / 2 : i.randomUniform(20, d.width - 20)(), 0 === t ? d.height / 2 : i.randomUniform(20, d.height - 20)()],
                speed: t % 4 == 0 ? s : 0,
                radius: p,
                angle: i.randomUniform(0, 360)(),
                collided: !1,
                infected: 0 === t,
                id: "stop-".concat(t)
            })
    }
    d.tick(),
    g.tick(),
    d.replayButton.on("click", (function(t) {
        d.data = [],
        d.storage = JSON.parse(JSON.stringify(h)),
        d.ticks = 0,
        d.hideReplayButton(),
        m()
    }
    )),
    t.exports = {
        simulation: d,
        summary: g,
        init: m,
        tick: function() {
            d.ticks > l ? d.showReplayButton() : (d.tick(),
            g.tick())
        }
    }
}
, function(t, n, e) {
    var i = e(9)
      , r = e(7)
      , o = e(17)
      , a = e(4)
      , s = a.SPEED
      , u = a.RADIUS
      , c = a.STARTING_BALLS
      , l = a.TOTAL_TICKS
      , h = a.STARTING_STORAGE
      , f = a.GIF_MODE
      , d = new r.init("#simulation-stop-more",{
        resetText: "Run a new simulation",
        transferEnergy: !1,
        storage: JSON.parse(JSON.stringify(h))
    })
      , p = u(d.width, d.height)
      , g = new o.init(f ? "#gif-stop-more" : "#summary-stop-more",d,{
        chart: !0,
        gifMode: f
    });
    function m() {
        for (var t = 0; t < c; t++)
            d.addDatum({
                pos: [0 === t ? d.width / 2 : i.randomUniform(20, d.width - 20)(), 0 === t ? d.height / 2 : i.randomUniform(20, d.height - 20)()],
                speed: t % 8 == 0 ? s : 0,
                radius: p,
                angle: i.randomUniform(0, 360)(),
                collided: !1,
                infected: 0 === t,
                id: "stop-".concat(t)
            })
    }
    d.tick(),
    g.tick(),
    d.replayButton.on("click", (function(t) {
        d.data = [],
        d.storage = JSON.parse(JSON.stringify(h)),
        d.ticks = 0,
        d.hideReplayButton(),
        m()
    }
    )),
    t.exports = {
        simulation: d,
        summary: g,
        init: m,
        tick: function() {
            d.ticks > l ? d.showReplayButton() : (d.tick(),
            g.tick())
        }
    }
}
, function(t, n, e) {
    var i = Object.assign({}, e(1), e(13), e(8), e(18))
      , r = (e(24),
    e(4))
      , o = r.STARTING_BALLS
      , a = r.TOTAL_TICKS;
    e(31);
    function s(t) {
        return this.data = t,
        this
    }
    function u() {
        var t = this;
        return this.chart = this.wrapper.selectAll(".chart").data(this.data).enter().append("div").attr("class", "chart"),
        this.chart.append("div").attr("class", "title").text((function(t) {
            return t.name
        }
        )),
        this.svg = this.chart.append("svg"),
        this.g = this.svg.append("g"),
        this.x = i.scaleLinear().domain([0, a]),
        this.y = i.scaleLinear().domain([0, o]),
        this.stackGenerator = i.stack().keys(["sick", "well", "recovered"]),
        this.areaGenerator = i.area().x((function(n) {
            return t.x(n.data.tick)
        }
        )).y0((function(n) {
            return t.y(n[0])
        }
        )).y1((function(n) {
            return t.y(n[1])
        }
        )),
        this
    }
    function c() {
        var t = this;
        return this.aspect = 9 / 16,
        this.width = this.chart.node().offsetWidth,
        this.height = this.width * this.aspect,
        this.svg.attr("width", this.width).attr("height", this.height),
        this.x.range([0, this.width]),
        this.y.range([this.height, 0]),
        this.areas = this.g.selectAll(".area").data((function(n, e) {
            return t.stackGenerator(t.data[e].data.storage)
        }
        ), (function(t) {
            return t.key
        }
        )),
        this.areas.exit().remove(),
        this.areas.enter().append("path").attr("class", (function(t) {
            return "area " + t.key
        }
        )).merge(this.areas).attr("d", this.areaGenerator),
        this
    }
    function l() {
        this.countdownWrapper.classed("show-countdown", 1),
        this.wrapper.classed("loading", 1),
        this.countdownWidth = this.countdownWrapper.node().offsetWidth;
        var t = this.countdownWrapper.node().offsetHeight
          , n = this.wrapper.node().offsetHeight;
        return this.countdownWrapper.style("top", "".concat(n / 2 - t / 2, "px")).style("left", "calc(50% - ".concat(this.countdownWidth / 2, "px)")),
        this
    }
    function h() {
        return this.countdownWrapper.classed("show-countdown", 0),
        this.wrapper.classed("loading", 0),
        this
    }
    function f() {
        var t = this
          , n = a * this.data.length - i.sum(this.data, (function(t) {
            return t.data.ticks
        }
        ))
          , e = new Worker("workers/simulation-worker.js");
        e.postMessage([this.data, a, n]),
        e.onmessage = function(e) {
            if ("number" == typeof e.data) {
                var i = (n - e.data) / n;
                t.countdownWrapper.select(".loaded").style("width", "".concat(t.countdownWidth * i, "px"))
            } else
                t.data = e.data,
                t.hideCountdown(),
                t.draw()
        }
    }
    function d() {
        var t = this.wrapper.node().getBoundingClientRect()
          , n = t.top || t.y
          , e = t.height;
        return n < innerHeight && n + e > 0
    }
    t.exports = {
        init: function(t) {
            return this.wrapper = i.select(t),
            this.countdownWrapper = i.select("#comparison-countdown"),
            this.draw = c,
            this.calculationHasStarted = !1,
            this.getTicksUpToDate = f,
            this.isNotOffScreen = d,
            this.setChart = u,
            this.setData = s,
            this.showCountdown = l,
            this.hideCountdown = h,
            this
        }
    }
}
, function(t, n, e) {
    "use strict";
    function i(t, n, e) {
        let i = 1 / 0
          , r = null;
        for (let o = 0, a = t.length; o < a; o++) {
            const a = e ? e(t[o]) : t[o];
            if (null != a && isFinite(a)) {
                const t = Math.abs(a - n);
                t < i && (i = t,
                r = o)
            }
        }
        return null !== r ? t[r] : r
    }
    function r(t, n) {
        let e, i = 0, r = 0, o = 0;
        for (let a = 0; a < t.length; a++) {
            const s = n ? n(t[a], a, t) : t[a];
            null != s && isFinite(s) && (e = s - o,
            o += e / ++i,
            r += e * (s - o))
        }
        if (i > 1)
            return Math.sqrt(r / (i - 1))
    }
    function o(t, n) {
        let e = !0;
        for (let i = 0, r = t.length; i < r; i++)
            if (!n(t[i], i, t)) {
                e = !1;
                break
            }
        return e
    }
    function a(t, n) {
        let e = 1 / 0
          , i = -1 / 0;
        for (let r = 0, o = t.length; r < o; r++) {
            const o = n ? n(t[r], r, t) : t[r];
            null != o && isFinite(o) && (o < e && (e = o),
            o > i && (i = o))
        }
        return [e, i]
    }
    function s(t, n) {
        let e = [];
        for (let i = 0, r = t.length; i < r; i++) {
            const r = t[i];
            n(r, i, t) && e.push(r)
        }
        return e
    }
    function u(t) {
        return [].concat.apply([], t)
    }
    function c(t, n, e=0) {
        let i = !1;
        for (let r = e; r < t.length; r++)
            if (t[r] === n) {
                i = !0;
                break
            }
        return i
    }
    function l(t, n) {
        let e = [];
        for (let i = 0, r = t.length; i < r; i++)
            e.push(n(t[i], i, t));
        return e
    }
    function h(t, n) {
        let e = -1 / 0;
        for (let i = 0, r = t.length; i < r; i++) {
            const r = n ? n(t[i], i, t) : t[i];
            null != r && isFinite(r) && r > e && (e = r)
        }
        return e
    }
    function f(t, n) {
        let e = 0
          , i = 0;
        for (let r = 0, o = t.length; r < o; r++) {
            const o = n ? n(t[r], r, t) : t[r];
            null != o && isFinite(o) && (e += o,
            i++)
        }
        return e / i
    }
    function d(t, n, e) {
        const i = t.slice()
          , r = o(i, (t,e,i)=>"number" == typeof (n ? n(t, e, i) : t));
        let a = 0;
        return r ? i.sort((t,r)=>{
            const o = n ? n(t, a + 1, i) : t
              , s = n ? n(r, a, i) : r;
            return a++,
            "desc" === e ? s - o : o - s
        }
        ) : i.sort((t,r)=>{
            const o = n ? n(t, a + 1, i) : t
              , s = n ? n(r, a, i) : r;
            return a++,
            "desc" === e ? o < s ? 1 : o > s ? -1 : 0 : o < s ? -1 : o > s ? 1 : 0
        }
        )
    }
    function p(t, n) {
        const e = s(d(n ? l(t, n) : t.slice()), t=>null != t && isFinite(t))
          , i = e.length / 2;
        return i % 1 == 0 ? (e[i - 1] + e[i]) / 2 : e[Math.floor(i)]
    }
    function g(t, n) {
        let e = 1 / 0;
        for (let i = 0, r = t.length; i < r; i++) {
            const r = n ? n(t[i], i, t) : t[i];
            null != r && isFinite(r) && r < e && (e = r)
        }
        return e
    }
    function m(t) {
        return t[Math.floor(Math.random() * t.length)]
    }
    function v(t, n) {
        let e = !1;
        for (let i = 0, r = t.length; i < r; i++)
            if (n(t[i], i, t)) {
                e = !0;
                break
            }
        return e
    }
    function y(t, n) {
        let e = 0;
        for (let i = 0, r = t.length; i < r; i++) {
            const r = n ? n(t[i], i, t) : t[i];
            null != r && isFinite(r) && (e += r)
        }
        return e
    }
    function _(t, n) {
        let e = [];
        for (let i = 0, r = t.length; i < r; i++) {
            const r = n ? n(t[i], i, t) : t[i];
            c(e, r) || e.push(r)
        }
        return e
    }
    e.r(n),
    e.d(n, "closest", (function() {
        return i
    }
    )),
    e.d(n, "deviation", (function() {
        return r
    }
    )),
    e.d(n, "every", (function() {
        return o
    }
    )),
    e.d(n, "extent", (function() {
        return a
    }
    )),
    e.d(n, "filter", (function() {
        return s
    }
    )),
    e.d(n, "flatten", (function() {
        return u
    }
    )),
    e.d(n, "includes", (function() {
        return c
    }
    )),
    e.d(n, "map", (function() {
        return l
    }
    )),
    e.d(n, "max", (function() {
        return h
    }
    )),
    e.d(n, "mean", (function() {
        return f
    }
    )),
    e.d(n, "median", (function() {
        return p
    }
    )),
    e.d(n, "min", (function() {
        return g
    }
    )),
    e.d(n, "random", (function() {
        return m
    }
    )),
    e.d(n, "some", (function() {
        return v
    }
    )),
    e.d(n, "sort", (function() {
        return d
    }
    )),
    e.d(n, "sum", (function() {
        return y
    }
    )),
    e.d(n, "unique", (function() {
        return _
    }
    )),
    e.d(n, "pipe", (function() {
        return b
    }
    ));
    const w = [i, r, o, a, s, u, c, l, h, f, p, g, m, v, d, y, _];
    function b(t) {
        const n = {};
        return n.curr = t,
        w.forEach(t=>{
            n[t.name] = (...e)=>(n.curr = t(n.curr, ...e),
            n)
        }
        ),
        n.result = t=>n.curr,
        n
    }
}
, function(t, n, e) {
    "use strict";
    e.r(n),
    e.d(n, "axisTop", (function() {
        return h
    }
    )),
    e.d(n, "axisRight", (function() {
        return f
    }
    )),
    e.d(n, "axisBottom", (function() {
        return d
    }
    )),
    e.d(n, "axisLeft", (function() {
        return p
    }
    ));
    var i = Array.prototype.slice
      , r = function(t) {
        return t
    };
    function o(t) {
        return "translate(" + (t + .5) + ",0)"
    }
    function a(t) {
        return "translate(0," + (t + .5) + ")"
    }
    function s(t) {
        return function(n) {
            return +t(n)
        }
    }
    function u(t) {
        var n = Math.max(0, t.bandwidth() - 1) / 2;
        return t.round() && (n = Math.round(n)),
        function(e) {
            return +t(e) + n
        }
    }
    function c() {
        return !this.__axis
    }
    function l(t, n) {
        var e = []
          , l = null
          , h = null
          , f = 6
          , d = 6
          , p = 3
          , g = 1 === t || 4 === t ? -1 : 1
          , m = 4 === t || 2 === t ? "x" : "y"
          , v = 1 === t || 3 === t ? o : a;
        function y(i) {
            var o = null == l ? n.ticks ? n.ticks.apply(n, e) : n.domain() : l
              , a = null == h ? n.tickFormat ? n.tickFormat.apply(n, e) : r : h
              , y = Math.max(f, 0) + p
              , _ = n.range()
              , w = +_[0] + .5
              , b = +_[_.length - 1] + .5
              , x = (n.bandwidth ? u : s)(n.copy())
              , T = i.selection ? i.selection() : i
              , M = T.selectAll(".domain").data([null])
              , k = T.selectAll(".tick").data(o, n).order()
              , C = k.exit()
              , S = k.enter().append("g").attr("class", "tick")
              , E = k.select("line")
              , A = k.select("text");
            M = M.merge(M.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")),
            k = k.merge(S),
            E = E.merge(S.append("line").attr("stroke", "currentColor").attr(m + "2", g * f)),
            A = A.merge(S.append("text").attr("fill", "currentColor").attr(m, g * y).attr("dy", 1 === t ? "0em" : 3 === t ? "0.71em" : "0.32em")),
            i !== T && (M = M.transition(i),
            k = k.transition(i),
            E = E.transition(i),
            A = A.transition(i),
            C = C.transition(i).attr("opacity", 1e-6).attr("transform", (function(t) {
                return isFinite(t = x(t)) ? v(t) : this.getAttribute("transform")
            }
            )),
            S.attr("opacity", 1e-6).attr("transform", (function(t) {
                var n = this.parentNode.__axis;
                return v(n && isFinite(n = n(t)) ? n : x(t))
            }
            ))),
            C.remove(),
            M.attr("d", 4 === t || 2 == t ? d ? "M" + g * d + "," + w + "H0.5V" + b + "H" + g * d : "M0.5," + w + "V" + b : d ? "M" + w + "," + g * d + "V0.5H" + b + "V" + g * d : "M" + w + ",0.5H" + b),
            k.attr("opacity", 1).attr("transform", (function(t) {
                return v(x(t))
            }
            )),
            E.attr(m + "2", g * f),
            A.attr(m, g * y).text(a),
            T.filter(c).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", 2 === t ? "start" : 4 === t ? "end" : "middle"),
            T.each((function() {
                this.__axis = x
            }
            ))
        }
        return y.scale = function(t) {
            return arguments.length ? (n = t,
            y) : n
        }
        ,
        y.ticks = function() {
            return e = i.call(arguments),
            y
        }
        ,
        y.tickArguments = function(t) {
            return arguments.length ? (e = null == t ? [] : i.call(t),
            y) : e.slice()
        }
        ,
        y.tickValues = function(t) {
            return arguments.length ? (l = null == t ? null : i.call(t),
            y) : l && l.slice()
        }
        ,
        y.tickFormat = function(t) {
            return arguments.length ? (h = t,
            y) : h
        }
        ,
        y.tickSize = function(t) {
            return arguments.length ? (f = d = +t,
            y) : f
        }
        ,
        y.tickSizeInner = function(t) {
            return arguments.length ? (f = +t,
            y) : f
        }
        ,
        y.tickSizeOuter = function(t) {
            return arguments.length ? (d = +t,
            y) : d
        }
        ,
        y.tickPadding = function(t) {
            return arguments.length ? (p = +t,
            y) : p
        }
        ,
        y
    }
    function h(t) {
        return l(1, t)
    }
    function f(t) {
        return l(2, t)
    }
    function d(t) {
        return l(3, t)
    }
    function p(t) {
        return l(4, t)
    }
}
