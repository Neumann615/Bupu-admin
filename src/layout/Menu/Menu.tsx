import {Menu as AntdMenu} from "antd"
import React, {useMemo} from 'react'
import {createStyles} from "antd-style"
import {Icon} from "@/components"
import {useAppStore, useMenuStore} from "@/store"
import {Resizable} from "re-resizable"
import {useControlTab} from "@/hooks"

const useStyles = createStyles(({token}) => ({
    asideMenu: {
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
    },
    asideMenuTitle: {
        textAlign: "center",
        boxSizing: "border-box",
        margin: 0,
        letterSpacing: "2px",
        height: "54px",
        lineHeight: "54px",
        fontWeight: "550",
        fontSize: token.fontSizeHeading4,
        color: token.colorTextBase,
        width: "220px",
        padding: "0px 12px"
    },
    asideMenuContent: {
        flex: 1,
        height: "1px",
        width: "100%",
        overflow: 'auto'
    }
}))

export function Menu() {
    const {styles, theme} = useStyles()
    let {menuData, subMenuCollapse, mainNavData, menuType, menuCurrentKeys} = useMenuStore()
    let {name} = useAppStore()
    let {openTab} = useControlTab()

    let renderMenuData = useMemo(() => {
        let a = JSON.parse(JSON.stringify(menuType === "simple" ? mainNavData : menuData))
        generatorMenuData(a)
        return a
    }, [menuData, mainNavData, menuType])


    function generatorMenuData(v: any) {
        for (let i = 0; i < v.length; i++) {
            v[i].icon = v[i].icon ? <Icon size={18} name={v[i].icon}></Icon> : null
            if (v[i].children?.length) {
                generatorMenuData(v[i].children)
            }
        }
    }

    return <Resizable
        enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
        }}
        style={{
            backgroundColor: theme.colorBgContainer
        }}
        minWidth={subMenuCollapse ? 64 : 220}
        maxWidth={280}>
        <div className={styles.asideMenu}>
            {!subMenuCollapse ? <p className={styles.asideMenuTitle + " text-ellipsis"}>{name}</p> : null}
            <div className={styles.asideMenuContent}>
                <AntdMenu
                    onClick={openTab}
                    defaultSelectedKeys={menuCurrentKeys}
                    selectedKeys={menuCurrentKeys}
                    inlineCollapsed={subMenuCollapse}
                    mode="inline"
                    items={renderMenuData}
                />
            </div>
        </div>
    </Resizable>
}