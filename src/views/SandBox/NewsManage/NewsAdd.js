import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { PageHeader, Steps, Form, Input, Button, Select, message, notification } from 'antd';
import style from './News.module.css';
import NewsEditor from '../../../components/NewsManage/NewsEditor';

const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState("");
    const NewsForm = useRef(null)
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])
    const User = JSON.parse(localStorage.getItem('token'))
    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 16 },
    };
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空！");
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            openNotification(auditState)
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        })
    }
    const openNotification = auditState => {
        notification.info({
            message: '通知',
            description:
                `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
            placement: 'bottomRight',
        });
    };
    return (
        <div>
            <PageHeader className="site-page-header" title="撰写新闻" />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            <div style={{ margin: "50px 0" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form ref={NewsForm} {...layout} name="control-hooks">
                        <Form.Item name="title" label="新闻标题" rules={[{ required: true, message: '新闻标题不能为空！' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true, message: '新闻分类不能为空！' }]}>
                            <Select placeholder="请选择新闻分类" allowClear>
                                {
                                    categoryList.map(item => <Option key={item.id} value={item.id}>{item.title}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} />
                </div>
            </div>
            <div>
                {
                    current === 2 &&
                    <div>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </div>

                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }

            </div>
        </div>
    )
}
