import Navbar from "./components/adnav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Professional1 = {
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
                        <br>
                        <p><span>Resume:</span>
                            <a :href="'static/pdfs/resume/' + data.username + '.pdf'" :download="data.username + '.pdf'">Download PDF</a>
                        </p>
                    </div>
                </div>
            </a>
        </div>
    `
};

const Dashbord = {
    components: {
        Professional1,
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
            <br>
            <h1 style="position:absolute;margin-left:35%;"> Review Professional's Resumes </h1>
            <div v-for="(item, key) in filteredData" :key="key" class="user-item">
                <Professional1 :data="item" v-if="item.type=='S' && item.isactive==0"/>
                <br>
                <button class="danger" @click="handleclick(item.ID)" v-if="item.type=='S' && item.isactive==0">Toggle Active</button>
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
        async handleclick(msg){
            const data = {
                ID:msg,
            };
            const response = await fetch('/toggleactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            this.fetchdata();
        },
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
            // console.log(data);
            // console.log(response);
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
                        <br>
                        <p v-if="data.isactive==1"><span>Isactive:</span>Yes</p>
                        <p v-else><span>Isactive:</span>No</p>
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
                        <br>
                        <p v-if="data.isactive==1"><span>Isactive:</span>Yes</p>
                        <p v-if="data.isactive==0"><span>Isactive:</span>No/Under Reveiw</p>
                        <p v-if="data.isactive==-1"><span>Isactive:</span>Neither</p>
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
                <Customer :data="item" v-if="item.type=='C'"/>
                <Professional :data="item" v-if="item.type=='S'"/>
                <br>
                <button class="danger" @click="handleclick(item.ID)">Toggle Active</button>
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
        async handleclick(msg){
            const data = {
                ID:msg,
            };
            const response = await fetch('/toggleactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            this.fetchdata();
        },
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

const routes = [
    { path: '/', redirect: '/admin' }, //temporarily 
    { path: '/admin', component: Dashbord },
    { path: '/admin/createservice', component: CreateServ},
    { path: '/admin/user', component: Search},
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



