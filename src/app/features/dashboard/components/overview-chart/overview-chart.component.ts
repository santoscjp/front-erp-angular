import { Component } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import type { ChartOptions } from '@core/interfaces/ui/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { overViewChartData } from '@core/helpers/global/second-dashboard.constants'
import type { OverViewChartType } from '@core/helpers/global/second-dashboard.constants'

@Component({
  selector: 'overview-chart',
  standalone: true,
  imports: [NgbDropdownModule, NgApexchartsModule],
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
})
export class OverviewChartComponent {
  overViewData = overViewChartData

  trackByTitle(_index: number, item: OverViewChartType): string {
    return item.title
  }

  mainChartOpts: Partial<ChartOptions> = {
    series: [
      {
        name: 'Income',
        type: 'bar',
        data: [
          120, 150, 90, 180, 130, 160, 100, 140, 170, 110, 150, 130,
        ],
      },
      {
        name: 'Expense',
        type: 'line',
        data: [80, 100, 70, 120, 90, 110, 80, 95, 115, 85, 105, 90],
      },
    ],
    chart: {
      height: 280,
      type: 'line',
      toolbar: {
        show: false,
      },
      fontFamily: 'inherit',
    },
    stroke: {
      width: [0, 2.5],
      curve: 'smooth',
      dashArray: [0, 5],
    },
    fill: {
      opacity: [1, 1],
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val: number) => '$ ' + (val / 1000).toFixed(0) + ' K',
        offsetX: -10,
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
      axisBorder: { show: false },
    },
    grid: {
      show: true,
      borderColor: '#f3f4f6',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 3,
      },
    },
    colors: ['#e8b4e0', '#1e3a5f'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: (y: number) => (typeof y !== 'undefined' ? '$ ' + y.toLocaleString() : ''),
        },
        {
          formatter: (y: number) => (typeof y !== 'undefined' ? '$ ' + y.toLocaleString() : ''),
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
  }

  miniBarChartOpts: Partial<ChartOptions> = {
    series: [{ name: 'Value', data: [30, 45, 35, 50, 40, 55, 45] }],
    chart: {
      type: 'bar',
      height: 40,
      width: 80,
      sparkline: { enabled: true },
    },
    plotOptions: {
      bar: { columnWidth: '60%', borderRadius: 2 },
    },
    colors: ['#e8b4e0'],
    tooltip: { enabled: false },
  }
}
