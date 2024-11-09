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
                        <h2>{{item.username}} <span style="margin-left:235px;">{{item.Reveiwsum/item.Reveiwcount}}/5&#11088;</span></h2>
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
    { path: '/customer/book', component: Book}
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



