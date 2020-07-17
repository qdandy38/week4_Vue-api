import pagination from './pagination.js';
Vue.component('pagination', pagination);
new Vue({
    el: '#app',
    data: {
        product: [], // AJAX取得的產品資料
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
        if (this.user.token === '') {
            window.location = 'login.html';
        } else {
            this.getProducts();
        }
    },
    methods: {
        getProducts(page = 1) { // AJAX取得遠端產品資料
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/products?page=${page}`;
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; // 預設帶入token
            axios.get(api)
                .then((res) => {
                    this.product = res.data.data; // 將AJAX取得的產品資料存入this.product
                    this.pagination = res.data.meta.pagination; // 將AJAX取得的分頁資訊存入this.pagination
                })
                .catch((err) => {
                    console.log(`資料取得錯誤，${err}`);
                })
        },
        updateProduct() { // 新增or編輯產品
            // 新增商品
            let api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product`
            let methods = `post`;
            if (!this.isNew) { // 編輯商品
                api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
                methods = `patch`;
            }
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; // 預設帶入token
            axios[methods](api, this.tempProduct)
                .then(() => {
                    $('#productModal').modal('hide'); // 成功新增or修改遠端資料後，關閉modal
                    Swal.fire({
                        toast: true,
                        title: (this.isNew ? '新增成功' : '編輯成功'),
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        padding: '2rem'
                    })
                    this.getProducts(); // 重新取得遠端資料
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getProduct(id) { // 取得單一商品資料
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${id}`;
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; // 預設帶入token
            axios.get(api)
                .then((res) => {
                    this.tempProduct = res.data.data; // 取得的單一產品資料存入tempProduct，作為等等modal開啟的預設值
                    $('#productModal').modal('show'); // 確認資料存入後再開啟Modal
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        delProduct() { // 刪除
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; // 預設帶入token
            axios.delete(api)
                .then(() => {
                    $('#delModal').modal('hide'); // 關閉Modal
                    Swal.fire({
                        toast: true,
                        title: '刪除成功!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        padding: '2rem'
                    })
                    this.getProducts();
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