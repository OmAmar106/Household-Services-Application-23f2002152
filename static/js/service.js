import Navbar from "./components/snav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const Profile = {
    props: {
        user: {
          type: Object,
          required: true
        },
    },
    template: `
    <div v-if="d">
        <br><br><br>
        <div class="container">
            <div class="profile-header">
                <h1>Profile Information</h1>
            </div>

            <div class="profile-section">
                <div class="profile-pic-container">
                    <img :src="d.dets.profilepic" alt="Profile Picture">
                    <div class="change-profile-pic">
                        <input type="file" @change="onFileChange" accept="image/*">
                        <button @click="uploadProfilePicture">Change Profile Picture</button>
                    </div>
                </div>
                <div class="profile-info">
                    <h3>Personal Information</h3>
                    <table>
                    <tr>
                        <th>User ID</th>
                        <td>{{ d.dets.UserID }}</td>
                    </tr>
                    <tr v-if="d.dets.type === 'C'">
                        <th>First Name</th>
                        <td>{{ d.dets.Firstname }}</td>
                    </tr>
                    <tr v-if="d.dets.type === 'C'">
                        <th>Last Name</th>
                        <td>{{ d.dets.Lastname }}</td>
                    </tr>
                    <tr v-else>
                        <th>Company Name</th>
                        <td>{{ d.dets.company }}</td>
                    </tr>
                    <tr>
                        <th>Username</th>
                        <td>{{ d.dets.username }}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{{ d.dets.email }}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{{ d.dets.address }}</td>
                    </tr>
                    <tr>
                        <th>Pincode</th>
                        <td>{{ d.dets.pincode }}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td :class="d.dets.isactive === 1 ? 'status-active' : 'status-inactive'">
                            {{ d.dets.isactive === 1 ? 'Active' : 'Inactive' }}
                        </td>
                    </tr>
                </table>
                </div>
            </div>

            <div class="services-info">
                <h3>Services Information</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Details</th>
                            <th>Start Date</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in Object.values(d.Services)" :key="service.ID">
                            <td>{{ service.name }}</td>
                            <td>{{ service.Details }}</td>
                            <td>{{ service.startdate }}</td>
                            <td>{{ service.Payment }}</td>
                            <td :class="service.isactive >= 1 ? 'status-active' : 'status-inactive'">
                                <span v-if="service.isactive === 1">Active</span>
                                <span v-else-if="service.isactive === 2">Completed</span>
                                <span v-else-if="service.isactive === 0">In Review</span>
                                <span v-else>Rejected</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            d: false,
            selectedFile: null
        }
    },
    methods: {
        async fetchdata() {
            let response = await fetch('/getprofile/' + this.user.username);
            const data1 = await response.json();
            this.d = data1;
            console.log(data1);
        },
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadProfilePicture() {
            if (!this.selectedFile) {
                alert("Please select a file first.");
                return;
            }

            const formData = new FormData();
            formData.append("profilepic", this.selectedFile);
            let response = await fetch('/updateProfilePicture',{
                method: 'POST',
                body: formData
            });
            this.fetchdata();
        }
    },
    mounted() {
        this.fetchdata();
    }
}

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
                    <p><span>By: </span><a :href="'/profile/'+item.username">{{item.username}}</a></p>
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

const Previous = {
    template: `
        <h1 style="margin-top:100px;margin-left:40%;">Past Requests</h1>

        <div v-for="(item,key) in data" class="inrev">
            <div class="dets">
                <img :src="item.profilepic">
                <br><br>
                <p><span>Name: </span>{{item.Name}}</p>
                <p><span>Address: </span>{{item.Address}}</p>
                <p><span>Pincode: </span>{{item.Pincode}}</p>
            </div>
            <div class="inrevdets">
                <h2 style="margin-left:82px;">Request</h2>
                <br>
                <div class="border">
                    <p><span>Payment: </span>{{item.Payment}}</p>
                    <br>
                    <p><span>Date: </span>{{new Date(item.startdate).toLocaleDateString('en-GB')}}</p>
                    <br>
                    <p><span>Details: </span></p>
                    <textarea :id="key" style="width:100%;height:80px;">{{item.Details}}</textarea>
                    <br>
                    <p><span>By: </span><a :href="'/profile/'+item.username">{{item.username}}</a></p>
                    <br>
                    <button @click="update(key)" style="background-color:lightblue;margin-left:59px;width:100px;height:40px;">Update</button>
                </div>
            </div>

            <div class="inrevbuts" style="margin-right:30px;">
                <div v-if="item.isactive==1">
                    <p>This is an Ongoing Service.</p>
                    <p>You may edit the Details.</p>
                    <br>
                    <button style="background-color:green;">Ongoing</button>
                </div>
                <div v-if="item.isactive==0">
                    <p>This is an Unread Service.</p>
                    <p>You may edit the Details.</p>
                    <br>
                    <button style="background-color:lightblue;">In Review</button>
                </div>
                <div v-if="item.isactive==-1">
                    <p>This is a Rejected Service.</p>
                    <p>You may edit the Details.</p>
                    <br>
                    <button style="background-color:red;">Rejected</button>
                </div>
                <div v-if="item.isactive==2">
                    <p>This is a Closed Service.</p>
                    <p>You may edit the Details.</p>
                    <br>
                    <button style="background-color:lightgreen;">Completed</button>
                </div>
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
            let response = await fetch('/servicegetall');
            const data1 = await response.json();
            this.data = data1;
        },
        async update(key){
            
            const element = document.getElementById(key);
            const value1 = element.value;
            
            const data = {
                key:key,
                value:value1
            };
            const response = await fetch('/changedetsserv', {
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
                        <h2>{{data.username}} <span style="float:right;margin-right:20px;">{{data.Reveiwsum/data.Reveiwcount}}/5&#11088;</span></h2>
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
    { path: '/service/previous', component: Previous },
    { path: '/service/profile', component: Profile },
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



