import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    UnorderedListOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

export default function RoleList() {
    const { confirm } = Modal
    const [dataSource, setdataSource] = useState([])
    const [rightList, setrightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState(0)
    const [isModalVisible, setisModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    &nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
                        setisModalVisible(true)
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }} />
                </div>
            }
        }
    ];
    useEffect(() => {
        axios.get('/roles').then(res => {
            setdataSource(res.data)
        })
        axios.get('/rights?_embed=children').then(res => {
            setrightList(res.data)

        })
    }, [])


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
        axios.delete(`/roles/${item.id}`)
    }
    const handleOk = () => {
        setisModalVisible(false)
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }
    const handleCancel = () => {
        setisModalVisible(false)
    }
    const onCheck = (checkedKeys) => {
        setcurrentRights(checkedKeys.checked)
    };
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree checkable treeData={rightList} checkedKeys={currentRights} onCheck={onCheck} checkStrictly />
            </Modal>
        </div>
    )
}
