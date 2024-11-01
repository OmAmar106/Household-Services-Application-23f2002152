export default {
    data() {
        return {
            isOpen: true
        };
    },
    template: `
    <div class="nav">
        <router-link to="/query"><button class="link"> Query </button></router-link>
        <router-link to="/login"><button class="link"> Sign In </button></router-link>
        <router-link to="/signup"><button class="link"> Sign Up </button></router-link>
    </div>
    <a href="/" style="position:absolute;"> <img src="static/images/icon.jpg" width="70px" height="70px" style="margin:5px;border-radius:20px;margin-left:15px;"> </a>
    `
};
