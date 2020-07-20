export default {
    template: `
    <div id="delModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header badge-danger">
                        <h5 class="modal-title">刪除產品</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>確定刪除<span class="text-danger font-weight-bold">{{tempProduct.title}}</span>？(刪除後無法復原)</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="delProduct()">確定</button>
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
        user: {}
    },
    methods: {
        delProduct() { // 刪除
            const api = `${this.user.path}/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;

            axios.delete(api)
                .then(() => {
                    this.$emit('done'); // 告訴外層刪除完畢，執行getProducts更新畫面
                    $('#delModal').modal('hide'); // 關閉Modal
                    Swal.fire({
                        toast: true,
                        title: '刪除成功!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        padding: '2rem'
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}