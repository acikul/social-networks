<template>
  <nav>
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': currentPage === 1}">
        <a class="page-link" href="#" @click.prevent="changePage(1)">First</a>
      </li>
      <li class="page-item" :class="{'disabled': currentPage === 1}">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Prev</a>
      </li>
      <li class="page-item" v-for="page in pages" :key="page" :class="{'active': page === currentPage}">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{'disabled': currentPage === totalPages}">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
      </li>
      <li class="page-item" :class="{'disabled': currentPage === totalPages}">
        <a class="page-link" href="#" @click.prevent="changePage(totalPages)">Last</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Pag',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 21
    },
    maxPages: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    pages() {
      const pages = []
      for (let i = 1; i <= this.totalPages; i++) {
        if (i >= this.currentPage - this.maxPages / 2 && i <= this.currentPage + this.maxPages / 2) {
          pages.push(i)
        }
      }
      return pages
    }
  },
  methods: {
    changePage(page) {
      if (page < 1) {
        page = 1
      } else if (page > this.totalPages) {
        page = this.totalPages
      }
      this.currentPage = page
      this.$emit('page-changed', page)
    }
  }
}
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
