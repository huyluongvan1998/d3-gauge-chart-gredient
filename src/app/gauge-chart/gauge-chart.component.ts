import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

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
    this.Gauge(550);

  }


  //@function config
  Gauge = function (value) {
    const { PI, cos, sin, round } = Math;
    let margin = { top: 10, bottom: 10, left: 10, right: 10 };
    let width = 500 + margin.left + margin.right;
    let height = 500 + margin.top + margin.bottom;
    const size = width - 32;
    const strokeWidth = 11;

    function polarToCartesian(
      cx: number,
      cy: number,
      radius: number,
      angleInDegrees: number,
    ) {
      var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
      };
    }

    function circlePath(x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,) {
      var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
      var end = polarToCartesian(x, y, radius, startAngle);
      var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      const d = [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,

      ];
      return {
        start,
        end,
        d: d.join(' '),
      };
    }




    function deg2rad(value) {
      return value * PI / 180;
    }


    const iR = 100;
    const oR = 100;

    const d1Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90)).endAngle(deg2rad(-46));
    const d2Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-45)).endAngle(deg2rad(-1));
    const d3Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(0)).endAngle(deg2rad(44));
    const d4Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(45)).endAngle(deg2rad(89));

    let progressPath, newProgressAngle, endAngle, circle, dataArc;
    let arc = d3.arc().innerRadius(iR).outerRadius(oR);
    let ratio, color;
    const part1Ratio = 41 / 180;
    const part2Ratio = 89 / 180;
    const part3Ratio = 135 / 180;

    function SemiCircularProgress(
      progressValue,
      totalValue,
      startValue,
      endValue
    ) {
      ratio = (progressValue - startValue) / (endValue - startValue);
      console.log('Ratio: ', ratio);
      console.log('Ratio 2: ', round(ratio * 180));
      console.log('Part3: ', part3Ratio);



      if (ratio > part3Ratio) {
        progressPath = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(45));
        dataArc = [{ startAngle: deg2rad(45), endAngle: deg2rad(45) }];
        color = 'url(#linearGradient-4)';
      } else if (ratio > part2Ratio) {
        progressPath = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(0));
        dataArc = [{ startAngle: deg2rad(0), endAngle: deg2rad(0) }];
        color = 'url(#linearGradient-3)';
      } else if (ratio > part1Ratio) {
        progressPath = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-44.8));
        dataArc = [{ startAngle: deg2rad(-44.8), endAngle: deg2rad(-44.8) }];
        color = 'url(#linearGradient-2)';
      } else {
        progressPath = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90));
        dataArc = [{ startAngle: deg2rad(-90), endAngle: deg2rad(-90) }];
        color = 'url(#linearGradient-1)';
      }
    }
    //@execute function for coordinate of processPath
    SemiCircularProgress(value, 850, 300, 850);

    function draw() {

      const svg = d3.select('#gauge-chart').append('svg');
      svg.attr('height', height)
        .attr('width', width);
      //@Gradient Linear.
      //@Gradient 1
      let defs = svg.append('defs');

      //@Gradient 1
      let linearG_1 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-1')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -0.85)
        .attr('y2', 1.099);
      linearG_1.append('stop')
        .attr('offset', 0)
        .attr('stop-color', '#6dbf47');
      linearG_1.append('stop')
        .attr('offset', 0.399)
        .attr('stop-color', '#8bd768');
      linearG_1.append('stop')
        .attr('offset', 0.727)
        .attr('stop-color', '#dfc729');
      linearG_1.append('stop')
        .attr('offset', 1)
        .attr('stop-color', '#e1281e');

      //@Gradient 2
      let linearG_2 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-2')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -2.0)
        .attr('y2', 3.075);
      linearG_2.append('stop')
        .attr('offset', 0)
        .attr('stop-color', '#6dbf47');
      linearG_2.append('stop')
        .attr('offset', 0.35)
        .attr('stop-color', '#8bd768');
      linearG_2.append('stop')
        .attr('offset', 0.828)
        .attr('stop-color', '#dfc729');
      linearG_2.append('stop')
        .attr('offset', 1)
        .attr('stop-color', '#e1281e');

      //@Gradient 3
      let linearG_3 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-3')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -0.35)
        .attr('y2', 1.099);
      linearG_3.append('stop')
        .attr('offset', 0)
        .attr('stop-color', '#6dbf47');
      linearG_3.append('stop')
        .attr('offset', 0.3)
        .attr('stop-color', '#8bd768');
      linearG_3.append('stop')
        .attr('offset', 0.828)
        .attr('stop-color', '#6dbf47');
      linearG_3.append('stop')
        .attr('offset', 1)
        .attr('stop-color', '#dfc729');

      //@Gradient 4
      console.log('ratio ', ratio === 1);
      let linearG_4 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-4')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -0.445)
        .attr('y2', 1.099);
      linearG_4.append('stop')
        .attr('offset', 0)
        .attr('stop-color', '#8bd768');
      linearG_4.append('stop')
        .attr('offset', 0.86)
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 0.945)
        .attr('stop-color', '#8bd768');
      linearG_4.append('stop')
        .attr('offset', 0.978)
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 1)
        .attr('stop-color', '#6dbf47');



      //@Gauge-chart
      const g = svg.append('g')
        .attr('transform', `translate(200, 200)`);

      g
        .attr('id', 'color-chart')
        .attr('rotation', 90)
        .attr('originX', width / 2)
        .attr('originY', width / 2);

      g.append('path')
        .attr('d', d1Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d1')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', '#d8d8d8');


      g.append('path')
        .attr('d', d2Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d2')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', '#d8d8d8');
      g.append('path')
        .attr('d', d3Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d3')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', '#d8d8d8');
      g.append('path')
        .attr('d', d4Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d4')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', '#d8d8d8');


      const arc = d3.arc().innerRadius(iR).outerRadius(oR);


      const path = g
        .selectAll('.progress-path')
        .data(dataArc);

      path.enter()
        .append('path')
        .attr('d', arc)
        .attr('class', 'progress-path')
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', color);

      circle = path.enter().append('circle')
        .attr('r', 8)
        .attr('id', 'mini-circle')
        .attr('stroke-width', 2)
        .attr('stroke', '#8bd768')
        .attr('fill', '#fff');
    }

    function update() {
      const g = d3.select('g');
      newProgressAngle = deg2rad(-90 + round(ratio * 180));

      g.select('.path-d1')
        .attr('d', d1Arc)
        .attr('stroke', `${ratio > part1Ratio ? 'url(#linearGradient-1)' : '#d8d8d8'}`);
      g.select('.path-d2')
        .attr('d', d2Arc)
        .attr('stroke', `${ratio > part2Ratio ? 'url(#linearGradient-2)' : '#d8d8d8'}`);
      g.select('.path-d3')
        .attr('d', d3Arc)
        .attr('stroke', `${ratio > part3Ratio ? 'url(#linearGradient-3)' : '#d8d8d8'}`);
      g.select('.path-d4')
        .attr('d', d4Arc)
        .attr('stroke', `${ratio === 1 ? 'url(#linearGradient-4)' : '#d8d8d8'}`);



      const progressGauge = g.select('.progress-path');
      progressGauge
        .transition()
        .duration(3000)
        .call(arcTween, newProgressAngle);

      circle
        .attr('cx', 0 - iR)
        .attr('cy', 0)
        .transition()
        .duration(1000)
        .attrTween("pathTween", function (d: any) {
          const startAngle = d.startAngle;
          const endAngle = newProgressAngle;
          const start: any = { startAngle, endAngle: startAngle }; // <-A
          const end: any = { startAngle: endAngle, endAngle };
          console.log(start, end);
          var interpolate = d3.interpolate(start, end);
          const circ = d3.select(this); // Select the circle
          return function (t) {
            const cent = arc.centroid(interpolate(t));
            circ
              .attr("cx", cent[0]) // Set the cx
              .attr("cy", cent[1]); // Set the cy                
          };
        });



      //@ArcTween Function => update the new coordinate for progress Gauge
      function arcTween(selection, newAngle) {
        selection.attrTween('d', function (d) {
          var interpolate = d3.interpolate(d.startAngle, newAngle);
          return function (t) {
            d.endAngle = interpolate(t);
            return progressPath(d);
          };
        });
      };



      // g.append('circle')
      //   .attr("cx", point.x)
      //   .attr("cy", point.y)
      //   .attr('r', 8)
      //   .attr('class', 'mini-circle')
      //   .attr('stroke-width', 2)
      //   .attr('stroke', '#8bd768')
      //   .attr('fill', '#fff');
    }

    draw();
    update();

  };
}
