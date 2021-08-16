import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from 'axios';
import { PageHeader, Descriptions, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    const [clickStar, setClickStar] = useState(0)
    const { match: { params: { id } } } = props
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${id}`, {
                view: res.view + 1
            })
        })
    }, [id])
    const handleStar = () => {
        if (clickStar === 1) {
            message.error("已经点过了！");
            return
        }
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${id}`, {
            star: newsInfo.star + 1
        }).then(res => setClickStar(1))
    }
    return (
        <div>
            {
                newsInfo &&
                <div>
                    <PageHeader onBack={() => window.history.back()} title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                &nbsp;
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={() => { handleStar() }} />
                            </div>
                        }>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div style={{ padding: '10px', margin: '0 10px' }} dangerouslySetInnerHTML={{ __html: newsInfo.content }}></div>
                </div>
            }
        </div>
    )
}
