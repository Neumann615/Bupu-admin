import {create} from 'zustand'
import defaultSetting from "@/defaultSetting";

export const useHomePageStore = create((set) => (defaultSetting.homePage))