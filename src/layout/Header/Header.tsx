import React, {useMemo, useState} from "react"
import {Col, Dropdown, Row, Breadcrumb, Space} from "antd"
import type {MenuProps} from 'antd'
import {createStyles} from "antd-style"
import {TransitionGroup, CSSTransition} from "react-transition-group"
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd"
import {Icon} from "@/components"
import {useControlTab} from "@/hooks"
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
    const {openTab, closeTab, swapTab, fixedTab} = useControlTab()
    const {styles, theme} = useStyles()
    const {tabs, nowTab} = useTabBarStore()
    const {changeSubMenuCollapse, subMenuCollapse, menuType} = useMenuStore()
    const {breadcrumbList} = useBreadcrumbStore()
    const [nowOpenTab, setNowOpenTab] = useState({tabId: "", isFixed: false})
    const [isOpenTab, setIsOpenTab] = useState(false)
    const nowOpenTabIndex = useMemo(() => {
        let _nowOpenTabIndex = -1
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === nowOpenTab.tabId) {
                _nowOpenTabIndex = index
            }
        })
        return _nowOpenTabIndex
    }, [nowOpenTab, tabs])

    const tabItems = useMemo<MenuProps['items']>(() => {
        let nowOpenTabIndex = -1
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === nowOpenTab.tabId) {
                nowOpenTabIndex = index
            }
        })
        let leftCount: number = 0
        let rightCount: number = 0
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].tabId !== nowOpenTab.tabId && !tabs[i].isFixed) {
                if (i < nowOpenTabIndex) {
                    leftCount += 1
                } else if (i > nowOpenTabIndex) {
                    rightCount += 1
                }
            }
        }
        console.log(leftCount,rightCount)
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
                    fixedTab(nowOpenTab.tabId)
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
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId)
                }
            },
            {
                label: '关闭其他标签页',
                key: '5',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Other"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "other")
                }
            },
            {
                label: '关闭左侧标签页',
                key: '6',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandLeft"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "left")
                },
                disabled: !Boolean(leftCount)
            },
            {
                label: '关闭右侧标签页',
                key: '7',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandRight"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "right")
                },
                disabled: !Boolean(rightCount)
            }
        ]
    }, [nowTab, nowOpenTab, isOpenTab])

    return <div className={styles.header}>
        <div className={styles.headerTabs}>
            <DragDropContext onDragEnd={(result: any) => {
                if (!result.destination) return // 判断是否有结束参数
                console.log("初始索引", result.source.index)
                console.log("结束索引", result.destination.index)
                swapTab(result.source.index, result.destination.index)
            }}>
                <Droppable droppableId='droppable' direction={"horizontal"}>
                    {(droppableProvided: any) => <div className={styles.headerTabsContent}
                                                      ref={droppableProvided.innerRef}>
                        {tabs.map((tabItem: any, index: number) => {
                            return <Draggable key={tabItem.tabId} draggableId={tabItem.tabId} index={index}>
                                {(provided: any, snapshot: any) => <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                    }}
                                >
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
                                                openTab(tabItem.menuData)
                                            }}
                                            className={nowTab.tabId === tabItem.tabId ? styles.nowTabItem : styles.headerTabItem}
                                            key={tabItem.tabId}>
                                            <div className={"flex-sb"} style={{width: "100%", height: "100%"}}>
                                                <div className={"flex-start"}>
                                                    {tabItem.icon ?
                                                        <Icon size={16} style={{marginRight: theme.marginXS}}
                                                              name={tabItem.icon}></Icon> : null}
                                                    <div className={styles.tabTitle}>
                                                        {tabItem.title}
                                                    </div>
                                                </div>
                                                <div className={styles.tabClose}>
                                                    {tabItem.isFixed ? <Icon size={10} onClick={(e: Event) => {
                                                        fixedTab(tabItem.tabId)
                                                        preventDefaultEvents(e)
                                                    }} name={"Pin"}></Icon> : <Icon size={10} onClick={(e: Event) => {
                                                        closeTab(tabItem.tabId)
                                                        preventDefaultEvents(e)
                                                    }} name={"Close"}></Icon>}
                                                </div>
                                            </div>
                                        </div>
                                    </Dropdown>
                                </div>}
                            </Draggable>
                        })}
                    </div>
                        //</TransitionGroup>
                    }
                </Droppable>
            </DragDropContext>
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
                                    menuItem?.children?.length ? null : openTab(menuItem)
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