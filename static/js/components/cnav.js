export default {
    data() {
        return {
            isOpen: false
        };
    },
    props: {
        user: {
          type: Object
        },
    },
    template: `
    <div class="nav" ref="nav">
        <div class="dropdown">
            <button @click="toggleDropdown" class="profile"><img :src="user.profilepic" class="profilepic" />
            <img src="static/images/dropdown.png" class="toggle"></button>
            <div :class="{'dropdown-content': true,'show': isOpen}">
                <router-link to="/customer/profile" @click="toggleDropdown">Profile</router-link>
                <router-link to="/customer/settings" @click="toggleDropdown">Settings</router-link>
                <a href="/signout">Log out</a>
            </div>
        </div>
        <router-link to="/customer/search"><button class="link"> Search Users </button></router-link>
        <router-link to="/customer/book"><button class="link"> Book Services </button></router-link>
        <router-link to="/customer"><button class="link"> Dashbord </button></router-link>
    </div>
    <a href="/" style="position:absolute;"> <img src="static/images/icon.jpg" width="70px" height="70px" style="margin:5px;border-radius:20px;margin-left:15px;"> </a>

    `,
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        closeDropdown(event) {
            if (this.$refs.nav && !this.$refs.nav.contains(event.target)) {
                this.isOpen = false;
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.closeDropdown);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDropdown);
    }
};
