export default {
    template: `
        <nav aria-label="Page navigation example">
            <ul class="pagination mb-0">
                <li class="page-item" :class="{'disabled': pages.current_page === 1}">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitPages(pages.current_page-1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="(item,key) in pages.total_pages" :key="key" :class="{'active': (item === pages.current_page)}">
                    <a class="page-link" href="#" @click.prevent="emitPages(item)">{{item}}</a>
                </li>
                <li class="page-item" :class="{'disabled': pages.current_page === pages.total_pages}">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="emitPages(pages.current_page+1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    `,
    data() {
        return {};
    },
    props: {
        pages: {} // 接收由外(product)向此元件傳送的分頁資訊(透過AJAX在getProducts()時取得的)
    },
    methods: {
        // 向元件外傳遞換頁資訊，切換顯示的商品
        emitPages(target_page) {
            this.$emit('change-pages', target_page);
        }
    }
}