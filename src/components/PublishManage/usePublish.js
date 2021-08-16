import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification, Modal } from 'antd'
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal
function usePublish(type) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username, type])
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已发布】中查看您的新闻',
                placement: 'bottomRight',
            });
        })
    }
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已下线】中查看您的新闻',
                placement: 'bottomRight',
            });
        })
    }
    const handleDelete = (id) => {
        confirm({
            title: '确定删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(id)
            },
            onCancel() {
                // console.log(item)
            }
        });
    }
    const deleteMethod = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: '通知',
                description: '您已经删除了您的新闻',
                placement: 'bottomRight',
            });
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}
export default usePublish