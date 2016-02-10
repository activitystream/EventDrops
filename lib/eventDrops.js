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
    eventZoom: null,
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
    hasOuterTicks: true
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
        var graphHeight = data.length * 50;
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

        if (typeof config.eventHover === 'function') {
          zoomRect.on('mousemove', function(d, e) {
            var event = d3.event;
            if (curx == event.clientX && cury == event.clientY) return;
            curx = event.clientX;
            cury = event.clientY;
            zoomRect.attr('display', 'none');
            var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
            zoomRect.attr('display', 'block');
            if (el.tagName !== 'circle') return;
            config.eventHover(el);
          });
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

        function redraw() {

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

          lines.enter()
            .append('g')
            .classed('line', true)
            .attr('transform', function(d) {
              return 'translate(0,' + yScale(d.name) + ')';
            })
            .style('fill', config.eventLineColor)
            .call(eventLine({ hasLabels: config.hasLabels, xScale: xScale, eventColor: config.eventColor, eventY: config.eventY, eventR: config.eventR }))
          ;

          lines.exit().remove();
        }

        redraw();
        if (config.hasDelimiter) {
          redrawDelimiter();
        }
        if (config.eventZoom) {
          config.eventZoom(xScale);
        }
      });
    }

    configurable(eventDropGraph, config);

    return eventDropGraph;
  };
};
