import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Spin } from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import Home from '../../views/SandBox/Home/Home'
import UserList from '../../views/SandBox/UserManage/UserList'
import RoleList from '../../views/SandBox/RightManage/RoleList'
import RightList from '../../views/SandBox/RightManage/RightList'
import NewsAdd from '../../views/SandBox/NewsManage/NewsAdd'
import NewsUpdate from '../../views/SandBox/NewsManage/NewsUpdate'
import NewsDraft from '../../views/SandBox/NewsManage/NewsDraft'
import NewsCategory from '../../views/SandBox/NewsManage/NewsCategory'
import NewsPreview from '../../views/SandBox/NewsManage/NewsPreview'
import Audit from '../../views/SandBox/AuditManage/Audit'
import AuditList from '../../views/SandBox/AuditManage/AuditList'
import Unpublished from '../../views/SandBox/PublishManage/Unpublished'
import Published from '../../views/SandBox/PublishManage/Published'
import Sunset from '../../views/SandBox/PublishManage/Sunset'
import NoPermission from '../../views/SandBox/NoPermission/NoPermission'

const localRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/update/:id": NewsUpdate,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const [BackRouterList, setBackRouterList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res => {
            setBackRouterList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRout = (item) => {
        return localRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            <Switch>
                {
                    BackRouterList.map(item => {
                        if (checkRout(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={localRouterMap[item.key]} exact />
                        }
                        return null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    BackRouterList.length > 0 && <Route path="*" component={NoPermission} />
                }

            </Switch>
        </Spin>
    )
}


const mapStateToProps = (state) => {
    const { LoadingReducer: { isLoading } } = state
    return {
        isLoading
    }
}
const mapDispatchToProps = {
    changeLoading() {
        return {
            type: "change_loading"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsRouter)