import pagination from "./pagination.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "mingyo";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const app = Vue.createApp({
  components:{
    pagination,
    vForm: Form,
    vField: Field,
    errorMessage: ErrorMessage,
  },
  data() {
    return {
      products: [],
      cartData: {
        carts:[]
      },
      productId: "",
      isLoadingItem:'',
      pagination:{},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    getProduct(page = 1) {
      axios.get(`${apiUrl}/api/${apiPath}/products/?page=${page}`).then((res) => {
        console.log(res);
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        console.log(this.products);
        console.log(this.pagination);
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
    },
    createOrder() {
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: this.form }).then((res) => {
        alert(res.data.message);
        this.$refs.form.resetForm();
        this.form.message = '';
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
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
