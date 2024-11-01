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
// const content = {
//     template:`
//         <div class="info">
//             <div class="title"> Clean Sweep </div>
//             <br><br>
//             <div class="content">
//                 <p>Welcome to Clean Sweep. <router-link to='/login'>Sign in</router-link> to book services. 
//                 In case of queries , go to <router-link to='/query'>Query page.</router-link></p>
//                 <br><br>
//                 <p>If this is your first time visited here , go to <router-link to='/signup'>Signup Page</router-link>
//                  and make a new account for free.</p>
//             </div>
//         </div>
//     `
// }

const FirstLogin = {
    template: `
        <div class="service">
            <form @submit.prevent="func1()">
                <br><br><br>
                <p class="title"> Enter Details</p>
                <br><br><br>
                <select v-model="servicename" required class="inpd">
                    <option value="" disabled>Select your Service</option>
                    <option v-for="service in services" :key="service" :value="service">{{ service }}</option>
                </select>
                <br><br>
                
                <div style="text-align:left;margin-left:60px;border:solid black; border-width:1.3px;border-radius:3px;padding:20px;margin-right:60px;">
                    <label for="file-upload" class="custom-file-upload" style="font-size:large; 
                        display: inline-block; margin-bottom: 10px;">
                        Upload Your Resume:
                    </label>
                    <br>
                    <input type="file" id="file-upload" @change="handleFileUpload" accept=".pdf" required>
                </div>


                <input type="submit" class="inps">
                <br><br><p class="error">{{ message }}</p>
            </form>
        </div>
    `,
    data(){
        return{
            message:'',
            file:null,
            servicename:'',
            services:[]
        }
    },
    created() {
        // fetch all the service names from backend
        this.getdet();
    },
    methods: {
        async getdet(){
            const response = await fetch('/listservice');
            const data = await response.json()
            // console.log(data);
            this.services = data;

        },

        handleFileUpload(event) {
            this.file = event.target.files[0];
        },

        async func1(){

            const formData = new FormData();
            formData.append('servicename',this.servicename)
            formData.append('file',this.file);

            const response = await fetch('/seller/resumeadd', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                this.message = errorResponse.message;
                console.log(this.message)
            } else {
                window.location.href = '/service';
            }
        },
    }
}

//App
const app = createApp({
    components: {
        Navbar,
        FirstLogin,
    },
    template: 
    `
        <div>
            <div v-if="user && user.ServicelistID">
                <Navbar></Navbar><br>
                <router-view :user="user"></router-view>
            </div>
            <div v-else>
                <FirstLogin></FirstLogin>
            </div>
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
            const response = await fetch('/seller/getdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                window.location.href = '/error';
            } else {
                const data = await response.json();
                console.log(data);
                this.user = data;
            }
        }
    }
});

app.use(router);
app.mount('#app');



