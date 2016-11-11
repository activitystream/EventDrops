!function e(t,n,r){function a(l,i){if(!n[l]){if(!t[l]){var c="function"==typeof require&&require;if(!i&&c)return c(l,!0);if(o)return o(l,!0);var s=new Error("Cannot find module '"+l+"'");throw s.code="MODULE_NOT_FOUND",s}var u=n[l]={exports:{}};t[l][0].call(u.exports,function(e){var n=t[l][1][e];return a(n?n:e)},u,u.exports,e,t,n,r)}return n[l].exports}for(var o="function"==typeof require&&require,l=0;l<r.length;l++)a(r[l]);return a}({1:[function(e,t){"use strict";var n=e("./eventDrops");"function"==typeof define&&define.amd?define("d3.chart.eventDrops",["d3"],function(e){e.chart=e.chart||{},e.chart.eventDrops=n(e)}):window?(window.d3.chart=window.d3.chart||{},window.d3.chart.eventDrops=n(window.d3)):t.exports=n},{"./eventDrops":3}],2:[function(e,t){"use strict";var n=e("./util/configurable"),r={xScale:null,dateFormat:null,hasIntervalLabels:!0};t.exports=function(e){return function(t){function a(n){n.each(function(){e.select(this).selectAll("text").remove();var n=t.xScale.domain();t.hasIntervalLabels&&e.select(this).append("text").text(function(){return t.dateFormat(n[0])}).classed("start",!0),t.hasIntervalLabels&&e.select(this).append("text").text(function(){return t.dateFormat(n[1])}).attr("text-anchor","end").attr("transform","translate("+t.xScale.range()[1]+")").classed("end",!0)})}t=t||{};for(var o in r)t[o]="undefined"!=typeof t[o]?t[o]:r[o];return n(a,t),a}}},{"./util/configurable":6}],3:[function(e,t){"use strict";var n=e("./util/configurable");t.exports=function(t){var r=e("./eventLine")(t),a=e("./delimiter")(t),o={start:new Date(0),end:new Date,minScale:0,maxScale:1/0,width:1e3,margin:{top:60,left:200,bottom:40,right:50},locale:null,axisFormat:null,tickFormat:[[".%L",function(e){return e.getMilliseconds()}],[":%S",function(e){return e.getSeconds()}],["%I:%M",function(e){return e.getMinutes()}],["%I %p",function(e){return e.getHours()}],["%a %d",function(e){return e.getDay()&&1!=e.getDate()}],["%b %d",function(e){return 1!=e.getDate()}],["%B",function(e){return e.getMonth()}],["%Y",function(){return!0}]],eventHover:null,eventHoverComplete:null,eventZoom:null,hasDelimiter:!0,hasTopAxis:!0,hasLabels:!0,hasIntervalLabels:!0,zoomCallback:function(){},hasBottomAxis:function(e){return e.length>=10},eventLineColor:"black",eventColor:null,eventY:-5,eventR:10,hasOuterTicks:!0,graphHeight:50};return function(e){function l(n){n.each(function(o){function s(){var r=t.event;if(C!=r.clientX||A!=r.clientY){if(C=r.clientX,A=r.clientY,"function"!=typeof y[0][0].getIntersectionList){w.attr("display","none");var a=document.elementFromPoint(t.event.clientX,t.event.clientY);return w.attr("display","block"),void("circle"===a.tagName&&(e.eventHoverComplete(n[0][0]),e.eventHover(a.__data__,a,n[0][0])))}var o=y[0][0].createSVGRect(),l=y[0][0].getBoundingClientRect();o.x=r.clientX-(l.x||l.left)-5,o.y=r.clientY-(l.y||l.top)-5,o.width=o.height=3,w.attr("display","none");var i=y[0][0].getIntersectionList(o,null);w.attr("display","block");for(var c=0;c<i.length;++c)if("circle"===i[c].tagName)return e.eventHoverComplete(n[0][0]),void e.eventHover(i[c].__data__,i[c],n[0][0]);e.eventHoverComplete(n[0][0])}}function u(n){return F?void(F=!1):n?void e.zoomCallback({translate:t.event.translate,scale:t.event.scale,p:t.mouse(y[0][0])}):void(null!==t.event.sourceEvent&&("[object MouseEvent]"===t.event.sourceEvent.toString()&&h.translate([t.event.translate[0],0]),"[object WheelEvent]"===t.event.sourceEvent.toString()&&(h.translate([t.event.translate[0],0]),h.scale(t.event.scale)),F=!0,h.event(w),p()))}function v(){y.select(".delimiter").remove();y.append("g").classed("delimiter",!0).attr("width",g).attr("height",10).attr("transform","translate("+e.margin.left+", "+(e.margin.top-45)+")").call(a({hasIntervalLabels:e.hasIntervalLabels,xScale:i,dateFormat:e.locale?e.locale.timeFormat("%d %B %Y"):t.time.format("%d %B %Y")}))}function m(){e.eventZoom&&e.eventZoom(i),e.hasDelimiter&&v()}function f(n){var r=[];e.tickFormat.forEach(function(e){var t=e.slice(0);r.push(t)});var a=e.locale?e.locale.timeFormat.multi(r):t.time.format.multi(r),o=t.svg.axis().scale(i).orient(n).tickFormat(a);e.hasOuterTicks||o.outerTickSize(0),"function"==typeof e.axisFormat&&e.axisFormat(o);var l=("bottom"==n?parseInt(x):0)+e.margin.top-40;S.select(".x-axis."+n).remove();S.append("g").classed("x-axis",!0).classed(n,!0).attr("transform","translate("+e.margin.left+", "+l+")").call(o)}function d(){h.on("zoom",null),h.on("zoomend",null),w.on("mousemove",null),t.select(".event-marker").on("mousemove",null)}function p(t){console.log("timeline_x internal redraw!"),t&&(h.on("zoom",u.bind(!0)),h.on("zoomend",null),h.on("zoomend",m),S.call(h).on("dblclick.zoom",null),w.call(h).on("dblclick.zoom",null));var n="function"==typeof e.hasTopAxis?e.hasTopAxis(o):e.hasTopAxis;n&&f("top");var a="function"==typeof e.hasBottomAxis?e.hasBottomAxis(o):e.hasBottomAxis;a&&f("bottom"),h.size([e.width,b]),S.select(".graph-body").remove();var l=S.append("g").classed("graph-body",!0).attr("transform","translate("+e.margin.left+", "+(e.margin.top-15)+")"),v=l.selectAll("g").data(o);const d=v.enter();d.append("g").classed("line",!0).attr("transform",function(e){return"translate(0,"+c(e.name)+")"}).style("fill",e.eventLineColor).call(r({hasLabels:e.hasLabels,xScale:i,eventColor:e.eventColor,eventY:e.eventY,eventR:e.eventR,mousemove:s})),v.exit().remove()}var h=t.behavior.zoom().center(null).scaleExtent([e.minScale,e.maxScale]).on("zoom",u.bind(!0));h.on("zoomend",m);var g=e.width-e.margin.right-e.margin.left,x=o.length*e.graphHeight,b=x+e.margin.top+e.margin.bottom;t.select(this).select("svg").remove();var y=t.select(this).append("svg").attr("width",e.width).attr("height",b),w=y.append("rect").call(h).classed("zoom",!0).attr("width",g).attr("height",b).attr("transform","translate("+e.margin.left+", 0)").on("dblclick.zoom",null),S=y.append("g").attr("transform","translate(0, 35)").call(h).on("dblclick.zoom",null),k=[],L=[];o.forEach(function(e,t){k.push(e.name),L.push(40*t)}),c.domain(k).range(L);var z=S.append("g").classed("y-axis",!0).attr("transform","translate(0, 60)"),D=z.append("g").selectAll("g").data(k);D.enter().append("g").attr("transform",function(e){return"translate(0, "+c(e)+")"}).append("line").classed("y-tick",!0).attr("x1",e.margin.left).attr("x2",e.margin.left+g),D.exit().remove();var C,A;"function"==typeof e.eventHover&&w.on("mousemove",s),i.range([0,g]).domain([e.start,e.end]),h.x(i);var F=!1;l.updateZoom=u,l.unload=d,l.redraw=p,p(),e.hasDelimiter&&v(),e.eventZoom&&e.eventZoom(i,!0)})}var i=t.time.scale(),c=t.scale.ordinal();e=e||{};for(var s in o)e[s]="undefined"!=typeof e[s]?e[s]:o[s];return n(l,e),l}}},{"./delimiter":2,"./eventLine":4,"./util/configurable":6}],4:[function(e,t){"use strict";var n=e("./util/configurable"),r=e("./filterData"),a={xScale:null,hasLabels:!0};t.exports=function(e){return function(t){t=t||{xScale:null,eventColor:null,eventY:null,eventR:null,mousemove:function(){}};for(var o in a)t[o]="undefined"!=typeof t[o]?t[o]:a[o];var l=function(n){n.each(function(){t.hasLabels&&(e.select(this).selectAll("text").remove(),e.select(this).append("text").text(function(e){var n=r(e.dates,t.xScale).length;return e.name+(n>0?" ("+n+")":"")}).attr("text-anchor","end").attr("transform","translate(-20)").style("fill","black")),e.select(this).selectAll("circle").on("mousemove",null).remove();{var n=e.select(this).selectAll("circle").data(function(e){return r(e.dates,t.xScale)});n.enter().append("circle").classed("event-marker",!0).attr("cx",function(e){return t.xScale(e.date)}).style("fill",t.eventColor).attr("cy",t.eventY).on("mousemove",t.mousemove).attr("class",function(e){return e&&e.classes&&e.classes.reduce(function(e,t){return e+t},"")||""}).attr("r",function(e){return e&&e.radius||t.eventR})}n.exit().remove()})};return n(l,t),l}}},{"./filterData":5,"./util/configurable":6}],5:[function(e,t){"use strict";t.exports=function(e,t){e=e||[];var n=[],r=t.range(),a=r[0],o=r[1];return e.forEach(function(e){var r=t(e.date);a>r||r>o||n.push(e)}),n}},{}],6:[function(e,t){t.exports=function(e,t,n){n=n||{};for(var r in t)!function(r){e[r]=function(a){return arguments.length?(t[r]=a,n.hasOwnProperty(r)&&n[r](a),e):t[r]}}(r)}},{}]},{},[1]);