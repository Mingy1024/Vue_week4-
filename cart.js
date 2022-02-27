import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "mingyo";

const app = createApp({
  data() {
    return {
      products: [],
      cartData: {},
      productId: "",
      isLoadingItem:'',
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
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        console.log(res);
        this.cartData = res.data.data;
      });
    },
    addToCart(id,qty = 1) {
      const data = {
        product_id : id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`,{ data }).then((res) => {
        console.log(res);
        this.getCart();
        this.$refs.productModal.closeModal();
        this.isLoadingItem = '';
      });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res) => {
        this.getCart();
        this.isLoadingItem = '';
      });
    },
    removeEntireCart(){
      this.isLoadingItem = true;
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        console.log(res);
        this.getCart();
        this.isLoadingItem = '';
      });
    },
    updateCartItem(item) {
      const data = {
        product_id : item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{ data }).then((res) => {
        this.getCart();
        this.isLoadingItem = '';
      });
    }
  },
  mounted() {
    this.getProduct();
    this.getCart();
  },
});

app.component("product-modal", {
  template: "#userProductModal",
  props: ["id"],
  data() {
    return {
      myModal: {},
      product: {},
      qty: 1,
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
    closeModal() {
      this.myModal.hide();
    },
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
      .then((res) => {
        this.product = res.data.product;
      });
    },
    addToCart() {
      this.$emit('add-cart',this.product.id,this.qty);
    }
  },
  mounted() {
    this.myModal = new bootstrap.Modal(this.$refs.modal,{ backdrop :'static' });
  },
});

app.mount("#app");
