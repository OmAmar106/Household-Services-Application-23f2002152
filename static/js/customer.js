import Navbar from "./components/cnav.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;


const Dashbord = {
    template: `
        <h1 style="margin-top:100px;margin-left:44%;">Past Requests</h1>

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
                    <p><span>For: </span><a :href="'/profile/'+item.username">{{item.username}}</a></p>
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
            let response = await fetch('/customgetall');
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

const Ongoing = {
    template: `
        <h1 style="margin-top:100px;margin-left:44%;">Past Requests</h1>

        <div v-for="(item,key) in data">
            <div v-if="item.isactive==1"  class="inrev">
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
                        <p><span>For: </span><a :href="'/profile/'+item.username">{{item.username}}</a></p>
                        <br>
                        <!-- <button @click="update(key)" style="background-color:lightblue;margin-left:59px;width:100px;height:40px;">Update</button>-->
                    </div>
                </div>

                <div class="inrevbuts1" style="float:right;">
                    <h2>Close Service</h2>
                    <br>
                    <input type="number" :id="'num'+key" placeholder="Enter Rating" style="margin-top:10px;">
                    <br><br>
                    <textarea :id="'remrk'+key" placeholder="Enter Remarks Here"></textarea>
                    <br><br>
                    <button style="background-color:red;" @click="update(key)">Close Service?</button>
                    <br>
                    <p style="color:red">{{ message }}</p>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            data: [],
            message: ''
        }
    },
    methods:{
        async fetchdata(){
            let response = await fetch('/customgetall');
            const data1 = await response.json();
            this.data = data1;
        },
        async update(key){
            
            const element = document.getElementById('remrk'+key);
            const value1 = element.value;

            const element1 = document.getElementById('num'+key);
            const value2 = element1.value;
            
            if(value2>5||value2<0){
                this.message = 'Rate from 0 to 5';
                return;
            }

            const data = {
                key:key,
                value:value1,
                value1:value2,
            };

            const response = await fetch('/addremark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            this.fetchdata();
            return;
        }
    },
    mounted(){
        this.fetchdata();
    }
}

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


/* user srch start */

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

