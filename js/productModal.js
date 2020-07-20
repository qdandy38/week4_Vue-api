export default {
    template: `
    <div id="productModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header badge-primary">
                    <h5 class="modal-title">新增商品</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="imgUrl">輸入圖片網址</label>
                                <input type="text" class="form-control" id="imgUrl" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl[0]">
                            </div>
                            <img class="img-fluid" :src="tempProduct.imageUrl[0]" alt="">
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                                <label for="productName">產品名稱</label>
                                <input type="text" class="form-control" id="productName" placeholder="請輸入產品名稱" v-model="tempProduct.title">
                            </div>
                            <div class="form-row">
                                <div class="col-sm">
                                    <div class="form-group">
                                        <label for="productCategory">分類</label>
                                        <input type="text" class="form-control" id="productCategory" placeholder="請輸入分類" v-model="tempProduct.category">
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="form-group">
                                        <label for="productUnit">單位</label>
                                        <input type="text" class="form-control" id="productUnit" placeholder="請輸入單位" v-model="tempProduct.unit">
                                    </div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-sm">
                                    <div class="form-group">
                                        <label for="productOriginPrice">原價</label>
                                        <input type="number" class="form-control" id="productOriginPrice" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="form-group">
                                        <label for="productPrice">售價</label>
                                        <input type="number" class="form-control" id="productPrice" placeholder="請輸入售價" v-model="tempProduct.price">
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label for="productDescription">產品描述</label>
                                <textarea id="productDescription" class="form-control" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="productContent">說明內容</label>
                                <textarea id="productContent" class="form-control" placeholder="請輸入說明內容" v-model="tempProduct.content"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input type="checkbox" id="enabled" class="form-check-input" v-model="tempProduct.enabled">
                                    <label for="enabled">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateProduct()">確認</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {};
    },
    props: {
        tempProduct: {},
        user: {},
        isNew: ''
    },
    methods: {
        updateProduct() {
            // 新增商品
            let api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product`
            let methods = `post`;
            console.log(this.isNew);
            if (!this.isNew) { // 編輯商品
                api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
                methods = `patch`;
            }

            axios[methods](api, this.tempProduct)
                .then(() => {
                    this.$emit('done'); // 告訴外層已經新增/編輯結束，外層執行getProducts更新畫面
                    $('#productModal').modal('hide'); // 成功新增or修改遠端資料後，關閉modal
                    Swal.fire({
                        toast: true,
                        title: (this.isNew ? '新增成功' : '編輯成功'),
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        padding: '2rem'
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}