import {Layout} from "@/layout/Layout"
import {useMount} from "ahooks"
import {getMenuInfo} from "@/api"
import {useMenuStore} from "@/store";
import {menuData} from "@/utils";

console.log("初始化菜单数据",menuData)
export default function Home() {
    useMount(() => {
        // getMenuInfo({
        //     msgId: "20231006161000",
        //     appId: "1123456",
        //     token: "43tetewtfzfaffd"
        // }).then((res: any) => {
        //     if (res && res.resultCode == 1) {
        //         let menuData = res.data
        //         console.log("后台数据获取", menuData)
                useMenuStore.setState({
                    mainNavData: menuData,
                    asideBarSelection: menuData[0].id,
                    menuData: menuData[0].children,
                    menuDataSelection: "/"
                })
        //     }
        // })
    })
    return <Layout></Layout>
}