const Book = {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    template: `
        
        <div class="search1">
            <div class="topnav">
                <select v-model="type" class="textsearch">
                    <option value="" selected >Select a Type</option>
                    <option v-for="(item,index) in services" :key="index" :value="item">
                        {{item}}
                    </option>
                </select>
                <input type="text" placeholder="Pincode.." v-model="area" class="textsearch">
                <input type="text" placeholder="Search.." v-model="searchQuery" class="textsearch">
                <img src="/static/images/magnifying-glass-solid.svg" style="width:20px;height:20px;">
            </div>
            
            <div v-for="(item, key) in filteredData" :key="key" class="user-item">
                <div class="user-card" style="background-color:lightcoral;margin-left:325px;margin-top:80px;">
                    <div class="user-card-img">
                        <img :src="item.profilepic"/>
                    </div>
                    
                    <div class="reviews" :id="'rev'+key" style="display:none;">
                        <br>
                        <h1 style="margin-left:43%;"> Reviews </h1>
                        <div v-for="(item1,key1) in item.remarks">
                            <div class="comment">
                                <span><span style="font-weight:bold;">Rating: </span> <span v-for="n in Array.from({ length: item1.star }, (_, i) => i + 1)" :key="n">&#11088;</span></span>
                                <br><br>
                                <p><span style="font-weight:bold;">Remarks:</span><br> {{item1.remark}}</p>
                            </div>
                        </div>

                        <button @click="showrev(key)" style="background-color:lightgray"><img src="/static/images/back.webp"></button>
                    </div>

                    <div class="options">
                        <br>
                        
                        <div class="enterdets" :id="key" style="display:none;">
                            <textarea rows="2" cols="2" required v-model="Details"
                            style="width:200px;height:90px;" placeholder="Enter Details of the service here">
                            </textarea>
                            <input type="number" required v-model="Payment" @input="handleInput" 
                            style="width:200px;height:auto "placeholder="Enter Price (₹)" :min="item.service[2]">
                            <br><br>
                            <button style="width:100px;height:auto;border-radius:0px;" @click="show1(item.service[2],key)">Submit</button>
                            <br>
                            <p class="colorerror" id="colorerror" style="color:red;font-size:14px;">{{message}}</p>    
                        </div>


                        <button @click="show(key)">Request Service</button>
                        <br><br>
                        <button @click="showrev(key)">View Reviews</button>
                        <br><br>
                        <p><span>Resume:</span>
                            <a :href="'/static/pdfs/resume/' + item.username + '.pdf'" :download="data.username + '.pdf'">Download PDF</a>
                        </p>
                    </div>

                    <div class="user-card-info seller">
                        <a :href="'/profile/' + item.username">
                        <h2>{{item.username}} <span style="float:right;margin-right:20px;">{{item.Reveiwsum/item.Reveiwcount}}/5&#11088;</span></h2>
                        </a>
                        <hr style="border: 1.5px solid purple; margin: 10px 0;">
                        <br>
                        <p><span>Company:</span> {{item.company}}</p>
                        <br>
                        <p><span>Service:</span>{{item.service[0]}}</p>
                        <br>
                        <p><span>Service Details:</span>{{item.service[1]}}</p>
                        <br>
                        <p><span>Service Minimum Price:</span>{{item.service[2]}}</p>
                        <br>
                        <p><span>Experience:</span> {{item.Experience}}</p>
                        <br>
                        <p><span>Email:</span>{{item.email}}</p>
                        <br>
                        <p><span>Location:</span>{{item.address}}</p>
                        <br>
                        <p><span>Pincode:</span>{{item.pincode}}</p>
                    </div>

                </div>
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
            services:[],
            Details:'',
            Payment:'',
            message:''
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
            console.log(this.data);
            for (const [key, value] of Object.entries(this.data)) {
                if(value.username && !value.username.includes(this.searchQuery)){
                    console.log(1)
                    continue;
                }
                if(value.username && this.area!=0 && !issimilar(value.pincode,this.area)){
                    console.log(2)
                    continue;
                }
                if(this.type && this.type!=value.service[0]){
                    continue;
                }
                data1[key] = value;
            }
            console.log(data1);
            return data1;
        }
    },
    methods:{
        async fetchdata(){
            let response = await fetch('/getservices');
            // console.log(response)
            const data1 = await response.json();
            this.data = data1;
            // console.log(data1);
        },
        async fetchservice(){
            let response = await fetch('/listservice');
            const data1 = await response.json();
            this.services = data1;
        },
        show(key){
            const elem = document.getElementById(key);
            if(elem.style.display=="none"){
                elem.style.display="block";
            }
            else{
                elem.style.display="none";
            }
        },
        showrev(key){
            key = 'rev'+key
            const elem = document.getElementById(key);
            if(elem.style.display=="none"){
                elem.style.display="block";
            }
            else{
                elem.style.display="none";
            }
        },
        async show1(k,seller){
            // console.log(k);
            // console.log(this.Payment);
            // console.log(this.Details);
            if(this.Payment<k){
                document.querySelectorAll('.colorerror').forEach(element => {
                    element.style.color = 'red';
                });
                this.message="Payment must be atleast "+k;
                return;
            }

            const data = {
                BasePay: this.Payment,
                Details: this.Details,
                seller: seller
            };
            const response = await fetch('/reqser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                document.querySelectorAll('.colorerror').forEach(element => {
                    element.style.color = 'red';
                });
                this.message = "some error occured"
            } else {
                const success = await response.json();
                document.querySelectorAll('.colorerror').forEach(element => {
                    element.style.color = 'green';
                });
                this.message = "Request Sent";              
            }

        }
    },
    mounted(){
        this.fetchdata();
        this.fetchservice();
    }
}

//Routes
const routes = [
    { path: '/', redirect: '/customer' }, //temporarily 
    { path: '/customer', component: Dashbord },
    { path: '/customer/profile', component: Profile},
    { path: '/customer/search', component: Search},
    { path: '/customer/book', component: Book},
    { path: '/customer/ongoing', component: Ongoing}
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



