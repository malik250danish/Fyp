import React, { useState } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import market from '../assets/icons/market.svg'
import shield from '../assets/icons/shield.svg'

const PartnerAnalytics = ({socket}) => {

    const [active, setActive] = useState(false)

    const handleOpen = () => {
        setActive(!active)
    }


    const monthly = {
        labels: ['1 Oct', '3 Oct', '6 Oct', '9 Oct', '12 Oct', '12 Oct', '15 Oct', '18 Oct', '21 Oct', '24 Oct', '27 Oct', '30 Oct'],
        data: [1700, 1500, 1000, 1500, 2200, 1766, 2500, 1200, 1800, 1980, 1509, 1900, 0]
    }
    
    const annual = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [1000, 1500, 2000, 1500, 1800, 1766, 2200, 1600, 2200, 1980, 2400, 1000, 0]
    }
    
    const weekly = {
        labels: ['Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day'],
        data: [1000, 1800, 2000, 1500, 1800, 1766, 1800, 1600, 2200, 1766, 1500, 1000, 0]
    }
    
    const widget = {
        labels: ['Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day', 'Day'],
        data: [1000, 1800, 2000, 1500, 1800, 1766, 1000, 1800, 2000, 0]
    }

    const [axis, setAxis] = useState(weekly)

    const [title, setTitle] = useState('This Week')

    const data = () => {
        return {
            labels: axis.labels,
            datasets: [{
              data: axis.data,
              borderColor: '#6592E9',
              borderWidth: 3,
              fill: true,
              backgroundColor: (context: ScriptableContext<"line">) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#a0b9ec");
                gradient.addColorStop(1, "#fff");
                return gradient;
              },
              tension: .5,
            }]
        }
      }
    
      const options = {
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
            x: {
               display: false,
            },
            y: {
                ticks: {
                    display: false
                }
            }
         },
      }

      const data1 = () => {
        return {
            labels: widget.labels,
            datasets: [{
              data: widget.data,
              borderColor: '#6592E9',
              borderWidth: 3,
              fill: true,
              backgroundColor: (context: ScriptableContext<"line">) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#fff");
                gradient.addColorStop(1, "#6592E9");
                return gradient;
              },
              tension: .5,
            }]
        }
      }
    
      const options1 = {
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
            x: {
               display: false,
            },
            y: {
                display: false
            }
         }
      }
      const data2 = () => {
        return {
            labels: widget.labels,
            datasets: [{
              data: widget.data,
              borderColor: '#54D2AE',
              borderWidth: 3,
              fill: true,
              backgroundColor: (context: ScriptableContext<"line">) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#fff");
                gradient.addColorStop(1, "#54D2AE");
                return gradient;
              },
              tension: .5,
            }]
        }
      }
    
      const options2 = {
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
            x: {
               display: false,
            },
            y: {
                display: false
            }
         }
      }
      const data3 = () => {
        return {
            labels: widget.labels,
            datasets: [{
              data: widget.data,
              borderColor: '#FFA556',
              borderWidth: 3,
              fill: true,
              backgroundColor: (context: ScriptableContext<"line">) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#fff");
                gradient.addColorStop(1, "#FFA556");
                return gradient;
              },
              tension: .5,
            }]
        }
      }
    
      const options3 = {
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
            x: {
               display: false,
            },
            y: {
                display: false
            }
         }
      }


  return (
    <div className='partner-route'>
        
        <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

        <div className="partner-content">

            <Notification click={handleOpen} active={active} socket={socket}  />

            <div className="p-5 partner-route-content">

                <h1 className='partner-heading mb-2'>Analytics</h1>

                <div className="chart-card bg-white mb-4 overflow-hidden">
                    <div className="d-flex justify-content-end chart-dropdown">
                        <div className="dropdown">
                            <button className="btn chart-dropdown-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {title}
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="#" onClick={() => {setAxis(weekly); setTitle('This Week')}}>This Week</Link></li>
                                <li><Link className="dropdown-item" to="#" onClick={() => {setAxis(monthly); setTitle('This Month')}}>This Month</Link></li>
                                <li><Link className="dropdown-item" to="#" onClick={() => {setAxis(annual); setTitle('This Year')}}>This Year</Link></li>
                            </ul>
                        </div>
                    </div>
                    <Line className='chart1' data={data()} options={options} />
                </div>

                <div className="row">

                    <div className="col-lg-4 mb-2">
                        <div className="chart-widget-container">
                            <h3 className='chart-widget-title widget1'>52.65$</h3>
                            <div className="chart-widget-heading">Income</div>
                            <Line className='chart-widget' data={data1()} options={options1} />
                        </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                        <div className="chart-widget-container">
                            <h3 className='chart-widget-title widget2'>24.36$</h3>
                            <div className="chart-widget-heading">Expend</div>
                            <Line className='chart-widget' data={data2()} options={options2} />
                        </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                        <div className="chart-widget-container">
                            <h3 className='chart-widget-title widget3'>84.89$</h3>
                            <div className="chart-widget-heading">Sales</div>
                            <Line className='chart-widget' data={data3()} options={options3} />
                        </div>
                    </div>

                </div>

                <h3 className='mt-5 fw-bold d-flex align-items-center justify-content-between'>
                    History
                    <Link to={'#'} className='fs-5' style={{ color: '#2E3192' }}>View all</Link>
                </h3>

                <div className="history-item">
                    <div className="history-left">
                        <div className="history-img green">
                            <img src={market} alt="" />
                        </div>
                        <h4>Supermarket</h4>
                    </div>
                    <div className="history-middle">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </div>
                    <div className="history-right">70$</div>
                </div>
                <div className="history-item">
                    <div className="history-left">
                        <div className="history-img blue">
                            <img src={shield} alt="" />
                        </div>
                        <h4>Health and beauty</h4>
                    </div>
                    <div className="history-middle">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </div>
                    <div className="history-right">112$</div>
                </div>

            </div>

        </div>

    </div>
  )
}

export default PartnerAnalytics