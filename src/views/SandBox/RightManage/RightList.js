import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';


export default function RightList() {
    const { confirm } = Modal
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            const list = res.data
            list.forEach(item => {
                if (item.children.length === 0) item.children = ""
            })
            setdataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    &nbsp;&nbsp;
                    <Popover content={<div style={{ textAlign: 'center' }}>
                        <Switch checked={item.pagepermisson} onClick={() => switchMethod(item)}></Switch>
                    </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : "click"}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>
                </div>
            }
        }
    ];
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setdataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
        } else {
            axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
        }
    }
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
        if (item.grade === 1) {
            setdataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setdataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 3 }} />
        </div>
    )
}
