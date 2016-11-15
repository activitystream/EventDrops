"use strict";
/* global require, module */
var configurable = require('./util/configurable');

module.exports = function (d3) {
  var eventLine = require('./eventLine')(d3);
  var delimiter = require('./delimiter')(d3);

  var defaultConfig = {
    start: new Date(0),
    end: new Date(),
    minScale: 0,
    maxScale: Infinity,
    width: 1000,
    margin: {
      top: 60,
      left: 200,
      bottom: 40,
      right: 50
    },
    locale: null,
    axisFormat: null,
    tickFormat: [
        [".%L", function(d) { return d.getMilliseconds(); }],
        [":%S", function(d) { return d.getSeconds(); }],
        ["%I:%M", function(d) { return d.getMinutes(); }],
        ["%I %p", function(d) { return d.getHours(); }],
        ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
        ["%b %d", function(d) { return d.getDate() != 1; }],
        ["%B", function(d) { return d.getMonth(); }],
        ["%Y", function() { return true; }]
    ],
    eventHover: null,
    eventHoverComplete: null,
    eventZoom: null,
    eventClick: null,
    hasDelimiter: true,
    hasTopAxis: true,
    hasLabels: true,
    hasIntervalLabels: true,
    zoomCallback: function() {
    },
    hasBottomAxis: function (data) {
      return data.length >= 10;
    },
    eventLineColor: 'black',
    eventColor: null,
    eventY: -5,
    eventR: 10,
    hasOuterTicks: true,
    graphHeight: 50
  };

  return function eventDrops(config) {
    var xScale = d3.time.scale();
    var yScale = d3.scale.ordinal();
    config = config || {};
    for (var key in defaultConfig) {
      config[key] = (typeof config[key] !== "undefined") ? config[key] : defaultConfig[key];
    }
    function eventDropGraph(selection) {
      selection.each(function (data) {
        var zoom = d3.behavior.zoom().center(null).scaleExtent([config.minScale, config.maxScale]).on("zoom", updateZoom.bind(true));

        zoom.on("zoomend", zoomEnd);

        var graphWidth = config.width - config.margin.right - config.margin.left;
        var graphHeight = data.length * config.graphHeight;
        var height = graphHeight + config.margin.top + config.margin.bottom;

        d3.select(this).select('svg').remove();

        var svg = d3.select(this)
          .append('svg')
          .attr('width', config.width)
          .attr('height', height)
        ;

        var zoomRect = svg
          .append('rect')
          .call(zoom)
          .classed('zoom', true)
          .attr('width', graphWidth)
          .attr('height', height)
          .attr('transform', 'translate(' + config.margin.left + ', 0)')
          .on('dblclick.zoom', null)
        ;

        var graph = svg.append('g')
          .attr('transform', 'translate(0, 35)')
          .call(zoom)
          .on('dblclick.zoom', null)
        ;

        var yDomain = [];
        var yRange = [];

        data.forEach(function (event, index) {
          yDomain.push(event.name);
          yRange.push(index * 40);
        });

        yScale.domain(yDomain).range(yRange);

        var yAxisEl = graph.append('g')
          .classed('y-axis', true)
          .attr('transform', 'translate(0, 60)');

        var yTick = yAxisEl.append('g').selectAll('g').data(yDomain);

        yTick.enter()
          .append('g')
          .attr('transform', function(d) {
            return 'translate(0, ' + yScale(d) + ')';
          })
          .append('line')
          .classed('y-tick', true)
          .attr('x1', config.margin.left)
          .attr('x2', config.margin.left + graphWidth);

        yTick.exit().remove();

        var curx, cury;

        function hover_hit(datum, el, svg) {
          config.eventHoverComplete(selection[0][0]);
          selection[0][0].style.cursor = "pointer";
          config.eventHover(el.__data__, el, selection[0][0]);
        };
        function hover_miss(svg) {
          config.eventHoverComplete(selection[0][0]);
          selection[0][0].style.cursor = "auto";
        };

        function mousemove(d, e) {
          var hit = this.hit;
          var miss = this.miss;
          var event = d3.event;
          if (curx == event.clientX && cury == event.clientY) return;
          curx = event.clientX;
          cury = event.clientY;

          if((typeof svg[0][0].getIntersectionList) !== 'function') {
            zoomRect.attr('display', 'none');
            var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
            zoomRect.attr('display', 'block');
            if(el.tagName === 'circle') {
              hit(el.__data__, el, selection[0][0]);
            }
            return;
          }
          //svg.select('.my-pointer').remove();

          var rpos = svg[0][0].createSVGRect();
          var bounds = svg[0][0].getBoundingClientRect();
          rpos.x = event.clientX - (bounds.x || bounds.left) - 5;
          rpos.y = /*bounds.height - */ (event.clientY - (bounds.y || bounds.top)) - 5;
          rpos.width = rpos.height = 3;

          /*
          svg
              .append('rect')
              .classed("my-pointer", true)
              .attr("pointer-events", "none")
              .attr("x", rpos.x)
              .attr("y", rpos.y)
              .attr("width", rpos.width)
              .attr("height", rpos.height)
              .attr("fill", "red");
              */


          zoomRect.attr('display', 'none');
          var list = svg[0][0].getIntersectionList(rpos, null);
          zoomRect.attr('display', 'block');
          for (var x = 0; x < list.length; ++x) {
            if (list[x].tagName === 'circle') {
              hit(list[x].__data__, list[x], selection[0][0]);
              return;
            }
          }
          miss(selection[0][0]);
          return;
        };

        if (typeof config.eventHover === 'function') {
          zoomRect.on('mousemove', mousemove.bind({
            hit: hover_hit,
            miss: hover_miss
          }));
        }

        xScale.range([0, graphWidth]).domain([config.start, config.end]);

        zoom.x(xScale);

        var inhibit = false;
        function updateZoom(notify, parameters) {
          if(inhibit) {
              inhibit = false;
              return;
          }
          if(notify) {
            config.zoomCallback({
              translate: d3.event.translate,
              scale: d3.event.scale,
              p: d3.mouse(svg[0][0])
            });
            return;
          }
          if(d3.event.sourceEvent === null) {
              return;
          }
          if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
            zoom.translate([d3.event.translate[0], 0]);
          }

          if (d3.event.sourceEvent.toString() === '[object WheelEvent]') {
            zoom.translate([d3.event.translate[0], 0]);
            zoom.scale(d3.event.scale);
          }
          //d3.event.stopPropagation();
          inhibit = true;
          zoom.event(zoomRect);
          redraw();
        }
        // Export
        eventDropGraph.updateZoom = updateZoom;

        function redrawDelimiter() {
          svg.select('.delimiter').remove();
          var delimiterEl = svg
            .append('g')
            .classed('delimiter', true)
            .attr('width', graphWidth)
            .attr('height', 10)
            .attr('transform', 'translate(' + config.margin.left + ', ' + (config.margin.top - 45) + ')')
            .call(delimiter({
              hasIntervalLabels: config.hasIntervalLabels,
              xScale: xScale,
              dateFormat: config.locale ? config.locale.timeFormat("%d %B %Y") : d3.time.format("%d %B %Y")
            }))
          ;
        }

        function zoomEnd() {
          if (config.eventZoom) {
            config.eventZoom(xScale);
          }
          if (config.hasDelimiter) {
            redrawDelimiter();
          }
        }

        function drawXAxis(where) {

          // copy config.tickFormat because d3 format.multi edit its given tickFormat data
          var tickFormatData = [];

          config.tickFormat.forEach(function (item) {
            var tick = item.slice(0);
            tickFormatData.push(tick);
          });

          var tickFormat = config.locale ? config.locale.timeFormat.multi(tickFormatData) : d3.time.format.multi(tickFormatData);
          var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient(where)
            .tickFormat(tickFormat)
          ;

          if(!config.hasOuterTicks) {
              xAxis.outerTickSize(0)
          }

          if (typeof config.axisFormat === 'function') {
            config.axisFormat(xAxis);
          }

          var y = (where == 'bottom' ? parseInt(graphHeight) : 0) + config.margin.top - 40;

          graph.select('.x-axis.' + where).remove();
          var xAxisEl = graph
            .append('g')
            .classed('x-axis', true)
            .classed(where, true)
            .attr('transform', 'translate(' + config.margin.left + ', ' + y + ')')
            .call(xAxis)
          ;
        }

        function unload() {
          zoom.on("zoom", null);
          zoom.on("zoomend", null);
          zoomRect.on('mousemove', null);
          zoomRect.on('click', null);
          d3.select('.event-marker')
              .on('mousemove', null)
              .on('click', null);
        }

        eventDropGraph.unload = unload;

        function redraw(reset) {
          console.log('timeline_x internal redraw!');

          if(reset) {
            zoom.on("zoom", updateZoom.bind(true));
            zoom.on("zoomend", null);
            zoom.on("zoomend", zoomEnd);
            graph.call(zoom)
                .on('dblclick.zoom', null);
            zoomRect.call(zoom)
                .on('dblclick.zoom', null);
          }

          var hasTopAxis = typeof config.hasTopAxis === 'function' ? config.hasTopAxis(data) : config.hasTopAxis;
          if (hasTopAxis) {
            drawXAxis('top');
          }

          var hasBottomAxis = typeof config.hasBottomAxis === 'function' ? config.hasBottomAxis(data) : config.hasBottomAxis;
          if (hasBottomAxis) {
            drawXAxis('bottom');
          }

          zoom.size([config.width, height]);

          graph.select('.graph-body').remove();
          var graphBody = graph
              .append('g')
              .classed('graph-body', true)
              .attr('transform', 'translate(' + config.margin.left + ', ' + (config.margin.top - 15) + ')');

          var lines = graphBody.selectAll('g').data(data);

          const enter_and_update = lines.enter();
          enter_and_update.append('g')
              .classed('line', true)
              .attr('transform', function(d) {
                return 'translate(0,' + yScale(d.name) + ')';
              })
              .style('fill', config.eventLineColor)
              .call(eventLine({
                hasLabels: config.hasLabels,
                xScale: xScale,
                eventColor: config.eventColor,
                eventY: config.eventY,
                eventR: config.eventR,
                mousemove: mousemove.bind({
                  hit: hover_hit,
                  miss: hover_miss
                }),
                click: function(d,i) {
                  config.eventClick(d, d3.event.target);
                }
              }));
          ;

          lines.exit().remove();
        }

        // Export
        eventDropGraph.redraw = redraw;

        redraw();
        if (config.hasDelimiter) {
          redrawDelimiter();
        }
        if (config.eventZoom) {
          config.eventZoom(xScale, true);
        }
      });
    }

    configurable(eventDropGraph, config);

    return eventDropGraph;
  };
};
