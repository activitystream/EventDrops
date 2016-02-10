!function t(e,n,a){function r(l,i){if(!n[l]){if(!e[l]){var s="function"==typeof require&&require;if(!i&&s)return s(l,!0);if(o)return o(l,!0);var c=new Error("Cannot find module '"+l+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[l]={exports:{}};e[l][0].call(u.exports,function(t){var n=e[l][1][t];return r(n?n:t)},u,u.exports,t,e,n,a)}return n[l].exports}for(var o="function"==typeof require&&require,l=0;l<a.length;l++)r(a[l]);return r}({1:[function(t,e,n){"use strict";var a=t("./eventDrops");"function"==typeof define&&define.amd?define("d3.chart.eventDrops",["d3"],function(t){t.chart=t.chart||{},t.chart.eventDrops=a(t)}):window?(window.d3.chart=window.d3.chart||{},window.d3.chart.eventDrops=a(window.d3)):e.exports=a},{"./eventDrops":3}],2:[function(t,e,n){"use strict";var a=t("./util/configurable"),r={xScale:null,dateFormat:null,hasIntervalLabels:!0};e.exports=function(t){return function(e){function n(n){n.each(function(n){t.select(this).selectAll("text").remove();var a=e.xScale.domain();e.hasIntervalLabels&&t.select(this).append("text").text(function(){return e.dateFormat(a[0])}).classed("start",!0),e.hasIntervalLabels&&t.select(this).append("text").text(function(){return e.dateFormat(a[1])}).attr("text-anchor","end").attr("transform","translate("+e.xScale.range()[1]+")").classed("end",!0)})}e=e||{};for(var o in r)e[o]="undefined"!=typeof e[o]?e[o]:r[o];return a(n,e),n}}},{"./util/configurable":6}],3:[function(t,e,n){"use strict";var a=t("./util/configurable");e.exports=function(e){var n=t("./eventLine")(e),r=t("./delimiter")(e),o={start:new Date(0),end:new Date,minScale:0,maxScale:1/0,width:1e3,margin:{top:60,left:200,bottom:40,right:50},locale:null,axisFormat:null,tickFormat:[[".%L",function(t){return t.getMilliseconds()}],[":%S",function(t){return t.getSeconds()}],["%I:%M",function(t){return t.getMinutes()}],["%I %p",function(t){return t.getHours()}],["%a %d",function(t){return t.getDay()&&1!=t.getDate()}],["%b %d",function(t){return 1!=t.getDate()}],["%B",function(t){return t.getMonth()}],["%Y",function(){return!0}]],eventHover:null,eventZoom:null,hasDelimiter:!0,hasTopAxis:!0,hasLabels:!0,hasIntervalLabels:!0,zoomCallback:function(){},hasBottomAxis:function(t){return t.length>=10},eventLineColor:"black",eventColor:null,eventY:-5,eventR:10};return function(t){function l(a){a.each(function(a){function o(n,a){return F?void(F=!1):n?void t.zoomCallback({translate:e.event.translate,scale:e.event.scale,p:e.mouse(g[0][0])}):void(null!==e.event.sourceEvent&&("[object MouseEvent]"===e.event.sourceEvent.toString()&&m.translate([e.event.translate[0],0]),"[object WheelEvent]"===e.event.sourceEvent.toString()&&(m.translate([e.event.translate[0],0]),m.scale(e.event.scale)),F=!0,m.event(x),v()))}function c(){g.select(".delimiter").remove();g.append("g").classed("delimiter",!0).attr("width",d).attr("height",10).attr("transform","translate("+t.margin.left+", "+(t.margin.top-45)+")").call(r({hasIntervalLabels:t.hasIntervalLabels,xScale:i,dateFormat:t.locale?t.locale.timeFormat("%d %B %Y"):e.time.format("%d %B %Y")}))}function u(){t.eventZoom&&t.eventZoom(i),t.hasDelimiter&&c()}function f(n){var a=[];t.tickFormat.forEach(function(t){var e=t.slice(0);a.push(e)});var r=t.locale?t.locale.timeFormat.multi(a):e.time.format.multi(a),o=e.svg.axis().scale(i).orient(n).tickFormat(r);"function"==typeof t.axisFormat&&t.axisFormat(o);var l=("bottom"==n?parseInt(p):0)+t.margin.top-40;b.select(".x-axis."+n).remove();b.append("g").classed("x-axis",!0).classed(n,!0).attr("transform","translate("+t.margin.left+", "+l+")").call(o)}function v(){var e="function"==typeof t.hasTopAxis?t.hasTopAxis(a):t.hasTopAxis;e&&f("top");var r="function"==typeof t.hasBottomAxis?t.hasBottomAxis(a):t.hasBottomAxis;r&&f("bottom"),m.size([t.width,h]),b.select(".graph-body").remove();var o=b.append("g").classed("graph-body",!0).attr("transform","translate("+t.margin.left+", "+(t.margin.top-15)+")"),l=o.selectAll("g").data(a);l.enter().append("g").classed("line",!0).attr("transform",function(t){return"translate(0,"+s(t.name)+")"}).style("fill",t.eventLineColor).call(n({hasLabels:t.hasLabels,xScale:i,eventColor:t.eventColor,eventY:t.eventY,eventR:t.eventR})),l.exit().remove()}var m=e.behavior.zoom().center(null).scaleExtent([t.minScale,t.maxScale]).on("zoom",o.bind(!0));m.on("zoomend",u);var d=t.width-t.margin.right-t.margin.left,p=45*a.length,h=p+t.margin.top+t.margin.bottom;e.select(this).select("svg").remove();var g=e.select(this).append("svg").attr("width",t.width).attr("height",h),x=g.append("rect").call(m).classed("zoom",!0).attr("width",d).attr("height",h).attr("transform","translate("+t.margin.left+", 0)").on("dblclick.zoom",null),b=g.append("g").attr("transform","translate(0, 35)").call(m).on("dblclick.zoom",null),y=[],w=[];a.forEach(function(t,e){y.push(t.name),w.push(40*e)}),s.domain(y).range(w);var S=b.append("g").classed("y-axis",!0).attr("transform","translate(0, 60)"),D=S.append("g").selectAll("g").data(y);D.enter().append("g").attr("transform",function(t){return"translate(0, "+s(t)+")"}).append("line").classed("y-tick",!0).attr("x1",t.margin.left).attr("x2",t.margin.left+d),D.exit().remove();var L,A;"function"==typeof t.eventHover&&x.on("mousemove",function(n,a){var r=e.event;if(L!=r.clientX||A!=r.clientY){L=r.clientX,A=r.clientY,x.attr("display","none");var o=document.elementFromPoint(e.event.clientX,e.event.clientY);x.attr("display","block"),"circle"===o.tagName&&t.eventHover(o)}}),i.range([0,d]).domain([t.start,t.end]),m.x(i);var F=!1;l.updateZoom=o,v(),t.hasDelimiter&&c(),t.eventZoom&&t.eventZoom(i)})}var i=e.time.scale(),s=e.scale.ordinal();t=t||{};for(var c in o)t[c]="undefined"!=typeof t[c]?t[c]:o[c];return a(l,t),l}}},{"./delimiter":2,"./eventLine":4,"./util/configurable":6}],4:[function(t,e,n){"use strict";var a=t("./util/configurable"),r=t("./filterData"),o={xScale:null,hasLabels:!0};e.exports=function(t){return function(e){e=e||{xScale:null,eventColor:null,eventY:null,eventR:null};for(var n in o)e[n]="undefined"!=typeof e[n]?e[n]:o[n];var l=function(n){n.each(function(n){e.hasLabels&&(t.select(this).selectAll("text").remove(),t.select(this).append("text").text(function(t){var n=r(t.dates,e.xScale).length;return t.name+(n>0?" ("+n+")":"")}).attr("text-anchor","end").attr("transform","translate(-20)").style("fill","black")),t.select(this).selectAll("circle").remove();var a=t.select(this).selectAll("circle").data(function(t){return r(t.dates,e.xScale)}),o=a.enter().append("circle").attr("cx",function(t){return e.xScale(t)}).style("fill",e.eventColor).attr("cy",e.eventY).attr("r",e.eventR);o.selectAll(".label").remove(),o.append("title").classed("label",!0).text("Tooltips currently unimplemented."),a.exit().remove()})};return a(l,e),l}}},{"./filterData":5,"./util/configurable":6}],5:[function(t,e,n){"use strict";e.exports=function(t,e){t=t||[];var n=[],a=e.range(),r=a[0],o=a[1];return t.forEach(function(t){var a=e(t);r>a||a>o||n.push(t)}),n}},{}],6:[function(t,e,n){e.exports=function(t,e,n){n=n||{};for(var a in e)!function(a){t[a]=function(r){return arguments.length?(e[a]=r,n.hasOwnProperty(a)&&n[a](r),t):e[a]}}(a)}},{}]},{},[1]);