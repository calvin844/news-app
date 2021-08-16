import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/PublishManage/NewsPublish'
import usePublish from '../../../components/PublishManage/usePublish'

export default function Published() {
    const { dataSource, handleDelete } = usePublish(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) =><Button onClick={() => handleDelete(id)} danger>删除</Button>} />
        </div>
    )
}
