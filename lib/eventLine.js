"use strict";
/* global require, module, d3 */
var configurable = require('./util/configurable');
var filterData = require('./filterData');

var defaultConfig = {
  xScale: null,
  hasLabels: true
};

module.exports = function (d3) {
  return function (config) {

    config = config || {
      xScale: null,
      eventColor: null,
      eventY: null,
      eventR: null,
      mousemove: function() {}
    };
    for (var key in defaultConfig) {
      config[key] = (typeof config[key] !== "undefined") ? config[key] : defaultConfig[key];
    }

    var eventLine = function eventLine(selection) {
      selection.each(function (data) {
        if(config.hasLabels) {
            d3.select(this).selectAll('text').remove();

            d3.select(this).append('text')
              .text(function(d) {
                var count = filterData(d.dates, config.xScale).length;
                return d.name + (count > 0 ? ' (' + count + ')' : '');
              })
              .attr('text-anchor', 'end')
              .attr('transform', 'translate(-20)')
              .style('fill', 'black')
            ;
        }

        d3.select(this).selectAll('circle')
            .on('mousemove', null)
            .remove();

        var circle = d3.select(this).selectAll('circle')
          .data(function(d) {
            // filter value outside of range
            return filterData(d.dates, config.xScale);
          });

        var circles = circle.enter()
          .append('circle')
          .classed('event-marker', true)
          .attr('cx', function(d) {
            return config.xScale(d.date);
          })
          .style('fill', config.eventColor)
          .attr('cy', config.eventY)
          .on('mousemove', config.mousemove)
          .attr('class', function(d) { return d && d.classes && d.classes.reduce(function(v, c) { return v + c;}, '') || ''})
          .attr('r', function(d) { return d && d.radius || config.eventR; })
        ;

        /*
        circles.selectAll('.label').remove();
        circles.append('title').classed('label', true).text(function(d) {
          return d.text || 'Tooltips currently unimplemented.';
        });
        */

        circle.exit().remove();

      });
    };

    configurable(eventLine, config);

    return eventLine;
  };
};
