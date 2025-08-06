import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.LIST.DASHBOARD',
        icon: 'las la-house-damage',
        link: '/pages',
    },
    {
        id: 3,
        label: 'MENUITEMS.PAGES.TEXT',
        isTitle: true
    },
    {
        id: 52,
        label: 'MENUITEMS.AUTH.TEXT',
        icon: 'las la-cog',
        subItems: [
            {
                id: 53,
                label: 'MENUITEMS.AUTH.LIST.SIGNIN',
                link: '/auth/auth-signin',
                parentId: 52
            },
            {
                id: 54,
                label: 'MENUITEMS.AUTH.LIST.SIGNUP',
                link: '/auth/auth-signup',
                parentId: 52
            },
            {
                id: 55,
                label: 'MENUITEMS.AUTH.LIST.PASSWORDRESET',
                link: '/auth/auth-pass-reset',
                parentId: 52
            },
            {
                id: 55,
                label: 'MENUITEMS.AUTH.LIST.LOCKSCREEN',
                link: '/auth/auth-lockscreen',
                parentId: 52
            }
        ]
    },
    {
        id: 83,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'las la-share-square',
        subItems: [
            {
                id: 84,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                parentId: 83
            },
            {
                id: 85,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 83,
                subItems: [
                    {
                        id: 86,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        parentId: 85
                    },
                    {
                        id: 87,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        parentId: 85,
                        subItems: [
                            {
                                id: 76,
                                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.LEVEL3.1',
                                parentId: 87
                            },
                            {
                                id: 76,
                                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.LEVEL3.2',
                                parentId: 87,

                            }
                        ]
                    }
                ]
            }
        ]
    },
]
