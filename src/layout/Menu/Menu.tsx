import {Menu as AntdMenu} from "antd"
import React, {useMemo, useState} from 'react'
import {createStyles} from "antd-style"
import {Icon} from "@/components"
import {useAppStore, useMenuStore} from "@/store"
import {Resizable} from "re-resizable"
import {useControlTab} from "@/hooks"

//@ts-ignore
const useStyles = createStyles(({token, css}) => ({
    asideMenu: css`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background-color: ${token.colorBgContainer};
      transition: width .3s;
    `,
    asideMenuHeader: css`
      display: flex;
      align-items: center;
      boxSizing: border-box;
      padding: 0px 12px;
      height: 54px;
    `,
    asideMenuLogo: {
        width: "38px",
        height: "38px",
        display: "block",
        border: "none",
    },
    asideMenuTitle: {
        textAlign: "center",
        letterSpacing: "2px",
        fontWeight: "550",
        fontSize: token.fontSizeHeading4,
        color: token.colorTextBase,
        flex: 1
    },
    asideMenuContent: {
        flex: 1,
        height: "1px",
        width: "100%",
        overflow: 'auto'
    },
    test: css`
      transition: width .2s;
      //width:300px!important;
    `,
    test1: css`
      width: 64px !important;
    `,
    test2: css`
      width: auto;
    `
}))

export function Menu() {
    let {styles, theme} = useStyles()
    let [openKeys, setOpenKeys] = useState([]);
    let {
        menuData,
        subMenuCollapse,
        mainNavData,
        menuType,
        menuCurrentKeys,
        subMenuUniqueOpened
    } = useMenuStore()
    let {name, logo} = useAppStore()
    let {openTab} = useControlTab()
    let rootSubmenuKeys = useMemo(() => {
        return menuData.filter((item: any) => {
            return item.children?.length
        }).map((item1) => item1.key)
    }, [menuData])

    function generatorMenuData(v: any) {
        for (let i = 0; i < v.length; i++) {
            v[i].icon = v[i].icon ? <Icon size={18} name={v[i].icon}></Icon> : null
            if (v[i].children?.length) {
                generatorMenuData(v[i].children)
            }
        }
    }

    let renderMenuData = useMemo(() => {
        let a = JSON.parse(JSON.stringify(menuType === "simple" ? mainNavData : menuData))
        generatorMenuData(a)
        return a
    }, [menuData, mainNavData, menuType])

    function onOpenChange(keys): MenuProps['onOpenChange'] {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(subMenuUniqueOpened ? (latestOpenKey ? [latestOpenKey] : []) : keys)
        }
    }

    return <div className={styles.asideMenu} style={{width: subMenuCollapse ? 64 : 230}}>
        {!subMenuCollapse ? <div className={styles.asideMenuHeader}>
                {menuType === "single" ? <img className={styles.asideMenuLogo} src={logo}/> : null}
                <div className={styles.asideMenuTitle + " text-ellipsis"}>{name}</div>
            </div>
            : null}
        <div className={styles.asideMenuContent}>
            <AntdMenu
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                onClick={openTab}
                defaultSelectedKeys={menuCurrentKeys}
                selectedKeys={menuCurrentKeys}
                inlineCollapsed={subMenuCollapse}
                mode="inline"
                items={renderMenuData}
            />
        </div>
    </div>

    // <Resizable
    //     enable={subMenuCollapse ? false : {
    //         top: false,
    //         right: true,
    //         bottom: false,
    //         left: false,
    //         topRight: false,
    //         bottomRight: false,
    //         bottomLeft: false,
    //         topLeft: false
    //     }}
    //     defaultSize={{
    //         width: subMenuCollapse ? 64 : 220,
    //         height: "100%"
    //     }}
    //     style={{
    //         backgroundColor: theme.colorBgContainer,
    //     }}
    //     className={styles.test}
    //     minWidth={subMenuCollapse ? 64 : 220}
    //     maxWidth={subMenuCollapse ? 64 : 260}
    // >
    //     <div className={styles.asideMenu} style={{width: subMenuCollapse ? 64 : "100%"}}>
    //         {!subMenuCollapse ? <p className={styles.asideMenuTitle + " text-ellipsis"}>{name}</p> : null}
    //         <div className={styles.asideMenuContent}>
    //             <AntdMenu
    //                 openKeys={openKeys}
    //                 onOpenChange={onOpenChange}
    //                 onClick={openTab}
    //                 defaultSelectedKeys={menuCurrentKeys}
    //                 selectedKeys={menuCurrentKeys}
    //                 inlineCollapsed={subMenuCollapse}
    //                 mode="inline"
    //                 items={renderMenuData}
    //             />
    //         </div>
    //     </div>
    // </Resizable>
}