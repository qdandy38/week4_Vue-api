import pagination from './pagination.js';
import productModal from './productModal.js';
import delModal from './delModal.js';
Vue.component('pagination', pagination);
Vue.component('productModal', productModal);
Vue.component('delModal', delModal);
new Vue({
    el: '#app',
    data: {
        products: [], // AJAX取得的產品資料
        pagination: {}, // 分頁資訊
        tempProduct: {
            imageUrl: [],
            enabled: false
        }, // 暫存要處裡的產品資料
        isNew: false,
        user: {
            token: '',
            uuid: '822f665f-fdb8-48cd-a3c7-a13100ae246a',
            path: 'https://course-ec-api.hexschool.io'
        }
    },
    created() {
        // 取得cookie內的token，如果沒有就返回登入頁面
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; // 預設帶入token
        if (this.user.token === '') {
            window.location = 'login.html';
        } else {
            this.getProducts();
        }
    },
    methods: {
        getProducts(page = 1) { // AJAX取得遠端產品資料
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/products?page=${page}`;

            axios.get(api)
                .then((res) => {
                    this.products = res.data.data; // 將AJAX取得的產品資料存入this.products
                    this.pagination = res.data.meta.pagination; // 將AJAX取得的分頁資訊存入this.pagination
                })
                .catch((err) => {
                    console.log(`資料取得錯誤，${err}`);
                })
        },
        getProduct(id) { // 取得單一商品資料
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${id}`;

            axios.get(api)
                .then((res) => {
                    this.tempProduct = res.data.data; // 取得的單一產品資料存入tempProduct，作為等等modal開啟的預設值
                    $('#productModal').modal('show'); // 確認資料存入後再開啟Modal
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imageUrl: [],
                        enable: false
                    };
                    this.isNew = true; // 新增狀態
                    $('#productModal').modal('show');
                    break;
                case 'edit':
                    // description欄位必須透過取得單一產品的方式，因此會執行 AJAX
                    this.getProduct(item.id);
                    this.isNew = false; // 編輯狀態
                    break;
                case 'delete':
                    this.tempProduct = JSON.parse(JSON.stringify(item)); // 深層複製
                    $('#delModal').modal('show');
                    break;
            }
        }
    }
});