import {useNavigate} from "react-router"
import {useMenuStore, useTabBarStore, useBreadcrumbStore, useAppStore} from "@/store"

export function useControlPage() {
    let {mainNavData, setMenuCurrentKeys, setMainNavCurrentKeys, menuType, mainNavCurrentKeys} = useMenuStore()
    let {tabs, setTabs, setNowTab, nowTab} = useTabBarStore()
    let {setBreadcrumbList} = useBreadcrumbStore()
    const navigate = useNavigate()

    function getPathByKey(curKey: string, data: any) {
        let result: any = [] // 记录路径结果
        let traverse = (curKey: string, path: any, data: any) => {
            if (data.length === 0) {
                return
            }
            for (let item of data) {
                path.push(item)
                if (item.key === curKey) {
                    result = JSON.parse(JSON.stringify(path))
                    return
                }
                const children = Array.isArray(item.children) ? item.children : []
                traverse(curKey, path, children) // 遍历
                path.pop() // 回溯
            }
        }
        traverse(curKey, [], data)
        return result
    }

    //打开页面
    function openPage(v: any) {
        let pathList = getPathByKey(v.key, mainNavData)
        if (pathList?.length) {
            //设置面包屑导航
            setBreadcrumbList(pathList)
            let _pathList = pathList.map((item: any) => item.key)
            setMainNavCurrentKeys(_pathList)
            setMenuCurrentKeys(_pathList)
            if (["side", "head"].includes(menuType)) {
                for (let i = 0; i < mainNavData.length; i++) {
                    if (mainNavData[i].key === _pathList[0]) {
                        useMenuStore.setState((store: any) => ({
                            menuData: mainNavData[i].children,
                        }))
                    }
                }
            }
            let targetRoute = pathList[pathList.length - 1]
            let tabData = {
                tabId: targetRoute.key,
                title: targetRoute.label,
                icon: targetRoute.icon,
                menuData: targetRoute
            }
            if (tabs.findIndex((tab: any) => tab.tabId === targetRoute.key) === -1) {
                tabs.push(tabData)
                setTabs(tabs)
            }
            console.log(tabData)
            if (tabData.tabId === nowTab.tabId) return
            setNowTab(tabData)
            navigate(v.key)
        }
    }

    //关闭页面
    function closePage(v: any) {
        let delIndex: number = -1
        let openIndex: number = 0
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === v.tabId) {
                delIndex = index
            }
        })
        if (delIndex !== -1) {
            //打开新页面,移动tab1
            if (nowTab.tabId === v.tabId) {
                //最左边
                if (delIndex === 0) {
                    openIndex = 1
                }
                //最右边
                else if (delIndex === tabs.length - 1) {
                    openIndex = delIndex - 1
                }
                //中间
                else if (delIndex > 0 && delIndex < tabs.length - 1) {
                    openIndex = delIndex + 1
                }
                openPage(tabs[openIndex].menuData)
            }
            //删除tab
            setTabs(tabs.filter((item: any) => item.tabId !== v.tabId))
        }
    }

    return {
        openPage,
        closePage
    }
}

