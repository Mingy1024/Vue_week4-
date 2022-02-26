import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "mingyo";

const app = createApp({
  data() {
    return {
      products: [],
      cartData: {},
      productId: "",
    };
  },
  methods: {
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/products`).then((res) => {
        console.log(res);
        this.products = res.data.products;
        console.log(this.products);
      });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
  },
  mounted() {
    this.getProduct();
  },
});

app.component("product-modal", {
  template: "#userProductModal",
  props: ["id"],
  data() {
    return {
      myModal: {},
      product: {},
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.myModal.show();
    },
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
      .then((res) => {
        this.product = res.data.product;
      });
    },
  },
  mounted() {
    this.myModal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.mount("#app");
