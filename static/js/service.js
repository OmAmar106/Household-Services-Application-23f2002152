import Navbar from "./components/cnav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const Dashbord = {
    template: `
    <div> hi </div>
    `
}
//Routes
const routes = [
    { path: '/', redirect: '/dashbord' }, //temporarily 
    { path: '/dashbord', component: Dashbord },
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
            <div class="lowerdiv">
                <router-view></router-view>
                <content></content>
            </div>
        </div>
    `
});
app.use(router);
app.mount('#app');



