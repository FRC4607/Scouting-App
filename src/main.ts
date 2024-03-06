import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import "./registerServiceWorker";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faCamera);

createApp(App)
  .use(router)
  .use(createPinia())
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
