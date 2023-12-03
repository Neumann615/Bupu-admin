import React, {useMemo, useState} from "react"
import {Col, Dropdown, Row, Breadcrumb, Space} from "antd"
import type {MenuProps} from 'antd'
import {createStyles} from "antd-style"
import {TransitionGroup, CSSTransition} from "react-transition-group"
import {Icon} from "@/components"
import {useControlPage} from "@/hooks"
import {useMenuStore, useTabBarStore, useBreadcrumbStore} from "@/store"
import {preventDefaultEvents} from "@/utils"
import Toolbar from "../Toolbar/Toolbar"

const useStyles = createStyles(({token, css}) => ({
    header: {
        width: "100%",
        height: "auto",
        boxShadow: token.boxShadowTertiary,
        boxSizing: "border-box",
        borderBottom: "1px solid" + token.colorBorderSecondary
    },
    headerTabs: {
        boxSizing: "border-box",
        backgroundColor: token.colorBgLayout
    },
    headerTabsContent: css`
      width: 100%;
      display: flex;
      height: 48px;
      align-items: flex-end;
      overflow-x: auto;

      ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    `,

    headerTabItem: css`
      width: 144px;
      height: 40px;
      text-align: center;
      font-size: ${token.fontSizeSM}px;
      border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
      color: ${token.colorTextTertiary};
      cursor: pointer;
      transition: all .4s;
      margin-left: ${token.marginXXS}px;
      padding: 0 ${token.paddingXS}px;

      :hover {
        background-color: ${token.colorBgContainer};
        transition: all .4s;
      }
    `,
    nowTabItem: css`
      width: 144px;
      height: 40px;
      text-align: center;
      font-size: ${token.fontSizeSM}px;
      border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
      color: ${token.colorTextTertiary};
      cursor: pointer;
      transition: all .4s;
      margin-left: ${token.marginXXS}px;
      padding: 0 ${token.paddingXS}px;
      background-color: ${token.colorBgContainer};
    `,
    tabTitle: css`
      width: 84px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
    `,
    tabClose: css`
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transition: all .2s;
      display: grid;
      place-items: center;

      :hover {
        transition: all .2s;
        background-color: ${token.colorFillSecondary};
      }
    `,
    headerModule: {
        boxSizing: "border-box",
        padding: token.paddingSM,
        backgroundColor: token.colorBgContainer
    },
    contextMenuIcon: css`
      .i-icon {
        display: grid;
        place-items: center;
        width: 15px;
        height: 15px;
      }
    `
}))

export function Header() {
    const {openPage, closePage} = useControlPage()
    const {styles, theme} = useStyles()
    const {tabs, nowTab, setTabs, setFixedTab} = useTabBarStore()
    const {changeSubMenuCollapse, subMenuCollapse, menuType} = useMenuStore()
    const {breadcrumbList} = useBreadcrumbStore()
    const [nowOpenTab, setNowOpenTab] = useState("")
    const [isOpenTab, setIsOpenTab] = useState(false)

    const tabItems = useMemo<MenuProps['items']>(() => {
        return [
            {
                label: '重新加载',
                key: '1',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Refresh"}></Icon>
                </div>,
                onClick: () => {
                    console.log(12321)
                },
                disabled: nowOpenTab.tabId !== nowTab.tabId
            },
            {
                label: nowOpenTab.isFixed ? '取消固定' : "固定",
                key: '3',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={nowOpenTab.isFixed ? "Pin" : "Pushpin"}></Icon>
                </div>,
                onClick: () => {
                    setFixedTab(nowOpenTab.tabId)
                }
            },
            {
                label: '最大化',
                key: '4',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"FullScreenTwo"}></Icon>
                </div>
            },
            {
                label: '关闭标签页',
                key: '2',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Close"}></Icon>
                </div>
            },
            {
                label: '关闭其他标签页',
                key: '5',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Other"}></Icon>
                </div>
            },
            {
                label: '关闭左侧标签页',
                key: '6',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandLeft"}></Icon>
                </div>
            },
            {
                label: '关闭右侧标签页',
                key: '7',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandRight"}></Icon>
                </div>
            }
        ]
    }, [nowTab, nowOpenTab, isOpenTab])

    return <div className={styles.header}>
        <div className={styles.headerTabs}>
            <TransitionGroup className={styles.headerTabsContent}>
                {tabs.map((tabItem: any) => {
                    return <CSSTransition
                        key={tabItem.tabId}
                        timeout={300}
                        classNames={
                            {
                                appear: "animate__animated",
                                appearActive: "animate__slideInUp",
                                enter: "animate__animated",
                                enterActive: "animate__slideInUp",
                                exit: "animate__animated",
                                exitActive: "animate__slideOutDown"
                            }
                        }>
                        <Dropdown
                            key={tabItem.tabId}
                            placement={"bottomLeft"}
                            trigger={["contextMenu"]}
                            onOpenChange={(v) => {
                                setIsOpenTab(v)
                                if (v) {
                                    setNowOpenTab(tabItem)
                                }
                            }}
                            menu={{items: tabItems}}>
                            <div
                                onClick={() => {
                                    openPage(tabItem.menuData)
                                }}
                                className={nowTab.tabId === tabItem.tabId ? styles.nowTabItem : styles.headerTabItem}
                                key={tabItem.tabId}>
                                <div className={"flex-sb"} style={{width: "100%", height: "100%"}}>
                                    <div className={"flex-start"}>
                                        {tabItem.icon ? <Icon size={16} style={{marginRight: theme.marginXS}}
                                                              name={tabItem.icon}></Icon> : null}
                                        <div className={styles.tabTitle}>
                                            {tabItem.title}
                                        </div>
                                    </div>
                                    <div className={styles.tabClose}>
                                        {tabItem.isFixed ? <Icon size={10} onClick={(e: Event) => {
                                            setFixedTab(tabItem.tabId)
                                            preventDefaultEvents(e)
                                        }} name={"Pin"}></Icon> : <Icon size={10} onClick={(e: Event) => {
                                            closePage(tabItem)
                                            preventDefaultEvents(e)
                                        }} name={"Close"}></Icon>}
                                    </div>
                                </div>
                            </div>
                        </Dropdown>
                    </CSSTransition>
                })}
            </TransitionGroup>
        </div>
        <Row align={"middle"} className={styles.headerModule}>
            <Col span={12}>
                <Space>
                    {["side", "head", "simple"].includes(menuType) ? <Icon
                            onClick={changeSubMenuCollapse}
                            fill={theme.colorText}
                            size={25}
                            name={subMenuCollapse ? "MenuFoldOne" : "MenuUnfoldOne"}></Icon>
                        : null}
                    <Breadcrumb
                        items={breadcrumbList.map((menuItem: any) => {
                            return {
                                title: menuItem.label,
                                onClick: () => {
                                    menuItem?.children?.length ? null : openPage(menuItem)
                                }
                            }
                        })}></Breadcrumb>
                </Space>
            </Col>
            <Col span={12} align={"right"}>
                <Toolbar></Toolbar>
            </Col>
        </Row>
    </div>
}