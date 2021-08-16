import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd'

export default function News() {
    const [newsList, setNewsList] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            var dataArr = Object.entries(_.groupBy(res.data, item => item.category.title))
            setNewsList(dataArr)
        })
    }, [])
    return (
        <div style={{ width: "95%", margin: "0 auto" }}>
            <PageHeader
                className="site-page-header"
                title="全球新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        newsList.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 2
                                        }}
                                        renderItem={data => (
                                            <List.Item>
                                                <a href={`/detail/${data.id}`}>{data.title}</a>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        )
                    }

                </Row>
            </div>
        </div>
    )
}
