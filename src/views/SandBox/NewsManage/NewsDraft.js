import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';


const { confirm } = Modal
export default function NewsDraft(props) {
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
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
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    &nbsp;&nbsp;
                    <Button shape="circle" icon={<EditOutlined />} onClick={() => { props.history.push(`/news-manage/update/${item.id}`) }} />
                    &nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => { handleCheck(item.id) }} />
                </div>
            }
        }
    ];
    const handleCheck = (id) => {
        // setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            openNotification()
            props.history.push('/audit-manage/list')
        })
    }

    const openNotification = () => {
        notification.info({
            message: '通知',
            description: '您可以到审核列表中查看您的新闻',
            placement: 'bottomRight',
        });
    };
    const confirmMethod = (item) => {
        confirm({
            title: '确定删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                console.log(item)
            }
        });
    }
    const deleteMethod = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
