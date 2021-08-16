import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import axios from 'axios'
import './index.css'
import { connect } from 'react-redux'

const { Sider } = Layout;
const { SubMenu } = Menu
function SideMenu(props) {
    const { isCollApsed, history: { push }, location: { pathname } } = props
    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data)
        })

    }, [])
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key} onClick={() => {
                push(item.key)
            }}>{item.title}</Menu.Item>
        })
    }

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const checkPagePermission = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }
    const selectKeys = [pathname]
    const openKeys = ['/' + pathname.split('/')[1]]
    return (
        <Sider trigger={null} collapsible collapsed={isCollApsed}>
            <div style={{ display: 'flex', height: "100%", flexDirection: "column" }}>
                <div className="logo">新闻管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu >
                </div>
            </div>
        </Sider >
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SideMenu))