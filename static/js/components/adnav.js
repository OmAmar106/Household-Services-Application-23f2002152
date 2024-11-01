export default {
    template: `
    <div class="nav">
        <a href="/signout"><button class="link" style="width:80px;"> <img src="/static/images/logout.png" style="width:40px;height:30px;"> </button></a>
        
        <button class="link" @mouseover="showdrop" id="id2">Services</button>

        <div class="dropdown-content1" ref="dropdown" @mouseleave="showdrop">
                <router-link to="/admin/browseservice"><button class="link link2">Browse Service</button></router-link>
                <br>
                <router-link to="/admin/createservice"><button class="link link2">Create Service</button></router-link>
        </div>

        <router-link to="/admin/user"><button class="link"> Browse Users </button></router-link>
        <router-link to="/admin/stats"><button class="link"> Site Stats </button></router-link>
        <router-link to="/admin"><button class="link"> Dashbord </button></router-link>
    </div>
    <a href="/" style="position:absolute;"> <img src="static/images/icon.jpg" width="70px" height="70px" style="margin:5px;border-radius:20px;margin-left:15px;"> </a>
    `,
    methods:{
        showdrop(){
            const dropdown = this.$refs.dropdown;
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }
};
