import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"
import { persist, createJSONStorage } from 'zustand/middleware'
export const useMenuStore: any = create(
    persist((set: any) => (
        {
            ...defaultSetting.menu,
            menuCurrentKeys: [],
            menuData: [],
            mainNavData: [],
            mainNavCurrentKeys: [],
            changeSubMenuCollapse: () => set((state: any) => ({ subMenuCollapse: !state.subMenuCollapse })),
            setMenuCurrentKeys: (keyPath: string[]) => set((state: any) => ({ menuCurrentKeys: keyPath })),
            setMainNavCurrentKeys: (keyPath: string[]) => set((state: any) => ({ mainNavCurrentKeys: keyPath }))
        }
    ), {
        name: defaultSetting.app.storagePrefix + "menu",
        storage: createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)
    })
)