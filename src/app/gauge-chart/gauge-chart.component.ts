import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { text } from 'd3';

export interface IThat {
  update: any,
  configuration: any;
}

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit {
  constructor() { }


  ngOnInit(): void {
    this.Gauge({
      size: 300
    }, 500);
  }


  //@function config
  Gauge = function (configuration, value) {
    let config = {
      size: 300,
      arcInset: 200,
      arcWidth: 90,

      pointerWidth: 1,
      pointerOffset: 0,
      pointerHeadLengthPercent: 0.9,

      minValue: 300,
      maxValue: 850,

      minAngle: -90,
      maxAngle: 90,

      transitionMs: 750,

      //@label style
      //curent label Style
      currentLabelFontSize: 48,
      currentLabelInset: 20,
      //min and max label
      labelFont: "Helvetica",
      labelFontSize: 20,
      labelTextFontSize: 12,
      //color for each milestone
      arcColorFn: function (value) {
        let ticks = [
          {
            tick: 299,
            color: 'green',
          },
          {
            tick: 350,
            color: 'yellow',
          },
          {
            tick: 450,
            color: 'orange',
          },
          {
            tick: 550,
            color: 'red',
          },
        ];
        //Change the color of gauge bar when reach specific value
        let ret;
        ticks.forEach(tick => {
          if (value > tick.tick) {
            ret = tick.color;
            return;
          }
        });
        return ret;
      },
    };
    //@function clone config from configuration method
    function configure(configuration) {
      for (let prop in configuration) {
        config[prop] = configuration[prop];
      }
    }
    configure(configuration);

    //Variables for styling and sizing gauge chart
    let foreground, arc, svg, current;
    let cur_color;
    let new_color, hold;

    var oR = config.size - config.arcInset;
    var iR = config.size - oR - config.arcWidth;

    //Convert to radian to apply for render gauge chart
    function deg2rad(deg) {
      return (deg * Math.PI) / 180;
    }

    //@BIG function
    //render the gauge chart
    function render() {
      // oR = 150;
      // iR = 50;

      // Arc Defaults
      let arcData = [
        { startAngle: deg2rad(-90), endAngle: deg2rad(-48) },
        { startAngle: deg2rad(-45), endAngle: deg2rad(0) },
        { startAngle: deg2rad(2), endAngle: deg2rad(45) },
        { startAngle: deg2rad(47), endAngle: deg2rad(90) }
      ];
      let arcSeparator = [
        { startAngle: deg2rad(-48), endAngle: deg2rad(-46) },
        { startAngle: deg2rad(0), endAngle: deg2rad(2) },
        { startAngle: deg2rad(45), endAngle: deg2rad(47) },
      ];


      let d1arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90)).endAngle(deg2rad(-47));
      let d2arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-45)).endAngle(deg2rad(-0));
      let d3arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(2)).endAngle(deg2rad(45));
      let d4arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(47)).endAngle(deg2rad(90));

      arc = d3.arc()
        .innerRadius(iR)
        .outerRadius(oR).startAngle(deg2rad(-90)).endAngle(deg2rad(-40));


      // Place svg element
      svg = d3.select("body").append("svg")
        .attr("width", config.size)
        .attr("height", config.size)
        .append("g")
        .attr("transform", "translate(" + config.size / 2 + "," + config.size / 2 + ")");

      //CREATE GRADIENT COLOR 
      const createGradient = select => {
        const gradient = select
          .select('defs')
          .append('linearGradient')
          .attr('id', 'gradient');
        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('style', 'stop-color:green;stop-opacity:1');

        gradient
          .append('stop')
          .attr('offset', '50%')
          .attr('style', 'stop-color:yellow;stop-opacity:1');
        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('style', 'stop-color:red;');
      };


      svg.append('defs');
      svg.call(createGradient);

      // Append background arc to svg
      const d1Arc = svg
        .append("path")
        .attr("class", "d1-arc")
        .style('fill', "#d8d8d8")
        .attr("d", d1arc);

      var d2Arc = svg
        .append("path")
        .attr("id", "d2")
        .style('fill', "#d8d8d8")
        .attr("d", d2arc);

      var d3Arc = svg
        .append("path")
        .attr("id", "d3")
        .style('fill', "#d8d8d8")
        .attr("d", d3arc);

      var d4Arc = svg
        .append("path")
        .attr("id", "d4")
        .style('fill', "#d8d8d8")
        .attr("d", d4arc);

      var animatedPath = svg
        .append("path")
        .attr("id", "progressPath")
        .style('fill', 'red')
        .attr("d", arc);

      function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
        var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
          x: cx + radius * Math.cos(angleInRadians),
          y: cy + radius * Math.sin(angleInRadians),
        };
      }
      var cx, cy = (oR - iR) / 2;
      var start = polarToCartesian(cx, cy, iR, -40 * 0.9999);
      var end = polarToCartesian(cx, cy, iR, -90);

      var circle = svg
        .append("circle")
        .attr('cx', start.x)
        .attr('cy', start.y)
        .attr('r', 8)
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('fill', 'white');
      // Display Max value
      var max = svg
        .append('text')
        .attr('transform', 'translate(' + (iR + (oR - iR) / 2) + ',20)') // Set between inner and outer Radius
        .attr('text-anchor', 'middle')
        .style('font-family', config.labelFont)
        .text(config.maxValue);

      // Display Min value
      var min = svg
        .append('text')
        .attr('transform', 'translate(' + -(iR + (oR - iR) / 2) + ',20)') // Set between inner and outer Radius
        .attr('text-anchor', 'middle')
        .style('font-size', config.labelFontSize)
        .style('font-family', config.labelFont)
        .text(config.minValue);

      // Display Current value
      current = svg
        .append('text')
        .attr(
          'transform',
          'translate(0,' + -(-config.currentLabelInset + iR / 3) + ')'
        ) // Push up from center 1/4 of innerRadius
        .attr('text-anchor', 'middle')
        .style('font-size', config.currentLabelFontSize)
        .style('font-family', config.labelFont)
        .style('letter-spacing', "0.48px")
        .text(150); // insert current value to this

      var LabelText = svg
        .append('text')
        .attr(
          'transform',
          'translate(0,' + -(-config.currentLabelInset + iR / 100) + ')'
        )
        .attr('text-anchor', 'middle')
        .style('font-size', config.labelTextFontSize)
        .style('font-weight', "bold")
        .style('letter-spacing', "0.24px")
        .style('fill', "#6cbe45")
        .text('VERY GOOD');
    }
    function update(value) {
      // Get new color
      new_color = config.arcColorFn(value);

      var numPi = deg2rad(Math.floor(((value - 300) * 180) / (config.maxValue) - 90));

      // Display Current value
      current.transition().text(value);

      // .text(config.labelFormat(value))



      // Arc Transition
      foreground
        .transition()
        .duration(config.transitionMs)
        .style('fill', function () {
          return 'url(#gradient)';
        })
        .call(arcTween, numPi);

      // Set colors for next transition
      hold = cur_color;
      cur_color = new_color;
      new_color = hold;
    }

    // Update animation
    function arcTween(transition, newAngle) {
      transition.attrTween('d', function (d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });
    }

    render();
    // update(300);
    // setInterval(() => {
    //   update(400);
    // }, 1500);

    return config;
  };
};
