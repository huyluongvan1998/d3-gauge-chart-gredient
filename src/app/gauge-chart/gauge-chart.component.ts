import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export interface IThat {
  update: any,
  configuration: any
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
  Gauge = function(configuration, value) {
    let that: IThat;

    let config = {
      size: 300,
      arcInset: 150,
      arcWidth: 60,

      pointerWidth: 1,
      pointerOffset: 0,
      pointerHeadLengthPercent: 0.9,

      minValue: 300,
      maxValue: 850,

      minAngle: -90,
      maxAngle: 90,

      transitionMs: 750,
      
      //label Style
      currentLabelFontSize: 20,
      currentLabelInset: 20,
      labelFont: "Helvetica",
      labelFontSize: 15,
      //color for each milestone
      arcColorFn: function (value) {
        let ticks = [
          {
            tick: 0,
            color: 'green',
          },
          {
            tick: 50,
            color: 'yellow',
          },
          {
            tick: 100,
            color: 'orange',
          },
          {
            tick: 150,
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
        {startAngle: deg2rad(-90), endAngle: deg2rad(-45)},
        {startAngle: deg2rad(-40), endAngle: deg2rad(45)},
        {startAngle: deg2rad(50), endAngle: deg2rad(90)}
      ]
      arc = d3.arc().innerRadius(iR).outerRadius(oR);
      let progressArc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90));
      
      // Place svg element
      // insert attr for gauge chart container 
      svg = d3
        .select('#gauge-chart')
        .append('svg')
        .attr('width', config.size)
        .attr('height', config.size)
        .append('g')
        .attr(
          'transform',
          'translate(' + config.size / 2 + ',' + config.size / 2 + ')'
        )
        .selectAll('path')
        .filter(() => !this.classList.contains("progress"))
        .data(arcData)
        .enter()
        .append('path')
        .style("fill", "#d8d8d8")
        .attr('d', arc);
        ;
          
      // Append background arc to svg
        // var background = d3
        // .select('g')
        // .selectAll('path')
        // .filter(() => !this.classList.contains("progress"))
        // .data(arcData)
        // .enter()
        // .append('path')
        // .style("fill", "#d8d8d8")
        // .attr('d', arc);
  
      

      // Append foreground arc to svg
      foreground = svg
      .append('path')
      .datum({
        endAngle: deg2rad(-90),
      })
      .attr("class", "progress")
      //.style("fill", cur_color)
      .attr('d', progressArc);


      
      // spacing bettween each path

     


      // Display Max value
      var max = svg
        .append('text')
        .attr('transform', 'translate(' + (iR + (oR - iR) / 2) + ',15)') // Set between inner and outer Radius
        .attr('text-anchor', 'middle')
        .style('font-family', config.labelFont)
        .text(config.maxValue);
  
      // Display Min value
      var min = svg
        .append('text')
        .attr('transform', 'translate(' + -(iR + (oR - iR) / 2) + ',15)') // Set between inner and outer Radius
        .attr('text-anchor', 'middle')
        .style('font-size', config.labelFontSize)
        .style('font-family', config.labelFont)
        .text(config.minValue);
  
      // Display Current value
      current = svg
        .append('text')
        .attr(
          'transform',
          'translate(0,' + -(-config.currentLabelInset + iR / 4) + ')'
        ) // Push up from center 1/4 of innerRadius
        .attr('text-anchor', 'middle')
        .style('font-size', config.currentLabelFontSize)
        .style('font-family', config.labelFont)
        .text(150); // insert current value to this
    }
    function update(value) {
      // Get new color
      new_color = config.arcColorFn(value);
      console.log(new_color);
  
      var numPi = deg2rad(Math.floor((value * 180) / config.maxValue - 90));
  
      // Display Current value
      current.transition().text(value);
      // .text(config.labelFormat(value))
  
      // Arc Transition
      foreground
        .transition()
        .duration(config.transitionMs)
        .styleTween('fill', function () {
          return d3.interpolate(new_color, cur_color);
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
    update(value);

    return config;
    };
}
