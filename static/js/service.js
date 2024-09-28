import Navbar from "./components/snav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Dashbord = {
    template: `
        <div>
        </div>
    `
}
//Routes
const routes = [
    { path: '/', redirect: '/service' }, //temporarily 
    { path: '/service', component: Dashbord },
];

//Router
const router = createRouter({
    history: createWebHistory(),
    routes
});


//Content
const content = {
    template:`
        <div class="info">
            <div class="title"> Service Finder </div>
            <br><br>
            <div class="content">
                <p>Welcome to Service Finder. <router-link to='/login'>Sign in</router-link> to book services. 
                In case of queries , go to <router-link to='/query'>Query page.</router-link></p>
                <br><br>
                <p>If this is your first time visited here , go to <router-link to='/signup'>Signup Page</router-link>
                 and make a new account for free.</p>
            </div>
        </div>
    `
}

//App
const app = createApp({
    components: {
        Navbar,
        content,
    },
    template: 
    `
        <div>
            <Navbar></Navbar><br>
            <router-view></router-view>
        </div>
    `,
});

app.use(router);
app.mount('#app');



