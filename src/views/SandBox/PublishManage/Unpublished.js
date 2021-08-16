import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/PublishManage/NewsPublish'
import usePublish from '../../../components/PublishManage/usePublish'

export default function Published() {
    const { dataSource, handlePublish } = usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handlePublish(id)} type="primary">发布</Button>} />
        </div>
    )
}
