import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { text } from 'd3';

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
        {startAngle: deg2rad(-90), endAngle: deg2rad(-48)},
        {startAngle: deg2rad(-45), endAngle: deg2rad(0)},
        {startAngle: deg2rad(2), endAngle: deg2rad(45)},
        {startAngle: deg2rad(47), endAngle: deg2rad(90)}
      ]
      let arcSeparator = [
        {startAngle: deg2rad(-48), endAngle: deg2rad(-46)},
        {startAngle: deg2rad(0), endAngle: deg2rad(2)},
        {startAngle: deg2rad(45), endAngle: deg2rad(47)},
      ]

      arc = d3.arc()
      .innerRadius(iR)
      .outerRadius(oR)


    // Place svg element
    svg = d3.select("body").append("svg")
      .attr("width", config.size)
      .attr("height", config.size)
      .append("g")
      .attr("transform", "translate(" + config.size / 2 + "," + config.size / 2 + ")")


    // Append background arc to svg
    var background = svg
    .selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("class", "gaugeBackground")
    .style('fill', "#d8d8d8")
    .attr("d", arc)

  //CREATE GRADIENT COLOR 
  var gradient = svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", "#c00")
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "50%")
    .attr("stop-color", "yellow")
    .attr("stop-opacity", 1);


gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0c0")
    .attr("stop-opacity", 1);





    // Append foreground arc to svg
    foreground = svg.append("path")
      .datum({
        startAngle: deg2rad(-90),
        endAngle: deg2rad(-90)
      })
      //.style("fill", cur_color)
      .attr('class','progress')
      .attr("d", arc)
     

      var separator= svg
      .selectAll("path")
      .filter()
      .data(arcSeparator)
      .enter()
      .append("path")
      .attr('class','separator')
      .style('fill', "white")
      .attr("d", arc);


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
        .style('letter-spacing',"0.48px")
        .text(150); // insert current value to this
    
        var LabelText = svg
        .append('text')
        .attr(
          'transform',
          'translate(0,' + -(-config.currentLabelInset + iR / 100) + ')'
        ) 
        .attr('text-anchor', 'middle')
        .style('font-size',config.labelTextFontSize)
        .style('font-weight',"bold")
        .style('letter-spacing',"0.24px")
        .style('fill',"#6cbe45")
        .text('VERY GOOD')    
      }
    function update(value) {
      // Get new color
      new_color = config.arcColorFn(value);
  
      var numPi = deg2rad(Math.floor((value * 180) / (config.maxValue) - 90));
  
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
    update(300);
    setInterval(()=> {
      update(400);
    }, 1500)

    return config;
    };
}
