import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBreadcrumbStore: any = create(
    persist((set: any) => ({
        ...defaultSetting.breadcrumb,
        breadcrumbList: [],
        setBreadcrumbList: (v: any) => set(() => ({ breadcrumbList: v })),
    }), {
        name: defaultSetting.app.storagePrefix + "breadcrumb",
        storage: createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)
    })
)