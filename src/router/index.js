import { createRouter, createWebHistory} from 'vue-router'
import { RouterName } from '@/commons/contants/router-name'
import { Path } from '@/commons/contants/path'

function lazyLoadView(view,path) {
    if(path && path != ''){
        return () => import(`@/views/${path}/${view}.vue`)
    }
    return () => import(`@/views/${view}.vue`)
}

function lazyLoadLayout(layout) {
    return () => import(`@/layouts/${layout}.vue`)
}

// function lazyLoadPage(page) {
//     return () => import(`@/pages/${page}.vue`)
// }

const routers = [
    {
        path: Path.Root,
        name: RouterName.Root,
        component: lazyLoadLayout(RouterName.Root),
        redirect: Path.Login,
        children: [
            {
                path: Path.Management,
                name: RouterName.Management,
                component: lazyLoadLayout(RouterName.Management),
                redirect: Path.DashBoard,
                children: [
                    {
                        path : Path.DashBoard,
                        name : RouterName.DashBoard,
                        component : lazyLoadView(RouterName.DashBoard,'dash-board')
                    },
                    {
                        path : Path.Report,
                        name : RouterName.Report,
                        component : lazyLoadView(RouterName.Report,'report')
                    },
                    {
                        path : Path.TheProject,
                        name : RouterName.TheProject,
                        component : lazyLoadView(RouterName.TheProject,'the-project'),
                    }
                ]
            },
            {
                path: Path.Login,
                name: RouterName.Login,
                component: lazyLoadLayout(RouterName.Login)
            },
            {
                path: Path.Register,
                name: RouterName.Register,
                component: lazyLoadLayout(RouterName.Register)
            }
        ]
    },
    // {
    //     path: Path.Maintain,
    //     name: RouterName.Maintain,
    //     component: lazyLoadPage('MaintainPage')
    // },
    // {
    //     path: Path.NoPermission,
    //     name: RouterName.NoPermission,
    //     component: lazyLoadPage('403Page')
    // },
    {
        path: Path.VControl,
        name: RouterName.VControl,
        component: lazyLoadLayout(RouterName.VControl)
    }
]

const routerApp = routers
const router = createRouter({
    history: createWebHistory('task'),
    routes: routerApp
})

router.beforeEach(async (to,from,next) => {
    next()
})

export default router