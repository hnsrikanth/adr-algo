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
        link: '/pages/dashboard',
    },
    {
        id: 3,
        label: 'MENUITEMS.PAGES.TEXT',
        isTitle: true
    },
    {
        id: 4,
        label: 'MENUITEMS.SETTINGS.LIST.SETTING',
        icon: 'las la-cog',
        link: '/pages/settings',
    },
    {
        id: 5,
        label: 'MENUITEMS.ADMINKITE.LIST.KITE',
        icon: 'las la-cog',
        link: '/pages/admin-kite',
    },
    {
        id: 6,
        // label: 'MENUITEMS.USERSTRATEGY.LIST.STRATEGY',
        // icon: 'las la-building',
        // link: '/pages/user-strategy',
    }
]
