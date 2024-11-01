import Navbar from "./components/cnav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Dashbord = {
    template: `
        <div>
        </div>
    `
}

const Profile = {
    props: {
        user: {
          type: Object
        },
    },
    template: `
        <div style="margin-top:70px">
            {{user}}
        </div>
    `
}

//Routes
const routes = [
    { path: '/', redirect: '/customer' }, //temporarily 
    { path: '/customer', component: Dashbord },
    { path: '/customer/profile', component: Profile},
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
            <div class="title"> Clean Sweep </div>
            <br><br>
            <div class="content">
                <p>Welcome to Clean Sweep. <router-link to='/login'>Sign in</router-link> to book services. 
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
            <Navbar :user="user" v-if="user"></Navbar><br>
            <router-view :user="user"></router-view>
        </div>
    `,
    data(){
        return {
            user:null,
        };
    },
    mounted(){
        this.func();
    },
    methods:{
        async func(){
            const response = await fetch('/customer/getdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                window.location.href = '/error';
            } else {
                const data = await response.json();
                this.user = data;
            }
        }
    }
});

app.use(router);
app.mount('#app');



