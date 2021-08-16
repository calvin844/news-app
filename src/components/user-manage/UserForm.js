import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    const { regionList, roleList, isUpateDisable, isUpdate } = props
    useEffect(() => {
        setisDisabled(isUpateDisable)
    }, [isUpateDisable])
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item) => {
        if (isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return item.value !== region
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return item.value !== region
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if (isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return item.value !== region
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return roleObj[item.id] !== "editor"
            }
        }
    }

    return (
        <Form ref={ref} layout="vertical" >
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请填写用户名！' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请填写密码！' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="region" label="区域" rules={[{ required: !isDisabled, message: '请选择区域！' }]}>
                <Select disabled={isDisabled} >
                    {
                        regionList.map(item => <Option disabled={checkRegionDisabled(item)} value={item.value} key={item.id}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色！' }]}>
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisabled(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        roleList.map(item => <Option disabled={checkRoleDisabled(item)} value={item.id} key={item.id}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm
