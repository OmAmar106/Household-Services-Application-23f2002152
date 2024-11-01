import Navbar from "./components/adnav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Dashbord = {
    template: `
        <div>
        Hello there
        </div>
    `
}


const CreateServ = {
    template: `
        <div class="innerd formcontainer">
            <br><br>
            <p class="title"> Create Service </p>
            <br>
            <form @submit.prevent="func1()">
                <input type="text" required class="inp" v-model="ServiceName" @input="handleInput" placeholder="Service Name">
                <textarea rows="10" cols="50" required class="inp" v-model="Details" @input="handleInput" 
                placeholder="Enter Details of the service here" style="height:100px;">
                </textarea>
                <input type="number" required class="inp" v-model="BasePay" @input="handleInput" placeholder="Minimum Cost (₹)">
                <br>
                <input type="submit" class="inps">
                <br><p class="error" id="colorerror" style="margin-top:9px;">{{message}}</p>
            </form>
            <br>
            <p></p>
        </div>
    `,
    data(){
        return {
            ServiceName:'',
            Details:'',
            message:'',
            BasePay:''
        };
    },
    created() {
        this.ServiceName = sessionStorage.getItem('ServiceName') || '';
        this.Details = sessionStorage.getItem('Details') || '';
        this.BasePay = sessionStorage.getItem('BasePay') || '';
    },
    methods: {
        async func1(){
            const data = {
                ServiceName: this.ServiceName,
                Details: this.Details,
                BasePay: this.BasePay
            };
            const response = await fetch('/crserv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log(data);
            console.log(response);
            if (!response.ok) {
                const errorResponse = await response.json();
                document.getElementById('colorerror').style.color = 'red';
                this.message = errorResponse.message;
            } else {
                const success = await response.json();
                document.getElementById('colorerror').style.color = 'green';
                this.message = success.message;               
            }
        },
        handleInput(){
            sessionStorage.setItem('ServiceName', this.ServiceName);
            sessionStorage.setItem('BasePay', this.BasePay);
            sessionStorage.setItem('Details', this.Details);
        }
    }
}


const routes = [
    { path: '/', redirect: '/admin' }, //temporarily 
    { path: '/admin', component: Dashbord },
    { path: '/admin/createservice', component: CreateServ}
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
            <Navbar></Navbar><br>
            <router-view></router-view>
        </div>
    `,
});

app.use(router);
app.mount('#app');



