import Navbar from "./components/snav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Dashbord = {
    template: `
        <h1 style="margin-top:100px;margin-left:40%;">Service Requests</h1>
        <div v-for="(item,key) in data" class="inrev">
            <div class="dets">
                <img :src="item.profilepic">
                <br><br>
                <p><span>Name: </span>{{item.Name}}</p>
                <p><span>Address: </span>{{item.Address}}</p>
                <p><span>Pincode: </span>{{item.Pincode}}</p>
            </div>
            <div class="inrevdets">
                <h2 style="margin-left:82px;">Requests</h2>
                <br>
                <div class="border">
                    <br>
                    <p><span>Payment: </span>{{item.Payment}}</p>
                    <br>
                    <p><span>Details: </span>{{item.Details}}</p>
                    <br>
                    <p><span>By: </span><a :href="'profile/'+item.username">{{item.username}}</a></p>
                </div>
            </div>

            <div class="inrevbuts">
                <button style="background-color:lightgreen;" @click="accept(key)">Accept</button>
                <br><br>
                <button style="background-color:orange;" @click="reject(key)">Reject</button>
            </div>

        </div>
    `,
    data(){
        return{
            data: [],
        }
    },
    methods:{
        async fetchdata(){
            let response = await fetch('/pendingservice');
            const data1 = await response.json();
            this.data = data1;
        },
        async accept(key){

            const data = {
                key:key,
                del:false
            };
            const response = await fetch('/changeser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            this.fetchdata();
        },
        async reject(key){
            const data = {
                key:key,
                del:true
            };
            const response = await fetch('/changeser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            this.fetchdata();
        }
    },
    mounted(){
        this.fetchdata();
    }
}

const Customer = {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    template: `
        <div class="wrapper">
            <a :href="'/profile/' + data.username">
                <div class="user-card">
                    <div class="user-card-img">
                        <img :src="data.profilepic"/>
                    </div>
                    <div class="user-card-info">
                        <h2>{{data.username}}</h2>
                        <hr style="border: 1.5px solid purple; margin: 10px 0;">
                        <br>
                        <p><span>Name:</span> {{data.Firstname}} {{data.Lastname}}</p>
                        <br>
                        <p><span>Email:</span>{{data.email}}</p>
                        <br>
                        <p><span>Location:</span>{{data.address}}</p>
                        <br>
                        <p><span>Pincode:</span>{{data.pincode}}</p>
                    </div>
                </div>
            </a>
        </div>
    `
};

const Professional = {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    template: `
        <div class="wrapper">
            <a :href="'/profile/' + data.username">
                <div class="user-card" style="background-color:lightblue">
                    <div class="user-card-img">
                        <img :src="data.profilepic"/>
                    </div>
                    <div class="user-card-info seller">
                        <h2>{{data.username}} <span style="margin-left:235px;">{{data.Reveiwsum/data.Reveiwcount}}/5&#11088;</span></h2>
                        <hr style="border: 1.5px solid purple; margin: 10px 0;">
                        <br>
                        <p><span>Company:</span> {{data.company}}</p>
                        <br>
                        <p><span>Service:</span>{{data.service}}</p>
                        <br>
                        <p><span>Experience:</span> {{data.Experience}}</p>
                        <br>
                        <p><span>Email:</span>{{data.email}}</p>
                        <br>
                        <p><span>Location:</span>{{data.address}}</p>
                        <br>
                        <p><span>Pincode:</span>{{data.pincode}}</p>
                    </div>
                </div>
            </a>
        </div>
    `
};

const Search = {
    components: {
        Customer,
        Professional,
    },
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    template: `
        <div class="search">
            <div class="topnav">
                <select v-model="type" class="textsearch">
                    <option value="" selected >Select a Type</option>
                    <option value="Professional">Professional</option>
                    <option value="Customer">Customer</option>
                </select>
                <input type="text" placeholder="Pincode.." v-model="area" class="textsearch">
                <input type="text" placeholder="Search.." v-model="searchQuery" class="textsearch">
                <img src="/static/images/magnifying-glass-solid.svg" style="width:20px;height:20px;">
            </div>

            <div v-for="(item, key) in filteredData" :key="key" class="user-item">
                <Customer :data="item" v-if="item.isactive==1 && item.type=='C'"/>
                <Professional :data="item" v-if="item.isactive==1 && item.type=='S'"/>
            </div>
        </div>
        <br>
    `,
    data(){
        return{
            searchQuery:'',
            type:'',
            area:'',
            data:[],
        }
    },
    computed: {
        filteredData(){
            function issimilar(a,b){
                const strA = b.toString();
                const strB = a.toString();
                return strB.includes(strA);
            }
            let data1 = {};
            for (const [key, value] of Object.entries(this.data)) {
                if(value.username && !value.username.includes(this.searchQuery)){
                    continue;
                }
                if(value.username && this.area!=0 && !issimilar(value.pincode,this.area)){
                    continue;
                }
                if(this.type=="Professional" && value.type=="C"){
                    continue;
                }
                if(this.type=="Customer" && value.type=="S"){
                    continue;
                }
                data1[key] = value;
            }
            return data1;
        }
    },
    methods:{
        async fetchdata(){
            let response = await fetch('/getusers');
            // console.log(response)
            const data1 = await response.json();
            this.data = data1;
        }
    },
    mounted(){
        this.fetchdata();
    }
}

//Routes
const routes = [
    { path: '/', redirect: '/service' }, //temporarily 
    { path: '/service', component: Dashbord },
    { path: '/service/search', component: Search },
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

const Inrev = {
    template: `
    <div style="text-align:center;font-size:52px;margin-top:17%;">
        Your resume is currently in review :).<br>
        You will be able to proceed once it has been accepted.
    </div>
    `
}
//App
const app = createApp({
    components: {
        Navbar,
        FirstLogin,
        Inrev
    },
    template: 
    `
        <div>
            <div v-if="user && user.isactive==1">
                <Navbar :user="user" v-if="user"></Navbar><br>
                <router-view :user="user"></router-view>
            </div>
            <div v-if="user && user.isactive==0">
                <Inrev></Inrev>
            </div>
            <div v-if="user && user.isactive==-1">
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



