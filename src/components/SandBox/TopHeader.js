import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const { Header } = Layout;
function TopHeader(props) {
    // console.log(props)
    const { isCollApsed, changeCollapsed } = props
    const handleCollapsed = () => {
        changeCollapsed()
    }

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={() => {
                localStorage.removeItem("token")
                props.history.replace("/login")
            }}>退出登陆</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: "0 16px" }}>
            {
                isCollApsed ? <MenuUnfoldOutlined onClick={handleCollapsed} /> : <MenuFoldOutlined onClick={handleCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎 <span style={{ color: "#1890ff" }}>{username}</span> 回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

const mapStateToProps = (state) => {
    const { CollApsedReducer: { isCollApsed } } = state
    return {
        isCollApsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
