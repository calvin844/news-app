import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import SideMenu from '../../components/SandBox/SideMenu'
import TopHeader from '../../components/SandBox/TopHeader'
import NewsRouter from '../../components/SandBox/NewsRouter'
//css
import './NewsSandBox.css'
import 'nprogress/nprogress.css'

//antd
import { Layout } from 'antd';
const { Content } = Layout

export default function NewsSandBox() {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    })
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}>
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
