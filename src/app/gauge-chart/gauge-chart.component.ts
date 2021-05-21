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
    this.Gauge(850);

  }


  //@function config
  Gauge = function (value) {
    const { PI, round } = Math;
    let margin = { top: 10, bottom: 10, left: 10, right: 10 };
    let width = 500 + margin.left + margin.right;
    let height = 500 + margin.top + margin.bottom;
    const size = width - 32;
    const strokeWidth = 7;

    function deg2rad(value) {
      return value * PI / 180;
    }


    const iR = 100;
    const oR = 100;

    const d1Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90)).endAngle(deg2rad(-46));
    const d2Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-45)).endAngle(deg2rad(-1));
    const d3Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(0)).endAngle(deg2rad(44));
    const d4Arc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(45)).endAngle(deg2rad(89));

    let newProgressAngle, progressArc;
    let ratio, color;
    const part1Ratio = 41 / 180;
    const part2Ratio = 89 / 180;
    const part3Ratio = 135 / 180;

    function SemiCircularProgress(
      progressValue,
      startValue,
      endValue
    ) {
      ratio = (progressValue - startValue) / (endValue - startValue);
      console.log('Ratio: ', ratio);
      console.log('Ratio 2: ', round(ratio * 180));
      console.log('Part3: ', part3Ratio);

      newProgressAngle = deg2rad(-90 + round(ratio * 180));


      if (ratio > part3Ratio) {
        progressArc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(45)).endAngle(newProgressAngle);
        color = 'url(#linearGradient-4)';
      } else if (ratio > part2Ratio) {
        progressArc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(0)).endAngle(newProgressAngle);
        color = 'url(#linearGradient-3)';
      } else if (ratio > part1Ratio) {
        progressArc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-44.8)).endAngle(newProgressAngle);
        color = 'url(#linearGradient-2)';
      } else {
        progressArc = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(deg2rad(-90)).endAngle(newProgressAngle);
        color = 'url(#linearGradient-1)';
      }
    }
    //@execute function for coordinate of processPath
    SemiCircularProgress(value, 300, 850);

    function draw() {

      const svg = d3.select('#gauge-chart').append('svg');
      svg.attr('height', height)
        .attr('width', width);
      //@Gradient Linear.
      //@Gradient 1
      let defs = svg.append('defs');
      //@Color offset
      const RED = '#e01f21',
        YELLOW = '#f8b600',
        LIGHT_GREEN = '#a9ee89',
        GREEN = '#6cbe45';

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
        .attr('stop-color', YELLOW);
      linearG_1.append('stop')
        .attr('offset', 0.727)
        .attr('stop-color', YELLOW);
      linearG_1.append('stop')
        .attr('offset', 1)
        .attr('stop-color', RED);

      //@Gradient 2
      let linearG_2 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-2')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -2.0)
        .attr('y2', 3.075);
      linearG_2.append('stop')
        .attr('offset', 0.2)
        .attr('stop-color', 'rgba(248, 182, 0, 0.4)');
      linearG_2.append('stop')
        .attr('offset', 0.828)
        .attr('stop-color', YELLOW);
      linearG_2.append('stop')
        .attr('offset', 1)
        .attr('stop-color', RED);

      //@Gradient 3
      let linearG_3 = defs
        .append('linearGradient')
        .attr('id', 'linearGradient-3')
        .attr('x1', 7.95)
        .attr('y1', 0.264)
        .attr('x2', -0.15)
        .attr('y2', 1.8);
      linearG_3.append('stop')
        .attr('offset', 0)
        .attr('stop-color', LIGHT_GREEN);
      linearG_3.append('stop')
        .attr('offset', 0.83)
        .attr('stop-color', LIGHT_GREEN);
      linearG_3.append('stop')
        .attr('offset', 0.85)
        .attr('stop-color', GREEN);
      linearG_3.append('stop')
        .attr('offset', 1)
        .attr('stop-color', YELLOW);

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
        .attr('stop-color', GREEN);
      linearG_4.append('stop')
        .attr('offset', 0.8)
        .attr('stop-color', GREEN);
      linearG_4.append('stop')
        .attr('offset', 1)
        .attr('stop-color', LIGHT_GREEN);



      //@Gauge-chart
      const g = svg.append('g')
        .attr('transform', `translate(200, 200)`);

      g
        .attr('id', 'color-chart')
        .attr('rotation', 90)
        .attr('originX', width / 2)
        .attr('originY', width / 2);

      //@Background for each path;
      g.append('path')
        .attr('d', d1Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d1')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part1Ratio ? 'url(#linearGradient-1)' : '#d8d8d8'}`);
      g.append('path')
        .attr('d', d2Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d2')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part2Ratio ? 'url(#linearGradient-2)' : '#d8d8d8'}`);
      g.append('path')
        .attr('d', d3Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d3')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio > part3Ratio ? 'url(#linearGradient-3)' : '#d8d8d8'}`);
      g.append('path')
        .attr('d', d4Arc)
        .attr('fill', 'none')
        .attr('class', 'path-d4')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', `${ratio === 1 ? 'url(#linearGradient-4)' : '#d8d8d8'}`);

      //@Progress Gauge 
      const path = g;
      const progressGauge = path
        .append('path')
        .attr('d', progressArc)
        .attr('class', 'progress-path')
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', color);

      const point = progressGauge.node().getPointAtLength(progressGauge.node().getTotalLength() / 2);

      path.append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 8)
        .attr('id', 'mini-circle')
        .attr('stroke-width', 2)
        .attr('stroke', '#8bd768')
        .attr('fill', '#fff')
        .style('display', `${value > 300 ? '' : 'none'}`)


      //@GAUGE CHART TEXT 
      const scale = {
        min: { right: -7, top: 7, subTop: 10 },
        max: { right: -7, top: 7, subTop: 10 },
        content: { right: -35, bottom: -25, text: 'Check back on' },
        date: { right: -55, bottom: 17, text: 'JAN, 20' }
      }

      const gaugeVal = { min: 300, max: 850 }
      path.append('text')
        .attr('x', -iR + scale.min.right)
        .attr('y', scale.min.top)
        .attr('dy', scale.min.subTop)
        .attr('font-size', 10)
        .attr('fill', '#95989A')
        .attr('letter-spacing', 0.2)
        .text(function () { return gaugeVal.min; });
      path.append('text')
        .attr('x', iR + scale.max.right)
        .attr('y', scale.max.top)
        .attr('dy', scale.max.subTop)
        .attr('font-size', 10)
        .attr('fill', '#95989A')
        .attr('letter-spacing', 0.2)
        .text(function () { return gaugeVal.max; });
      path.append('text')
        .attr('x', scale.content.right)
        .attr('y', 0)
        .attr('dy', scale.content.bottom)
        .style('font-size', 12)
        .style('fill', '#95989A')
        .style('letter-spacing', 0.24)
        .text(function () { return scale.content.text; });
      path.append('text')
        .attr('x', scale.date.right)
        .attr('y', 0)
        .attr('dy', scale.date.bottom)
        .style('font-size', 32)
        .style('fill', '#3084C6')
        .style('letter-spacing', 0.64)
        .style('font-weight', 'bold')
        .text(function () { return scale.date.text; });


    }
    draw();
    // update();

  };
}
