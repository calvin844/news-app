import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd';


export default function AuditList(props) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username])
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                let colorList = ['', 'orange', 'green', 'red']
                let auditList = ['', '审核中', '已通过', '未通过']
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 &&
                        <Button onClick={() => handleRervert(item.id)} >撤销</Button>
                    }
                    {
                        item.auditState === 2 &&
                        <Button danger onClick={() => handlePublish(item.id)}>发布</Button>
                    }
                    {
                        item.auditState === 3 &&
                        <Button type="primary" onClick={() => handleUpdate(item.id)} >修改</Button>
                    }
                </div>
            }
        }
    ];
    const handleRervert = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            "auditState": 0
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到草稿箱中查看您的新闻',
                placement: 'bottomRight',
            });
        })
    }
    const handleUpdate = (id) => {
        props.history.push(`/news-manage/update/${id}`)
    }
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            props.history.push(`/publish-manage/published`)
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已发布】中查看您的新闻',
                placement: 'bottomRight',
            });
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
