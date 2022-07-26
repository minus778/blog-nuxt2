<template>
    <div class="tags">
        <h2>-&nbsp;Tags&nbsp;-</h2>
        <div class="tagList">
            <ul>
                <li v-for="item in tagList" @click="toTagDetail(item)" :key="item.id">
                    <span class="text">{{ item.name }}</span>
                    <span class="num">({{ item.num }})</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "tags",
    methods: {
        toTagDetail(item) {
            this.$router.push({
                path: `/tags/${item.name}`,
                query: { id: item.id }
            })
        }
    },
    computed: {
        tagList() {
            return this.$store.state.tagList
        }
    },
}
</script>

<style scoped lang='scss'>
.tags {
    @include commonSizeTag;

    .tagList {
        margin-top: 50px;

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                padding: 10px 30px 10px 0;
                cursor: pointer;
                transition: transform 0.2s linear;

                .text {
                    font-size: 15px;
                }

                .num {
                    font-size: 12px;
                    color: gray;
                }

                &:hover {
                    transform: scale(1.1);

                    .text {
                        color: $textColor;
                    }
                }
            }
        }
    }
}
</style>