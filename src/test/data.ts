let menuData = [
    {
        id: "2",
        label: "演示",
        isRoot: true,
        icon: "Application",
        key: "wxx",
        children: [
            {
                label: "单位信息1",
                icon: "Shield",
                key: "/one",
                children: [
                    {
                        label: "单位信息默认页面",
                        icon: "Home",
                        key: "/",
                    },
                    {
                        label: "功能模块1",
                        icon: "Pic",
                        key: "/test1",
                    },
                    {
                        label: "功能模块2",
                        icon: "Sleep",
                        key: "/test2",
                    },
                    {
                        label: "功能模块3",
                        icon: "Like",
                        key: "/test3",
                    }
                ]
            },
            {
                label: "单位信息2",
                icon: "Shield",
                key: "/a",
                children: [
                    {
                        label: "单位信息默认页面",
                        icon: "Home",
                        key: "/a/test1",
                    },
                    {
                        label: "功能模块1",
                        icon: "Pic",
                        key: "/a/test2",
                    },
                    {
                        label: "功能模块2",
                        icon: "Sleep",
                        key: "/a/test3",
                    }
                ]
            }
        ]
    },
    {
        id: "1",
        label: "页面",
        icon: "City",
        isRoot: true,
        key: "zym",
        children: [
            {
                label: "单位信息",
                icon: "",
                key: "module",
                children: [
                    {
                        label: "单位信息默认页面",
                        icon: "",
                        key: "/module",
                    },
                    {
                        label: "功能模块1",
                        icon: "",
                        key: "/module/test1",
                    },
                    {
                        label: "功能模块2",
                        icon: "",
                        key: "/module/test2",
                    },
                    {
                        label: "功能模块3",
                        icon: "",
                        key: "/module/test3",
                    },
                    {
                        label: "子菜单",
                        icon: "",
                        key: "module-child",
                        children: [
                            {
                                label: "单位信息默认页面子",
                                icon: "",
                                key: "/module/module-child",
                            },
                            {
                                label: "功能模块1zi",
                                icon: "",
                                key: "/module/module-child/test1",
                            },
                            {
                                label: "功能模块2zi",
                                icon: "",
                                key: "/module/module-child/test2"
                            },
                            {
                                label: "功能模块3zi",
                                icon: "",
                                key: "/module/module-child/test3"
                            },
                        ]
                    }
                ]
            }
        ]
    }
]