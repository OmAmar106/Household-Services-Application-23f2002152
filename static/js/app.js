import Navbar from "./components/Navbar.js";

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

//Login 
const Login = {
    template: `
        <div class="innerd formcontainer">
            <br><br>
            <p class="title"> SIGN IN  </p>
            <br><br>
            <form @submit.prevent="func()">
                <input type="text" required class="inp" v-model="username" @input="handleInput" placeholder="Username/Email">
                <br>
                <input type="password" required class="inp" v-model="password" placeholder="Password">
                <br><br>
                <input type="submit" class="inps">
                <br><br><p class="error">{{ message }}</p>
            </form>
            <br>
            <p>Don't have an account?, <router-link to ='/signup'>Sign Up</router-link> now</p>
        </div>
    `,
    data(){
        return {
            username:'',
            password:'',
            message:''
        };
    },
    created() {
        this.username = sessionStorage.getItem('username') || '';
    },
    methods: {
        async func(){
            const data = {
                username: this.username,
                password: this.password,
            };
            const response = await fetch('/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                this.message = errorResponse.message;
            } else {
                window.location.href = '/dashbord';
            }
        },
        handleInput(){
            sessionStorage.setItem('username', this.username);
        }
    }
};


//Query
const Query = {
    template:`
    `
}

//Customer
const Customer = {
    template: `
        <form @submit.prevent="func()">
            <div class="line1">
                <input type="text" required class="inpc" v-model="lastname" @input="handleInput" placeholder="Last Name">
                <input type="text" required class="inpc" v-model="firstname" @input="handleInput" placeholder="First Name">
            </div>
            <input type="email" required class="inpf" v-model="email" @input="handleInput" placeholder="Enter Email">
            <input type="text" required class="inpf" v-model="username" @input="handleInput" placeholder="Enter Username">
            <input type="text" required class="inpf" v-model="address" @input="handleInput" placeholder="Enter Address">
            <input type="number" required class="inpf" v-model="pincode" @input="handleInput" placeholder="Enter Pincode">
            <input type="password" required class="inpf" v-model="password" placeholder="Enter Password">
            <input type="password" required class="inpf" v-model="passwordcheck" placeholder="Enter Password Again">
            <input type="submit" class="inps" style="margin-top:30px">
            <br><div class="error">{{message}}</div>
        </form>
    `,
    data(){
        return {
            username:'',
            firstname:'',
            lastname:'',
            email:'',
            address:'',
            pincode:0,
            message:'',
            password:'',
            passwordcheck:''
        };
    },
    created() {
        this.username = sessionStorage.getItem('username') || '';
        this.firstname = sessionStorage.getItem('firstname') || '';
        this.lastname = sessionStorage.getItem('lastname') || '';
        this.email = sessionStorage.getItem('email') || '';
        this.address = sessionStorage.getItem('address') || '';
        this.pincode = sessionStorage.getItem('pincode') || '';
    },
    methods: {
        async func(){
            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            this.message='';
            if(this.password!=this.passwordcheck){
                this.message='password does not match';
            }
            else if(this.password.length<8){
                this.message='password must be atleast 8 digits';
            }
            // else if(this.pincode.length!=6){
            //     this.message='pincode does not exist';
            // }
            else if(!validateEmail(this.email)){
                this.message='enter a valid email'
            }
            else{
                const data = {
                    username: this.username,
                    password: this.password,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    address: this.address,
                    pincode: this.pincode
                };
                const response = await fetch('/add_customer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    const errorResponse = await response.json();
                    this.message = errorResponse.message;
                } else {
                    window.location.href = '/customer';
                }
            }
        },
        handleInput(){
            sessionStorage.setItem('username', this.username);
            sessionStorage.setItem('firstname', this.firstname);
            sessionStorage.setItem('lastname', this.lastname);
            sessionStorage.setItem('email', this.email);
            sessionStorage.setItem('address', this.address);
            sessionStorage.setItem('pincode', this.pincode);
        }
    }
}

//Professional
const Professional = {
    template: `
        <form @submit.prevent="func()">
            <input type="text" required class="inpf" v-model="companyname" @input="handleInput" placeholder="Enter Company Name">
            <input type="email" required class="inpf" v-model="email" @input="handleInput" placeholder="Enter Email">
            <input type="text" required class="inpf" v-model="username" @input="handleInput" placeholder="Enter Username">
            <input type="text" required class="inpf" v-model="address" @input="handleInput" placeholder="Enter Address">
            <div class="line1">
                <input type="number" required class="inpc" v-model="pincode" @input="handleInput" placeholder="Pincode">
                <input type="number" required class="inpc" v-model="exp" @input="handleInput" placeholder="Experience">
            </div>
            <input type="password" required class="inpf" v-model="password" placeholder="Enter Password">
            <input type="password" required class="inpf" v-model="passwordcheck" placeholder="Enter Password Again">
            <input type="submit" class="inps" style="margin-top:30px">
            <br><div class="error">{{message}}</div>
        </form>
    `,
    data(){
        return {
            username:'',
            companyname:'',
            email:'',
            address:'',
            pincode:0,
            exp:0,
            password:'',
            passwordcheck:'',
            message:''
        };
    },
    created() {
        this.username = sessionStorage.getItem('username') || '';
        this.companyname = sessionStorage.getItem('companyname') || '';
        this.exp = sessionStorage.getItem('exp') || '';
        this.email = sessionStorage.getItem('email') || '';
        this.address = sessionStorage.getItem('address') || '';
        this.pincode = sessionStorage.getItem('pincode') || '';
    },
    methods: {
        handleInput(){
            sessionStorage.setItem('username',this.username);
            sessionStorage.setItem('companyname',this.companyname);
            sessionStorage.setItem('exp',this.exp);
            sessionStorage.setItem('email',this.email);
            sessionStorage.setItem('address',this.address);
            sessionStorage.setItem('pincode',this.pincode);
        },
        async func(){
            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            this.message='';
            if(this.password!=this.passwordcheck){
                this.message='password does not match';
            }
            else if(this.password.length<8){
                this.message='password must be atleast 8 digits';
            }
            // else if(this.pincode.length!=6){
            //     this.message='pincode does not exist';
            // }
            else if(!validateEmail(this.email)){
                this.message='enter a valid email'
            }
            else{
                const data = {
                    username: this.username,
                    password: this.password,
                    compname: this.companyname,
                    exp: this.exp,
                    email: this.email,
                    address: this.address,
                    pincode: this.pincode
                };
                const response = await fetch('/add_professional', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    const errorResponse = await response.json();
                    this.message = errorResponse.message;
                } else {
                    window.location.href = '/service';
                }
            }
        },
    }
}

//Signup
const Signup = {
    template: `
        <div class="innerd formcontainer">
            <br>
            <p class="title">  SIGN UP  </p>
            <br><br>
            <div v-if="customer">
                <Customer></Customer>
            </div>
            <div v-else>
                <Professional></Professional>
            </div>
            <p>Already have an account?, <router-link to ='/login'>Sign in</router-link> now</p>
            <input type="button" class="button" @click="change" v-if="customer" value="Register as Professional?">
            <input type="button" class="button" @click="change" v-else value="Register as Customer?">
        </div>
    `,
    components:{
        Customer:Customer,
        Professional:Professional
    },
    data(){
        return {
            customer:true
        }
    },
    methods: {
        change(){
            this.customer = !this.customer;
        }
    }
};

//Routes
const routes = [
    { path: '/', redirect: '/login' }, //temporarily 
    { path: '/login', component: Login },
    { path: '/signup', component: Signup},
    { path: '/query', component: Query}
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



