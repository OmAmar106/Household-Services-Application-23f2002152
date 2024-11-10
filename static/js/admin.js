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
        // async show1(k,seller){
        //     // console.log(k);
        //     // console.log(this.Payment);
        //     // console.log(this.Details);
        //     if(this.Payment<k){
        //         document.querySelectorAll('.colorerror').forEach(element => {
        //             element.style.color = 'red';
        //         });
        //         this.message="Payment must be atleast "+k;
        //         return;
        //     }

        //     const data = {
        //         BasePay: this.Payment,
        //         Details: this.Details,
        //         seller: seller
        //     };
        //     const response = await fetch('/reqser', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(data)
        //     });

        //     if (!response.ok) {
        //         document.querySelectorAll('.colorerror').forEach(element => {
        //             element.style.color = 'red';
        //         });
        //         this.message = "some error occured"
        //     } else {
        //         const success = await response.json();
        //         document.querySelectorAll('.colorerror').forEach(element => {
        //             element.style.color = 'green';
        //         });
        //         this.message = "Request Sent";              
        //     }

        // }
    },
    mounted(){
        this.fetchdata();
        this.fetchservice();
    }
}

const Stats = {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    template: `
        <div style="text-align:center;margin-top:80px;">
            <br><br>
            <h1> Site Stats </h1>
            <br><br>
            <img id="pieChart" src="" alt="Bar Chart" style="float:left;margin-left:90px;">
            <img id="pieChart1" src="" alt="Bar Chart" style="float:left;margin-left:50px;">
            <br>
            <img id="hist" src="" alt="Bar Chart" style="float:left;margin-left:90px;width:40%;height:auto;">
            <img id="pie3" src="" alt="Bar Chart" style="float:left;margin-left:90px;width:40%;height:auto;">
            <br><br>
        </div>
    `,
    methods:{
        async fetchdata(){
            fetch('/getstats')
            .then(response => response.json())
            .then(data => {
                document.getElementById('pieChart').src = 'data:image/png;base64,' + data.pie;
                document.getElementById('pieChart1').src = 'data:image/png;base64,' + data.pie1;
                document.getElementById('hist').src = 'data:image/png;base64,' + data.hist;
                document.getElementById('pie3').src = 'data:image/png;base64,' + data.pie3;
            })
            .catch(error => console.error('Error fetching graphs:', error));
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
    { path: '/admin/browseservice', component: Book},
    { path: '/admin/stats', component: Stats},
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



