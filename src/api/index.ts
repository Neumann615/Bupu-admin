import { post } from "./axios"

export function login(v): any {
    return post("/api/platform/api/sys/login", v)
}

export function getMenuInfo(v) {
    return post("/api/platform/api/sys/getMenuInfo", v)
}