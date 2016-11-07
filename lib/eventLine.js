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
      eventR: null
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

        d3.select(this).selectAll('circle').remove();

        var circle = d3.select(this).selectAll('circle')
          .data(function(d) {
            // filter value outside of range
            return filterData(d.dates, config.xScale);
          });

        var updateAndEnter = circle.enter()
          .append('circle')
          .attr('cx', function(d) {
            return config.xScale(d);
          })
          .style('fill', config.eventColor)
          .attr('cy', config.eventY)
          .attr('class', function(d) { return d && d.classes.reduce(function(v, c) { return v + c;}, '') || ''})
          .attr('r', function(d) { return d && d.radius || config.eventR; })
        ;

        updateAndEnter.selectAll('.label').remove();
        updateAndEnter.append('title').classed('label', true).text('Tooltips currently unimplemented.');

        circle.exit().remove();

      });
    };

    configurable(eventLine, config);

    return eventLine;
  };
};
