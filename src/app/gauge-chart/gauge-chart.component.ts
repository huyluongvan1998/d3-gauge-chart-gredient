import { Component, OnInit, SimpleChanges } from '@angular/core';
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
    this.Gauge(450);

  }


  //@function config
  Gauge = function (value) {
    const { PI, cos, sin, round } = Math;
    let margin = { top: 10, bottom: 10, left: 10, right: 10 };
    let width = 300 + margin.left + margin.right;
    let height = 300 + margin.top + margin.bottom;
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
    const size = width - 32;
    const strokeWidth = 11;
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const A = 50;

    function deg2rad(value) {
      return value * PI / 180;
    }



    const d1Arc = circlePath(cx, cy, r, -90, -46);
    const d2Arc = circlePath(cx, cy, r, -45, -1);
    const d3Arc = circlePath(cx, cy, r, 0, 44);
    const d4Arc = circlePath(cx, cy, r, 45, 89);
    const dArc = d3.arc().innerRadius(cx + r).outerRadius(cx + r + strokeWidth).startAngle(deg2rad(-90));

    let progressPath;

    let ratio, color;
    const part1Ratio = 41 / 180;
    const part2Ratio = 91 / 180;
    const part3Ratio = 141 / 180;

    function SemiCircularProgress(
      progressValue,
      totalValue,
      startValue,
      endValue
    ) {
      ratio = (progressValue - startValue) / (endValue - startValue);
      console.log('Ratio: ', ratio);
      console.log('Ratio 2: ', round(ratio * 180));
      console.log('Part1: ', part1Ratio);



      if (ratio > part3Ratio) {
        progressPath = circlePath(cx, cy, r, 45, -90 + round(ratio * 180));
        color = 'url(#linearGradient-4)';
      } else if (ratio > part2Ratio) {
        progressPath = circlePath(cx, cy, r, 0, -90 + round(ratio * 180));
        color = 'url(#linearGradient-3)';
      } else if (ratio > part1Ratio) {
        progressPath = circlePath(cx, cy, r, -44.8, -90 + round(ratio * 180));
        color = 'url(#linearGradient-2)';
      } else {
        progressPath = circlePath(cx, cy, r, -90, -90 + round(ratio * 180));
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
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 0.86)
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 0.945)
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 0.978)
        .attr('stop-color', '#6dbf47');
      linearG_4.append('stop')
        .attr('offset', 1)
        .attr('stop-color', '#e1281e');



      //@Gauge-chart
      const g = svg.append('g')
        .attr('transform', `translate(10, 10)`);

      g
        .attr('id', 'color-chart')
        .attr('rotation', 90)
        .attr('originX', width / 2)
        .attr('originY', width / 2);

      g.append('path')
        .attr('d', d1Arc.d)
        .attr('fill', 'none')
        .attr('data-name', 'Path 1527')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part1Ratio ? 'url(#linearGradient-1)' : '#d8d8d8'}`);

      g.append('path')
        .attr('d', d2Arc.d)
        .attr('fill', 'none')
        .attr('data-name', 'Path 1527')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part2Ratio ? 'url(#linearGradient-2)' : '#d8d8d8'}`);
      g.append('path')
        .attr('d', d3Arc.d)
        .attr('fill', 'none')
        .attr('data-name', 'Path 1527')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part3Ratio ? 'url(#linearGradient-3)' : '#d8d8d8'}`);
      g.append('path')
        .attr('d', d4Arc.d)
        .attr('fill', 'none')
        .attr('data-name', 'Path 1527')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio === 1 ? 'url(#linearGradient-4)' : '#d8d8d8'}`);

      g.append('path')
        .attr('d', progressPath.d)
        .attr('class', 'progress-path')
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', color);
      g.append('circle')
        .attr('cx', progressPath.start.x)
        .attr('cy', progressPath.start.y)
        .attr('r', 8)
        .attr('class', 'mini-circle')
        .attr('stroke-width', 2)
        .attr('stroke', '#8bd768')
        .attr('fill', '#fff');

      g.append('path')
        .datum({ endAngle: deg2rad(-45) })
        .attr('d', dArc)
        .attr('class', 'testArc')
        .each(function (d: any) {
          var centerPoint = dArc.centroid(d);
          console.log('center ', centerPoint);
        });

    }
    draw();
  };
}
