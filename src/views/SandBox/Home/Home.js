import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import * as Echarts from 'echarts'
import _ from 'lodash'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;
export default function Home() {
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    const [viewList, setViewList] = useState([])
    const [allList, setAllList] = useState([])
    const [starList, setStarList] = useState([])
    const [visible, setVisible] = useState(false)
    const [pieChart, setPieChart] = useState(null)
    const barRef = useRef(null)
    const pieRef = useRef(null)
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            // console.log(res.data)
            setViewList(res.data)
        })
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            // console.log(res.data)
            setStarList(res.data)
        })
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setAllList(res.data)
            let barData = _.groupBy(res.data, item => item.category.title)
            renderBarView(barData)
        })
        return () => {
            window.onresize = null
        }
    }, [])
    const renderPieView = (pieData) => {
        var currentList = allList.filter(item => item.author === username)
        var grounpObj = _.groupBy(currentList, item => item.category.title);
        var list = []
        for (var i in grounpObj) {
            list.push({
                name: i,
                value: grounpObj[i].length
            })
        }
        var myChart
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }
        var option = {
            title: {
                text: '??????????????????????????????',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '????????????',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }
    const renderBarView = (barData) => {
        // ??????????????????dom????????????echarts??????
        var myChart = Echarts.init(barRef.current);
        // ?????????????????????????????????
        var option = {

            title: {
                text: '??????????????????'
            },
            tooltip: {},
            legend: {
                data: ['??????']
            },
            xAxis: {
                data: Object.keys(barData),
                axisLabel: {
                    interval: 0,
                    rotate: "45"
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '??????',
                type: 'bar',
                data: Object.values(barData).map(item => item.length)
            }]
        };
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize()
        }
    }
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="??????????????????" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={item => (
                                <List.Item>
                                    <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="??????????????????" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={item => (
                                <List.Item>
                                    <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setVisible(true);
                                    renderPieView()
                                }, 0);
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]} >
                        <Meta avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region || "??????"}</b>
                                    &nbsp;
                                    &nbsp;
                                    <span>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width="500px"
                title="??????????????????"
                placement="right"
                closable={true}
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}>123</div>
            </Drawer>
            <div ref={barRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}>123</div>
        </div>
    )
}
